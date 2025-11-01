
import express, { type Request, type Response } from "express";
import {mainRouter} from "./routes/mainrouter"
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors({
  origin: '*',
}));

app.use(express.json());
app.use("/api", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
