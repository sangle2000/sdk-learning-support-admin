import { createBrowserRouter, redirect } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import LoginAdmin from "../pages/LoginAdmin";
import { isAuthenticated, setToken } from "../utils/auth";

const dashboardLoader = () => {
    if (!isAuthenticated()) {
        return redirect("/login");
    }
    return null;
};

export const loginAction = async ({ request }: ActionFunctionArgs) => {
    const form = await request.formData();
    const email = (form.get("email") as string) || "";
    const password = (form.get("password") as string) || "";

    if (!email || !password) {
        return { error: "Vui lòng nhập email và mật khẩu" };
    }

    // mock authentication delay - replace with real API call
    const response = await fetch("https://sdk.petalsandyou.com/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
        return { error: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin." };
    }

    // On success, persist token and redirect
    const data = await response.json();
    setToken(data.accessToken);
    return redirect("/dashboard");
};

const router = createBrowserRouter([
    {
        path: "/dashboard",
        element: <Dashboard />,
        loader: dashboardLoader,
    },
    {
        path: "/login",
        element: <LoginAdmin />,
        action: loginAction,
    },
]);

export default router;