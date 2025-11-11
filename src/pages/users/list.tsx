import React from "react";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  BooleanField,
  DateField,
} from "@refinedev/antd";
import { Table, Space, Tag, Avatar, Tooltip, Button } from "antd";
import {
  CheckCircleOutlined,
  StopOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { IUser } from "../../types";

export const UserList: React.FC = () => {
  const { tableProps } = useTable<IUser>({
    resource: "user",
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="_id">
        <Table.Column
          dataIndex="randomName"
          title="User"
          render={(value) => (
            <Space>
              <Avatar
                style={{ backgroundColor: "var(--primary-color)", color: "#0a0a0a" }}
                icon={<UserOutlined />}
              >
                {value?.[0] || "?"}
              </Avatar>
              <span style={{ fontWeight: 600 }}>{value}</span>
            </Space>
          )}
        />
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column
          dataIndex="role"
          title="Role"
          render={(value) => (
            <Tag color={value === "super_admin" ? "gold" : "blue"}>
              {value === "super_admin" ? "Admin" : "User"}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="isActive"
          title="Active"
          render={(value) => (
            <BooleanField
              value={value}
              trueIcon={<CheckCircleOutlined />}
              falseIcon={<StopOutlined />}
              valueLabelTrue="Active"
              valueLabelFalse="Inactive"
            />
          )}
        />
        <Table.Column
          dataIndex="isBanned"
          title="Status"
          render={(value, record: IUser) => {
            if (value) {
              return (
                <Tooltip title={record.banReason || "Banned"}>
                  <Tag color="red" icon={<WarningOutlined />}>
                    Banned
                  </Tag>
                </Tooltip>
              );
            }
            return <Tag color="green">Normal</Tag>;
          }}
        />
        <Table.Column
          dataIndex="totalMatches"
          title="Matches"
          sorter
          render={(value) => <Tag color="cyan">{value || 0}</Tag>}
        />
        <Table.Column
          dataIndex="timezone"
          title="Time Zone"
          render={(value) => value || "-"}
        />
        <Table.Column
          dataIndex="createdAt"
          title="Registration Date"
          render={(value) => <DateField value={value} format="DD.MM.YYYY HH:mm" />}
          sorter
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: IUser) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record._id} />
              <EditButton hideText size="small" recordItemId={record._id} />
              <DeleteButton hideText size="small" recordItemId={record._id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
