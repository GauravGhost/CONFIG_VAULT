import express from "express";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SERVER_CONFIG } from "./config/server-config.js";
import { init } from "./lib/initialize.js";
import routes from "./routes/index.js";
import globalErrorHandler from "./lib/global-error-handler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 
}));

async function startServer() {
    try {
        // Initialize database and other services
        await init();
        
        // API routes
        app.use('/api', routes);
        
        // Global error handler (must be last middleware)
        app.use(globalErrorHandler.errorHandler);

        app.listen(SERVER_CONFIG.APP_PORT, () => {
            console.log(`Server is running on port ${SERVER_CONFIG.APP_PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
