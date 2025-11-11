import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
  Space,
  Badge,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  PictureOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BulbOutlined,
  StopOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { Column, Pie } from "@ant-design/charts";
import { axiosInstance } from "../../authProvider";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";

dayjs.extend(relativeTime);
dayjs.locale("en");

const { Title, Text } = Typography;

interface UserStats {
  total: number;
  active: number;
  banned: number;
  newThisWeek: number;
}

interface MatchStats {
  total: number;
  active: number;
  completedToday: number;
}

interface ReportStats {
  total: number;
  pending: number;
  underReview: number;
  resolvedThisWeek: number;
}

interface Statistics {
  users: UserStats;
  matches: MatchStats;
  reports: ReportStats;
}

interface User {
  _id: string;
  randomName: string;
  email: string;
  createdAt: string;
  isActive: boolean;
  isBanned: boolean;
}

interface Match {
  _id: string;
  date: string;
  user1: {
    _id: string;
    randomName: string;
    email: string;
  };
  user2: {
    _id: string;
    randomName: string;
    email: string;
  };
  isCompleted: boolean;
  createdAt: string;
}

interface Report {
  _id: string;
  reporter: {
    _id: string;
    randomName: string;
  };
  reportedUser: {
    _id: string;
    randomName: string;
  };
  category: string;
  status: string;
  createdAt: string;
}

interface RecentActivities {
  latestUsers: User[];
  latestMatches: Match[];
  latestReports: Report[];
}

