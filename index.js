import express, { json } from "express";
import cors from 'cors';
import { schedule } from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();
import { router } from './src/routes/route.js';
import { checkUser } from './src/cron/cron.js';
import { mongooseConnect } from "./src/db/mongo.js";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { logger } from "./src/logger/logger.js";
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(json());
app.use(cors());
app.use(router);

app.get("/", (req, res) => {
    res.send("Hello World!")
});

schedule("0 * * * *", function () {
    checkUser()
});

app.listen(process.env.PORT, () => {
    logger.info("Server started");
    console.log(`Server started at ${process.env.PORT}`);
    mongooseConnect();
})