import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Row, Col } from "antd";
import { IUser, Role } from "../../types";

export const UserCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<IUser>();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <div className="simple-form-card">
        <Form {...formProps} layout="vertical">
          <div className="form-section">
            <div className="form-section-title">User Information</div>

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
                    {
                      min: 3,
                      message: "Must be at least 3 characters",
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
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Password is required",
                    },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter password" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Role"
                  name="role"
                  initialValue={Role.User}
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
            </Row>

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
          </div>
        </Form>
      </div>
    </Create>
  );
};
