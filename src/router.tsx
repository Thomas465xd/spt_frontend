import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ClientView from "./views/categories/ClientView";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import ForgotPasswordView from "./views/auth/ForgotPasswordView";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardView from "./views/admin/AdminDashboardView";
import SetPasswordView from "./views/auth/SetPasswordView";
import AdminUsersView from "./views/admin/AdminUsersView";
import AdminUnconfirmedUsersView from "./views/admin/AdminUnconfirmedUsersView";
import NotFound from "./views/404/NotFound";
import ResetPasswordView from "./views/auth/ResetPasswordView";
import ProfileLayout from "./layouts/ProfileLayout";
import ProfileView from "./views/profile/ProfileView";
import ChangePasswordView from "./views/profile/ChangePasswordView";
import CategoriesView from "./views/categories/CategoriesView";
import ProductsView from "./views/products/ProductsView";
import CategoryProductsView from "./views/categories/CategoryProductsView";
import CartView from "./views/cart/CartView";
import OrdersView from "./views/orders/OrdersView";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<ClientView />} index />

                    <Route path="/products" element={<ProductsView />} index />
                    <Route path="/cart" element={<CartView />} />
                    <Route path="/orders" element={<OrdersView />} />
                    <Route path="/orders/details/:orderId" element={<ProductsView />} />

                    <Route path="/categories" element={<CategoriesView />} />
                    <Route path="/categories/products" element={<CategoryProductsView />} />

                    <Route element={<ProfileLayout />}>
                            <Route path="/profile" element={<ProfileView/>} />
                            <Route path="/profile/password" element={<ChangePasswordView/>} />
                    </Route>
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="/auth/login" element={<LoginView />} />
                    <Route path="/auth/register" element={<RegisterView />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordView />} />
                    <Route path="/auth/reset-password/:token" element={<ResetPasswordView />} />
                    <Route path="/auth/set-password/:token" element={<SetPasswordView />} />
                </Route>

                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboardView />} />
                    <Route path="/admin/dashboard/users" element={<AdminUsersView />} />
                    <Route path="/admin/confirm" element={<AdminUnconfirmedUsersView />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="/404" element={<NotFound />} />
                </Route>    
            </Routes>
        </BrowserRouter>
    )
}