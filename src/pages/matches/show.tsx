import React from "react";
import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import {
  Typography,
  Card,
  Row,
  Col,
  Descriptions,
  Tag,
  Space,
  Avatar,
  Badge,
  Divider,
  Image,
  Empty,
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PictureOutlined,
  WarningOutlined,
  TeamOutlined,
  HeartOutlined,
  FireOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  StarOutlined,
  MehOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { IMatch, ReactionType } from "../../types";

const { Title, Text } = Typography;

const reactionIcons: Record<ReactionType, React.ReactNode> = {
  [ReactionType.LOVE]: <HeartOutlined style={{ color: "#ff6b6b" }} />,
  [ReactionType.FIRE]: <FireOutlined style={{ color: "#ff922b" }} />,
  [ReactionType.COOL]: <ThunderboltOutlined style={{ color: "#4dabf7" }} />,
  [ReactionType.FUNNY]: <SmileOutlined style={{ color: "#ffd43b" }} />,
  [ReactionType.WOW]: <StarOutlined style={{ color: "#9775fa" }} />,
  [ReactionType.MEH]: <MehOutlined style={{ color: "#868e96" }} />,
};

const timeTypeLabels: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

export const MatchShow: React.FC = () => {
  const { query } = useShow<IMatch>();
  const { data, isLoading } = query;

  // Backend sometimes returns { data: { data: {...} } } structure
  const rawData = data?.data as unknown as { data?: IMatch } | IMatch;
  const record = (rawData && 'data' in rawData && rawData.data) ? rawData.data : (rawData as IMatch);

  const renderPhotos = (photoData: unknown, userName: string) => {
    if (!photoData) {
      return <Empty description="No photos yet" />;
    }

    const photosObj = photoData as { conceptPhoto?: { url: string; reaction?: { type: string }; uploadedAt: string }; dailyTimesPhotos?: Array<{ timeType: string; url: string; reaction?: { type: string }; uploadedAt: string }> };
    const allPhotos: Array<{ type: string; timeType?: string; url: string; reaction?: { type: string }; uploadedAt: string }> = [];

    // Concept photo ekle
    if (photosObj.conceptPhoto) {
      allPhotos.push({
        type: "concept",
        url: photosObj.conceptPhoto.url,
        reaction: photosObj.conceptPhoto.reaction,
        uploadedAt: photosObj.conceptPhoto.uploadedAt,
      });
    }

    // Daily times photos ekle
    if (photosObj.dailyTimesPhotos && Array.isArray(photosObj.dailyTimesPhotos)) {
      photosObj.dailyTimesPhotos.forEach((dtp) => {
        allPhotos.push({
          type: "daily",
          timeType: dtp.timeType,
          url: dtp.url,
          reaction: dtp.reaction,
          uploadedAt: dtp.uploadedAt,
        });
      });
    }

    if (allPhotos.length === 0) {
      return <Empty description="No photos yet" />;
    }

    return (
      <Row gutter={[16, 16]}>
        {allPhotos.map((photo, index) => (
          <Col xs={12} sm={8} md={6} key={index}>
            <Card
              size="small"
              className="glass-card"
              cover={
                <Image
                  src={photo.url}
                  alt={`${userName} photo`}
                  style={{ height: 200, objectFit: "cover" }}
                  placeholder={
                    <div
                      style={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PictureOutlined
                        style={{ fontSize: 48, color: "var(--text-secondary)" }}
                      />
                    </div>
                  }
                />
              }
            >
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Tag color={photo.type === "concept" ? "gold" : "blue"}>
                  {photo.type === "concept" ? "Concept" : (timeTypeLabels[photo.timeType || ""] || photo.timeType)}
                </Tag>
                {photo.reaction && (
                  <Space>
                    {reactionIcons[photo.reaction.type as ReactionType]}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {photo.reaction.type}
                    </Text>
                  </Space>
                )}
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {dayjs(photo.uploadedAt).format("HH:mm")}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  if (isLoading || !record) {
    return <Show isLoading={isLoading} />;
  }

  return (
    <Show isLoading={isLoading}>
      <Row gutter={[16, 16]}>
        {/* Match Info Card */}
        <Col xs={24}>
          <Card
            title={
              <Space>
                <TeamOutlined />
                <span>Match Information</span>
              </Space>
            }
            className="glass-card"
          >
            <Descriptions
              column={{ xs: 1, sm: 2, md: 3 }}
              bordered
              size="small"
            >
              <Descriptions.Item label="Date">
                {dayjs(record.date).format("DD.MM.YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {record.isCompleted ? (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    Completed
                  </Tag>
                ) : (
                  <Tag color="processing" icon={<ClockCircleOutlined />}>
                    In Progress
                  </Tag>
                )}
              </Descriptions.Item>
              {record.completedAt && (
                <Descriptions.Item label="Completion Time">
                  {dayjs(record.completedAt).format("DD.MM.YYYY HH:mm")}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Report Status">
                {record.isBrokenByReport ? (
                  <Tag color="red" icon={<WarningOutlined />}>
                    Reported
                  </Tag>
                ) : (
                  <Tag color="green">Normal</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Total Photos">
                <Space>
                  <Tag color="cyan">
                    {record.user1PhotosCount + record.user2PhotosCount}
                  </Tag>
                  <span>
                    ({record.user1PhotosCount} + {record.user2PhotosCount})
                  </span>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Users Info */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <Avatar
                  style={{
                    backgroundColor: "var(--primary-color)",
                    color: "#0a0a0a",
                  }}
                  icon={<UserOutlined />}
                >
                  {record.user1Id?.randomName?.[0] || "?"}
                </Avatar>
                <span>{record.user1Id?.randomName || "User 1"}</span>
              </Space>
            }
            className="glass-card"
            extra={
              <Space>
                <Badge
                  status={record.didUser1SeePartner ? "success" : "processing"}
                  text={record.didUser1SeePartner ? "Seen" : "Not Seen"}
                />
                <Tag color="cyan">
                  <PictureOutlined /> {record.user1PhotosCount}
                </Tag>
              </Space>
            }
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Email">
                {record.user1Id?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Total Matches">
                {record.user1Id?.totalMatches || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {record.user1Id?.isBanned ? (
                  <Tag color="red">Banned</Tag>
                ) : record.user1Id?.isActive ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="orange">Inactive</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <Avatar
                  style={{ backgroundColor: "#9254de", color: "#fff" }}
                  icon={<UserOutlined />}
                >
                  {record.user2Id?.randomName?.[0] || "?"}
                </Avatar>
                <span>{record.user2Id?.randomName || "User 2"}</span>
              </Space>
            }
            className="glass-card"
            extra={
              <Space>
                <Badge
                  status={record.didUser2SeePartner ? "success" : "processing"}
                  text={record.didUser2SeePartner ? "Seen" : "Not Seen"}
                />
                <Tag color="purple">
                  <PictureOutlined /> {record.user2PhotosCount}
                </Tag>
              </Space>
            }
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Email">
                {record.user2Id?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Total Matches">
                {record.user2Id?.totalMatches || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {record.user2Id?.isBanned ? (
                  <Tag color="red">Banned</Tag>
                ) : record.user2Id?.isActive ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="orange">Inactive</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Photos from User 1 */}
        <Col xs={24}>
          <Card
            title={
              <Space>
                <PictureOutlined />
                <span>
                  {record.user1Id?.randomName || "User 1"} Photos
                </span>
              </Space>
            }
            className="glass-card"
          >
            {renderPhotos(
              record.user1Photos,
              record.user1Id?.randomName || "User 1"
            )}
          </Card>
        </Col>

        {/* Photos from User 2 */}
        <Col xs={24}>
          <Card
            title={
              <Space>
                <PictureOutlined />
                <span>
                  {record.user2Id?.randomName || "User 2"} Photos
                </span>
              </Space>
            }
            className="glass-card"
          >
            {renderPhotos(
              record.user2Photos,
              record.user2Id?.randomName || "User 2"
            )}
          </Card>
        </Col>
      </Row>
    </Show>
  );
};
