import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { confirmUser, getUserById } from "@/api/AdminAPI";
import { toast } from "react-toastify";
import Loader from "../ui/Loader";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
	BriefcaseBusiness,
	Building,
	Globe2,
	IdCard,
	Mail,
	MapPin,
	Phone,
	User,
} from "lucide-react";
import { capitalizeFirstLetter } from "@/utilities/text";
import { formatPhone } from "@/utilities/phone";
import Flag from "react-flagpack";

export default function ConfirmUserModal() {
	const location = useLocation();
	const navigate = useNavigate();

	const queryParams = new URLSearchParams(location.search);
	const confirmUserId = queryParams.get("confirmUser")!;

	const show = confirmUserId ? true : false;

	const { handleSubmit } = useForm({});

	const queryClient = useQueryClient();

	// Obtener usuario con useQuery
	const { data, isLoading, error } = useQuery({
		queryKey: ["user", confirmUserId],
		queryFn: () => getUserById({ userId: confirmUserId }),
		enabled: !!confirmUserId, // Esto asegura que no se ejecute si no hay confirmUserId
		retry: 2,
	});

	const user = data?.user;
	const token = data?.token ?? "";

	const { mutate, isPending } = useMutation({
		mutationFn: confirmUser,
		onError: (error) => {
			toast.error(error.message);
			navigate(location.pathname, { replace: true });
		},
		onSuccess: (data) => {
			// "delete" unconfirmed user from query cache
			queryClient.invalidateQueries({ queryKey: ["unconfirmedUsers"] });
			navigate(location.pathname, { replace: true });
			toast.success(data.message);
		},
	});

	const handleForm = async () => {
		mutate(token);
	};

	return (
		<Transition appear show={show} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				onClose={() => navigate(location.pathname, { replace: true })}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/60" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
								{/* Botón de cierre */}
								<button
									onClick={() =>
										navigate(location.pathname, {
											replace: true,
										})
									}
									className="absolute top-8 right-8 text-gray-500 hover:text-gray-700 transition"
								>
									<XMarkIcon className="h-8 w-8" />
								</button>

								<Dialog.Title
									as="h3"
									className="font-bold text-4xl  my-5"
								>
									Confirmar Usuario
								</Dialog.Title>

								<p className="text-xl">
									Una vez confirmado el usuario será enviado
									un email con las instrucciones para {""}
									<span className="text-orange-600 font-bold">
										establecer su contraseña
									</span>
								</p>

								{isLoading && <Loader />}
								{error && (
									<p className="text-red-600 my-4">
										{error.message}
									</p>
								)}

								{user && (
									<div className="mt-5 p-5 border border-slate-200 rounded-lg bg-slate-50">
										<table className="w-full">
											<tbody>
												<tr className="">
													<td className="p-2 font-bold flex-align">
														<Globe2
															size={20}
															className="text-gray-400"
														/>
														País:
													</td>
													<td className="p-2">
														<div className="flex-align">
															{user.country}
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
														</div>
													</td>
												</tr>
												<tr className="">
													<td className="p-2 font-bold flex-align">
														<User
															size={20}
															className="text-gray-400"
														/>
														Nombre:
													</td>
													<td className="p-2">
														{capitalizeFirstLetter(
															user.name,
														)}
													</td>
												</tr>
												<tr className="">
													<td className="p-2 font-bold flex-align">
														<Building
															size={20}
															className="text-gray-400"
														/>
														Empresa:
													</td>
													<td className="p-2">
														{user.businessName}
													</td>
												</tr>
												<tr className="">
													<td className="p-2 font-bold flex-align">
														<IdCard
															size={20}
															className="text-gray-400"
														/>
														ID Personal:
													</td>
													<td className="p-2">
														{user.personalId}
													</td>
												</tr>
												<tr className="">
													<td className="p-2 font-bold flex-align">
														<BriefcaseBusiness
															size={20}
															className="text-gray-400"
														/>
														ID Empresa:
													</td>
													<td className="p-2">
														{user.businessId}
													</td>
												</tr>
												<tr className="">
													<td className="p-2 font-bold flex-align">
														<MapPin
															size={20}
															className="text-gray-400"
														/>
														Dirección:
													</td>
													<td className="p-2">
														{user.address}
													</td>
												</tr>
												<tr className="">
													<td className="p-2 font-bold flex-align">
														<Phone
															size={20}
															className="text-gray-400"
														/>
														Teléfono:
													</td>
													<td className="p-2">
														{formatPhone(
															user.phone,
															user.country,
														)}
													</td>
												</tr>
												<tr>
													<td className="p-2 font-bold flex-align">
														<Mail
															size={20}
															className="text-gray-400"
														/>
														Correo:
													</td>
													<td className="p-2">
														{user.email}
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								)}

								<form
									className="mt-10 space-y-5 border-t border-gray-300 pt-10"
									onSubmit={handleSubmit(handleForm)}
									noValidate
								>
									<input
										type="submit"
										disabled={isLoading || isPending}
										className="bg-orange-500 hover:bg-orange-600 w-full p-3 text-white font-bold text-xl cursor-pointer rounded transition-colors disabled:opacity-50"
										value="Autorizar Usuario"
									/>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
