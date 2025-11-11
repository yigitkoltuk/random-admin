import React, { useState, useEffect } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Tabs, Alert } from "antd";
import { FileTextOutlined, EyeOutlined } from "@ant-design/icons";
import { IPolicy } from "../../types";
import MDEditor from "@uiw/react-md-editor";

export const PolicyEdit: React.FC = () => {
  const { formProps, saveButtonProps, query, onFinish } = useForm<IPolicy>();
  const record = query?.data?.data;
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (record?.content) {
      setContent(record.content);
    }
  }, [record]);

  const handleFormSubmit = (values: any) => {
    onFinish({
      ...values,
      content,
    });
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <div className="simple-form-card">
        <Form {...formProps} layout="vertical" onFinish={handleFormSubmit}>
          <div className="form-section">
            <div className="form-section-title">Policy Information</div>

            <Alert
              message="Markdown Support"
              description="The content field supports Markdown format. You can use headings, lists, links, and more."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form.Item
              label="Policy Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Policy name is required",
                },
              ]}
            >
              <Input
                placeholder="Örn: Terms of Service, Privacy Policy"
                prefix={<FileTextOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="Version"
              name="version"
              rules={[
                {
                  required: true,
                  message: "Version is required",
                },
              ]}
            >
              <Input placeholder="Örn: 1.0, 2.1" />
            </Form.Item>
          </div>

          <div className="form-section">
            <div className="form-section-title">Policy Content</div>

            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: "Content is required",
                },
              ]}
            >
              <Tabs
                items={[
                  {
                    key: "edit",
                    label: (
                      <span>
                        <FileTextOutlined /> Edit
                      </span>
                    ),
                    children: (
                      <div data-color-mode="dark">
                        <MDEditor
                          value={content}
                          onChange={(val) => setContent(val || "")}
                          preview="edit"
                          height={500}
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid var(--border-glass)",
                          }}
                        />
                      </div>
                    ),
                  },
                  {
                    key: "preview",
                    label: (
                      <span>
                        <EyeOutlined /> Preview
                      </span>
                    ),
                    children: (
                      <div
                        data-color-mode="dark"
                        style={{
                          minHeight: 500,
                          padding: 16,
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid var(--border-glass)",
                          borderRadius: 8,
                        }}
                      >
                        <MDEditor.Markdown source={content} />
                      </div>
                    ),
                  },
                ]}
              />
            </Form.Item>
          </div>
        </Form>
      </div>
    </Edit>
  );
};
