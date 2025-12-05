import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import UserSearchModal from "./UserSearchModal";
import Loader from "@/components/ui/Loader";
import { getOrderByIdAdmin, updateOrder } from "@/api/OrderAPI";
import { formatToCLP } from "@/utilities/price";
import { AuthUser } from "@/types/auth";
import Swal from "sweetalert2";
import { OrderForm } from "@/types/order";
import { formatDateForInput } from "@/utilities/date";

export default function EditOrderForm() {
	const navigate = useNavigate();
	const { orderId } = useParams<{ orderId: string }>();
	const queryClient = useQueryClient();
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<AuthUser | null>(
		null
	);

	// Fetch order data
	const {
		data: orderData,
		isLoading: isLoadingOrder,
		isError,
	} = useQuery({
		queryKey: ["order", orderId],
		queryFn: () => getOrderByIdAdmin(orderId!),
		enabled: !!orderId,
		staleTime: 1000 * 60 * 5,
	});

	const {
		register,
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm<OrderForm>({
		defaultValues: {
			items: [{ sku: "", name: "", price: 0, quantity: 1, lineTotal: 0 }],
			payment: "",
			shipper: "",
			status: "Pendiente",
			country: "Chile",
			businessName: "",
			businessRut: "",
			user: "",
            trackingNumber: "",
            estimatedDelivery: "", 
            deliveredAt: null
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	const items = watch("items");
    const status = watch("status"); 

	// Populate form when order data is loaded
	useEffect(() => {
		if (orderData) {
			reset({
				items: orderData.items,
				payment: orderData.payment,
				shipper: orderData.shipper,
				status: orderData.status,
				country: orderData.country,
				businessName: orderData.businessName,
				businessRut: orderData.businessRut,
                trackingNumber: orderData.trackingNumber, 
                estimatedDelivery: formatDateForInput(orderData.estimatedDelivery),
                deliveredAt: orderData.deliveredAt ? formatDateForInput(orderData.deliveredAt) : null,
				user:
					typeof orderData.user === "string"
						? orderData.user
						: orderData.user._id,
			});

			// Set selected user if user data is populated
			if (typeof orderData.user !== "string") {
				setSelectedUser({
					_id: orderData.user._id,
					name: orderData.user.name,
					businessName: orderData.user.businessName,
					rut: orderData.user.rut,
					businessRut: orderData.user.businessRut,
					email: orderData.user.email,
					phone: orderData.user.phone,
					address: orderData.user.address,
					admin: orderData.user.admin,
				});
			}
		}
	}, [orderData, reset]);

	// Update order mutation
	const { mutate: updateOrderMutation, isPending } = useMutation({
		mutationFn: ({
			orderId,
			formData,
		}: {
			orderId: string;
			formData: OrderForm;
		}) => updateOrder({ orderId, formData }),
		onSuccess: () => {
			toast.success("Orden actualizada exitosamente");
			queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", orderId]})
			navigate("/admin/orders");
		},
		onError: (error) => {
			toast.error(error.message || "Error al actualizar la orden");
		},
	});

	// Calculate line total when price or quantity changes
	const calculateLineTotal = (index: number) => {
		const item = items[index];
		if (item) {
			const lineTotal = item.price * item.quantity;
			setValue(`items.${index}.lineTotal`, lineTotal);
		}
	};

	// Calculate total order amount
	const calculateTotal = () => {
		return items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
	};

	const onSubmit = (data: OrderForm) => {
		if (!selectedUser) {
			toast.error("Debes seleccionar un cliente");
			return;
		}

        Swal.fire({
            title: "¿Estas Seguro? 🚚📦",
            text: "En caso de haber actualizado el estado de la orden, un email será enviado automáticamente al usuario afectado.",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Actualizar",
            cancelButtonText: "Volver",
        }).then((result) => {
            if (result.isConfirmed) {
				const orderFormData = {
					items: data.items,
					payment: data.payment,
					shipper: data.shipper,
					status: data.status,
					country: data.country,
					businessName: data.businessName,
					businessRut: data.businessRut,
					total: calculateTotal(),
					user: selectedUser._id,
					trackingNumber: data.trackingNumber, 
					estimatedDelivery: data.estimatedDelivery, 
					deliveredAt: data.deliveredAt
				};

                updateOrderMutation({ orderId: orderId!, formData: orderFormData });
            }
        });
	};

	const handleSelectUser = (user: AuthUser) => {
		setSelectedUser(user);
		setValue("businessName", user.businessName);
		setValue("businessRut", user.businessRut);
		setValue("user", user._id);
	};

	if (isLoadingOrder) return <Loader />;

	if (isError || !orderData) {
		return (
			<div className="max-w-6xl mx-auto p-6">
				<div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
					<h2 className="text-xl font-semibold text-red-900 mb-2">
						Error al cargar la orden
					</h2>
					<p className="text-red-700 mb-4">
						No se pudo encontrar la orden solicitada
					</p>
					<button
						onClick={() => navigate("/admin/orders")}
						className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
					>
						Volver a Órdenes
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="max-w-6xl mx-auto p-6">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200">
					<div className="p-6 border-b border-gray-200">
						<h1 className="text-2xl font-bold text-gray-900">
							Editar Orden
						</h1>
						<p className="text-sm text-gray-600 mt-1">
							Modifica los datos de la orden #{orderId?.slice(-8)}
						</p>
					</div>

					<div className="p-6 space-y-8">
						{/* User Selection */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<User className="h-5 w-5" />
								Información del Cliente
							</h2>

							{selectedUser ? (
								<div className="border border-green-200 bg-green-50 rounded-lg p-4">
									<div className="flex items-start justify-between">
										<div className="space-y-2 flex-1">
											<div className="flex items-center gap-3">
												<h3 className="font-semibold text-gray-900">
													{selectedUser.name}
												</h3>
												<span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
													Seleccionado
												</span>
											</div>
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div>
													<span className="text-gray-600">
														Empresa:
													</span>
													<span className="ml-2 font-medium text-gray-900">
														{
															selectedUser.businessName
														}
													</span>
												</div>
												<div>
													<span className="text-gray-600">
														RUT Empresa:
													</span>
													<span className="ml-2 font-medium text-gray-900">
														{
															selectedUser.businessRut
														}
													</span>
												</div>
												<div>
													<span className="text-gray-600">
														Email:
													</span>
													<span className="ml-2 text-gray-900">
														{selectedUser.email}
													</span>
												</div>
												<div>
													<span className="text-gray-600">
														Teléfono:
													</span>
													<span className="ml-2 text-gray-900">
														{selectedUser.phone}
													</span>
												</div>
											</div>
										</div>
										<button
											type="button"
											onClick={() =>
												setIsUserModalOpen(true)
											}
											className="text-orange-600 hover:text-orange-700 font-medium text-sm ml-4"
										>
											Cambiar
										</button>
									</div>
								</div>
							) : (
								<button
									type="button"
									onClick={() => setIsUserModalOpen(true)}
									className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-orange-500 hover:bg-orange-50 transition-all"
								>
									<User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
									<p className="text-gray-600 font-medium">
										Seleccionar Cliente
									</p>
									<p className="text-sm text-gray-500 mt-1">
										Haz clic para buscar y seleccionar un
										cliente
									</p>
								</button>
							)}
							{errors.user && (
								<p className="text-red-600 text-sm">
									El cliente es obligatorio
								</p>
							)}
						</div>

						{/* Order Items */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-gray-900">
									Productos de la Orden
								</h2>
								<button
									type="button"
									onClick={() =>
										append({
											sku: "",
											name: "",
											price: 0,
											quantity: 1,
											lineTotal: 0,
										})
									}
									className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
								>
									<Plus className="h-4 w-4" />
									Agregar Producto
								</button>
							</div>

							<div className="space-y-4">
								{fields.map((field, index) => (
									<div
										key={field.id}
										className="border border-gray-200 rounded-lg p-4 space-y-4"
									>
										<div className="flex items-center justify-between mb-3">
											<h3 className="font-medium text-gray-900">
												Producto {index + 1}
											</h3>
											{fields.length > 1 && (
												<button
													type="button"
													onClick={() =>
														remove(index)
													}
													className="text-red-600 hover:text-red-700"
												>
													<Trash2 className="h-4 w-4" />
												</button>
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													SKU *
												</label>
												<input
													{...register(
														`items.${index}.sku`,
														{ required: true }
													)}
													type="text"
													placeholder="MB001294"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
												/>
												{errors.items?.[index]?.sku && (
													<p className="text-red-600 text-xs mt-1">
														SKU es requerido
													</p>
												)}
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Nombre del Producto *
												</label>
												<input
													{...register(
														`items.${index}.name`,
														{ required: true }
													)}
													type="text"
													placeholder="GASKET,M/T CASE PLUG"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
												/>
												{errors.items?.[index]
													?.name && (
													<p className="text-red-600 text-xs mt-1">
														Nombre es requerido
													</p>
												)}
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Precio Unitario *
												</label>
												<input
													{...register(
														`items.${index}.price`,
														{
															required: true,
															valueAsNumber: true,
															min: 0,
															onChange: () =>
																calculateLineTotal(
																	index
																),
														}
													)}
													type="number"
													step="0.01"
													placeholder="1025.00"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
												/>
												{errors.items?.[index]
													?.price && (
													<p className="text-red-600 text-xs mt-1">
														Precio es requerido
													</p>
												)}
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Cantidad *
												</label>
												<input
													{...register(
														`items.${index}.quantity`,
														{
															required: true,
															valueAsNumber: true,
															min: 1,
															onChange: () =>
																calculateLineTotal(
																	index
																),
														}
													)}
													type="number"
													placeholder="2"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
												/>
												{errors.items?.[index]
													?.quantity && (
													<p className="text-red-600 text-xs mt-1">
														Cantidad es requerida
													</p>
												)}
											</div>

											<div className="md:col-span-2">
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Subtotal
												</label>
												<div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-semibold text-gray-900">
													{formatToCLP(
														items[index]
															?.lineTotal || 0
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Order Details */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold text-gray-900">
								Detalles de la Orden
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Método de Pago *
									</label>
									<input
										{...register("payment", {
											required: true,
										})}
										type="text"
										placeholder="Transferencia Bancaria"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
									/>
									{errors.payment && (
										<p className="text-red-600 text-xs mt-1">
											Método de pago es requerido
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Expedidor *
									</label>
									<input
										{...register("shipper", {
											required: true,
										})}
										type="text"
										placeholder="Chilexpress"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
									/>
									{errors.shipper && (
										<p className="text-red-600 text-xs mt-1">
											Expedidor es requerido
										</p>
									)}
								</div>

                                {/* Tracking Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Número de Seguimiento *
                                    </label>
                                    <input
                                        {...register('trackingNumber', { required: true })}
                                        type="text"
                                        placeholder="9234012398424"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    {errors.trackingNumber && (
                                        <p className="text-red-600 text-xs mt-1">Número de seguimiento es requerido</p>
                                    )}
                                </div>

                                {/* Estimated Delivery */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de Entrega Estimada *
                                    </label>
                                    <input
                                        {...register('estimatedDelivery', { required: true })}
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    {errors.estimatedDelivery && (
                                        <p className="text-red-600 text-xs mt-1">Fecha de entrega estimada es requerida</p>
                                    )}
                                </div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Estado *
									</label>
									<select
										{...register("status", {
											required: true,
										})}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
									>
										<option value="Pendiente">
											Pendiente
										</option>
										<option value="En Transito">
											En Tránsito
										</option>
										<option value="Entregado">
											Entregado
										</option>
										<option value="Cancelado">
											Cancelado
										</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										País *
									</label>
									<input
										{...register("country", {
											required: true,
										})}
										type="text"
										placeholder="Chile"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
									/>
									{errors.country && (
										<p className="text-red-600 text-xs mt-1">
											País es requerido
										</p>
									)}
								</div>

                                {/* Delivered At - Only show if status is "Entregado" */}
                                <div className="md:col-span-2">
                                    <label className={`block text-sm font-medium text-gray-700 mb-1`}>
                                        Fecha de Entrega Real
                                    </label>
                                    <input
                                        {...register('deliveredAt')}
                                        disabled={status !== "Entregado"}
                                        type="date"
                                        className="disabled:opacity-50 disabled:cursor-not-allowed w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Este campo solo está disponible cuando el estado de la orden es "Entregado"
                                    </p>
                                </div>
							</div>
						</div>

						{/* Total */}
						<div className="border-t border-gray-200 pt-6">
							<div className="flex items-center justify-between text-xl font-bold">
								<span className="text-gray-900">
									Total de la Orden:
								</span>
								<span className="text-orange-600">
									{formatToCLP(calculateTotal())}
								</span>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-4 justify-end border-t border-gray-200 pt-6">
							<button
								type="button"
								onClick={() => navigate("/admin/orders")}
								className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
								disabled={isPending}
							>
								Cancelar
							</button>
							<button
								onClick={(e) => {
									e.preventDefault();
									handleSubmit(onSubmit)();
								}}
								disabled={isPending}
								className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isPending
									? "Actualizando..."
									: "Actualizar Orden"}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* User Search Modal */}
			<UserSearchModal
				isOpen={isUserModalOpen}
				onClose={() => setIsUserModalOpen(false)}
				onSelectUser={handleSelectUser}
			/>
		</>
	);
}
