import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import "./index.css";
import UserManagement from "./pages/admin/Dashboard";
import Login from "./pages/auth/Login";
import AuthProvider from "./context/AuthContext";
import Profile from "./pages/admin/Profile";
import Dashboard from "./pages/user/Dashboard";
import SignUp from "./pages/auth/SignUp";
import CreateUser from "./pages/admin/CreateUser";

const router = createBrowserRouter([
	{
		path: "/",
		element: <AuthProvider />,
		children: [
			{
				path: "sign-up",
				element: <SignUp />,
			},
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "admin",
				element: <Layout />,
				children: [
					{
						path: "user",
						element: <UserManagement />,
					},
					{
						path: "profile",
						element: <Profile />,
					},
					{
						path: "create-user",
						element: <CreateUser />,
					},
				],
			},
			{
				path: "dashboard",
				element: <Dashboard />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} future={{ v7_startTransition: true }} />
	</React.StrictMode>
);
