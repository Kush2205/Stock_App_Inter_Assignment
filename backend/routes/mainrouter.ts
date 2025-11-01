import { Router } from "express";
import { userRouter } from "./userRouter";
import { stocksRouter } from "./stocksRouter";
import { main } from "bun";
export const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/stocks", stocksRouter);