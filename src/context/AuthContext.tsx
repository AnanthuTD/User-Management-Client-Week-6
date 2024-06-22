import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { User } from "../types";

interface AuthContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	setUser: () => {},
});

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
				<AuthContext.Provider
					value={
						{
							user: authUser,
							setUser: setAuthUser,
						} satisfies AuthContextType
					}
				>
					<Outlet />
				</AuthContext.Provider>
			) : null}
		</>
	);
}

export const UseUser = (): AuthContextType =>
	useContext<AuthContextType>(AuthContext);

export default AuthProvider;
