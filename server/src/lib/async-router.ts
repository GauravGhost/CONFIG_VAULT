import type { Request, Response, NextFunction, RequestHandler, Router } from 'express';
import express from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

interface AsyncRouter extends Router {
    allAsync: (path: string, ...handlers: AsyncRequestHandler[]) => Router;
    getAsync: (path: string, ...handlers: AsyncRequestHandler[]) => Router;
    postAsync: (path: string, ...handlers: AsyncRequestHandler[]) => Router;
    putAsync: (path: string, ...handlers: AsyncRequestHandler[]) => Router;
    deleteAsync: (path: string, ...handlers: AsyncRequestHandler[]) => Router;
}

function replaceLastBySafeHandler(handlers: AsyncRequestHandler[]): RequestHandler[] {
    if (handlers.length === 0) {
        return [];
    }

    const lastHandler = handlers[handlers.length - 1];
    if (!lastHandler) {
        return handlers as RequestHandler[];
    }
    
    const ret = [...handlers];
    ret[handlers.length - 1] = (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = lastHandler(req, res, next);
            if (result && typeof result.catch === 'function') {
                result.catch((error: any) => next(error));
            }
        } catch (error) {
            next(error);
        }
    };
    return ret as RequestHandler[];
}

function createRouter(): AsyncRouter {
    const router = express.Router() as AsyncRouter;

    router.allAsync = (path: string, ...handlers: AsyncRequestHandler[]) => router.all(path, ...replaceLastBySafeHandler(handlers));
    router.getAsync = (path: string, ...handlers: AsyncRequestHandler[]) => router.get(path, ...replaceLastBySafeHandler(handlers));
    router.postAsync = (path: string, ...handlers: AsyncRequestHandler[]) => router.post(path, ...replaceLastBySafeHandler(handlers));
    router.putAsync = (path: string, ...handlers: AsyncRequestHandler[]) => router.put(path, ...replaceLastBySafeHandler(handlers));
    router.deleteAsync = (path: string, ...handlers: AsyncRequestHandler[]) => router.delete(path, ...replaceLastBySafeHandler(handlers));

    return router;
}

export default createRouter();
