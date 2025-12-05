import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createOrder } from "@/api/OrderAPI";
import { AuthUser } from "@/types/auth";
import UserSearchModal from "./UserSearchModal";
import Swal from "sweetalert2";
import { OrderForm } from "@/types/order";
import { formatToCLP } from "@/utilities/price";

// Main Create Order Form Component
export default function CreateOrderForm() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<AuthUser | null>(
		null
	);

	const {
		register,
		control,
		handleSubmit,
		watch,
		setValue,
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
            estimatedDelivery: "", 
            deliveredAt: null,
            trackingNumber: "", 
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	const items = watch("items");

	// Create order mutation
	const { mutate: createOrderMutation, isPending } = useMutation({
		mutationFn: createOrder,
        onError: (error) => {
            toast.error(error.message || "Error al crear la orden");
        },
		onSuccess: () => {
			toast.success("Orden creada exitosamente");
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			navigate("/admin/orders");
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
            text: "Antes de registrar la orden revisa que los datos ingresados sean correctos.",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Registrar",
            cancelButtonText: "Volver",
        }).then((result) => {
            if (result.isConfirmed) {
                const orderData = {
                    items: data.items,
                    payment: data.payment,
                    shipper: data.shipper,
                    status: data.status,
                    country: data.country,
                    businessName: data.businessName,
                    businessRut: data.businessRut,
                    total: calculateTotal(),
                    user: selectedUser._id,
                    estimatedDelivery: data.estimatedDelivery, 
                    trackingNumber: data.trackingNumber, 
                    deliveredAt: null
                };

                createOrderMutation(orderData);
            }
        });
	};

	const handleSelectUser = (user: AuthUser) => {
		setSelectedUser(user);
		setValue("businessName", user.businessName);
		setValue("businessRut", user.businessRut);
		setValue("user", user._id);
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		handleSubmit(onSubmit)(e);
	};

	return (
		<>
			<div className="max-w-6xl mx-auto p-6">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200">
					<div className="p-6 border-b border-gray-200">
						<h1 className="text-2xl font-bold text-gray-900">
							Registrar Nueva Orden
						</h1>
						<p className="text-sm text-gray-600 mt-1">
							Completa los datos de la orden para registrarla en
							el sistema
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
                                                    min={0}
													placeholder="Escribir sin puntos. Ej: 19990"
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
                                        placeholder="Ej. 9234012398424"
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
								onClick={handleFormSubmit}
								disabled={isPending}
								className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isPending
									? "Registrando..."
									: "Registrar Orden"}
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
