import React from "react";
import {
  useTable,
  List,
  ShowButton,
  DateField,
  BooleanField,
} from "@refinedev/antd";
import { Table, Space, Tag, Avatar, Input, Select } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SearchOutlined,
  TeamOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { IMatch } from "../../types";
import dayjs from "dayjs";

const { Search } = Input;

export const MatchList: React.FC = () => {
  const { tableProps, searchFormProps, filters } = useTable<IMatch>({
    resource: "matching",
    syncWithLocation: true,
    onSearch: (params: any) => {
      const filters: Array<{ field: string; operator: "eq" | "contains"; value: any }> = [];
      const { isCompleted, search } = params;

      if (isCompleted !== undefined && isCompleted !== "") {
        filters.push({
          field: "isCompleted",
          operator: "eq" as const,
          value: isCompleted,
        });
      }

      if (search) {
        filters.push({
          field: "search",
          operator: "contains" as const,
          value: search,
        });
      }

      return filters;
    },
  });

  return (
    <List>
      <Space direction="vertical" size="middle" style={{ width: "100%", marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="Search username..."
            allowClear
            prefix={<SearchOutlined />}
            onSearch={(value) => {
              searchFormProps?.form?.setFieldsValue({ search: value });
              searchFormProps?.form?.submit();
            }}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: 200 }}
            onChange={(value) => {
              searchFormProps?.form?.setFieldsValue({ isCompleted: value });
              searchFormProps?.form?.submit();
            }}
            options={[
              { label: "All", value: "" },
              { label: "Completed", value: true },
              { label: "In Progress", value: false },
            ]}
          />
        </Space>
      </Space>

      <Table {...tableProps} rowKey="_id">
        <Table.Column
          dataIndex="date"
          title="Date"
          render={(date) => dayjs(date).format("DD.MM.YYYY")}
          sorter
        />
        <Table.Column
          key="user1"
          title="User 1"
          render={(_, record: IMatch) => (
            <Space>
              <Avatar
                size="small"
                style={{ backgroundColor: "var(--primary-color)", color: "#0a0a0a" }}
                icon={<UserOutlined />}
              >
                {record.user1Id?.randomName?.[0] || "?"}
              </Avatar>
              <span>{record.user1Id?.randomName || "N/A"}</span>
            </Space>
          )}
        />
        <Table.Column
          key="user2"
          title="User 2"
          render={(_, record: IMatch) => (
            <Space>
              <Avatar
                size="small"
                style={{ backgroundColor: "#9254de", color: "#fff" }}
                icon={<UserOutlined />}
              >
                {record.user2Id?.randomName?.[0] || "?"}
              </Avatar>
              <span>{record.user2Id?.randomName || "N/A"}</span>
            </Space>
          )}
        />
        <Table.Column
          dataIndex="isCompleted"
          title="Status"
          render={(value) => (
            value ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Completed
              </Tag>
            ) : (
              <Tag color="processing" icon={<ClockCircleOutlined />}>
                In Progress
              </Tag>
            )
          )}
          sorter
        />
        <Table.Column
          key="photos"
          title="Photos"
          render={(_, record: IMatch) => (
            <Space>
              <Tag color="cyan" icon={<PictureOutlined />}>
                {record.user1PhotosCount || 0}
              </Tag>
              <span>vs</span>
              <Tag color="purple" icon={<PictureOutlined />}>
                {record.user2PhotosCount || 0}
              </Tag>
            </Space>
          )}
        />
        <Table.Column
          key="seen"
          title="Seen"
          render={(_, record: IMatch) => (
            <Space>
              <BooleanField
                value={record.didUser1SeePartner}
                trueIcon={<CheckCircleOutlined />}
                falseIcon={<ClockCircleOutlined />}
                valueLabelTrue="K1"
                valueLabelFalse="K1"
              />
              <BooleanField
                value={record.didUser2SeePartner}
                trueIcon={<CheckCircleOutlined />}
                falseIcon={<ClockCircleOutlined />}
                valueLabelTrue="K2"
                valueLabelFalse="K2"
              />
            </Space>
          )}
        />
        <Table.Column
          dataIndex="isBrokenByReport"
          title="Report"
          render={(value) => (
            value ? (
              <Tag color="red">Reported</Tag>
            ) : (
              <Tag color="green">Normal</Tag>
            )
          )}
        />
        <Table.Column
          dataIndex="completedAt"
          title="Completion"
          render={(value) => value ? dayjs(value).format("DD.MM.YYYY HH:mm") : "-"}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: IMatch) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record._id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
