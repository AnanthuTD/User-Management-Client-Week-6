import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import "./index.css";
import UserManagement from "./pages/admin/Dashboard";
import Login from "./pages/auth/Login";
import AuthProvider from "./context/AuthContext";

const router = createBrowserRouter([
	{
		path: "/",
		element: <AuthProvider />,
		children: [
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/admin",
				element: <Layout />,
				children: [
					{
						path: "user",
						element: <UserManagement />,
					},
					{
						path: "account",
						element: <div>Account Management</div>,
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
