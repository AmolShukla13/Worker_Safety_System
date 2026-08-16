import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./components/admin/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminWorkers from "./pages/admin/AdminWorkers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import WorkerDashboard from "./pages/WorkerDashboard";
import Attendance from "./pages/Attendance";
import Wages from "./pages/Wages";
import Complaints from "./pages/Complaints";
import Profile from "./pages/Profile";
import SafetyGuidelines from "./pages/SafetyGuidelines";
import SafetyAlerts from "./pages/SafetyAlerts";
import Logout from "./pages/Logout";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminWages from "./pages/admin/AdminWages";
import { Navigate } from "react-router-dom";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminSettings from "./pages/admin/AdminSettings";
import ChangePassword from "./pages/admin/ChangePassword";
import WorkerChangePassword from "./pages/ChangePassword";
import Settings from "./pages/Settings";
import AdminLogout from "./pages/admin/AdminLogout";
import AdminSafetyAlerts from "./pages/admin/AdminSafetyAlerts";
import AdminSafetyGuidelines from "./pages/admin/AdminSafetyGuidelines";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Routes */}
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="register" element={<Register />} />
  <Route path="workers" element={<AdminWorkers />} />
<Route path="attendance" element={<AdminAttendance />} />
<Route path="complaints" element={<AdminComplaints />} />
<Route path="wages" element={<AdminWages />} />
<Route path="alerts" element={<AdminSafetyAlerts />} />
<Route
  path="guidelines"
  element={<AdminSafetyGuidelines />}
/>
<Route path="profile" element={<AdminProfile />} />
<Route path="settings" element={<AdminSettings />} />
<Route path="change-password" element={<ChangePassword />} />
<Route path="logout" element={<AdminLogout />} />




</Route>

        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
  path="/"
  element={<Navigate to="/login" replace />}
/>
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/wages" element={<Wages />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/profile" element={<Profile />} />
          <Route
  path="/change-password"
  element={<WorkerChangePassword />}
/>

<Route
  path="/settings"
  element={<Settings />}
/>
          <Route
            path="/safety-guidelines"
            element={<SafetyGuidelines />}
          />
          <Route
            path="/safety-alerts"
            element={<SafetyAlerts />}
          />
          <Route path="/logout" element={<Logout />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;