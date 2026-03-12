import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn } from "../features/auth/sign-in";
import CreateUser from "../features/admin/components/CreateUser";
import ClientSetupPage from "../features/admin/pages/ClientSetupPage";
import AdminDirectoryPage from "../features/admin/pages/Clientpage";
import AllUsers from "../features/admin/pages/AllUsers";
import CreateRolePage from "../features/admin/pages/CreateRolePage";
import { ProtectedRoute } from "@/components/protected-route";
import { isAuthenticated } from "@/lib/isAuthenticated";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/sign-in"
        element={
          isAuthenticated() ? (
            <Navigate to="/users" replace />
          ) : (
            <SignIn />
          )
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AllUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <AdminDirectoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-client"
        element={
          <ProtectedRoute>
            <ClientSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-role"
        element={
          <ProtectedRoute>
            <CreateRolePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/create-user"
        element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        }
      />
      {/* Legacy routes for backward compatibility */}
      <Route
        path="/all-clients"
        element={
          <ProtectedRoute>
            <AdminDirectoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client-users"
        element={
          <ProtectedRoute>
            <AllUsers />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
