import React, { useState } from "react";
import { useShow } from "@refinedev/core";
import { Show, RefreshButton } from "@refinedev/antd";
import {
  Typography,
  Row,
  Col,
  Tag,
  Space,
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Divider,
} from "antd";
import {
  UserOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  StopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { IReport, ReportCategory, ReportStatus } from "../../types";
import { axiosInstance } from "../../authProvider";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const categoryColors: Record<ReportCategory, string> = {
  [ReportCategory.CHILD_SAFETY]: "red",
  [ReportCategory.INAPPROPRIATE]: "orange",
  [ReportCategory.SPAM]: "yellow",
  [ReportCategory.HARASSMENT]: "volcano",
  [ReportCategory.FAKE]: "magenta",
  [ReportCategory.OTHER]: "default",
};

const categoryLabels: Record<ReportCategory, string> = {
  [ReportCategory.CHILD_SAFETY]: "Child Safety",
  [ReportCategory.INAPPROPRIATE]: "Inappropriate Content",
  [ReportCategory.SPAM]: "Spam",
  [ReportCategory.HARASSMENT]: "Harassment",
  [ReportCategory.FAKE]: "Fake Profile",
  [ReportCategory.OTHER]: "Other",
};

const statusColors: Record<ReportStatus, string> = {
  [ReportStatus.PENDING]: "orange",
  [ReportStatus.UNDER_REVIEW]: "blue",
  [ReportStatus.APPROVED]: "green",
  [ReportStatus.REJECTED]: "red",
};

const statusLabels: Record<ReportStatus, string> = {
  [ReportStatus.PENDING]: "Pending",
  [ReportStatus.UNDER_REVIEW]: "Under Review",
  [ReportStatus.APPROVED]: "Approved",
  [ReportStatus.REJECTED]: "Rejected",
};

export const ReportShow: React.FC = () => {
  const { query } = useShow<IReport>();
  const { data, isLoading } = query;
  const record = data?.data;

  const [reviewForm] = Form.useForm();
  const [banModalVisible, setBanModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleReview = async (status: ReportStatus) => {
    try {
      setProcessing(true);
      const values = await reviewForm.validateFields();
      await axiosInstance.patch(`/reports/${record?._id}`, {
        status,
        adminNote: values.adminNote,
      });
      message.success(`Report ${statusLabels[status].toLowerCase()}`);
      query?.refetch();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleBanUser = async () => {
    try {
      setProcessing(true);
      const values = await reviewForm.validateFields();
      await axiosInstance.post(`/user/${record?.reportedUserId._id}/ban`, {
        reason: values.banReason || `Banned due to report #${record?._id}`,
      });
      await axiosInstance.patch(`/reports/${record?._id}`, {
        status: ReportStatus.APPROVED,
        adminNote: values.adminNote,
      });
      message.success("User banned and report approved");
      setBanModalVisible(false);
      query?.refetch();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  const updateStatus = async (status: ReportStatus) => {
    try {
      setProcessing(true);
      await axiosInstance.patch(`/reports/${record?._id}`, {
        status,
      });
      message.success("Status updated");
      query?.refetch();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading || !record) {
    return <Show isLoading={isLoading} />;
  }

  const isPending = record.status === ReportStatus.PENDING;
  const isUnderReview = record.status === ReportStatus.UNDER_REVIEW;

  return (
    <>
      <Show
        isLoading={isLoading}
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
            {isPending && (
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => updateStatus(ReportStatus.UNDER_REVIEW)}
                loading={processing}
              >
                Take for Review
              </Button>
            )}
            <RefreshButton />
          </>
        )}
      >
        <Row gutter={[16, 16]}>
          {/* Report Info */}
          <Col xs={24} lg={12}>
            <div className="detail-card">
              <div className="detail-section-title">
                <WarningOutlined /> Report Information
              </div>

              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {dayjs(record.reportDate).format("DD.MM.YYYY HH:mm")}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">
                  <Tag color={categoryColors[record.category as ReportCategory]} style={{ fontSize: 14 }}>
                    {categoryLabels[record.category as ReportCategory]}
                  </Tag>
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  <Tag color={statusColors[record.status as ReportStatus]} style={{ fontSize: 14 }}>
                    {statusLabels[record.status as ReportStatus]}
                  </Tag>
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Match Status:</span>
                <span className="detail-value">
                  {record.didBreakMatch ? (
                    <Tag color="red">Broken</Tag>
                  ) : (
                    <Tag color="green">In Progress</Tag>
                  )}
                </span>
              </div>

              {record.matchId && (
                <div className="detail-row">
                  <span className="detail-label">Match ID:</span>
                  <span className="detail-value">
                    <Text copyable style={{ fontFamily: "monospace", fontSize: 12 }}>
                      {record.matchId}
                    </Text>
                  </span>
                </div>
              )}
            </div>
          </Col>

          {/* Users Info */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div className="detail-card">
                <div className="detail-section-title">Reporting User</div>
                <Space>
                  <Avatar
                    size={48}
                    style={{ backgroundColor: "var(--primary-color)", color: "#0a0a0a" }}
                    icon={<UserOutlined />}
                  >
                    {record.reporterId?.randomName?.[0] || "?"}
                  </Avatar>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      {record.reporterId?.randomName || "N/A"}
                    </Title>
                    <Text type="secondary">{record.reporterId?.email || "N/A"}</Text>
                  </div>
                </Space>
              </div>

              <div className="detail-card">
                <div className="detail-section-title">
                  Reported User
                  {record.reportedUserId?.isBanned && (
                    <Tag color="red" icon={<StopOutlined />} style={{ marginLeft: 8 }}>
                      Banned
                    </Tag>
                  )}
                </div>
                <Space>
                  <Avatar
                    size={48}
                    style={{ backgroundColor: "#ff4d4f", color: "#fff" }}
                    icon={<WarningOutlined />}
                  >
                    {record.reportedUserId?.randomName?.[0] || "?"}
                  </Avatar>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      {record.reportedUserId?.randomName || "N/A"}
                    </Title>
                    <Text type="secondary">{record.reportedUserId?.email || "N/A"}</Text>
                  </div>
                </Space>
              </div>
            </Space>
          </Col>

          {/* Report Details */}
          <Col xs={24}>
            <div className="detail-card">
              <div className="detail-section-title">Report Details</div>

              {record.customText && (
                <>
                  <Title level={5}>User Description:</Title>
                  <Paragraph
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-glass)",
                    }}
                  >
                    {record.customText}
                  </Paragraph>
                </>
              )}

              {record.adminNote && (
                <>
                  <Divider />
                  <Title level={5}>Admin Note:</Title>
                  <Paragraph
                    style={{
                      background: "rgba(195, 232, 235, 0.1)",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid rgba(195, 232, 235, 0.3)",
                    }}
                  >
                    {record.adminNote}
                  </Paragraph>
                </>
              )}

              {record.reviewedBy && (
                <>
                  <Divider />
                  <div className="detail-row">
                    <span className="detail-label">Reviewed by:</span>
                    <span className="detail-value">{record.reviewedBy.randomName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Review Date:</span>
                    <span className="detail-value">
                      {dayjs(record.reviewedAt).format("DD.MM.YYYY HH:mm")}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Col>

          {/* Review Form */}
          {(isPending || isUnderReview) && (
            <Col xs={24}>
              <div className="simple-form-card">
                <div className="form-section">
                  <div className="form-section-title">Review Report</div>

                  <Form form={reviewForm} layout="vertical">
                    <Form.Item
                      label="Admin Note"
                      name="adminNote"
                      rules={[{ required: true, message: "Admin note is required" }]}
                    >
                      <TextArea
                        rows={4}
                        placeholder="Write your review note..."
                      />
                    </Form.Item>

                    <Space wrap>
                      <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleReview(ReportStatus.APPROVED)}
                        loading={processing}
                        style={{ background: "#52c41a" }}
                      >
                        Approve
                      </Button>
                      <Button
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleReview(ReportStatus.REJECTED)}
                        loading={processing}
                      >
                        Reject
                      </Button>
                      {!record.reportedUserId?.isBanned && (
                        <Button
                          danger
                          type="primary"
                          icon={<StopOutlined />}
                          onClick={() => setBanModalVisible(true)}
                          loading={processing}
                        >
                          Ban User
                        </Button>
                      )}
                    </Space>
                  </Form>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Show>

      {/* Ban Modal */}
      <Modal
        title="Ban User"
        open={banModalVisible}
        onOk={handleBanUser}
        onCancel={() => setBanModalVisible(false)}
        okText="Ban and Approve"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: processing }}
      >
        <Form form={reviewForm} layout="vertical">
          <Form.Item
            label="Ban Reason (Optional)"
            name="banReason"
          >
            <TextArea
              rows={3}
              placeholder={`Default: Banned due to report #${record._id}`}
            />
          </Form.Item>
        </Form>
        <p style={{ marginTop: 16 }}>
          This action will ban the user and approve the report.
        </p>
      </Modal>
    </>
  );
};
