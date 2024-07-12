"use client";

import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  ContainerOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, Modal, Input, Select, Form, theme } from "antd";
import type { MenuProps } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { ButtonAdd } from "@/components/buttons";
import {
  fetchDataLocation,
  fetchDataStatus,
  Status,
  CustomLocation,
  fetchData,
  Asset,
  fetchDetail,
} from "@/data/data";
import axios from "axios";
import Cookies from "js-cookie";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

type MenuItem = Required<MenuProps>["items"][number];

type AssetDetail = {
  id: string;
  name: string;
  status: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
  };
};

type AssetForm = {
  id: string;
  location_id: string;
  status_id: string;
  name: string;
};

const items: MenuItem[] = [
  { key: "1", label: "Home", icon: <HomeOutlined /> },
  { key: "2", label: "Assets", icon: <ContainerOutlined /> },
];

const AppUpdate: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [assetData, setAssetData] = useState<Asset[]>([]);
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [locationList, setLocationList] = useState<CustomLocation[]>([]);
  const [assetDetail, setAssetDetail] = useState<AssetDetail>({
    id: "",
    name: "",
    status: {
      id: "",
      name: "",
    },
    location: {
      id: "",
      name: "",
    },
  });
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [successDeleteModalVisible, setSuccessDeleteModalVisible] =
    useState(false); // State untuk modal success delete
  const [error, setError] = useState<string>("");

  const params = useSearchParams();
  const assetId = params.get("id");

  const [form] = Form.useForm();

  useEffect(() => {
    fetchDataLocation()
      .then((data) => setLocationList(data))
      .catch((error) => console.error("Failed to fetch locations:", error));
  }, []);

  useEffect(() => {
    fetchDataStatus()
      .then((data) => setStatusList(data))
      .catch((error) => console.error("Failed to fetch statuses:", error));
  }, []);

  useEffect(() => {
    fetchData()
      .then((data) => setAssetData(data))
      .catch((error) => console.error("Failed to fetch assets:", error));
  }, []);

  useEffect(() => {
    if (assetId) {
      fetchAssetDetail(assetId);
    }
  }, [assetId]);

  const fetchAssetDetail = async (id: string) => {
    try {
      const data = await fetchDetail(id);
      if (data) {
        const detail = {
          id: data.id,
          name: data.name,
          status: {
            id: data.status.id,
            name: data.status.name,
          },
          location: {
            id: data.location.id,
            name: data.location.name,
          },
        };
        setAssetDetail(detail);
        form.setFieldsValue({
          name: detail.name,
          status_id: detail.status.id,
          location_id: detail.location.id,
        });
      }
    } catch (error) {
      console.error("Failed to fetch asset detail:", error);
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

  const onFinish = async (values: AssetForm) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.put(
        `https://be-ksp.analitiq.id/asset/${assetDetail.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
        router.push("/asset");
      }, 2000);
    } catch (error) {
      console.error("Error updating asset: ", error);
      setError("Failed to update asset");
    }
  };

  const handleDelete = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(`https://be-ksp.analitiq.id/asset/${assetDetail.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDeleteModalVisible(false);
      setSuccessDeleteModalVisible(true); // Menampilkan modal success delete
      setTimeout(() => {
        setSuccessDeleteModalVisible(false);
        router.push("/asset");
      }, 2000);
    } catch (error) {
      console.error("Error deleting asset: ", error);
      setError("Failed to delete asset");
    }
  };

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

  const showDeleteModal = () => {
    setDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    setDeleteModalVisible(false);
    await handleDelete();
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
            <h2 className="text-xl text-bold">Edit Asset</h2>
            <h3 className="text-4xl text-bold mt-7">Fill this form below</h3>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                name: assetDetail.name,
                status_id: assetDetail.status.id,
                location_id: assetDetail.location.id,
              }}
            >
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
                  {statusList.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
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
                  {locationList.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "16px",
                  }}
                >
                  <Button
                    className="bg-gray-50 border-red-400 text-red-500 hover:border-red-300"
                    onClick={showDeleteModal}
                  >
                    Delete
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Content>
      </Layout>
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
          <p className="text-4x1 text-3xl mt-2">Data has been Updated</p>
        </div>
      </Modal>
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Delete"
        cancelText="cancel"
      >
        <p className="text-lg">
          Your action will cause this data permanently deleted
        </p>
      </Modal>
      <Modal
        title={<div className="text-2xl">Success!</div>}
        open={successDeleteModalVisible}
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
          <p className="text-4x1 text-3xl mt-2">Data has been Deleted</p>
        </div>
      </Modal>
    </Layout>
  );
};

export default AppUpdate;
