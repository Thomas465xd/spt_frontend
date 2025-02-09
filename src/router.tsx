import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ClientView from "./views/ClientView";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import ForgotPasswordView from "./views/auth/ForgotPasswordView";
import AdminLayout from "./layouts/AdminLayout";
import ConfirmUserView from "./views/admin/ConfirmUserView";
import AdminDashboardView from "./views/admin/AdminDashboardView";
import SetPasswordView from "./views/auth/SetPasswordView";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<ClientView />} index />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="/auth/login" element={<LoginView />} />
                    <Route path="/auth/register" element={<RegisterView />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordView />} />
                    <Route path="/auth/set-password/:token" element={<SetPasswordView />} />
                </Route>

                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboardView />} />
                    <Route path="/admin/confirm" element={<ConfirmUserView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}