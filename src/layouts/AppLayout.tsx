import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/ui/Footer";
import { useQueryClient } from "@tanstack/react-query";
import HomeLoader from "@/components/ui/HomeLoader";
import Swal from "sweetalert2";
import Header from "@/components/home/Header";

export default function AppLayout() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data, isError, isLoading } = useAuth();

	const logout = () => {
		localStorage.removeItem("SPT_ADMIN_TOKEN");
		localStorage.removeItem("SPT_AUTH_TOKEN");
		queryClient.removeQueries();
		navigate("/auth/login");
	};

	const handleLogout = () => {
		Swal.fire({
			title: "¿Estas seguro?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Cerrar Sesión",
			cancelButtonText: "Volver",
		}).then((result) => {
			if (result.isConfirmed) {
				logout();
			}
		});
	};

	if (isLoading) return <HomeLoader />;
	if (isError) return <Navigate to="/auth/login" replace />;
	if (data)
		return (
			<div className="flex flex-col min-h-screen">
				{/* Header */}
				<Header name={data.name} onLogoutClick={handleLogout} />

				{/* Main Content Area */}
				<main className="flex-1 max-w-screen-2xl md:mx-10 lg:mx-30 xl:mx-auto mt-8 p-5">
					<Outlet />
				</main>

				{/* Footer */}
				<footer className="mt-auto">
					<Footer />
				</footer>

				{/* Toast Notifications */}
				<ToastContainer
					position="top-right"
					autoClose={4000}
					pauseOnFocusLoss={false}
					pauseOnHover={false}
				/>
			</div>
		);
}
