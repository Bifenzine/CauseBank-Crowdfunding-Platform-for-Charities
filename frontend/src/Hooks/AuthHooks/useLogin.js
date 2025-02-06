import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../../Context/AuthContext";
import ForumApi from "../../DataFetching/DataFetching"; // Adjust the import if needed
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthUser, setToken } = useAuthContext(); // Get setAuthUser and setToken from context
  const navigate = useNavigate();

  const login = async (email, password) => {
    const success = handleInputErrors(email, password);
    if (!success) {
      return;
    }

    setIsLoading(true);
    try {
      // Log the headers to see the client type
      const headers = { "x-client-type": "web" };
      console.log("Request Headers:", headers);
      const response = await ForumApi.post(
        "/api/v1/auth/login",
        {
          email,
          password,
        },
        {
          headers,

          withCredentials: true, // Important: ensure cookies are sent with the request
        }
      );
      console.log("headers:", response.headers);

      const data = response?.data;

      // Save user data and token to context
      setAuthUser(data?.data?.user); // Assuming `data.data` contains user info
      setToken(data?.data?.token); // Assuming `data.data.token` contains the token
      navigate("/");

      toast.success(`Welcome back, ${data?.data?.user?.lastName || "User"}!`);
    } catch ([error]) {
      console.error("Login error:", error);
      toast.error(error || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, login };
};

export default useLogin;

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }
  return true;
}
