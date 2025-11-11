import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayout,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { authProvider } from "./authProvider";
import { dataProvider } from "./dataProvider";
import { Header } from "./components/header";
import { Login } from "./pages/login";
import { Dashboard } from "./pages/dashboard";
import {
  UserOutlined,
  TeamOutlined,
  PictureOutlined,
  WarningOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  BellOutlined,
  FileTextOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import "./styles/global.css";

// Import pages
import { UserList } from "./pages/users/list";
import { UserShow } from "./pages/users/show";
import { UserEdit } from "./pages/users/edit";
import { UserCreate } from "./pages/users/create";

import { MatchList } from "./pages/matches/list";
import { MatchShow } from "./pages/matches/show";

import { PhotoList } from "./pages/photos/list";
import { PhotoShow } from "./pages/photos/show";

import { ReportList } from "./pages/reports/list";
import { ReportShow } from "./pages/reports/show";

import { ConceptList } from "./pages/concepts/list";
import { ConceptCreate } from "./pages/concepts/create";
import { ConceptEdit } from "./pages/concepts/edit";
import { ConceptShow } from "./pages/concepts/show";

import { DailyTimeList } from "./pages/daily-times/list";
import { DailyTimeEdit } from "./pages/daily-times/edit";

import { NotificationList } from "./pages/notifications/list";
import { NotificationSend } from "./pages/notifications/send";

import { PolicyList } from "./pages/policies/list";
import { PolicyCreate } from "./pages/policies/create";
import { PolicyEdit } from "./pages/policies/edit";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: "#C3E8EB",
              colorBgBase: "#0a0a0a",
              colorBgContainer: "rgba(20, 20, 20, 0.7)",
              colorBorder: "rgba(255, 255, 255, 0.1)",
              colorText: "#ffffff",
              colorTextSecondary: "rgba(255, 255, 255, 0.7)",
              borderRadius: 12,
              fontSize: 14,
            },
          }}
        >
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "dashboard",
                    list: "/",
                    meta: {
                      label: "Dashboard",
                      icon: <DashboardOutlined />,
                    },
                  },
                  {
                    name: "user",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: {
                      label: "Users",
                      icon: <UserOutlined />,
                      canDelete: true,
                    },
                  },
                  {
                    name: "matching",
                    list: "/matches",
                    show: "/matches/show/:id",
                    meta: {
                      label: "Matches",
                      icon: <TeamOutlined />,
                    },
                  },

                  {
                    name: "reports",
                    list: "/reports",
                    show: "/reports/show/:id",
                    meta: {
                      label: "Reports",
                      icon: <WarningOutlined />,
                    },
                  },
                  {
                    name: "concepts",
                    list: "/concepts",
                    create: "/concepts/create",
                    edit: "/concepts/edit/:id",
                    show: "/concepts/show/:id",
                    meta: {
                      label: "Concepts",
                      icon: <BulbOutlined />,
                      canDelete: true,
                    },
                  },
                  {
                    name: "daily-times",
                    list: "/daily-times",
                    edit: "/daily-times/edit/:id",
                    meta: {
                      label: "Time Slots",
                      icon: <ClockCircleOutlined />,
                    },
                  },
                  {
                    name: "notifications",
                    list: "/notifications",
                    create: "/notifications/send",
                    meta: {
                      label: "Notifications",
                      icon: <BellOutlined />,
                    },
                  },
                  {
                    name: "policies",
                    list: "/policies",
                    create: "/policies/create",
                    edit: "/policies/edit/:id",
                    meta: {
                      label: "Policies",
                      icon: <FileTextOutlined />,
                      canDelete: true,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "tb3X5P-Xz4eip-KP2AU3",
                  disableTelemetry: true,
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout Header={Header}>
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route index element={<Dashboard />} />

                    <Route path="/users">
                      <Route index element={<UserList />} />
                      <Route path="create" element={<UserCreate />} />
                      <Route path="edit/:id" element={<UserEdit />} />
                      <Route path="show/:id" element={<UserShow />} />
                    </Route>

                    <Route path="/matches">
                      <Route index element={<MatchList />} />
                      <Route path="show/:id" element={<MatchShow />} />
                    </Route>

                    <Route path="/reports">
                      <Route index element={<ReportList />} />
                      <Route path="show/:id" element={<ReportShow />} />
                    </Route>

                    <Route path="/concepts">
                      <Route index element={<ConceptList />} />
                      <Route path="create" element={<ConceptCreate />} />
                      <Route path="edit/:id" element={<ConceptEdit />} />
                      <Route path="show/:id" element={<ConceptShow />} />
                    </Route>

                    <Route path="/daily-times">
                      <Route index element={<DailyTimeList />} />
                      <Route path="edit/:id" element={<DailyTimeEdit />} />
                    </Route>

                    <Route path="/notifications">
                      <Route index element={<NotificationList />} />
                      <Route path="send" element={<NotificationSend />} />
                    </Route>

                    <Route path="/policies">
                      <Route index element={<PolicyList />} />
                      <Route path="create" element={<PolicyCreate />} />
                      <Route path="edit/:id" element={<PolicyEdit />} />
                    </Route>

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>

                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
