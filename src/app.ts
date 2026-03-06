import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from "cors";
import { memberRouter } from './routes/memberRoutes';
import { assignmentRouter } from './routes/assignmentRoutes';

export const app = express();
app.use(express.json());
app.use(cors());

app.use("/members", memberRouter);
app.use("/assignments", assignmentRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Server error" });
});