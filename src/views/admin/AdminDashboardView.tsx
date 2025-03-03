import { Shield, UserCheck, ShoppingBag, Users, Users2, LogOutIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboardView() {

	return (
		<div className="bg-white min-h-screen">
			{/* Hero Section */}
			<div className="bg-slate-800 text-white p-6 shadow-lg mb-6">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-3xl font-bold mb-2">
						Panel de Administración
					</h1>
					<p className="text-lg mb-6">
						Bienvenido al centro de control administrativo
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div className="bg-slate-600 p-4 rounded-lg">
							<h2 className="text-xl font-semibold mb-2">
								Resumen
							</h2>
							<div className="flex justify-between">
								<div className="text-center">
									<p className="text-3xl font-bold"></p>
									<p className="text-sm">Usuarios Totales</p>
								</div>
								<div className="text-center">
									<p className="text-3xl font-bold"></p>
									<p className="text-sm">Nuevos Usuarios</p>
								</div>
								<div className="text-center">
									<p className="text-3xl font-bold"></p>
									<p className="text-sm">
										Pedidos Pendientes
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white text-slate-700 p-4 rounded-lg">
							<h2 className="text-xl font-semibold mb-2">
								Acciones Rápidas
							</h2>
							<div className="grid grid-cols-2 gap-2">
								<Link 
                                    className="bg-orange-500 text-white p-2 rounded flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                                    to="/admin/confirm"
                                >
									<UserCheck size={20} />
									Confirmar Usuarios
								</Link>
								<Link
                                    className="bg-orange-500 text-white p-2 rounded flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                                    to="/admin/dashboard/users"
                                >
									<Users2 size={20} />
                                    Ver Usuarios
								</Link>
                                <Link
                                    className="bg-orange-500 text-white p-2 rounded flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                                    to="/admin/orders"
                                >
									<ShoppingBag size={20} />
                                    Ver Pedidos
								</Link>
                                <Link
                                    className="bg-slate-700 text-white p-2 rounded flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    to="/"
                                >
									<LogOutIcon size={20} />
                                    Ir al Portal
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Funcionalidades */}
			<div className="max-w-7xl mx-auto p-6">
				<h2 className="text-2xl font-bold text-slate-700 mb-6">
					Funcionalidades del Panel
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
						<div className="text-orange-500 mb-4">
							<Users size={30} />
						</div>
						<h3 className="text-lg font-semibold text-slate-700 mb-2">
							Gestión de Usuarios
						</h3>
						<p className="text-slate-600">
							Visualiza información detallada de cada usuario y
							gestiona sus cuentas.
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
						<div className="text-orange-500 mb-4">
							<Shield size={30} />
						</div>
						<h3 className="text-lg font-semibold text-slate-700 mb-2">
							Bloqueo y Eliminación
						</h3>
						<p className="text-slate-600">
							Bloquea o elimina usuarios que incumplan las normas
							de la plataforma.
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
						<div className="text-orange-500 mb-4">
							<UserCheck size={30} />
						</div>
						<h3 className="text-lg font-semibold text-slate-700 mb-2">
							Confirmación de Usuarios
						</h3>
						<p className="text-slate-600">
							Revisa y confirma las solicitudes de nuevos usuarios
							registrados.
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
						<div className="text-orange-500 mb-4">
							<ShoppingBag size={30} />
						</div>
						<h3 className="text-lg font-semibold text-slate-700 mb-2">
							Gestión de Pedidos
						</h3>
						<p className="text-slate-600">
							Visualiza y gestiona los pedidos realizados por los
							usuarios.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
