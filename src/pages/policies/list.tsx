import React from "react";
import {
  useTable,
  List,
  EditButton,
  DeleteButton,
  DateField,
} from "@refinedev/antd";
import { Table, Space, Tag, Typography } from "antd";
import {
  FileTextOutlined,
} from "@ant-design/icons";
import { IPolicy } from "../../types";
import dayjs from "dayjs";

const { Text } = Typography;

export const PolicyList: React.FC = () => {
  const { tableProps } = useTable<IPolicy>({
    resource: "policies",
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="_id">
        <Table.Column
          dataIndex="name"
          title="Policy Name"
          render={(name) => (
            <Space>
              <FileTextOutlined style={{ color: "var(--primary-color)" }} />
              <strong>{name}</strong>
            </Space>
          )}
        />
        <Table.Column
          dataIndex="version"
          title="Version"
          render={(version) => (
            <Tag color="blue" style={{ fontSize: 13 }}>
              v{version}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="content"
          title="Content Preview"
          render={(content) => (
            <Text
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                display: "block",
                maxWidth: 400,
              }}
              ellipsis={{ tooltip: true }}
            >
              {content?.substring(0, 100)}...
            </Text>
          )}
        />
        <Table.Column
          dataIndex="createdAt"
          title="Creation Date"
          render={(value) => <DateField value={value} format="DD.MM.YYYY HH:mm" />}
          sorter
        />
        <Table.Column
          dataIndex="updatedAt"
          title="Last Update"
          render={(value) => dayjs(value).format("DD.MM.YYYY HH:mm")}
          sorter
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: IPolicy) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record._id} />
              <DeleteButton hideText size="small" recordItemId={record._id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
