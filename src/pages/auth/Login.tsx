import {
	Card,
	Form,
	Input,
	Button,
	Alert,
	Typography,
	message,
	Divider,
} from "antd";
import axios from "axios";
import { UseUser } from "../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { GoogleCredentialResponse, GoogleLogin } from "@react-oauth/google";
import { User } from "../../types";
import "./styles.css";

interface LoginError {
	msg?: string;
	code?: string;
	error?: boolean;
}
const Login = () => {
	const { user, setUser } = UseUser();
	const [error, setError] = useState<LoginError | null>(null);

	const onFinish = async (values: { email: string; password: string }) => {
		setError(null);
		try {
			const res = await axios.post("/api/auth/login", values, {
				withCredentials: true,
			});
			const { user } = res.data;
			if (user) {
				setUser(user);
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setError(error.response.data);
				console.error(error.response.data.msg);
			} else {
				setError({ msg: "unexpected error" });
				console.error(error);
			}
		}
	};

	const responseMessage = async (response: GoogleCredentialResponse) => {
		try {
			const { data } = await axios.post(
				"/api/auth/sign-in/google",
				response
			);
			const { user }: { user: User } = data;
			if (user) {
				setUser(user);
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setError(error.response.data);
				console.error(error.response.data.msg);
			} else {
				setError({ msg: "unexpected error" });
				console.error(error);
			}
		}
	};

	const errorMessage = (error: {
		error: string;
		error_description?: string;
		error_uri?: string;
	}) => {
		message.error(error.error);
		console.error(error);
	};

	return user ? (
		<Navigate
			to={user.role === "admin" ? "/admin/user" : "/dashboard"}
			replace={true}
		/>
	) : (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<Card style={{ width: 500 }} title="Login">
				<div className="google-login-container">
					<GoogleLogin
						onSuccess={responseMessage}
						// @ts-ignore
						onError={errorMessage}
						useOneTap
						use_fedcm_for_prompt={true}
						auto_select
						text="continue_with"
						// ux_mode="redirect"
						width={300}
					/>
				</div>
				<Divider />
				<Form onFinish={onFinish}>
					<Form.Item
						name={"email"}
						required={true}
						rules={[
							{
								type: "email",
								required: true,
								message: "Please input your email address!",
							},
						]}
					>
						<Input placeholder="Email" />
					</Form.Item>
					<Form.Item
						name={"password"}
						rules={[
							{
								required: true,
								message: "Please input your password!",
							},
							{
								pattern:
									/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
								message:
									"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
							},
						]}
					>
						<Input.Password placeholder="Password" />
					</Form.Item>
					<Form.Item>
						<Button
							style={{ width: "100%" }}
							htmlType="submit"
							type="primary"
						>
							Login
						</Button>
					</Form.Item>
				</Form>
				{error && (
					<Alert
						type={"error"}
						message={<Typography.Text>{error.msg}</Typography.Text>}
					/>
				)}

				<Typography.Text>
					Not a user? <Link to={"/sign-up"}>sign-up now</Link>
				</Typography.Text>
			</Card>
		</div>
	);
};

export default Login;
