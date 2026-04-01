# Deploy To Vercel

## Project Type

- Frontend: Vite + React static build
- Backend: Vercel Node.js Function through `api/[...route].js`
- Database: MongoDB Atlas

## Files Added For Deployment

- `vercel.json`
- `api/[...route].js`
- `server/app.js`

## Environment Variables On Vercel

Add these variables in the Vercel project settings:

```env
MONGODB_URI=mongodb+srv://tanthuy068_db_user:duy12345@cluster1.zewo87r.mongodb.net/lumina_crm?retryWrites=true&w=majority&appName=Cluster1
FRONTEND_URL=https://YOUR_VERCEL_DOMAIN
```

Optional for local preview:

```env
VITE_API_URL=/api
```

## Deploy Steps

1. Push this repository to GitHub.
2. Login to [Vercel](https://vercel.com/).
3. Click `Add New Project`.
4. Import the GitHub repository.
5. Keep the root directory as the project root.
6. In environment variables, add `MONGODB_URI`.
7. Add `FRONTEND_URL` with your Vercel production domain.
8. Click `Deploy`.

## After Deploy

Check these URLs:

- `/`
- `/#/shop`
- `/#/product/1`
- `/api/health`
- `/api/products`

## Notes

- The frontend uses `HashRouter`, so page links should use `/#/...`
- Local development still works with the Vite proxy in `vite.config.ts`
- Rotate the MongoDB password after public sharing for security
