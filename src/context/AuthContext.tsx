import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { User } from "../types";

interface AuthContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

function AuthProvider() {
	const [authUser, setAuthUser] = useState<User | null>(null);
	const [isAuthenticating, setAuthenticating] = useState(true);
	const navigate = useNavigate();

	const authenticateUser = async () => {
		try {
			const response = await axios.get("/api/auth", {
				withCredentials: true,
			});

			if (response.data?.user) setAuthUser(response.data.user);
			throw new Error("no user found");
		} catch (error) {
			return navigate("/login", { replace: true });
		} finally {
			setAuthenticating(false);
		}
	};

	useEffect(() => {
		authenticateUser();
	}, []);

	return (
		<>
			{!isAuthenticating ? (
				<Outlet
					context={
						{
							user: authUser,
							setUser: setAuthUser,
						} satisfies AuthContextType
					}
				/>
			) : null}
		</>
	);
}

export const UseUser = (): AuthContextType => {
	const data = useOutletContext<AuthContextType>();
	console.log(data);
	return data;
};
export default AuthProvider;
