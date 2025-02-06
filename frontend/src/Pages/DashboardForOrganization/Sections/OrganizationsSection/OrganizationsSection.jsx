import { useState } from "react";
import CustomAlert from "../../../../components/AlertComponent/CustomAlert.jsx";
import { useAuthContext } from "../../../../Context/AuthContext.jsx";
import useDeleteCause from "../../../../Hooks/CauseHooks/useDeleteCause.js";
import UpdateOrganizationPage from "../../../OrganizationsPage/UpdateOrganizationPage.jsx";
import useDeleteOrganization from "../../../../Hooks/OrganizationHooks/useDeleteOrganization.js";

const OrganizationsSection = () => {
    const { userOrganisation } = useAuthContext();
    console.log(userOrganisation);
    const { deleteOrganization, loading } = useDeleteOrganization();
    const [showAlert, setShowAlert] = useState(false);

    const handleDelete = () => {
        // Show custom alert for deletion confirmation
        setShowAlert(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteOrganization(userOrganisation?.id); // Use the delete hook
            setShowAlert(false);
            window.location.href = `/`; // Redirect after deletion
        } catch (error) {
            console.error("Error deleting organization:", error);
        }
    };

    return (
        <div className="p-0 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-2 bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-2xl font-bold text-gray-800">Organization Section</h4>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2  rounded-md
                    shadow-md">
                    Delete Organization
                </button>
            </div>
            {userOrganisation ? (
               <div>
                   <UpdateOrganizationPage />
               </div>
            ) : (
                <p className="text-gray-600">No organization data available.</p>
            )}

            {/* Custom Alert for Deletion */}
            {showAlert && (
                <CustomAlert
                    message="Are you sure you want to delete this organization? This action cannot be undone."
                    onConfirm={confirmDelete}
                    onCancel={() => setShowAlert(false)}
                    isLoading={loading}
                />
            )}
        </div>
    );
};

export default OrganizationsSection;