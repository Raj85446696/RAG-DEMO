import dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import {responseChat} from '../middlewares/responsechat.middleware.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT || 8001;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

app.use(cors({
  origin: FRONTEND_BASE_URL,
  methods: ['GET', 'POST']
}));

app.post("/chat",responseChat);

export default app ; 