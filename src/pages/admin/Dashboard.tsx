import React, { useEffect, useState } from "react";
import {
	Table,
	Form,
	Typography,
	Popconfirm,
	Button,
	InputNumber,
	Input,
	Select,
	message,
} from "antd";
import type { TableProps } from "antd";
import axios from "axios";
import { User } from "../../types";
import { UseUser } from "../../context/AuthContext";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: string;
	inputType: "number" | "text" | "select";
	record: User;
	index: number;
	key: string;
	fallbackDataIndex: string;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
	editing,
	dataIndex,
	fallbackDataIndex,
	title,
	inputType,
	children,
	...restProps
}) => {
	let inputNode = null;

	switch (inputType) {
		case "number":
			inputNode = <InputNumber />;
			break;
		case "select":
			inputNode = (
				<Select
					options={[
						{ value: "admin", label: "admin" },
						{ value: "user", label: "user" },
					]}
				/>
			);
			break;

		default:
			inputNode = <Input />;
			break;
	}

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={
						dataIndex || fallbackDataIndex
					} /* if no dataIndex is provided fallback to key. since usage of both render and dataIndex are not supported by table */
					style={{ margin: 0 }}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`,
						},
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

const App: React.FC = () => {
	const [form] = Form.useForm();
	const [data, setData] = useState<User[] | []>([]);
	const [editingKey, setEditingKey] = useState("");
	// const { user } = UseUser();

	async function loadUser() {
		try {
			const { data } = await axios.get("/api/admin/user");
			setData(data.users || []);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.data) {
				message.error(error.response.data.msg || "something went wrong!");
			}
		}
	}

	useEffect(() => {
		loadUser();
	}, []);

	const isEditing = (record: User) => record._id === editingKey;

	const edit = (record: Partial<User>) => {
		form.setFieldsValue({ ...record, ...record.name });
		setEditingKey(record._id!);
	};

	const cancel = () => {
		setEditingKey("");
	};

	const save = async (id: string) => {
		try {
			const row = (await form.validateFields()) as User;

			const newData = [...data];
			const index = newData.findIndex((item) => id === item._id);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row,
				});
				try {
					await axios.patch("/api/admin/user", { user: row });
					setData(newData);
					setEditingKey("");
				} catch (error) {
					if (axios.isAxiosError(error)) {
						message.error(
							error?.response?.data.msg || error.response?.statusText
						);
					} else message.error("Something went wrong!");
				}
			}
		} catch (errInfo) {
			console.error("Validate Failed:", errInfo);
			message.error("Validation Failed!");
		}
	};

	const handleDelete = async (id: string) => {
		/* if (user._id === id)
			return message.warning("Are you trying to delete yourself?"); */
		try {
			const index = data.findIndex((item) => item._id === id);
			if (index > -1) {
				try {
					await axios.delete("/api/admin/user/" + id);
					const newData = [...data];
					newData.splice(index, 1);
					setData(newData);
				} catch (error) {
					if (axios.isAxiosError(error)) {
						message.error(
							error?.response?.data.msg || error.response?.statusText
						);
					} else message.error("Something went wrong!");
				}
			} else {
				message.error("Data does not exist!");
			}
		} catch (error) {
			message.error("Validation Failed!");
		}
	};

	const columns = [
		{
			title: "Id",
			width: 100,
			dataIndex: "_id",
			key: "_id",
			fixed: "left",
		},
		{
			title: "First Name",
			width: 100,
			key: "firstName",
			editable: true,
			render: (record: User) => <span>{record?.name?.firstName || ""}</span>,
			fallBackDataIndex: "firstName",
		},
		{
			title: "Last Name",
			key: "lastName",
			width: 150,
			editable: true,
			render: (record: User) => <span>{record?.name?.lastName || ""}</span>,
			fallBackDataIndex: "lastName",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			editable: true,
			width: 150,
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
			editable: true,
			width: 70,
		},
		{
			title: "Action",
			key: "operation",
			fixed: "right",
			width: 100,
			render: (_: any, record: User) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Typography.Link
							onClick={() => save(record._id)}
							style={{ marginRight: 8 }}
						>
							Save
						</Typography.Link>
						<Popconfirm title="Sure to cancel?" onConfirm={cancel}>
							<a>Cancel</a>
						</Popconfirm>
					</span>
				) : (
					<span>
						<Button
							disabled={editingKey !== ""}
							onClick={() => edit(record)}
							style={{ marginRight: 8 }}
							type="primary"
						>
							Edit
						</Button>
						<Popconfirm
							title="Are you sure to delete this user?"
							onConfirm={() => handleDelete(record._id)}
						>
							<Button danger>Delete</Button>
						</Popconfirm>
					</span>
				);
			},
		},
	];

	const mergedColumns: TableProps["columns"] = columns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record: User) => {
				let inputType = "text";
				switch (col.dataIndex) {
					case "age":
						inputType = "number";
						break;
					case "role":
						inputType = "select";
						break;
				}
				return {
					record,
					inputType,
					dataIndex: col.dataIndex,
					title: col.title,
					fallbackDataIndex: col.key, // fallback if no data index specified
					editing: isEditing(record),
				};
			},
		};
	});

	return (
		<Form form={form} component={false}>
			<Table
				components={{
					body: {
						cell: EditableCell,
					},
				}}
				bordered
				dataSource={data}
				columns={mergedColumns}
				rowClassName="editable-row"
				pagination={{
					onChange: cancel,
				}}
				scroll={{ x: 1500 }}
				sticky={{ offsetHeader: 64 }}
			/>
		</Form>
	);
};

export default App;
