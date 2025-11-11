import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, InputNumber, Row, Col, Space, Tag, Alert } from "antd";
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

export const DailyTimeEdit: React.FC = () => {
  const { formProps, saveButtonProps, query } = useForm<IDailyTime>();
  const record = query?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      {record && (
        <div className="simple-form-card">
          <div style={{ marginBottom: 24 }}>
            <Space size="large">
              {timeTypeIcons[record.type as TimeType]}
              <Tag color={timeTypeColors[record.type as TimeType]} style={{ fontSize: 16, padding: "6px 16px" }}>
                {timeTypeLabels[record.type as TimeType]}
              </Tag>
            </Space>
          </div>

          <Alert
            message="Time Slot Settings"
            description="Users can upload daily photos during this time slot. Hours must be between 0-23, minutes between 0-59."
            type="info"
            showIcon
            icon={<ClockCircleOutlined />}
            style={{ marginBottom: 24 }}
          />

          <Form {...formProps} layout="vertical">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <div className="form-section">
                  <div className="form-section-title">Start Time</div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Hour"
                        name="startHour"
                        rules={[
                          {
                            required: true,
                            message: "Hour is required",
                          },
                          {
                            type: "number",
                            min: 0,
                            max: 23,
                            message: "Hour must be between 0-23",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={23}
                          style={{ width: "100%" }}
                          placeholder="Hour"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Minute"
                        name="startMinute"
                        rules={[
                          {
                            required: true,
                            message: "Minute is required",
                          },
                          {
                            type: "number",
                            min: 0,
                            max: 59,
                            message: "Minute must be between 0-59",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={59}
                          style={{ width: "100%" }}
                          placeholder="Minute"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="form-section">
                  <div className="form-section-title">End Time</div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Hour"
                        name="endHour"
                        rules={[
                          {
                            required: true,
                            message: "Hour is required",
                          },
                          {
                            type: "number",
                            min: 0,
                            max: 23,
                            message: "Hour must be between 0-23",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={23}
                          style={{ width: "100%" }}
                          placeholder="Hour"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Minute"
                        name="endMinute"
                        rules={[
                          {
                            required: true,
                            message: "Minute is required",
                          },
                          {
                            type: "number",
                            min: 0,
                            max: 59,
                            message: "Minute must be between 0-59",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={59}
                          style={{ width: "100%" }}
                          placeholder="Minute"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            <Alert
              message="Example Time Slots"
              description={
                <div>
                  <p><strong>Morning:</strong> 06:00 - 12:00</p>
                  <p><strong>Afternoon:</strong> 12:00 - 18:00</p>
                  <p><strong>Evening:</strong> 18:00 - 22:00</p>
                  <p><strong>Night:</strong> 22:00 - 06:00 (next day)</p>
                </div>
              }
              type="success"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Form>
        </div>
      )}
    </Edit>
  );
};
