import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import {Link, useParams} from "react-router-dom";
import { getUserInfo } from "../../DataFetching/DataFetching";
import SettingsSection from "./Settings/SettingsSection";
import BookmarksSection from "./BookmarksSection/BookmarksSection";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserInfo(id);
        if (response?.data?.data) {
          setUser(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user profile");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-xl mb-2">Error Loading Profile</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const ProfileHeader = () => (
    <div className="bg-white relative rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="h-32 w-32 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {user?.avatarUrl ? (
            <img
              src={user?.avatarUrl}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
          )}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.firstName} {user?.lastName}
          </h1>
          <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {user?.role}
            </span>
            {user?.isActive && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active Account
              </span>
            )}
          </div>
        </div>
      </div>
      {user?.role === "ORGANIZATION" &&
          <div className="absolute top-4 right-4">
            <Link to={`/dashboard/${id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Dashboard
            </Link>
          </div>
      }

    </div>
  );

  return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader/>

          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 mb-6 shadow-sm">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 outline-none
                ${
                  selected
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
              `
              }>
              Settings
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 outline-none
                ${
                  selected
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
              `
              }>
              Bookmarks
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <SettingsSection user={user} userId={id} />
            </Tab.Panel>
            <Tab.Panel>
              <BookmarksSection userId={id} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Profile;
