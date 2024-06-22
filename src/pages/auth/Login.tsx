import { Card, Form, Input, Button } from "antd";
import axios from "axios";
import { UseUser } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
	const { user, setUser } = UseUser();

	const onFinish = async (values: { email: string; password: string }) => {
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
				console.log(error.response.data.msg);
			} else {
				console.error(error);
			}
		}
	};

	const onFinishFailed = (errorInfo: { email: string; password: string }) => {
		console.log("Failed:", errorInfo);
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
			<Card style={{ width: 500 }} title="User Management">
				<Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
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
								/* pattern:
									/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, */
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
			</Card>
		</div>
	);
};

export default Login;
