import React, { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Typography, Card, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../../styles/global.css";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<LoginFormValues>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values: LoginFormValues) => {
    setError(null);
    setIsLoading(true);
    login(values, {
      onError: (error: any) => {
        setError(
          error?.message || "Login failed. Please check your credentials."
        );
        setIsLoading(false);
      },
      onSuccess: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0a0a0a",
      }}
    >
      <Card
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title
            level={2}
            style={{
              color: "var(--primary-color)",
              marginBottom: 8,
            }}
          >
            RANDOM
          </Title>
          <Text style={{ color: "var(--text-secondary)" }}>Admin Panel</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label={
              <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>Email</span>
            }
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              prefix={
                <UserOutlined style={{ color: "rgba(255, 255, 255, 0.45)" }} />
              }
              placeholder="admin@random.com"
              autoComplete="email"
              style={{
                height: 42,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
                color: "#fff",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                Password
              </span>
            }
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined style={{ color: "rgba(255, 255, 255, 0.45)" }} />
              }
              placeholder="••••••••"
              autoComplete="current-password"
              style={{
                height: 42,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
                color: "#fff",
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              style={{
                height: 42,
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
