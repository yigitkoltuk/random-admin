import React, { useState } from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, InputNumber, Upload, message, Row, Col } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { IConcept } from "../../types";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Dragger } = Upload;

export const ConceptCreate: React.FC = () => {
  const { formProps, saveButtonProps, onFinish } = useForm<IConcept>();
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    // Simulate image upload - replace with actual upload logic
    try {
      // In production, upload to your storage service (S3, Cloudinary, etc.)
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImageUrl(dataUrl);
        message.success("Image uploaded");
        onSuccess("ok");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      message.error("Image upload failed");
      onError(error);
    }
  };

  const handleFormSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      activateDateTime: values.activateDateTime.toISOString(),
      imageUrl: imageUrl || undefined,
    };
    onFinish(formattedValues);
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <div className="simple-form-card">
        <Form {...formProps} layout="vertical" onFinish={handleFormSubmit}>
          <div className="form-section">
            <div className="form-section-title">Concept Information</div>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Date"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: "Date is required",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD.MM.YYYY"
                    placeholder="Select date"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Activation Time"
                  name="activateDateTime"
                  rules={[
                    {
                      required: true,
                      message: "Activation time is required",
                    },
                  ]}
                >
                  <DatePicker
                    showTime
                    style={{ width: "100%" }}
                    format="DD.MM.YYYY HH:mm"
                    placeholder="Select activation time"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Concept Name"
              name="concept"
              rules={[
                {
                  required: true,
                  message: "Concept name is required",
                },
              ]}
            >
              <Input placeholder="E.g.: Morning Coffee, Sunset" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Description is required",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Write a description about the concept..."
              />
            </Form.Item>

            <Form.Item
              label="Upload Window (Minutes)"
              name="uploadWindowMinutes"
              initialValue={60}
              rules={[
                {
                  required: true,
                  message: "Upload window is required",
                },
              ]}
            >
              <InputNumber
                min={1}
                max={1440}
                style={{ width: "100%" }}
                placeholder="Duration in minutes"
                addonAfter="minutes"
              />
            </Form.Item>
          </div>

          <div className="form-section">
            <div className="form-section-title">Concept Image (Optional)</div>

            <Form.Item
              name="imageUrl"
              help="Sample image to show to users"
            >
              <Dragger
                name="file"
                multiple={false}
                customRequest={handleUpload}
                accept="image/*"
                maxCount={1}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: "var(--primary-color)" }} />
                </p>
                <p className="ant-upload-text">
                  Click or drag and drop
                </p>
                <p className="ant-upload-hint">
                  PNG, JPG, GIF formats supported
                </p>
              </Dragger>
            </Form.Item>
            {imageUrl && (
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <img
                  src={imageUrl}
                  alt="preview"
                  style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 12 }}
                />
              </div>
            )}
          </div>
        </Form>
      </div>
    </Create>
  );
};