interface DashboardData {
  statistics: Statistics;
  recentActivities: RecentActivities;
}

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/user/admin/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const userColumns = [
    {
      title: "User",
      dataIndex: "randomName",
      key: "randomName",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "isBanned",
      key: "status",
      render: (banned: boolean, record: any) =>
        banned ? (
          <Tag color="red" icon={<StopOutlined />}>
            Banned
          </Tag>
        ) : record.isActive ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Active
          </Tag>
        ) : (
          <Tag color="orange">Inactive</Tag>
        ),
    },
    {
      title: "Registered",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).fromNow(),
    },
  ];

  const matchColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD MMMM YYYY"),
    },
    {
      title: "Users",
      key: "users",
      render: (_: any, record: Match) => (
        <Space>
          <Tag color="cyan">{record.user1?.randomName || "N/A"}</Tag>
          <span>↔</span>
          <Tag color="purple">{record.user2?.randomName || "N/A"}</Tag>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "isCompleted",
      key: "status",
      render: (completed: boolean | null) =>
        completed === true ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Completed
          </Tag>
        ) : completed === null ? (
          <Tag color="default" icon={<StopOutlined />}>
            Closed
          </Tag>
        ) : (
          <Tag color="processing" icon={<ClockCircleOutlined />}>
            In Progress
          </Tag>
        ),
    },
  ];

  const reportColumns = [
    {
      title: "Reporter",
      key: "reporter",
      render: (_: any, record: Report) => (
        <Tag>{record.reporter?.randomName}</Tag>
      ),
    },
    {
      title: "Reported User",
      key: "reported",
      render: (_: any, record: Report) => (
        <Tag color="red">{record.reportedUser?.randomName}</Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => {
        const colors: Record<string, string> = {
          "child-safety": "red",
          inappropriate: "orange",
          spam: "yellow",
          harassment: "volcano",
          fake: "magenta",
          other: "default",
        };
        return <Tag color={colors[cat] || "default"}>{cat}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: "orange",
          "under-review": "blue",
          approved: "green",
          rejected: "red",
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).fromNow(),
    },
  ];

  // Prepare chart data
  const userDistributionData = data
    ? [
        { type: "Active Users", value: data.statistics.users.active },
        { type: "Banned Users", value: data.statistics.users.banned },
      ]
    : [];

  const matchStatusData = data
    ? [
        { type: "Active Matches", value: data.statistics.matches.active },
        {
          type: "Completed Today",
          value: data.statistics.matches.completedToday,
        },
      ]
    : [];

  const reportStatusData = data
    ? [
        { type: "Pending", value: data.statistics.reports.pending },
        { type: "Under Review", value: data.statistics.reports.underReview },
        {
          type: "Resolved This Week",
          value: data.statistics.reports.resolvedThisWeek,
        },
      ]
    : [];

  const pieConfig = {
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-30%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
        fill: "#fff",
      },
    },
    legend: {
      position: "bottom" as const,
    },
    theme: "dark",
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
  };

  const columnConfig = {
    xField: "type",
    yField: "value",
    label: {
      position: "top" as const,
      style: {
        fill: "#fff",
        opacity: 0.8,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fill: "rgba(255, 255, 255, 0.65)",
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: "rgba(255, 255, 255, 0.65)",
        },
      },
    },
    theme: "dark",
    meta: {
      type: {
        alias: "Status",
      },
      value: {
        alias: "Count",
      },
    },
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Dashboard Overview
      </Title>

      {/* Top Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card" loading={loading} hoverable>
            <Statistic
              title="Total Users"
              value={data?.statistics.users.total || 0}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div style={{ marginTop: 12, fontSize: 12 }}>
              <Space split="|">
                <Text type="success">
                  <RiseOutlined /> {data?.statistics.users.newThisWeek || 0} new
                  this week
                </Text>
                <Text type="secondary">
                  {data?.statistics.users.active || 0} active
                </Text>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card" loading={loading} hoverable>
            <Statistic
              title="Total Matches"
              value={data?.statistics.matches.total || 0}
              prefix={<TeamOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div style={{ marginTop: 12, fontSize: 12 }}>
              <Space split="|">
                <Text type="success">
                  <CheckCircleOutlined />{" "}
                  {data?.statistics.matches.completedToday || 0} completed today
                </Text>
                <Text type="secondary">
                  {data?.statistics.matches.active || 0} active
                </Text>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card" loading={loading} hoverable>
            <Statistic
              title="Total Reports"
              value={data?.statistics.reports.total || 0}
              prefix={<WarningOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f" }}
            />
            <div style={{ marginTop: 12, fontSize: 12 }}>
              <Space split="|">
                <Text type="warning">
                  <ClockCircleOutlined />{" "}
                  {data?.statistics.reports.pending || 0} pending
                </Text>
                <Text type="secondary">
                  {data?.statistics.reports.underReview || 0} reviewing
                </Text>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stats-card" loading={loading} hoverable>
            <Statistic
              title="Resolved This Week"
              value={data?.statistics.reports.resolvedThisWeek || 0}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div style={{ marginTop: 12, fontSize: 12 }}>
              <Text type="secondary">Reports handled</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="User Distribution" loading={loading}>
            {data && userDistributionData.length > 0 ? (
              <Pie {...pieConfig} data={userDistributionData} height={250} />
            ) : !loading ? (
              <div
                style={{
                  height: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255, 255, 255, 0.45)",
                }}
              >
                No data available
              </div>
            ) : null}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Match Status" loading={loading}>
            {data && matchStatusData.length > 0 ? (
              <Column {...columnConfig} data={matchStatusData} height={250} />
            ) : !loading ? (
              <div
                style={{
                  height: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255, 255, 255, 0.45)",
                }}
              >
                No data available
              </div>
            ) : null}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Report Status Overview" loading={loading}>
            {data && reportStatusData.length > 0 ? (
              <Column {...columnConfig} data={reportStatusData} height={250} />
            ) : !loading ? (
              <div
                style={{
                  height: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255, 255, 255, 0.45)",
                }}
              >
                No data available
              </div>
            ) : null}
          </Card>
        </Col>
      </Row>

      {/* Activity Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Banned Users"
              value={data?.statistics.users.banned || 0}
              prefix={<StopOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Active Matches"
              value={data?.statistics.matches.active || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Under Review"
              value={data?.statistics.reports.underReview || 0}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card title="Recent Users" extra={<UserOutlined />}>
            <Table
              dataSource={data?.recentActivities.latestUsers || []}
              columns={userColumns}
              loading={loading}
              pagination={false}
              rowKey="_id"
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card title="Recent Matches" extra={<TeamOutlined />}>
            <Table
              dataSource={data?.recentActivities.latestMatches || []}
              columns={matchColumns}
              loading={loading}
              pagination={false}
              rowKey="_id"
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Recent Reports" extra={<WarningOutlined />}>
            <Table
              dataSource={data?.recentActivities.latestReports || []}
              columns={reportColumns}
              loading={loading}
              pagination={false}
              rowKey="_id"
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
