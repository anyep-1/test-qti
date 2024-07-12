import { Button } from "antd";
import React from "react";
import { useRouter } from "next/navigation";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

export const ButtonAdd: React.FC = () => {
  const router = useRouter();

  const handleAddClick = () => {
    router.push("/asset/add");
  };

  return (
    <Button
      className="mt-4"
      type="primary"
      icon={<PlusOutlined />}
      onClick={handleAddClick}
    >
      Input Asset
    </Button>
  );
};
