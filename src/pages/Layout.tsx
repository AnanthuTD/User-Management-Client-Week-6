import { Link, Outlet } from "react-router-dom";
import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { UseUser } from "../context/AuthContext";

const { Header, Content, Footer } = Layout;

const items = [
	{ key: "user", label: <Link to={"/admin/user"}>User</Link> },
	{ key: "account", label: <Link to={"/admin/account"}>Account</Link> },
];

const App: React.FC = () => {
	const { user } = UseUser();
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	return (
		<Layout style={{ height: "100vh" }}>
			<Header style={{ display: "flex", alignItems: "center" }}>
				<div className="demo-logo">{JSON.stringify(user)}</div>
				<Menu
					theme="dark"
					mode="horizontal"
					defaultSelectedKeys={["2"]}
					items={items}
					style={{ flex: 1, minWidth: 0 }}
				/>
			</Header>
			<Content style={{ padding: "0 48px" }}>
				{/* <Breadcrumb style={{ margin: "16px 0" }}>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item>List</Breadcrumb.Item>
					<Breadcrumb.Item>App</Breadcrumb.Item>
				</Breadcrumb> */}
				<div
					style={{
						background: colorBgContainer,
						minHeight: "100%",
						// padding: 24,
						borderRadius: borderRadiusLG,
					}}
				>
					<Outlet />
				</div>
			</Content>
			{/* <Footer style={{ textAlign: "center" }}>
				Ant Design ©{new Date().getFullYear()} Created by Ant UED
			</Footer> */}
		</Layout>
	);
};

export default App;
