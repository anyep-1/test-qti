"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, MenuProps, Button, Modal } from "antd";
import {
  HomeOutlined,
  ContainerOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import ContentTable from "@/components/table-content";
import { fetchData, Asset } from "@/data/data";
import { ButtonAdd } from "@/components/buttons";
import Cookies from "js-cookie";
import axios from "axios";
import Search from "@/components/search";

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

const AssetPage: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();
  const [assetData, setAssetData] = useState<Asset[]>([]);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        const data = await fetchData();
        setAssetData(data);
      } catch (error) {
        console.error("Failed to fetch asset data:", error);
      }
    };

    fetchAssetData();
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

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
  };

  // Filter assetData based on searchTerm
  const filteredAssets = assetData.filter((asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div>
            <h2 className="text-2xl text-black">List Asset</h2>
            <Search onSearch={handleSearch} />
          </div>
          <div
            style={{
              marginTop: "10px",
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <ContentTable data={filteredAssets} />
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

export default AssetPage;
