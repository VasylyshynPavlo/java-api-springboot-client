import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'antd';
import { LoginButtonProps } from "../../types/Auth.ts";
import { useGoogleLoginMutation } from '../../services/authApi.ts';

const GoogleLoginButton: React.FC<LoginButtonProps> = ({ onLogin, title, icon }) => {
    const [googleLogin] = useGoogleLoginMutation();

    const login = useGoogleLogin({
        onSuccess: async (authCodeResponse) => {
            try {
                console.log("Google Access Token:", authCodeResponse.access_token);
                const result = await googleLogin({ token: authCodeResponse.access_token }).unwrap();
                console.log("Server Response:", result);
                onLogin(result.token);
            } catch (error) {
                console.error('Google Login Failed:', error);
            }
        },
        onError: (error) => {
            console.error('Google Auth Failed:', error);
        },
    });

    return (
        <Button icon={icon} onClick={() => login()}>
            {title}
        </Button>
    );
};

export default GoogleLoginButton;