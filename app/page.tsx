"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

export default function PageLogin() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (value: FieldType) => {
    try {
      const response = await axios({
        method: "post",
        baseURL: "https://be-ksp.analitiq.id",
        url: "/auth/login",
        data: {
          email: value.email,
          password: value.password,
        },
      });

      const { token } = response.data;

      if (token) {
        Cookies.set("token", token, { expires: 7 });

        router.push("/main");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-6xl">
        <div className="bg-blue-500 w-1/2 rounded-tl-xl rounded-bl-xl">
          <img src="/public-bg1.png" alt="login-bg" className="w-full h-auto" />
        </div>
        <div className="w-1/2 h-auto flex flex-col items-center justify-center mx-auto bg-gray-100 p-8">
          <img src="/logo-login.png" alt="logo-bg" className="w-20 h-auto" />
          <h2 className="font-bold text-2xl text-center">Welcome Back</h2>
          <p className="text-m text-gray-400">
            You've been missed, Please sign in your account
          </p>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 30 }}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 30 }}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <Form.Item wrapperCol={{ span: 30 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
}
