import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import config from "../../Config/config";

const useGoogle = () => {
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const API_URL = config.apiUrl;

  useEffect(() => {
    const handleOAuthRedirect = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const userStr = urlParams.get("user");
      const error = urlParams.get("error");

      if (error) {
        console.error("OAuth Error:", error);
        navigate("/login");
        return;
      }

      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          setAuthUser({ user, token });
          localStorage.setItem("token", token);
          localStorage.setItem("user", userStr);
          navigate("/dashboard");
        } catch (err) {
          console.error("Error parsing user data:", err);
          navigate("/login");
        }
      }
    };

    handleOAuthRedirect();
  }, [setAuthUser, navigate]);

  const googleOauth = () => {
    const clientType = "web";
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/oauth2/redirect`
    );
    window.location.href = `${API_URL}/oauth2/authorization/google`;
  };

  return { googleOauth };
};

export default useGoogle;
