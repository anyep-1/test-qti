"use client";
import React, { useState } from "react";
import { Divider, List, theme, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Asset } from "@/data/data";
import { useRouter } from "next/navigation";

interface ContentTableProps {
  data: Asset[];
}

const ContentTable: React.FC<ContentTableProps> = ({ data }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();
  const handleEditClick = (id: string) => {
    router.push(`/asset/update?id=${id}`);
  };

  return (
    <div
      style={{
        padding: 24,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Divider orientation="left"></Divider>
      <List
        size="large"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div>
              <div className="font-normal text-sm text-gray-400">
                Asset Name
              </div>
            </div>
            <div>
              <Button
                onClick={() => handleEditClick(item.id)}
                type="primary"
                style={{ marginLeft: "1500px", color: "#fff" }}
              >
                <EditOutlined />
              </Button>
            </div>
            {item.name}
          </List.Item>
        )}
        style={{ fontWeight: "500" }}
      />
    </div>
  );
};

export default ContentTable;
