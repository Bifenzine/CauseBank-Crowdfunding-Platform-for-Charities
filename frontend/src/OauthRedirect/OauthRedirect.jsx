import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";

const OAuthRedirect = () => {
  const { setAuthUser, setToken } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get data from URL fragment instead of search params
    const hash = location.hash.substring(1); // Remove the # symbol
    const params = new URLSearchParams(hash);
    const token = params.get("token");
    const userStr = params.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        setAuthUser(user);
        setToken(token);
        localStorage.setItem("causeBank-token", token);
        localStorage.setItem("causeBank-user", userStr);
        navigate("/");
      } catch (err) {
        console.error("Error parsing user data:", err);
        navigate("/signin?error=Invalid user data");
      }
    } else {
      navigate("/signin?error=Authentication failed");
    }
  }, [navigate, setAuthUser, setToken]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
};

export default OAuthRedirect;
