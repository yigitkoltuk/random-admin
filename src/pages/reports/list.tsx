import React from "react";
import {
  useTable,
  List,
  ShowButton,
  DateField,
} from "@refinedev/antd";
import { Table, Space, Tag, Avatar, Select, Input } from "antd";
import {
  UserOutlined,
  WarningOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { IReport, ReportCategory, ReportStatus } from "../../types";
import dayjs from "dayjs";

const { Search } = Input;

const categoryColors: Record<ReportCategory, string> = {
  [ReportCategory.CHILD_SAFETY]: "red",
  [ReportCategory.INAPPROPRIATE]: "orange",
  [ReportCategory.SPAM]: "yellow",
  [ReportCategory.HARASSMENT]: "volcano",
  [ReportCategory.FAKE]: "magenta",
  [ReportCategory.OTHER]: "default",
};

const categoryLabels: Record<ReportCategory, string> = {
  [ReportCategory.CHILD_SAFETY]: "Child Safety",
  [ReportCategory.INAPPROPRIATE]: "Inappropriate Content",
  [ReportCategory.SPAM]: "Spam",
  [ReportCategory.HARASSMENT]: "Harassment",
  [ReportCategory.FAKE]: "Fake Profile",
  [ReportCategory.OTHER]: "Other",
};

const statusColors: Record<ReportStatus, string> = {
  [ReportStatus.PENDING]: "orange",
  [ReportStatus.UNDER_REVIEW]: "blue",
  [ReportStatus.APPROVED]: "green",
  [ReportStatus.REJECTED]: "red",
};

const statusLabels: Record<ReportStatus, string> = {
  [ReportStatus.PENDING]: "Pending",
  [ReportStatus.UNDER_REVIEW]: "Under Review",
  [ReportStatus.APPROVED]: "Approved",
  [ReportStatus.REJECTED]: "Rejected",
};

export const ReportList: React.FC = () => {
  const { tableProps, searchFormProps } = useTable<IReport>({
    resource: "reports/admin/all",
    syncWithLocation: true,
    onSearch: (params: any) => {
      const filters: Array<{ field: string; operator: "eq" | "contains"; value: any }> = [];
      const { status, category, search } = params;

      if (status) {
        filters.push({
          field: "status",
          operator: "eq" as const,
          value: status,
        });
      }

      if (category) {
        filters.push({
          field: "category",
          operator: "eq" as const,
          value: category,
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
            placeholder="Search user..."
            allowClear
            prefix={<SearchOutlined />}
            onSearch={(value) => {
              searchFormProps?.form?.setFieldsValue({ search: value });
              searchFormProps?.form?.submit();
            }}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: 180 }}
            onChange={(value) => {
              searchFormProps?.form?.setFieldsValue({ status: value });
              searchFormProps?.form?.submit();
            }}
            options={[
              { label: "All", value: "" },
              ...Object.values(ReportStatus).map((status) => ({
                label: statusLabels[status],
                value: status,
              })),
            ]}
          />
          <Select
            placeholder="Filter by Category"
            allowClear
            style={{ width: 180 }}
            onChange={(value) => {
              searchFormProps?.form?.setFieldsValue({ category: value });
              searchFormProps?.form?.submit();
            }}
            options={[
              { label: "All", value: "" },
              ...Object.values(ReportCategory).map((category) => ({
                label: categoryLabels[category],
                value: category,
              })),
            ]}
          />
        </Space>
      </Space>

      <Table {...tableProps} rowKey="_id">
        <Table.Column
          dataIndex="reportDate"
          title="Date"
          render={(date) => dayjs(date).format("DD.MM.YYYY HH:mm")}
          sorter
        />
        <Table.Column
          key="reporter"
          title="Reporter"
          render={(_, record: IReport) => (
            <Space>
              <Avatar
                size="small"
                style={{ backgroundColor: "var(--primary-color)", color: "#0a0a0a" }}
                icon={<UserOutlined />}
              >
                {record.reporterId?.randomName?.[0] || "?"}
              </Avatar>
              <span>{record.reporterId?.randomName || "N/A"}</span>
            </Space>
          )}
        />
        <Table.Column
          key="reported"
          title="Reported"
          render={(_, record: IReport) => (
            <Space>
              <Avatar
                size="small"
                style={{ backgroundColor: "#ff4d4f", color: "#fff" }}
                icon={<WarningOutlined />}
              >
                {record.reportedUserId?.randomName?.[0] || "?"}
              </Avatar>
              <span>{record.reportedUserId?.randomName || "N/A"}</span>
            </Space>
          )}
        />
        <Table.Column
          dataIndex="category"
          title="Category"
          render={(category: ReportCategory) => (
            <Tag color={categoryColors[category]}>
              {categoryLabels[category]}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(status: ReportStatus) => (
            <Tag color={statusColors[status]}>
              {statusLabels[status]}
            </Tag>
          )}
          sorter
        />
        <Table.Column
          dataIndex="customText"
          title="Description"
          render={(text) => (
            text ? (
              <span style={{ fontSize: 12 }}>
                {text.length > 50 ? `${text.substring(0, 50)}...` : text}
              </span>
            ) : (
              "-"
            )
          )}
        />
        <Table.Column
          dataIndex="didBreakMatch"
          title="Match"
          render={(didBreak) => (
            didBreak ? (
              <Tag color="red">Broken</Tag>
            ) : (
              <Tag color="green">In Progress</Tag>
            )
          )}
        />
        <Table.Column
          key="reviewedBy"
          title="Reviewer"
          render={(_, record: IReport) => (
            record.reviewedBy ? (
              <span>{record.reviewedBy.randomName}</span>
            ) : (
              <Tag color="orange">Pending</Tag>
            )
          )}
        />
        <Table.Column
          dataIndex="reviewedAt"
          title="Review Date"
          render={(date) => date ? dayjs(date).format("DD.MM.YYYY HH:mm") : "-"}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: IReport) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record._id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
