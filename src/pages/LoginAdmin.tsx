import { Form, useActionData, useNavigation } from "react-router-dom";
import "./LoginAdmin.css";

export default function LoginAdmin() {
    const actionData = useActionData() as { error?: string } | null;
    const navigation = useNavigation();
    const submitting = navigation.state === "submitting";

    return (
        <div className="login-root">
            <div className="login-card">
                <div className="login-brand">
                    <img src="/logo/sdk_logo_demo.png" alt="SDK" className="login-logo" />
                    <h1>SDK Admin Login</h1>
                    <p className="login-sub">Technical admin portal</p>
                </div>

                <Form method="post" className="login-form">
                    <label>
                        <span>Email</span>
                        <input
                            name="email"
                            type="email"
                            placeholder="admin@example.com"
                            autoComplete="username"
                        />
                    </label>

                    <label>
                        <span>Password</span>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </label>

                    {actionData?.error && (
                        <div className="login-error">{actionData.error}</div>
                    )}

                    <button className="login-btn" type="submit" disabled={submitting}>
                        {submitting ? "Signing in..." : "Sign in"}
                    </button>

                    <div className="login-foot">
                        <small>Powered by SDK • Secure access</small>
                    </div>
                </Form>
            </div>
        </div>
    );
}