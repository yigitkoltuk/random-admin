import React from "react";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import {
  Typography,
  Row,
  Col,
  Tag,
  Space,
  Avatar,
  Table,
  Badge,
  Divider,
  Modal,
  Image,
  Card,
  Statistic,
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  StopOutlined,
  WarningOutlined,
  MailOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  PictureOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { IUser, IMatch, IPhoto, IDailyTimePhoto } from "../../types";
import { axiosInstance } from "../../authProvider";

const { Title, Text } = Typography;

export const UserShow: React.FC = () => {
  const { query } = useShow<IUser>();
  const { data, isLoading } = query;
  const record = data?.data;

  const [matches, setMatches] = React.useState<IMatch[]>([]);
  const [photos, setPhotos] = React.useState<IPhoto[]>([]);
  const [loadingMatches, setLoadingMatches] = React.useState(false);
  const [loadingPhotos, setLoadingPhotos] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewTitle, setPreviewTitle] = React.useState("");

  React.useEffect(() => {
    if (record?._id) {
      fetchUserMatches();
      fetchUserPhotos();
    }
  }, [record?._id]);

  const fetchUserMatches = async () => {
    try {
      setLoadingMatches(true);
      const response = await axiosInstance.get(`/matching/user/${record?._id}`);
      setMatches(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoadingMatches(false);
    }
  };

  const fetchUserPhotos = async () => {
    try {
      setLoadingPhotos(true);
      const response = await axiosInstance.get(`/photos/user/${record?._id}`);
      setPhotos(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const matchColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD.MM.YYYY"),
    },
    {
      title: "Partner",
      key: "partner",
      render: (_: any, match: IMatch) => {
        const isUser1 = match.user1Id?._id === record?._id;
        const partner = isUser1 ? match.user2Id : match.user1Id;
        return (
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            <Text>{partner?.randomName || "N/A"}</Text>
          </Space>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isCompleted",
      key: "status",
      render: (completed: boolean, match: IMatch) => (
        <Space direction="vertical" size={4}>
          {completed ? (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              Completed
            </Tag>
          ) : (
            <Tag color="processing" icon={<ClockCircleOutlined />}>
              In Progress
            </Tag>
          )}
          {match.isBrokenByReport && (
            <Tag color="red" icon={<WarningOutlined />}>
              Reported
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Did Partner See?",
      key: "partnerSeen",
      render: (_: any, match: IMatch) => {
        const isUser1 = match.user1Id?._id === record?._id;
        const didSeePartner = isUser1
          ? match.didUser1SeePartner
          : match.didUser2SeePartner;
        return (
          <Badge
            status={didSeePartner ? "success" : "error"}
            text={didSeePartner ? "Yes" : "No"}
          />
        );
      },
    },
    {
      title: "Photos",
      key: "photos",
      render: (_: any, match: IMatch) => {
        const isUser1 = match.user1Id?._id === record?._id;
        const userPhotos = isUser1
          ? match.user1PhotosCount
          : match.user2PhotosCount;
        const partnerPhotos = isUser1
          ? match.user2PhotosCount
          : match.user1PhotosCount;
        return (
          <Space>
            <Tag color="cyan">{userPhotos || 0} (Me)</Tag>
            <span>vs</span>
            <Tag color="purple">{partnerPhotos || 0} (Partner)</Tag>
          </Space>
        );
      },
    },
  ];

  const handlePreview = (photo: IPhoto) => {
    const images: string[] = [];
    let title = `Photos - ${dayjs(photo.date).format("DD.MM.YYYY")}`;

    if (photo.conceptPhoto) {
      images.push(photo.conceptPhoto.url);
      title = `Concept Photo - ${dayjs(photo.date).format("DD.MM.YYYY")}`;
    }

    if (photo.dailyTimesPhotos && photo.dailyTimesPhotos.length > 0) {
      photo.dailyTimesPhotos.forEach((dailyPhoto: IDailyTimePhoto) => {
        images.push(dailyPhoto.url);
      });
    }

    setPreviewImages(images);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };

  const photoColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD.MM.YYYY"),
    },
    {
      title: "Type",
      key: "type",
      render: (_: any, photo: IPhoto) =>
        photo.conceptPhoto ? (
          <Tag color="gold">Concept</Tag>
        ) : (
          <Tag color="blue">Daily</Tag>
        ),
    },
    {
      title: "Preview",
      key: "preview",
      render: (_: any, photo: IPhoto) => {
        const hasPhotos =
          photo.conceptPhoto ||
          (photo.dailyTimesPhotos && photo.dailyTimesPhotos.length > 0);
        if (!hasPhotos) {
          return <Text type="secondary">-</Text>;
        }

        const firstPhoto =
          photo.conceptPhoto?.url || photo.dailyTimesPhotos?.[0]?.url;
        const photoCount =
          (photo.conceptPhoto ? 1 : 0) + (photo.dailyTimesPhotos?.length || 0);

        return (
          <Space size={8}>
            <Image
              width={60}
              height={60}
              src={firstPhoto}
              style={{ objectFit: "cover", borderRadius: 4, cursor: "pointer" }}
              preview={false}
              onClick={() => handlePreview(photo)}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              +{photoCount - 1}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Daily Photos",
      key: "dailyPhotos",
      render: (_: any, photo: IPhoto) => {
        if (!photo.dailyTimesPhotos || photo.dailyTimesPhotos.length === 0) {
          return <Text type="secondary">-</Text>;
        }
        return (
          <Space size={4} wrap>
            {photo.dailyTimesPhotos.map(
              (dailyPhoto: IDailyTimePhoto, index: number) => (
                <Tag
                  key={index}
                  color={
                    dailyPhoto.timeType === "morning"
                      ? "orange"
                      : dailyPhoto.timeType === "afternoon"
                      ? "blue"
                      : dailyPhoto.timeType === "night"
                      ? "purple"
                      : "default"
                  }
                >
                  {dailyPhoto.timeType === "morning"
                    ? "Morning"
                    : dailyPhoto.timeType === "afternoon"
                    ? "Afternoon"
                    : dailyPhoto.timeType === "night"
                    ? "Night"
                    : dailyPhoto.timeType}
                  {dailyPhoto.reaction && ` (${dailyPhoto.reaction.type})`}
                </Tag>
              )
            )}
          </Space>
        );
      },
    },
    {
      title: "Seen by Partner?",
      key: "seenByPartner",
      render: (_: any, photo: IPhoto) => {
        if (!photo.dailyTimesPhotos || photo.dailyTimesPhotos.length === 0) {
          return <Text type="secondary">-</Text>;
        }
        const allSeen = photo.dailyTimesPhotos.every(
          (p: IDailyTimePhoto) => p.isItSeenByPartner
        );
        const someSeen = photo.dailyTimesPhotos.some(
          (p: IDailyTimePhoto) => p.isItSeenByPartner
        );

        return (
          <Badge
            status={allSeen ? "success" : someSeen ? "warning" : "error"}
            text={
              allSeen
                ? "All"
                : someSeen
                ? `${
                    photo.dailyTimesPhotos.filter(
                      (p: IDailyTimePhoto) => p.isItSeenByPartner
                    ).length
                  }/${photo.dailyTimesPhotos.length}`
                : "No"
            }
          />
        );
      },
    },
    {
      title: "Completed",
      dataIndex: "isComplete",
      key: "complete",
      render: (complete: boolean) => (
        <Badge
          status={complete ? "success" : "processing"}
          text={complete ? "Yes" : "No"}
        />
      ),
    },
  ];

  if (isLoading || !record) {
    return <Show isLoading={isLoading} />;
  }

  return (
    <Show isLoading={isLoading}>
      <Row gutter={[16, 16]}>
        {/* User Info Card */}
        <Col xs={24} lg={12}>
          <div className="detail-card">
            <div className="detail-section-title">
              <UserOutlined /> User Information
            </div>

            <Space
              direction="vertical"
              align="center"
              style={{ width: "100%", padding: "16px 0" }}
            >
              <Avatar
                size={100}
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "#0a0a0a",
                  fontSize: 40,
                }}
              >
                {record.randomName?.[0] || "?"}
              </Avatar>
              <Title
                level={3}
                style={{ margin: "8px 0 0 0", color: "var(--primary-color)" }}
              >
                {record.randomName}
              </Title>
              <Space>
                <Tag
                  color={record.role === "super_admin" ? "gold" : "blue"}
                  style={{ padding: "4px 12px" }}
                >
                  {record.role === "super_admin" ? "Admin" : "User"}
                </Tag>
                {record.isBanned && (
                  <Tag color="red" icon={<WarningOutlined />}>
                    Banned
                  </Tag>
                )}
              </Space>
            </Space>

            <Divider style={{ margin: "16px 0" }} />

            <div className="detail-row">
              <span className="detail-label">
                <MailOutlined /> Email:
              </span>
              <span className="detail-value">{record.email}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <CheckCircleOutlined /> Active:
              </span>
              <span className="detail-value">
                <Badge
                  status={record.isActive ? "success" : "error"}
                  text={record.isActive ? "Yes" : "No"}
                />
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <GlobalOutlined /> Time Zone:
              </span>
              <span className="detail-value">
                {record.timezone || "Not specified"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <TeamOutlined /> Total Matches:
              </span>
              <span className="detail-value">
                <Tag color="cyan">{record.totalMatches || 0}</Tag>
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <TeamOutlined /> Active Matches:
              </span>
              <span className="detail-value">
                <Tag color="green">{record.activeMatches || 0}</Tag>
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <PictureOutlined /> Total Photos:
              </span>
              <span className="detail-value">
                <Tag color="blue">{record.totalPhotos || 0}</Tag>
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <CheckCircleOutlined /> Completed Photos:
              </span>
              <span className="detail-value">
                <Tag color="success">{record.completedPhotos || 0}</Tag>
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <ClockCircleOutlined /> Registration Date:
              </span>
              <span className="detail-value">
                {dayjs(record.createdAt).format("DD.MM.YYYY HH:mm")}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">
                <ClockCircleOutlined /> Last Update:
              </span>
              <span className="detail-value">
                {dayjs(record.updatedAt).format("DD.MM.YYYY HH:mm")}
              </span>
            </div>
          </div>
        </Col>

        {/* Statistics Card or Ban Status */}
        <Col xs={24} lg={12}>
          {record.isBanned ? (
            <div
              className="detail-card"
              style={{ borderColor: "rgba(255, 77, 79, 0.4)" }}
            >
              <div className="detail-section-title">
                <WarningOutlined /> Ban Information
              </div>

              <div className="detail-row">
                <span className="detail-label">Reason:</span>
                <span className="detail-value">
                  {record.banReason || "Not specified"}
                </span>
              </div>

              {record.bannedUntil && (
                <div className="detail-row">
                  <span className="detail-label">Ban Duration:</span>
                  <span className="detail-value">
                    {dayjs(record.bannedUntil).format("DD.MM.YYYY HH:mm")}
                  </span>
                </div>
              )}

              {record.bannedBy && (
                <div className="detail-row">
                  <span className="detail-label">Banned By:</span>
                  <span className="detail-value">{record.bannedBy}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="detail-card">
              <div className="detail-section-title">
                <PictureOutlined /> Statistics
              </div>

              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Total Matches"
                      value={record.totalMatches || 0}
                      valueStyle={{ color: "#00b4d8" }}
                      prefix={<TeamOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Active Matches"
                      value={record.activeMatches || 0}
                      valueStyle={{ color: "#52c41a" }}
                      prefix={<TeamOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Total Photos"
                      value={record.totalPhotos || 0}
                      valueStyle={{ color: "#1890ff" }}
                      prefix={<PictureOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Completed"
                      value={record.completedPhotos || 0}
                      valueStyle={{ color: "#52c41a" }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Col>

        {/* Match History */}
        <Col xs={24}>
          <div className="detail-card">
            <div className="detail-section-title">
              <TeamOutlined /> Match History ({matches.length})
            </div>
            <Table
              dataSource={matches}
              columns={matchColumns}
              loading={loadingMatches}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
            />
          </div>
        </Col>

        {/* Photos */}
        <Col xs={24}>
          <div className="detail-card">
            <div className="detail-section-title">
              <PictureOutlined /> Photos ({photos.length})
            </div>
            <Table
              dataSource={photos}
              columns={photoColumns}
              loading={loadingPhotos}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
            />
          </div>
        </Col>
      </Row>

      {/* Image Preview Modal */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width={800}
        centered
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {previewImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Photo ${index + 1}`}
              style={{ maxWidth: "100%", maxHeight: 500, objectFit: "contain" }}
            />
          ))}
        </div>
      </Modal>
    </Show>
  );
};
