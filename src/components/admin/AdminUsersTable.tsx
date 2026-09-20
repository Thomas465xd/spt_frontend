import { FC } from "react";
import Loader from "../ui/Loader";
import { UsersResponse } from "@/types/index";
import { formatPhone } from "@/utilities/phone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, updateUserStatus } from "@/api/AdminAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ConfirmUserModal from "./ConfirmUserModal";
import Flag from "react-flagpack";
import { forgotPasswordEmail } from "@/api/AuthAPI";

type AdminUsersTableProps = {
	type: "confirmed" | "unconfirmed";
	users: UsersResponse["users"];
	isLoading: boolean;
	error: null;
};

const AdminConfirmedTable: FC<AdminUsersTableProps> = ({
	type,
	users,
	isLoading,
	error,
}) => {
	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const { mutate: changeUserStatus } = useMutation({
		mutationFn: updateUserStatus,
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: (data) => {
			// "deletes de user from query cache"
			queryClient.invalidateQueries({ queryKey: ["confirmedUsers"] });
			queryClient.invalidateQueries({ queryKey: ["unconfirmedUsers"] });
			toast.success(data.message);
		},
	});

	const handleUserStatus = (userId: string) => {
		Swal.fire({
			title: "¿Estas Seguro de esta Acción?",
			text: "🚨 El usuario quedara como 'no confirmado'. Puedes deshacer esta acción en cualquier momento. 🚨",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, seguro ✅",
			cancelButtonText: "Cancelar",
		}).then((result) => {
			if (result.isConfirmed) {
				changeUserStatus({ userId });
			}
		});
	};

	const { mutate: deleteNoPasswordUser } = useMutation({
		mutationFn: deleteUser,
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: (data) => {
			// "deletes de user from query cache"
			queryClient.invalidateQueries({ queryKey: ["confirmedUsers"] });
			queryClient.invalidateQueries({ queryKey: ["unconfirmedUsers"] });
			toast.success(data.message);
		},
	});

	const handleDeleteUser = (userId: string) => {
		Swal.fire({
			title: "¿Estas Seguro de esta Acción? ⚠️",
			text: "🚨 Recuerda que esta la elimnación de este usuario no es reversible 🚨",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Eliminar",
			cancelButtonText: "Cancelar",
		}).then((result) => {
			if (result.isConfirmed) {
				deleteNoPasswordUser(userId);
			}
		});
	};

	const { mutate: resendPasswordInstructions } = useMutation({
		mutationFn: forgotPasswordEmail,
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: () => {
			toast.success("Instrucciones enviadas exitosamente.");
		},
	});

	const handleResendInstructions = (email: string) => {
		Swal.fire({
			title: "Reenviar Instrucciones para completar usuario",
			text: "Este usuario ya fue confirmado, pero aún no ha establecido una contraseña ¿deseas reenviar instrucciones para esto?",
			icon: "info",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#292524",
			confirmButtonText: "Si, Reenviar",
			cancelButtonText: "Cancelar",
		}).then((result) => {
			if (result.isConfirmed) {
				resendPasswordInstructions({ email });
			}
		});
	};

	return (
		<>
			<div className="px-4 sm:px-6 lg:px-8 my-20">
				<div className="mt-8 flow-root">
					<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 bg-white p-5">
							{isLoading && <Loader />}
							{error && (
								<p className="text-center text-red-500">
									Error al cargar usuarios
								</p>
							)}
							{!isLoading &&
								!error &&
								users &&
								users.length === 0 && (
									<p className="text-center text-gray-500">
										No hay usuarios disponibles.
									</p>
								)}
							{!isLoading &&
								!error &&
								users &&
								users.length > 0 && (
									<div className="flex justify-center overflow-x-auto">
										<table className="min-w-max sm:min-w-max md:min-w-full divide-y divide-gray-300 last-of-type:border-b border-b-gray-300">
											<thead>
												<tr>
													<th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
														Nombre
													</th>
													<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
														ID Personal
													</th>
													<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
														ID Empresa
													</th>
													<th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
														Email
													</th>
													<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
														Teléfono
													</th>
													<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
														Dirección
													</th>
													<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
														Acciones
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200">
												{users.map((user) => (
													<tr key={user.id}>
														<td className="text-nowrap py-4 pl-4 text-sm text-gray-900 sm:pl-0">
															<div className="flex items-center gap-2 ">
																{user.country ===
																"Chile" ? (
																	<Flag
																		code="CL"
																		gradient="real-linear"
																		size="m"
																		hasDropShadow
																		className="border-none"
																	/>
																) : user.country ===
																  "Peru" ? (
																	<Flag
																		code="PE"
																		gradient="real-linear"
																		size="m"
																		hasDropShadow
																		className="border-none"
																	/>
																) : (
																	""
																)}

																<span>
																	{user.name}
																</span>
															</div>
														</td>
														<td className="px-3 py-4 text-sm text-gray-900">
															{user.personalId}
														</td>
														<td className="px-3 py-4 text-sm text-gray-900">
															{user.businessId}
														</td>
														<td className="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
															{user.email}
														</td>
														<td className="px-3 py-4 text-sm text-gray-900">
															{formatPhone(
																user.phone,
																user.country,
															)}
														</td>
														<td className="px-3 py-4 text-sm text-gray-900">
															{user.address}
														</td>
														<td className="px-3 py-4 text-sm text-gray-900">
															{type ===
															"unconfirmed" ? (
																user.passwordSet ? (
																	<button
																		className="text-blue-600 hover:underline"
																		type="button"
																		onClick={() =>
																			handleUserStatus(
																				user.id,
																			)
																		}
																	>
																		Desbloquear
																		Usuario
																	</button>
																) : (
																	<div className="flex flex-col items-start">
																		<button
																			className="text-red-700 hover:underline font-bold text-left"
																			type="button"
																			onClick={() =>
																				handleDeleteUser(
																					user.id,
																				)
																			}
																		>
																			Eliminar
																			Usuario
																		</button>

																		<button
																			className="text-green-600 hover:underline font-bold text-left"
																			type="button"
																			onClick={() =>
																				navigate(
																					location.pathname +
																						`?confirmUser=${user.id}`,
																				)
																			}
																		>
																			Confirmar
																			Usuario
																		</button>
																	</div>
																)
															) : user.passwordSet ? (
																<button
																	className="text-orange-600 hover:underline font-bold text-left"
																	type="button"
																	onClick={() =>
																		handleUserStatus(
																			user.id,
																		)
																	}
																>
																	Bloquear
																	Usuario
																</button>
															) : (
																<div className="flex flex-col items-start">
																	<button
																		className="text-blue-600 hover:underline font-bold text-left"
																		type="button"
																		onClick={() =>
																			handleResendInstructions(
																				user.email,
																			)
																		}
																	>
																		Reenviar
																		Instrucciones
																	</button>

																	<button
																		className="text-red-700 hover:underline font-bold text-left"
																		type="button"
																		onClick={() =>
																			handleDeleteUser(
																				user.id,
																			)
																		}
																	>
																		Eliminar
																	</button>
																</div>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
						</div>
					</div>
				</div>
			</div>

			{type === "unconfirmed" && <ConfirmUserModal />}
		</>
	);
};

export default AdminConfirmedTable;
