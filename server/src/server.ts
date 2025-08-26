import express from "express";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SERVER_CONFIG } from "./config/server-config.js";
import { init } from "./lib/initialize.js";
import routes from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 
}));

// API routes
app.use('/api', routes);



app.listen(SERVER_CONFIG.APP_PORT, async () => {
    await init();
    console.log(`Server is running on port ${SERVER_CONFIG.APP_PORT}`);
});
