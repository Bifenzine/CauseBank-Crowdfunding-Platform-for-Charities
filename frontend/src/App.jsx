import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Signin from "./components/Auth/signin.jsx";
import SignupType from "./components/Auth/signupType.jsx";
import { useAuthContext } from "./Context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Home/Home.jsx";
import WhyUs from "./components/HomeCompo/WhyUs/WhyUs";
import Fullhowitworks from "./components/HomeCompo/Fullhowitwork/Fullhowitwork";
import NotFound from "./Pages/NotFound/NotFound.jsx";
import Causes from "./Pages/CausePage/Causes.jsx";
import OAuthRedirect from "./OauthRedirect/OauthRedirect";
import EmailVerification from "./Pages/verifyEmail/verifyEmail";
import CauseDetails from "./Pages/CauseidPage/CauseDetails";
import OrganizationsAll from "./Pages/OrganizationsPage/OrganizationsAll";
import OrganizationDetails from "./Pages/OrganizationsPage/OrganizationDetails";
import CreateCausePage from "./Pages/CausePage/Create/CreateCausePage";
import CausesByCountry from "./Pages/CausesByCountry/CausesByCountry";
import UpdateOrganizationPage from "./Pages/OrganizationsPage/UpdateOrganizationPage";
import Navbar from "./components/Layout/Navbar";
import CausesByCategory from "./Pages/CausesByCategory/CausesByCategory";
import UpdateCausePage from "./Pages/CausePage/update/UpdateCausePage";
import Profile from "./Pages/Profile/Profile";
import DonationPage from "./Pages/DonationPage/DonationPage";
import DashboardOrg from "./Pages/DashboardForOrganization/DashboardOrg.jsx";
import DonationsPage from "./Pages/DonationsPage/DonationsPage.jsx";
import useTawkTo from "./Hooks/support/useTawkTo.js";

function App() {
  useTawkTo();
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        {/*<HeaderAccStripe />*/}
        <Navbar />
        <Routes>
          <Route path="/signupType" element={<SignupType />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/WhyUs" element={<WhyUs />} />
          <Route path="/Fullhowitworks" element={<Fullhowitworks />} />
          <Route path="/" element={<Home />} />
          <Route path="/Causes" element={<Causes />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/auth/success" element={<OAuthRedirect />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/causes/:id" element={<CauseDetails />} />
          <Route path="/donate/:causeId" element={<DonationPage />} />
          <Route path="/donations" element={<DonationsPage />} />
          <Route
            path="/organization/allOrganizations"
            element={<OrganizationsAll />}
          />
          <Route path="organization/:id" element={<OrganizationDetails />} />
          <Route
            path="/Organization/UpdateOrganization/:organizationId"
            element={<UpdateOrganizationPage />}
          />
          <Route
            path="Cause/CreateCause/:organizationId"
            element={<CreateCausePage />}
          />
          <Route
            path="/country/:country/causes"
            element={<CausesByCountry />}
          />
          <Route
            path="/categories/:categoryId/causes"
            element={<CausesByCategory />}
          />
          <Route path="/updatecause/:causeId" element={<UpdateCausePage />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/dashboard/:id" element={<DashboardOrg />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
