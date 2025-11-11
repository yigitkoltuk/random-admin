import React, { useState } from "react";
import { useNavigation } from "@refinedev/core";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Alert,
  Radio,
  Divider,
} from "antd";
import {
  SendOutlined,
  BellOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { NotificationType } from "../../types";
import { axiosInstance } from "../../authProvider";

const { TextArea } = Input;

const notificationTypeOptions = [
  { label: "Admin Notification", value: NotificationType.ADMIN_NOTIFICATION },
  { label: "System", value: NotificationType.SYSTEM },
];

export const NotificationSend: React.FC = () => {
  const [form] = Form.useForm();
  const { list } = useNavigation();
  const [sending, setSending] = useState(false);
  const [recipientType, setRecipientType] = useState<"all" | "specific">("all");

  const handleSend = async (values: any) => {
    try {
      setSending(true);
      const payload = {
        title: values.title,
        message: values.message,
        type: values.type,
        recipientId: recipientType === "specific" ? values.recipientId : undefined,
      };

      await axiosInstance.post("/notifications/admin/send", payload);
      message.success("Notification sent successfully");
      form.resetFields();
      setTimeout(() => {
        list("notifications");
      }, 1000);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <div className="simple-form-card">
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BellOutlined style={{ fontSize: 20 }} />
            <span style={{ fontSize: 20, fontWeight: 600 }}>Send Notification</span>
          </div>
          <Button onClick={() => list("notifications")}>
            Go Back
          </Button>
        </div>

        <Alert
          message="Sending Notification"
          description="You can send notifications to all users or a specific user. Notifications are instantly delivered to users' devices."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSend}
          initialValues={{
            type: NotificationType.ADMIN_NOTIFICATION,
          }}
        >
          <div className="form-section">
            <div className="form-section-title">Select Recipient</div>
            <Form.Item name="recipientType">
              <Radio.Group
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Radio value="all">
                    <Space>
                      <TeamOutlined />
                      <span>Send to All Users</span>
                    </Space>
                  </Radio>
                  <Radio value="specific">
                    <Space>
                      <UserOutlined />
                      <span>Send to Specific User</span>
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            {recipientType === "specific" && (
              <Form.Item
                label="User ID"
                name="recipientId"
                rules={[
                  {
                    required: true,
                    message: "User ID is required",
                  },
                ]}
              >
                <Input
                  placeholder="Enter user ID"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            )}
          </div>

          <Divider />

          <div className="form-section">
            <div className="form-section-title">Notification Content</div>

            <Form.Item
              label="Notification Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Notification type is required",
                },
              ]}
            >
              <Select
                placeholder="Select type"
                options={notificationTypeOptions}
              />
            </Form.Item>

            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Title is required",
                },
                {
                  max: 100,
                  message: "Title must be at most 100 characters",
                },
              ]}
            >
              <Input
                placeholder="Notification title"
                showCount
                maxLength={100}
              />
            </Form.Item>

            <Form.Item
              label="Message"
              name="message"
              rules={[
                {
                  required: true,
                  message: "Message is required",
                },
                {
                  max: 500,
                  message: "Message must be at most 500 characters",
                },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Notification message"
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={sending}
                  size="large"
                >
                  Send
                </Button>
                <Button onClick={() => form.resetFields()} disabled={sending}>
                  Clear
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};
