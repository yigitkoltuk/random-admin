import React from "react";
import { useShow } from "@refinedev/core";
import { Show, RefreshButton, EditButton, DeleteButton } from "@refinedev/antd";
import {
  Typography,
  Row,
  Col,
  Tag,
  Space,
  Image,
  Statistic,
  Card,
  Divider,
} from "antd";
import {
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PictureOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { IConcept } from "../../types";
import { axiosInstance } from "../../authProvider";

const { Title, Text } = Typography;

export const ConceptShow: React.FC = () => {
  const { query } = useShow<IConcept>();
  const { data, isLoading } = query;
  const record = data?.data;

  const [stats, setStats] = React.useState({
    totalPhotos: 0,
    totalUsers: 0,
  });
  const [loadingStats, setLoadingStats] = React.useState(false);

  React.useEffect(() => {
    if (record?._id) {
      fetchConceptStats();
    }
  }, [record?._id]);

  const fetchConceptStats = async () => {
    try {
      setLoadingStats(true);
      const response = await axiosInstance.get(`/concepts/${record?._id}/stats`);
      setStats(response.data || { totalPhotos: 0, totalUsers: 0 });
    } catch (error) {
      console.error("Failed to fetch concept stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (isLoading || !record) {
    return <Show isLoading={isLoading} />;
  }

  return (
    <Show
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <EditButton />
          <DeleteButton />
          <RefreshButton />
        </>
      )}
    >
      <Row gutter={[16, 16]}>
        {/* Concept Info Card */}
        <Col xs={24} lg={12}>
          <div className="detail-card">
            <div className="detail-section-title">
              <BulbOutlined /> Concept Information
            </div>

            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <Title level={2} style={{ margin: "8px 0", color: "var(--primary-color)" }}>
                {record.concept}
              </Title>
              <Space>
                {record.isActive ? (
                  <Tag color="success" icon={<CheckCircleOutlined />} style={{ padding: "4px 12px" }}>
                    Active
                  </Tag>
                ) : (
                  <Tag color="default" icon={<ClockCircleOutlined />} style={{ padding: "4px 12px" }}>
                    Inactive
                  </Tag>
                )}
                <Tag color="gold" style={{ padding: "4px 12px" }}>
                  {dayjs(record.date).format("DD MMMM YYYY")}
                </Tag>
              </Space>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <div className="detail-row">
              <span className="detail-label">Description:</span>
              <span className="detail-value">{record.description}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Activation Time:</span>
              <span className="detail-value">
                {dayjs(record.activateDateTime).format("DD.MM.YYYY HH:mm")}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Upload Window:</span>
              <span className="detail-value">
                <Tag color="cyan">{record.uploadWindowMinutes} minutes</Tag>
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Notification Status:</span>
              <span className="detail-value">
                {record.notificationSentAt ? (
                  <Space>
                    <Tag color="green" icon={<BellOutlined />}>
                      Sent
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(record.notificationSentAt).format("DD.MM.YYYY HH:mm")}
                    </Text>
                  </Space>
                ) : (
                  <Tag color="orange">Not sent yet</Tag>
                )}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Creation:</span>
              <span className="detail-value">
                {dayjs(record.createdAt).format("DD.MM.YYYY HH:mm")}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Last Update:</span>
              <span className="detail-value">
                {dayjs(record.updatedAt).format("DD.MM.YYYY HH:mm")}
              </span>
            </div>
          </div>
        </Col>

        {/* Concept Image */}
        <Col xs={24} lg={12}>
          <div className="detail-card" style={{ height: "100%" }}>
            <div className="detail-section-title">Concept Image</div>

            {record.imageUrl ? (
              <Image
                src={record.imageUrl}
                alt={record.concept}
                style={{ borderRadius: 12, width: "100%" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 300,
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 12,
                  border: "1px solid var(--border-glass)",
                }}
              >
                <Space direction="vertical" align="center">
                  <PictureOutlined style={{ fontSize: 64, color: "var(--text-secondary)" }} />
                  <Text type="secondary">No image uploaded</Text>
                </Space>
              </div>
            )}
          </div>
        </Col>

        {/* Usage Statistics */}
        <Col xs={24}>
          <div className="detail-card">
            <div className="detail-section-title">
              <PictureOutlined /> Usage Statistics
            </div>

            {loadingStats ? (
              <div>Loading...</div>
            ) : (
              <Row gutter={16}>
                <Col xs={12} sm={8} md={6}>
                  <Card className="stats-card">
                    <Statistic
                      title="Total Photos"
                      value={stats.totalPhotos}
                      prefix={<PictureOutlined style={{ color: "var(--primary-color)" }} />}
                      valueStyle={{ color: "var(--primary-color)" }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Card className="stats-card">
                    <Statistic
                      title="Participating Users"
                      value={stats.totalUsers}
                      prefix={<UserOutlined style={{ color: "#52c41a" }} />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Card className="stats-card">
                    <Statistic
                      title="Participation Rate"
                      value={stats.totalUsers > 0 ? ((stats.totalPhotos / stats.totalUsers) * 100).toFixed(1) : 0}
                      suffix="%"
                      prefix={<CheckCircleOutlined style={{ color: "#1890ff" }} />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        </Col>
      </Row>
    </Show>
  );
};
