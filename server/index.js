import dotenv from 'dotenv';
import app from './app.js';
import { getDatabaseStatus } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database status: ${getDatabaseStatus()}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}\n`);
});
