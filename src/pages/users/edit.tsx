import React, { useState } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, Space, Button, Modal, message, DatePicker, Row, Col } from "antd";
import { IUser, Role } from "../../types";
import { WarningOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../authProvider";
import dayjs from "dayjs";

const { TextArea } = Input;

export const UserEdit: React.FC = () => {
  const { formProps, saveButtonProps, query } = useForm<IUser>();
  const record = query?.data?.data;

  const [banModalVisible, setBanModalVisible] = useState(false);
  const [unbanModalVisible, setUnbanModalVisible] = useState(false);
  const [banForm] = Form.useForm();

  const handleBanUser = async () => {
    try {
      const values = await banForm.validateFields();
      await axiosInstance.post(`/user/${record?._id}/ban`, {
        reason: values.reason,
        bannedUntil: values.bannedUntil ? dayjs(values.bannedUntil).toISOString() : undefined,
      });
      message.success("User has been banned");
      setBanModalVisible(false);
      query?.refetch();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Ban failed");
    }
  };

  const handleUnbanUser = async () => {
    try {
      await axiosInstance.post(`/user/${record?._id}/unban`);
      message.success("User has been unbanned");
      setUnbanModalVisible(false);
      query?.refetch();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Unban failed");
    }
  };

  return (
    <>
      <Edit
        saveButtonProps={saveButtonProps}
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
            {record?.isBanned ? (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => setUnbanModalVisible(true)}
              >
                Unban
              </Button>
            ) : (
              <Button
                danger
                icon={<WarningOutlined />}
                onClick={() => setBanModalVisible(true)}
              >
                Ban
              </Button>
            )}
          </>
        )}
      >
        <div className="simple-form-card">
          <Form {...formProps} layout="vertical">
            <div className="form-section">
              <div className="form-section-title">Basic Information</div>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Random Name"
                    name="randomName"
                    rules={[
                      {
                        required: true,
                        message: "Random name is required",
                      },
                    ]}
                  >
                    <Input placeholder="Enter random name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Enter a valid email",
                      },
                    ]}
                  >
                    <Input placeholder="Enter email" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Select a role",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select role"
                      options={[
                        { label: "User", value: Role.User },
                        { label: "Admin", value: Role.SuperAdmin },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Time Zone"
                    name="timezone"
                  >
                    <Select
                      placeholder="Select time zone"
                      showSearch
                      options={[
                        { label: "Europe/Istanbul", value: "Europe/Istanbul" },
                        { label: "Europe/London", value: "Europe/London" },
                        { label: "America/New_York", value: "America/New_York" },
                        { label: "America/Los_Angeles", value: "America/Los_Angeles" },
                        { label: "Asia/Tokyo", value: "Asia/Tokyo" },
                        { label: "Australia/Sydney", value: "Australia/Sydney" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className="form-section">
              <div className="form-section-title">Status Settings</div>

              <Form.Item
                label="Active"
                name="isActive"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<StopOutlined />}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Edit>

      {/* Ban Modal */}
      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: "#ff4d4f" }} />
            <span>Ban User</span>
          </Space>
        }
        open={banModalVisible}
        onOk={handleBanUser}
        onCancel={() => setBanModalVisible(false)}
        okText="Ban"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <Form form={banForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="Ban Reason"
            name="reason"
            rules={[{ required: true, message: "You must specify a reason" }]}
          >
            <TextArea
              rows={4}
              placeholder="Explain the reason for banning..."
            />
          </Form.Item>
          <Form.Item
            label="Ban Duration (Optional)"
            name="bannedUntil"
            help="If left empty, the ban will be permanent"
          >
            <DatePicker
              showTime
              format="DD.MM.YYYY HH:mm"
              style={{ width: "100%" }}
              placeholder="Select duration"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Unban Modal */}
      <Modal
        title={
          <Space>
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
            <span>Unban User</span>
          </Space>
        }
        open={unbanModalVisible}
        onOk={handleUnbanUser}
        onCancel={() => setUnbanModalVisible(false)}
        okText="Unban"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to unban user <strong>{record?.randomName}</strong>?
        </p>
      </Modal>
    </>
  );
};
