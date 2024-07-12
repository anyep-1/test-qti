"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  HomeOutlined,
  ContainerOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button, Modal } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import Cookies from "js-cookie";
import {
  AggLocation,
  AggStatus,
  CustomLocation,
  fetchAggLocation,
  fetchAggStatus,
  fetchDataLocation,
  fetchDataStatus,
  Status,
} from "@/data/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Home", "1", <HomeOutlined />),
  getItem("Assets", "2", <ContainerOutlined />),
];

const AppMain: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [LocationList, setLocationList] = useState<CustomLocation[]>([]);
  const [aggLocation, setAggLocation] = useState<AggLocation[]>([]);
  const [aggStatus, setAggStatus] = useState<AggStatus[]>([]);

  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const handleCancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const handleConfirmLogout = async () => {
    const token = Cookies.get("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      await axios({
        method: "post",
        baseURL: "https://be-ksp.analitiq.id",
        url: "/auth/logout",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Cookies.remove("token");
      router.push("/");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === "1") {
      router.push("/main");
    } else if (e.key === "2") {
      router.push("/asset");
    }
  };

  const handleHome = () => {
    router.push("/main");
  };

  useEffect(() => {
    fetchAggLocation().then((data) => setAggLocation(data));
  }, []);

  useEffect(() => {
    fetchAggStatus().then((data) => setAggStatus(data));
  }, []);

  const dataStatus = {
    labels: aggStatus.map((status) => status.status.name),
    datasets: [
      {
        label: "Jumlah",
        data: aggStatus.map((status) => status.count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const dataLocation = {
    labels: aggLocation.map((location) => location.location.name),
    datasets: [
      {
        label: "Jumlah",
        data: aggLocation.map((location) => location.count),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={{ position: "fixed", height: "100vh", background: "#fff" }}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <img
            onClick={handleHome}
            className="p-10"
            src="/logo-home.png"
            alt="logo-home"
            style={{ width: "100%" }}
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
          onClick={handleMenuClick}
        />
        <div
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            style={{ background: "#fff", color: "#000", width: "100%" }}
            onClick={showLogoutModal}
          >
            Log Out
          </Button>
        </div>
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header style={{ padding: "0 24px", background: colorBgContainer }}>
          <div className="flex justify-between h-[60px]">
            <div className="flex items-center">
              <img
                src="/profile-picture.png"
                alt="user-avatar"
                style={{ borderRadius: "50%", width: "40px", height: "40px" }}
              />
              <div className="flex flex-col gap-5 ml-3">
                <div className="h-1 font-bold">Dindin Mahfud</div>
                <div>dindinmahfud@goods.com</div>
              </div>
            </div>
          </div>
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <h2 className="text-3xl">Status</h2>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1, marginRight: "24px" }}>
                <h3 className="mt-3">Chart</h3>
                <Bar data={dataStatus} />
              </div>
              <div style={{ width: "200px" }}>
                {aggStatus.map((status) => (
                  <div
                    key={status.status.id}
                    style={{
                      marginBottom: "16px",
                      textAlign: "center",
                      padding: "16px",
                      background: "#f0f2f5",
                      borderRadius: "8px",
                    }}
                  >
                    <div>{status.status.name}</div>
                    <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                      {status.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              marginTop: "24px",
            }}
          >
            <h2 className="text-3xl">Location</h2>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1, marginRight: "24px" }}>
                <h3 className="mt-3">Chart</h3>
                <Bar data={dataLocation} />
              </div>
              <div style={{ width: "200px" }}>
                {aggLocation.map((location) => (
                  <div
                    key={location.location.id}
                    style={{
                      marginBottom: "16px",
                      textAlign: "center",
                      padding: "16px",
                      background: "#f0f2f5",
                      borderRadius: "8px",
                    }}
                  >
                    <div>{location.location.name}</div>
                    <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                      {location.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Content>
      </Layout>

      {/* Logout Modal */}
      <Modal
        title="Log Out"
        open={logoutModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
        okText="OK"
        cancelText="Cancel"
      >
        <p className="text-lg">
          When you want to use this app, you have to relogin, are you sure?
        </p>
      </Modal>
    </Layout>
  );
};

export default AppMain;
