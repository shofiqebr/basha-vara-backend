import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRouter from './module/auth/auth.router';
import cookieParser from "cookie-parser";
import tenantRouter from './module/tenant/tenant.router';
import landlordRouter from './module/landLord/landLord.router';
import adminRouter from './module/admin/admin.router';

const app: Application = express();

// Allow multiple origins dynamically
const allowedOrigins = [
  "https://bike-store-front.vercel.app",
  // "https://bike-store-blush.vercel.app",
  "http://localhost:3000"
];

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests from allowed origins
      callback(null, true);
    } else {
      // Reject requests from other origins
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies with cross-origin requests
}));
app.use(express.urlencoded({ extended: true }));


app.use(authRouter);
app.use(adminRouter);
app.use(tenantRouter);
app.use(landlordRouter);

app.get('/', (req: Request, res: Response) => {
  res.send("Hello from basha vara");
});

export default app;
