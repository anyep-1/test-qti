"use client";

import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  ContainerOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button, Modal, Input, Select, Form } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import { ButtonAdd } from "@/components/buttons";
import {
  fetchDataLocation,
  fetchDataStatus,
  Status,
  CustomLocation,
} from "@/data/data";
import axios from "axios";
import Cookies from "js-cookie";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

type MenuItem = Required<MenuProps>["items"][number];

type asset = {
  name: string;
  status_id: string;
  location_id: string;
};

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

const AppAdd: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [Status, setStatus] = useState<Status[]>([]);
  const [Locations, setLocations] = useState<CustomLocation[]>([]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await fetchDataLocation();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch asset data:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await fetchDataStatus();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch asset data:", error);
      }
    };

    fetchStatus();
  }, []);

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

  const onFinish = async (values: asset) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "https://be-ksp.analitiq.id/asset/",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            name: values.name,
            status_id: values.status_id,
            location_id: values.location_id,
          },
        }
      );

      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
        router.push("/asset");
      }, 2000);
    } catch (error) {
      console.error("Error Adding asset: ", error);
      setError("Failed to add asset");
    }
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
        <div style={{ padding: "16px", textAlign: "center", color: "#fff" }}>
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
          defaultSelectedKeys={["2"]}
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
            <ButtonAdd />
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
            <h2 className="text-xl text-bold">Input Asset</h2>
            <h3 className="text-4xl text-bold mt-7">Fill this form below</h3>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Asset Name"
                style={{ marginTop: "20px" }}
                name="name"
                rules={[
                  { required: true, message: "Please input the asset name!" },
                ]}
              >
                <Input placeholder="Input name" />
              </Form.Item>
              <Form.Item
                label="Status"
                name="status_id"
                rules={[
                  { required: true, message: "Please select the status!" },
                ]}
              >
                <Select placeholder="Select status">
                  {Status?.map((item) => (
                    <Option value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Location"
                name="location_id"
                rules={[
                  { required: true, message: "Please select the location!" },
                ]}
              >
                <Select placeholder="Select location">
                  {Locations?.map((item) => (
                    <Option value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "12%", marginLeft: "1444px" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>
      </Layout>

      {/* Success Modal */}
      <Modal
        title={<div className="text-2xl">Success!</div>}
        open={successModalVisible}
        onCancel={() => setSuccessModalVisible(false)}
        footer={null}
        style={{ textAlign: "center" }}
      >
        <div style={{ textAlign: "center" }}>
          <CheckCircleOutlined
            style={{
              color: "#1a56c4",
              fontSize: "100px",
              marginBottom: "16px",
              marginTop: "10px",
            }}
          />
          <p className="text-4x1 text-3xl mt-2">Data has been submitted</p>
        </div>
      </Modal>

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

export default AppAdd;
