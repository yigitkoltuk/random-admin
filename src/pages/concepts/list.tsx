import React from "react";
import {
  useTable,
  List,
  ShowButton,
  EditButton,
  DeleteButton,
  DateField,
  BooleanField,
} from "@refinedev/antd";
import { Table, Space, Tag, Image, Select } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { IConcept } from "../../types";
import dayjs from "dayjs";

export const ConceptList: React.FC = () => {
  const { tableProps, searchFormProps } = useTable<IConcept>({
    resource: "concepts",
    syncWithLocation: true,
    onSearch: (params: any) => {
      const filters: Array<{ field: string; operator: "eq"; value: any }> = [];
      const { isActive } = params;

      if (isActive !== undefined && isActive !== "") {
        filters.push({
          field: "isActive",
          operator: "eq" as const,
          value: isActive,
        });
      }

      return filters;
    },
  });

  return (
    <List>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by Status"
          allowClear
          style={{ width: 180 }}
          onChange={(value) => {
            searchFormProps?.form?.setFieldsValue({ isActive: value });
            searchFormProps?.form?.submit();
          }}
          options={[
            { label: "All", value: "" },
            { label: "Active", value: true },
            { label: "Inactive", value: false },
          ]}
        />
      </Space>

      <Table {...tableProps} rowKey="_id">
        <Table.Column
          dataIndex="date"
          title="Date"
          render={(date) => dayjs(date).format("DD.MM.YYYY")}
          sorter
        />
        <Table.Column
          dataIndex="concept"
          title="Concept"
          render={(value) => (
            <Space>
              <BulbOutlined style={{ color: "var(--primary-color)" }} />
              <strong>{value}</strong>
            </Space>
          )}
        />
        <Table.Column
          dataIndex="description"
          title="Description"
          render={(text) => (
            text?.length > 60 ? `${text.substring(0, 60)}...` : text
          )}
        />
        <Table.Column
          dataIndex="imageUrl"
          title="Image"
          render={(url) => (
            url ? (
              <Image
                src={url}
                alt="concept"
                width={60}
                height={60}
                style={{ objectFit: "cover", borderRadius: 8 }}
                preview={{
                  mask: "View",
                }}
              />
            ) : (
              <span>-</span>
            )
          )}
        />
        <Table.Column
          dataIndex="activateDateTime"
          title="Activation"
          render={(date) => dayjs(date).format("DD.MM.YYYY HH:mm")}
          sorter
        />
        <Table.Column
          dataIndex="uploadWindowMinutes"
          title="Upload Window"
          render={(minutes) => <Tag color="cyan">{minutes} dk</Tag>}
        />
        <Table.Column
          dataIndex="isActive"
          title="Status"
          render={(value) => (
            <BooleanField
              value={value}
              trueIcon={<CheckCircleOutlined />}
              falseIcon={<ClockCircleOutlined />}
              valueLabelTrue="Active"
              valueLabelFalse="Inactive"
            />
          )}
          sorter
        />
        <Table.Column
          dataIndex="notificationSentAt"
          title="Notification"
          render={(date) => (
            date ? (
              <Tag color="green" icon={<CheckCircleOutlined />}>
                Sent
              </Tag>
            ) : (
              <Tag color="orange">Pending</Tag>
            )
          )}
        />
        <Table.Column
          dataIndex="createdAt"
          title="Creation"
          render={(value) => <DateField value={value} format="DD.MM.YYYY HH:mm" />}
          sorter
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: IConcept) => (
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
