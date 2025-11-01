import { authMiddleware } from "../middleware/authMiddleware";
import prisma from "../db/index";
import {Router} from 'express';

export const stocksRouter = Router();

stocksRouter.get("/" , authMiddleware, async (req, res) => {
    const userId = req.body.userId;
    try {
        const user =  await prisma.user.findUnique({where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({stocks: user.stocks});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
})

stocksRouter.post("/" , authMiddleware, async (req, res) => {
    const userId = req.body.userId;
    const {stockSymbol} = req.body;
    const normalizedSymbol = typeof stockSymbol === "string" ? stockSymbol.trim().toUpperCase() : "";
    try {
        const user =  await prisma.user.findUnique({where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        if (!/^[A-Z]{1,4}$/.test(normalizedSymbol)) {
            return res.status(400).json({
                message: "Stock symbol must be 1-4 uppercase letters",
                errorCode: "INVALID_STOCK_SYMBOL"
            });
        }
        if (user.stocks.includes(normalizedSymbol)) {
            return res.status(400).json({message: "Stock already in watchlist"});
        }
        const updatedStocks = [...user.stocks, normalizedSymbol];
        await prisma.user.update({
            where: {id: userId},
            data: {stocks: updatedStocks}
        });
        res.status(200).json({message: "Stock added to watchlist", stocks: updatedStocks});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
});