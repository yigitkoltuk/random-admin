import React from "react";
import { useTable, List, DateField } from "@refinedev/antd";
import { Table, Space, Tag, Avatar, Button } from "antd";
import {
  UserOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { INotification, NotificationType } from "../../types";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

const notificationTypeColors: Record<NotificationType, string> = {
  [NotificationType.PARTNER_NUDGE]: "blue",
  [NotificationType.ADMIN_NOTIFICATION]: "gold",
  [NotificationType.SYSTEM]: "purple",
  [NotificationType.PHOTO_REACTION]: "magenta",
  [NotificationType.CONCEPT_ACTIVATED]: "cyan",
};

const notificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.PARTNER_NUDGE]: "Partner Nudge",
  [NotificationType.ADMIN_NOTIFICATION]: "Admin Notification",
  [NotificationType.SYSTEM]: "System",
  [NotificationType.PHOTO_REACTION]: "Photo Reaction",
  [NotificationType.CONCEPT_ACTIVATED]: "Concept Activated",
};

export const NotificationList: React.FC = () => {
  const navigate = useNavigate();

  const { tableProps } = useTable<INotification>({
    resource: "notifications/admin/all",
    syncWithLocation: true,
  });

  return (
    <List
      headerButtons={() => (
        <>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => navigate("/notifications/send")}
          >
            Send Notification
          </Button>
        </>
      )}
    >
      <Table {...tableProps} rowKey="_id">
        <Table.Column
          dataIndex="createdAt"
          title="Date"
          render={(date) => dayjs(date).format("DD.MM.YYYY HH:mm")}
          sorter
        />
        <Table.Column
          dataIndex="type"
          title="Type"
          render={(type: NotificationType) => (
            <Tag color={notificationTypeColors[type]}>
              {notificationTypeLabels[type]}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="title"
          title="Title"
          render={(title) => <strong>{title}</strong>}
        />
        <Table.Column
          dataIndex="message"
          title="Message"
          render={(message) =>
            message?.length > 80 ? `${message.substring(0, 80)}...` : message
          }
        />
        <Table.Column
          dataIndex="recipientId"
          title="Recipient"
          render={(recipientId) => {
            if (!recipientId) {
              return <Tag color="gold">All Users</Tag>;
            }

            // Handle both object and string formats
            const userId =
              typeof recipientId === "string" ? recipientId : recipientId._id;
            const userName =
              typeof recipientId === "object" && recipientId.randomName
                ? recipientId.randomName
                : userId.slice(0, 8) + "...";

            return (
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <span>{userName}</span>
              </Space>
            );
          }}
        />
        <Table.Column
          dataIndex="senderId"
          title="Sender"
          render={(senderId) => {
            if (!senderId) {
              return <Tag color="purple">System</Tag>;
            }

            // Handle both object and string formats
            const userId =
              typeof senderId === "string" ? senderId : senderId._id;
            const userName =
              typeof senderId === "object" && senderId.randomName
                ? senderId.randomName
                : userId.slice(0, 8) + "...";

            return (
              <Space>
                <Avatar size="small" icon={<SendOutlined />} />
                <span>{userName}</span>
              </Space>
            );
          }}
        />
        <Table.Column
          dataIndex="isRead"
          title="Status"
          render={(isRead) =>
            isRead ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Read
              </Tag>
            ) : (
              <Tag color="processing" icon={<ClockCircleOutlined />}>
                Unread
              </Tag>
            )
          }
        />
        <Table.Column
          dataIndex="readAt"
          title="Read Time"
          render={(date) =>
            date ? dayjs(date).format("DD.MM.YYYY HH:mm") : "-"
          }
        />
      </Table>
    </List>
  );
};
