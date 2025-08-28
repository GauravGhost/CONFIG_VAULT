import { Navigate, useLocation } from "react-router";
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { storage } from "../../../lib/storage";
import { usePrivateGetApi } from "@/hooks/useApi";
import type { User } from "@config-vault/shared";
import { endpoints } from "@/lib/endpoints";
import useProfileStore from "@/store/useProfileStore";
import { Loader } from "@/components/ui/loader";

const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp ? Math.floor(Date.now() / 1000) >= payload.exp : false;
    } catch {
        return true;
    }
}

export function PrivateRoute({ children }: Readonly<{ children: ReactNode }>) {
    const location = useLocation();
    const { fetch, data, loading, error } = usePrivateGetApi<User>();
    const { setUser, user } = useProfileStore();

    useEffect(() => {
        if (user) return;

        const token = storage.get<string>('AUTH_TOKEN');
        
        if (!token || isTokenExpired(token)) {
            storage.remove('AUTH_TOKEN');
            return;
        }

        fetch(endpoints.users.getCurrent);
    }, [user, fetch]);

    useEffect(() => {
        if (data) setUser(data);
    }, [data, setUser]);

    const isAuthenticated = user || data;
    const shouldRedirect = !loading && !isAuthenticated && (error || !storage.get<string>('AUTH_TOKEN'));

    if (loading) return <Loader fullScreen />;
    if (shouldRedirect) return <Navigate to="/login" state={{ from: location }} replace />;
    if (isAuthenticated) return children;

    return <Loader fullScreen />;
}