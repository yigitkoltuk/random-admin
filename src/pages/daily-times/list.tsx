import React from "react";
import {
  useTable,
  List,
  EditButton,
} from "@refinedev/antd";
import { Table, Space, Tag } from "antd";
import {
  SunOutlined,
  CloudOutlined,
  MoonOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { IDailyTime, TimeType } from "../../types";

const timeTypeIcons: Record<TimeType, React.ReactNode> = {
  [TimeType.MORNING]: <SunOutlined style={{ color: "#ffd43b" }} />,
  [TimeType.AFTERNOON]: <CloudOutlined style={{ color: "#4dabf7" }} />,
  [TimeType.EVENING]: <SunOutlined style={{ color: "#ff922b" }} />,
  [TimeType.NIGHT]: <MoonOutlined style={{ color: "#7950f2" }} />,
};

const timeTypeLabels: Record<TimeType, string> = {
  [TimeType.MORNING]: "Morning",
  [TimeType.AFTERNOON]: "Afternoon",
  [TimeType.EVENING]: "Evening",
  [TimeType.NIGHT]: "Night",
};

const timeTypeColors: Record<TimeType, string> = {
  [TimeType.MORNING]: "gold",
  [TimeType.AFTERNOON]: "blue",
  [TimeType.EVENING]: "orange",
  [TimeType.NIGHT]: "purple",
};

export const DailyTimeList: React.FC = () => {
  const { tableProps } = useTable<IDailyTime>({
    resource: "daily-times",
    syncWithLocation: false,
    pagination: {
      mode: "off",
    },
  });

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };

  return (
    <List
      title="Daily Time Slots"
      headerProps={{
        subTitle: "Configure photo upload time slots for each day",
      }}
    >
      <Table {...tableProps} rowKey="_id" pagination={false}>
        <Table.Column
          dataIndex="type"
          title="Time Slot"
          render={(type: TimeType) => (
            <Space>
              {timeTypeIcons[type]}
              <Tag color={timeTypeColors[type]} style={{ fontSize: 14, padding: "4px 12px" }}>
                {timeTypeLabels[type]}
              </Tag>
            </Space>
          )}
        />
        <Table.Column
          key="startTime"
          title="Start Time"
          render={(_, record: IDailyTime) => (
            <Space>
              <ClockCircleOutlined style={{ color: "var(--primary-color)" }} />
              <strong style={{ fontSize: 16 }}>
                {formatTime(record.startHour, record.startMinute)}
              </strong>
            </Space>
          )}
        />
        <Table.Column
          key="endTime"
          title="End Time"
          render={(_, record: IDailyTime) => (
            <Space>
              <ClockCircleOutlined style={{ color: "var(--primary-color)" }} />
              <strong style={{ fontSize: 16 }}>
                {formatTime(record.endHour, record.endMinute)}
              </strong>
            </Space>
          )}
        />
        <Table.Column
          key="duration"
          title="Duration"
          render={(_, record: IDailyTime) => {
            const startMinutes = record.startHour * 60 + record.startMinute;
            const endMinutes = record.endHour * 60 + record.endMinute;
            let duration = endMinutes - startMinutes;
            if (duration < 0) duration += 24 * 60; // Handle overnight periods
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            return (
              <Tag color="cyan" style={{ fontSize: 13 }}>
                {hours > 0 && `${hours} hour(s) `}
                {minutes > 0 && `${minutes} minute(s)`}
              </Tag>
            );
          }}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: IDailyTime) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record._id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
