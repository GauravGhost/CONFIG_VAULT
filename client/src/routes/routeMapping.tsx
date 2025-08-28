
import { ErrorBoundary } from "@/components/core/ErrorBoundary";
import { PublicOnlyRoute } from "@/components/core/wrapper/PublicRouteWrapper";
import AuthorizedLayout from "@/components/layout/AuthorizedLayout";
import { pageConfig } from "@/constant/page-config";
import Dashboard from "@/pages/dashboard/Dashboard";
import Login from "@/pages/login/Login";
import Profile from "@/pages/profile/Profile";
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
        title: pageConfig.dashboard.name,
        path: pageConfig.dashboard.path,
        element: <Dashboard />,
      },
      {
        title: pageConfig.profile.name,
        path: pageConfig.profile.path,
        element: <Profile />
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
