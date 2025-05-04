import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Upload, Slider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/authApi.ts";
import { IUserRegisterRequest } from "../../types/Auth.ts";
import { TextInput } from "flowbite-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./GoogleLoginButton.tsx";
import { GoogleOutlined } from '@ant-design/icons';
import AvatarEditor from "react-avatar-editor";

const { Item } = Form;

const RegisterPage: React.FC = () => {
    const [form] = Form.useForm<IUserRegisterRequest>();
    const navigate = useNavigate();
    const [registerUser] = useRegisterUserMutation();
    const [scale, setScale] = useState<number>(1.2);

    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const editorRef = useRef<AvatarEditor>(null);

    const handleAvatarChange = (info: any) => {
        const file = info.fileList[0]?.originFileObj;
        if (file) {
            if (avatarUrl) {
                URL.revokeObjectURL(avatarUrl);
            }

            setAvatar(file);
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        return () => {
            if (avatarUrl) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
    }, [avatarUrl]);



    const onFinish = async (values: IUserRegisterRequest) => {
        try {
            let finalAvatar: File | null = null;

            if (avatar && editorRef.current) {
                const canvas = editorRef.current.getImageScaledToCanvas();
                const blob = await new Promise<Blob>((resolve) =>
                    canvas.toBlob((blob) => resolve(blob as Blob))
                );
                finalAvatar = new File([blob], avatar.name, { type: blob.type });
            }

            const userData: IUserRegisterRequest = {
                username: values.username,
                password: values.password,
                avatar: finalAvatar,
            };

            console.log("Register user", userData);
            const response = await registerUser(userData).unwrap();
            localStorage.setItem('token', response.token);
            navigate("/");
        } catch (error) {
            console.error("Register error", error);
        }
    };

    const onLoginGoogleResult = (token: string) => {
        localStorage.setItem('token', token);
        navigate("/");
    };

    return (
        <GoogleOAuthProvider clientId="688315354046-isd3q5qkjaj88uaj9oudrldsf18bm592.apps.googleusercontent.com">
            <h1 className="text-center text-4xl font-bold text-blue-500">Register</h1>

            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Item
                        name="username"
                        label={"Username"}
                        rules={[{ required: true, message: "Enter your username" }]}
                    >
                        <TextInput placeholder={"Username"} />
                    </Item>

                    <Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: "Enter password" },
                            { min: 6, message: "Password must be at least 6 characters" }
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Item>

                    <Item
                        label="Avatar"
                        name="avatar"
                        rules={[
                            {
                                validator: () => {
                                    if (!avatar) {
                                        return Promise.reject("Avatar is required");
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Upload
                            showUploadList={false}
                            beforeUpload={() => false}
                            onChange={handleAvatarChange}
                        >
                            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                        </Upload>

                        {avatarUrl && (
                            <>
                                <AvatarEditor
                                    ref={editorRef}
                                    image={avatarUrl}
                                    width={250}
                                    height={250}
                                    border={50}
                                    borderRadius={0}
                                    color={[255, 255, 255, 0.6]}
                                    scale={scale}
                                    rotate={0}
                                />
                                <div className="mt-4">
                                    <span>Zoom:</span>
                                    <Slider
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        value={scale}
                                        onChange={(value) => setScale(value)}
                                    />
                                </div>
                            </>
                        )}
                    </Item>


                    <Item>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Item>
                </Form>

                <GoogleLoginButton
                    icon={<GoogleOutlined />}
                    title="Enter via Google"
                    onLogin={onLoginGoogleResult}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default RegisterPage;
