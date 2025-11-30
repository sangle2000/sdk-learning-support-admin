import { createBrowserRouter, Navigate, redirect } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import LoginAdmin from "../pages/LoginAdmin";
import { login } from "../service/auth";
import ProtectedRoute from "../pages/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import ChangePassword from "../pages/ChangePassword";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const email = (form.get("email") as string) || "";
  const password = (form.get("password") as string) || "";

  if (!email || !password) {
    return { error: "Vui lòng nhập email và mật khẩu" };
  }

  // mock authentication delay - replace with real API call
  await login(email, password);
    return redirect("/dashboard");
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/dashboard"} />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginAdmin />,
    action: loginAction,
  },
  {
    path: "/reset-password",
    element: <ChangePassword />
  }
]);

export default router;
