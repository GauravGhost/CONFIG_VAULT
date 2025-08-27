
import { ErrorBoundary } from "@/components/core/ErrorBoundary";
import { PublicOnlyRoute } from "@/components/core/wrapper/PublicRouteWrapper";
import AuthorizedLayout from "@/components/layout/AuthorizedLayout";
import { dashboardConfig } from "@/constant/page-config/dashboard-config";
import Dashboard from "@/pages/dashboard/Dashboard";
import Login from "@/pages/login/Login";
import type { RouteObject } from "react-router";

export type RouteObjectExtend = RouteObject & {
  title: string;
  permissionId?: string;
  operationAllowed?: string[];
  children?: RouteObjectExtend[];
};

export const routeMapping: RouteObjectExtend[] = [
  {
    title: "Private Route",
    path: "/",
    element: <AuthorizedLayout />,
    children: [
      {
        title: dashboardConfig.name,
        path: dashboardConfig.path,
        element: <Dashboard />,
      }
    ],
  },
  {
    title: "Login",
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    title: "Not Found",
    path: "*",
    element: <ErrorBoundary />,
  },
];
