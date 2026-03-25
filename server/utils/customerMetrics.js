export const calculateMembershipLevel = (totalSpent) => {
  if (totalSpent > 20000000) return 'Diamond';
  if (totalSpent > 10000000) return 'Gold';
  if (totalSpent > 5000000) return 'Silver';
  return 'Bronze';
};

export const calculateRewardPoints = (totalSpent) => Math.floor(totalSpent / 10000);
