import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "./components/ui/Loader";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import CreateOrderView from "./views/admin/orders/CreateOrderView";
import UpdateOrderView from "./views/admin/orders/UpdateOrderView";

// Lazy load layouts
const AppLayout = lazy(() => import("./layouts/AppLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const ProfileLayout = lazy(() => import("./layouts/ProfileLayout"));

// Lazy load views
// Client views
const ClientView = lazy(() => import("./views/home/ClientView"));
const ProductsView = lazy(() => import("./views/products/ProductsView"));
const CartView = lazy(() => import("./views/cart/CartView"));
const CartCheckoutView = lazy(() => import("./views/cart/CartCheckoutView"));
const OrdersView = lazy(() => import("./views/orders/deprecated/OrdersView"));

// Auth views
const LoginView = lazy(() => import("./views/auth/LoginView"));
const RegisterView = lazy(() => import("./views/auth/RegisterView"));
const ForgotPasswordView = lazy(
	() => import("./views/auth/ForgotPasswordView")
);
const ResetPasswordView = lazy(() => import("./views/auth/ResetPasswordView"));
const SetPasswordView = lazy(() => import("./views/auth/SetPasswordView"));

// Admin views
const AdminDashboardView = lazy(
	() => import("./views/admin/AdminDashboardView")
);
const AdminUsersView = lazy(() => import("./views/admin/users/AdminUsersView"));
const AdminUnconfirmedUsersView = lazy(
	() => import("./views/admin/users/AdminUnconfirmedUsersView")
);
const AdminOrdersView = lazy(() => import("./views/admin/orders/AdminOrderView"));

// Profile views
const ProfileView = lazy(() => import("./views/profile/ProfileView"));
const ChangePasswordView = lazy(
	() => import("./views/profile/ChangePasswordView")
);
const ExtraProfileView = lazy(() => import("./views/profile/ExtraProfileView"));

// Error views
const NotFound = lazy(() => import("./views/404/NotFound"));

// Loading component for Suspense fallback
const LoadingFallback = () => (
    <Loader />
);

export default function Router() {
	return (
		<BrowserRouter>
			<Suspense fallback={<LoadingFallback />}>
				<Routes>
					{/* App Layout Routes */}
					<Route element={<AppLayout />}>
						<Route path="/" element={<ClientView />} />
						<Route path="/products" element={<ProductsView />} />
						<Route path="/cart" element={<CartView />} />
						<Route
							path="/cart/checkout"
							element={<CartCheckoutView />}
						/>
						<Route path="/orders" element={<OrdersView />} />
						<Route
							path="/orders/details/:orderId"
							element={<ProductsView />}
						/>

						{/* Profile Routes - nested under AppLayout */}
						<Route path="/profile" element={<ProfileLayout />}>
							<Route index element={<ProfileView />} />
							<Route
								path="password"
								element={<ChangePasswordView />}
							/>
							<Route
								path="shipping"
								element={<ExtraProfileView />}
							/>
						</Route>
					</Route>

					{/* Auth Layout Routes */}
					<Route element={<AuthLayout />}>
						<Route path="/auth/login" element={<LoginView />} />
						<Route
							path="/auth/register"
							element={<RegisterView />}
						/>
						<Route
							path="/auth/forgot-password"
							element={<ForgotPasswordView />}
						/>
						<Route
							path="/auth/reset-password/:token"
							element={<ResetPasswordView />}
						/>
						<Route
							path="/auth/set-password/:token"
							element={<SetPasswordView />}
						/>
						<Route path="/404" element={<NotFound />} />
					</Route>

					{/* Admin Layout Routes */}
					<Route element={<AdminLayout />}>
						<Route
							path="/admin/dashboard"
							element={<AdminDashboardView />}
						/>
						<Route
							path="/admin/users"
							element={<AdminUsersView />}
						/>
						<Route
							path="/admin/confirm"
							element={<AdminUnconfirmedUsersView />}
						/>
						<Route
							path="/admin/orders"
							element={<AdminOrdersView />}
						/>
						<Route
							path="/admin/orders/create"
							element={<CreateOrderView />}
						/>
						<Route
							path="/admin/orders/edit/:orderId"
							element={<UpdateOrderView />}
						/>
					</Route>

					{/* Catch-all route - redirect to 404 */}
					<Route path="*" element={<Navigate to="/404" replace />} />
				</Routes>
			</Suspense>
            
            {/* Place Vercel Analytics outside <Routes> to track all pages */}
			<Analytics />
            <SpeedInsights />
		</BrowserRouter>
	);
}
