import { getConfirmedUsers } from "@/api/AdminAPI";
import { AdminTableUser } from "@/types/admin";
import { useQuery } from "@tanstack/react-query";
import { Search, User, X } from "lucide-react";
import { useState } from "react";

// User Search Modal Component
export default function UserSearchModal({
	isOpen,
	onClose,
	onSelectUser,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSelectUser: (user: AdminTableUser) => void;
}) {
	const [searchRUT, setSearchRUT] = useState("");
	const [searchEmail, setSearchEmail] = useState("");
	const [page, setPage] = useState(1);

	const { data, isLoading } = useQuery({
		queryKey: ["users", page, searchRUT, searchEmail],
		queryFn: () =>
			getConfirmedUsers({
				page,
				perPage: 10,
				searchRUT,
				searchEmail,
			}),
		enabled: isOpen,
		staleTime: 1000 * 60 * 5,
	});

	const users = data?.users || [];
	const totalPages = data?.totalPages || 1;

	const handleSearch = () => {
		setPage(1); // Reset to first page when searching
	};

	const handleClearSearch = () => {
		setSearchRUT("");
		setSearchEmail("");
		setPage(1);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">
						Buscar Usuario
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="h-6 w-6" />
					</button>
				</div>

				{/* Search Filters */}
				<div className="p-6 border-b border-gray-200 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Buscar por RUT Empresa
							</label>
							<input
								type="text"
								value={searchRUT}
								onChange={(e) => setSearchRUT(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && handleSearch()
								}
								placeholder="Ej: 76.123.456-7"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Buscar por Email
							</label>
							<input
								type="email"
								value={searchEmail}
								onChange={(e) => setSearchEmail(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && handleSearch()
								}
								placeholder="Ej: usuario@empresa.cl"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
							/>
						</div>
					</div>
					<div className="flex gap-3">
						<button
							onClick={handleSearch}
							disabled={isLoading}
							className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
						>
							<Search className="h-4 w-4" />
							{isLoading ? "Buscando..." : "Buscar"}
						</button>
						<button
							onClick={handleClearSearch}
							className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
						>
							Limpiar
						</button>
					</div>
				</div>

				{/* Users List */}
				<div className="flex-1 overflow-y-auto p-6">
					{isLoading ? (
						<div className="text-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
							<p className="text-gray-500">
								Cargando usuarios...
							</p>
						</div>
					) : users.length === 0 ? (
						<div className="text-center py-12">
							<User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-500">
								No se encontraron usuarios
							</p>
							<p className="text-sm text-gray-400 mt-2">
								Intenta buscar con otros criterios
							</p>
						</div>
					) : (
						<>
							<div className="space-y-3 mb-6">
								{users.map((user) => (
									<div
										key={user._id}
										className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer"
										onClick={() => {
											onSelectUser(user);
											onClose();
										}}
									>
										<div className="flex items-start justify-between">
											<div className="space-y-2 flex-1">
												<div className="flex items-center gap-3">
													<h3 className="font-semibold text-gray-900">
														{user.name}
													</h3>
													<span className="text-xs text-gray-500">
														RUT: {user.rut}
													</span>
												</div>
												<div className="grid grid-cols-2 gap-4 text-sm">
													<div>
														<span className="text-gray-600">
															Empresa:
														</span>
														<span className="ml-2 font-medium text-gray-900">
															{user.businessName}
														</span>
													</div>
													<div>
														<span className="text-gray-600">
															RUT Empresa:
														</span>
														<span className="ml-2 font-medium text-gray-900">
															{user.businessRut}
														</span>
													</div>
													<div>
														<span className="text-gray-600">
															Email:
														</span>
														<span className="ml-2 text-gray-900">
															{user.email}
														</span>
													</div>
													<div>
														<span className="text-gray-600">
															Teléfono:
														</span>
														<span className="ml-2 text-gray-900">
															{user.phone}
														</span>
													</div>
												</div>
											</div>
											<button className="text-orange-600 hover:text-orange-700 font-medium text-sm ml-4">
												Seleccionar
											</button>
										</div>
									</div>
								))}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex items-center justify-center gap-2 border-t border-gray-200 pt-4">
									<button
										onClick={() =>
											setPage((p) => Math.max(1, p - 1))
										}
										disabled={page === 1}
										className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
									>
										Anterior
									</button>
									<span className="text-sm text-gray-600">
										Página {page} de {totalPages}
									</span>
									<button
										onClick={() =>
											setPage((p) =>
												Math.min(totalPages, p + 1)
											)
										}
										disabled={page === totalPages}
										className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
									>
										Siguiente
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}