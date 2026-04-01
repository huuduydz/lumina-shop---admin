import { Product, ProductColorOption } from './types';

export interface ProductColorPriceOption extends ProductColorOption {
  additionalPrice: number;
}

export interface ProductSizePriceOption {
  label: string;
  additionalPrice: number;
}

export interface VariantPriceDetails {
  basePrice: number;
  colorExtra: number;
  sizeExtra: number;
  finalPrice: number;
  finalOriginalPrice?: number;
}

const COLOR_PRICE_RATES = [0, 0.03, 0.06, 0.09];
const SIZE_PRICE_RATES = [0, 0.07, 0.14, 0.21, 0.28];
const COLOR_PRICE_FLOORS = [0, 3, 6, 9];
const SIZE_PRICE_FLOORS = [0, 6, 12, 18, 24];

const roundCurrency = (value: number) => Number(value.toFixed(2));

const resolveStepValue = (index: number, values: number[], step: number) => {
  if (index < values.length) {
    return values[index];
  }

  return values[values.length - 1] + step * (index - values.length + 1);
};

const resolveAdditionalPrice = (
  basePrice: number,
  index: number,
  rates: number[],
  floors: number[],
  fallbackStep: number,
  fallbackFloorStep: number,
  explicitPrice?: number
) => {
  if (index <= 0) {
    return 0;
  }

  if (explicitPrice !== undefined) {
    return roundCurrency(explicitPrice);
  }

  const rate = resolveStepValue(index, rates, fallbackStep);
  const floor = resolveStepValue(index, floors, fallbackFloorStep);
  return roundCurrency(Math.max(basePrice * rate, floor));
};

export const getColorOptions = (product: Product): ProductColorPriceOption[] => {
  const colors = product.availableColors?.length
    ? product.availableColors
    : [{ name: 'Default', hex: '#0f172a' }];

  return colors.map((color, index) => ({
    ...color,
    additionalPrice: resolveAdditionalPrice(
      product.price,
      index,
      COLOR_PRICE_RATES,
      COLOR_PRICE_FLOORS,
      0.03,
      3,
      color.additionalPrice
    )
  }));
};

export const getSizeOptions = (product: Product): ProductSizePriceOption[] => {
  const sizes = product.availableSizes?.length ? product.availableSizes : ['Standard'];

  return sizes.map((label, index) => ({
    label,
    additionalPrice: resolveAdditionalPrice(
      product.price,
      index,
      SIZE_PRICE_RATES,
      SIZE_PRICE_FLOORS,
      0.07,
      6
    )
  }));
};

export const calculateVariantPrice = (
  product: Product,
  selectedColor?: string,
  selectedSize?: string
): VariantPriceDetails => {
  const colorOptions = getColorOptions(product);
  const sizeOptions = getSizeOptions(product);
  const colorExtra =
    colorOptions.find((color) => color.name === selectedColor)?.additionalPrice ?? colorOptions[0]?.additionalPrice ?? 0;
  const sizeExtra =
    sizeOptions.find((size) => size.label === selectedSize)?.additionalPrice ?? sizeOptions[0]?.additionalPrice ?? 0;
  const totalExtra = colorExtra + sizeExtra;

  return {
    basePrice: roundCurrency(product.price),
    colorExtra,
    sizeExtra,
    finalPrice: roundCurrency(product.price + totalExtra),
    finalOriginalPrice:
      product.originalPrice !== undefined ? roundCurrency(product.originalPrice + totalExtra) : undefined
  };
};

export const buildCartItemKey = (productId: string, color: string, size?: string) =>
  [productId, color || 'Default', size || 'Standard'].join('::');

export const formatAdditionalPrice = (value: number) =>
  value > 0 ? `+$${roundCurrency(value).toFixed(2)}` : 'Included';
