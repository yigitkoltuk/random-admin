import React, { useState, useEffect } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, InputNumber, Upload, message, Row, Col, Switch } from "antd";
import { InboxOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { IConcept } from "../../types";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Dragger } = Upload;

export const ConceptEdit: React.FC = () => {
  const { formProps, saveButtonProps, query, onFinish } = useForm<IConcept>();
  const record = query?.data?.data;
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (record?.imageUrl) {
      setImageUrl(record.imageUrl);
    }
  }, [record]);

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
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
    <Edit saveButtonProps={saveButtonProps}>
      <div className="simple-form-card">
        <Form
          {...formProps}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            ...formProps.initialValues,
            date: formProps.initialValues?.date ? dayjs(formProps.initialValues.date) : undefined,
            activateDateTime: formProps.initialValues?.activateDateTime
              ? dayjs(formProps.initialValues.activateDateTime)
              : undefined,
          }}
        >
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

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Upload Window (Minutes)"
                name="uploadWindowMinutes"
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
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Active"
                name="isActive"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<CloseCircleOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
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
    </Edit>
  );
};
