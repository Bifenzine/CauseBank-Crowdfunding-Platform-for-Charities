// import { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../../Context/AuthContext";
// import Config from "../../Config/Config";

// const useUpdatePost = () => {
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const { authUser } = useAuthContext();

//   // tested : working
//   const updatePost = async (postId, FormData) => {
//     console.log(FormData);

//     if (!authUser) {
//       toast.error("You need to be logged in to update a post");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.patch(
//         `${Config.apiUrl}/api/updatePost/${postId}`,
//         FormData,
//         {
//           withCredentials: true, // Send cookies with request
//           headers: { "x-client-type": "web" },
//         }
//       );
//       setLoading(false);
//       toast.success("Post updated successfully");
//       return response.data;
//     } catch (error) {
//       setLoading(false);
//       setError(error.response.data.error);
//       toast.error("Failed to update post");
//       throw new Error(error.response.data.error); // Throw error to handle it in the component
//     }
//   };

//   return { updatePost, error, loading };
// };

// export default useUpdatePost;
