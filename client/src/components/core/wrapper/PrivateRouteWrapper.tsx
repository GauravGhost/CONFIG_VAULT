import { Navigate, useLocation } from "react-router";
import type { ReactNode } from 'react';
import { storage } from "../../../lib/storage";

function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload.exp) return false;
        const now = Math.floor(Date.now() / 1000);
        return payload.exp < now;
    } catch {
        return true;
    }
}

export function PrivateRoute({ children }: Readonly<{ children: ReactNode }>) {
    const location = useLocation();

    const token = storage.get<string>('AUTH_TOKEN');

    const isAuthenticated = () => {
        if (!token) {
            return false;
        }
        if (isTokenExpired(token)) {
            storage.remove('AUTH_TOKEN');
            return false;
        }
        return true;
    };

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
