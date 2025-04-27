import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleOutlined } from '@ant-design/icons';
import { IUserLoginRequest } from "../../types/Auth.ts";
import GoogleLoginButton from "./GoogleLoginButton.tsx";
import { useLoginUserMutation } from "../../services/authApi.ts";
import { useNavigate } from "react-router-dom";
import { TextInput } from "flowbite-react";

const { Item } = Form;

const LoginPage: React.FC = () => {
    const [form] = Form.useForm<IUserLoginRequest>();
    const navigate = useNavigate();
    const [loginUser] = useLoginUserMutation();
    const [error, setError] = useState<string | null>(null);

    const onFinish = async (values: IUserLoginRequest) => {
        try {
            const response = await loginUser(values).unwrap();
            //console.log("Login response:", response); // Логування для діагностики
            localStorage.setItem('token', response.token);
            message.success("Login successful!");
            navigate("/");
        } catch (err: any) {
            const errorMessage = err.data?.error || err.message || "Failed to login. Please try again.";
            setError(errorMessage);
            console.error("Login error:", err);
        }
    };

    const onLoginGoogleResult = (token: string) => {
        const cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        localStorage.setItem('token', cleanToken);
        message.success("Google login successful!");
        navigate("/");
    };

    return (
        <GoogleOAuthProvider clientId="688315354046-isd3q5qkjaj88uaj9oudrldsf18bm592.apps.googleusercontent.com">
            <h1 className="text-center text-4xl font-bold text-blue-500">Login</h1>
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Item
                        name="username"
                        label="Username"
                        rules={[
                            { required: true, message: "Please enter your username" },
                            { min: 3, message: "Username must be at least 3 characters long" },
                        ]}
                    >
                        <TextInput placeholder="Enter username" />
                    </Item>

                    <Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 4, message: "Password must be at least 6 characters long" },
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Item>

                    {error && (
                        <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Item>

                    <GoogleLoginButton
                        icon={<GoogleOutlined />}
                        title="Login with Google"
                        onLogin={onLoginGoogleResult}
                    />
                </Form>
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginPage;