import express from "express";
import dotenv from "dotenv";
import { connectionDB } from "./DB/connection.js";
import { appRouter } from "./src/app.router.js";
const app = express();
const port = process.env.PORT || 3000;

dotenv.config();
connectionDB();
appRouter(app, express);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
