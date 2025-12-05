import { Order, OrderStatusEnum } from "@/types/order";
import { formatToCLP } from "@/utilities/price";
import { ChevronDown, ChevronUp, Copy, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import Dialog from "../ui/Dialog";
import { copyToClipboard } from "@/utilities/copy";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteOrder, updateOrderStatus } from "@/api/OrderAPI";

type OrderTableProps = {
	orders: Order[];
    admin: boolean; 
};

const statusColors = {
	Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
	"En Transito": "bg-blue-100 text-blue-800 border-blue-200",
	Entregado: "bg-green-100 text-green-800 border-green-200",
	Cancelado: "bg-red-100 text-red-800 border-red-200",
};

const pointColors = {
    Pendiente: "fill-yellow-800", 
    "En Transito": "fill-blue-800",
    Entregado: "fill-green-800", 
    Cancelado: "fill-red-800"
}

export default function OrderTable({ orders, admin }: OrderTableProps) {
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
		orders.reduce(
			(acc, order) => ({ ...acc, [order._id]: order.status }),
			{}
		)
	);

	// Update orderStatuses whenever orders prop changes (ej. going back to this page using the paginator)
	useEffect(() => {
		const newStatuses = orders.reduce(
			(acc, order) => ({ ...acc, [order._id]: order.status }),
			{}
		);
		setOrderStatuses(newStatuses);
	}, [orders]); // Re-run when orders change

	const queryClient = useQueryClient();

	const { mutate: updateOrderStatusMutation } = useMutation({
		mutationFn: updateOrderStatus,
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: (data) => {
			// deletes the order from query cache"
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			toast.success(data?.message);
		},
	});

	const { mutate: deleteOrderMutation } = useMutation({
		mutationFn: deleteOrder,
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: (data) => {
			// deletes the order from query cache"
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			toast.success(data.message);
		},
	});

	const toggleRow = (orderId: string) => {
		const newExpanded = new Set(expandedRows);
		if (newExpanded.has(orderId)) {
			newExpanded.delete(orderId);
		} else {
			newExpanded.add(orderId);
		}
		setExpandedRows(newExpanded);
	};

	const handleStatusChange = (orderId: string, newStatus: string) => {
		setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }));

		// Here you would call your API to update the status
		console.log(`Updating order ${orderId} to status: ${newStatus}`);

		// TODO Implement update order status mutation
		Swal.fire({
			title: `Actualizar Estado a "${newStatus}"`,
			text: "Una vez completada la operación, un Email será enviado al usuario notificando el nuevo estado. 🚚📦",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Actualizar",
			cancelButtonText: "Cancelar",
		}).then((result) => {
			if (result.isConfirmed) {
				updateOrderStatusMutation({
					orderId,
					formData: { status: newStatus as OrderStatusEnum },
				});
			}
		});
	};

	const handleDelete = (orderId: string) => {
		Swal.fire({
			title: "Eliminar Orden ⚠️",
			text: "🚨 Recuerda que esta acción no es reversible 🚨",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Eliminar",
			cancelButtonText: "Cancelar",
		}).then((result) => {
			if (result.isConfirmed) {
				// Implement deleteOrder mutation
				deleteOrderMutation(orderId);
			}
		});
	};

    console.log(orders)

	return (
		<div className="my-20">
			<div className="px-4 sm:px-6 lg:px-8">
                {admin && (
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold text-gray-900">
                                Ordenes
                            </h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Administra, organiza y registra tus órdenes.
                            </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <Link
                                to={"/admin/orders/create"}
                                className="flex items-center gap-2 rounded-md bg-orange-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs transition-colors duration-200 hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                            >
                                <Pen size={16} />
                                Registrar Orden
                            </Link>
                        </div>
                    </div>
                )}
			</div>

			<div className="mt-8 overflow-x-auto">
				<div className="inline-block min-w-full align-middle px-4 sm:px-6 lg:px-8">
					<table className="min-w-full divide-y divide-gray-300">
						<thead>
							<tr>
								<th
									scope="col"
									className="py-3.5 pr-3.5 text-left text-sm font-semibold text-gray-900 w-12"
								>
									{/* Expand column */}
								</th>
								<th
									scope="col"
									className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
								>
									ID Orden
								</th>
								<th
									scope="col"
									className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
                                >
									Nombre Empresa
								</th>
                                {admin ? (
                                    <th
                                        scope="col"
                                        className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
                                    >
                                        RUT Empresa
                                    </th>
                                ) : (
                                    <th
                                        scope="col"
                                        className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
                                    >
                                        Realizada Por
                                    </th>
                                )}
								<th
									scope="col"
									className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
								>
									País
								</th>
								<th
									scope="col"
									className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
								>
									Estado
								</th>
								<th
									scope="col"
									className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
								>
									Expedidor
								</th>
								<th
									scope="col"
									className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
								>
									Total
								</th>
                                {admin ? (
                                    <th
                                        scope="col"
                                        className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
                                    >
                                        Acciones
                                    </th>
                                ) : (
                                    <th
                                        scope="col"
                                        className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
                                    >
                                        Items
                                    </th>
                                )}
							</tr>
						</thead>

						<tbody className="divide-y divide-gray-200 bg-white">
							{orders.map((order) => {

                                // --- LÓGICA DE CUMPLIMIENTO PARA CADA ORDEN ---
                                const estimated = new Date(order.estimatedDelivery);
                                const delivered = order.deliveredAt ? new Date(order.deliveredAt) : null;

                                let fulfillmentLabel = "En tránsito";
                                let fulfillmentColor = "text-gray-500";

                                if (delivered) {
                                    const diffInMs = delivered.getTime() - estimated.getTime();
                                    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

                                    if (diffInDays > 0) {
                                        fulfillmentLabel = `Atrasado ${diffInDays} día${diffInDays === 1 ? "" : "s"}`;
                                        fulfillmentColor = "text-red-600 font-semibold";
                                    } else if (diffInDays < 0) {
                                        fulfillmentLabel = `Entregado ${Math.abs(diffInDays)} día${diffInDays === -1 ? "" : "s"} antes`;
                                        fulfillmentColor = "text-green-600 font-semibold";
                                    } else {
                                        fulfillmentLabel = "Entregado justo a tiempo";
                                        fulfillmentColor = "text-green-600 font-semibold";
                                    }
                                }

								const isExpanded = expandedRows.has(order._id);

								const currentStatus = orderStatuses[order._id];

								return (
									<>
										<tr
											key={order._id}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="py-2 pr-3 pl-4 sm:pl-0 group relative">
												<button
													onClick={() =>
														toggleRow(order._id)
													}
													className="text-gray-400 hover:text-gray-600 transition-colors"
													aria-label={
														isExpanded
															? "Collapse row"
															: "Expand row"
													}
												>
													{isExpanded ? (
														<ChevronUp className="h-5 w-5 text-orange-500 cursor-pointer" />
													) : (
														<ChevronDown className="h-5 w-5 text-orange-500 cursor-pointer" />
													)}
												</button>

												{!isExpanded ? (
													<Dialog position="right">
														Ver Detalles
													</Dialog>
												) : (
													<Dialog position="right">
														Ocultar Detalles
													</Dialog>
												)}
											</td>
											<td className="px-2 py-2 text-sm whitespace-nowrap text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="group relative">
                                                        <Dialog position="right">
                                                            Copiar
                                                        </Dialog>
                                                        <Copy
                                                            size={16}
                                                            className="text-orange-400 hover:text-orange-600 duration-300 transition-colors cursor-pointer"
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    order._id
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <span className="font-mono text-xs truncate w-16">
                                                        {order._id}
                                                    </span>
                                                </div>
											</td>
											<td className="px-2 py-2 text-sm font-medium whitespace-nowrap text-gray-900">
												{order.businessName}
											</td>
											<td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">
                                                {admin ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="group relative">
                                                            <Dialog position="right">
                                                                Copiar
                                                            </Dialog>
                                                            <Copy
                                                                size={16}
                                                                className="text-orange-400 hover:text-orange-600 duration-300 transition-colors cursor-pointer"
                                                                onClick={() =>
                                                                    copyToClipboard(
                                                                        order.businessRut
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <span>
                                                            {order.businessRut}
                                                        </span>
                                                    </div>
												) : (
													<div className="">
														{typeof order.user === "string" ? order.user : order.user.name}
													</div>
												)}
											</td>
											<td className="px-2 py-2 text-sm whitespace-nowrap text-gray-500">
												{order.country}
											</td>
											<td className="px-2 py-2 text-sm whitespace-nowrap">
												{/* Made select responsive with proper sizing */}
                                                {admin ? (
                                                    <select
                                                        value={currentStatus}
                                                        disabled={!admin}
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                order._id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`w-full min-w-[120px] max-w-[160px] rounded-full px-3 py-1 text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                                                            statusColors[
                                                                currentStatus as keyof typeof statusColors
                                                            ]
                                                        }`}
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
                                                ) : (
                                                    <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${
                                                        statusColors[
                                                            currentStatus as keyof typeof statusColors
                                                        ]
                                                    }`}>
                                                        <svg viewBox="0 0 6 6" aria-hidden="true" className={`size-1.5 ${pointColors[ currentStatus as keyof typeof pointColors]}`}>
                                                            <circle r={3} cx={3} cy={3} />
                                                        </svg>
                                                        {order.status}
                                                    </span>
                                                )}
											</td>
											<td className="px-2 py-2 text-sm whitespace-nowrap text-gray-500">
												{order.shipper}
											</td>
											<td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900 font-semibold">
												{formatToCLP(order.total)}
											</td>
                                            {admin ? (
                                                <td className="py-2 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <Link
                                                            to={`/admin/orders/edit/${order._id}`}
                                                            className="text-orange-600 hover:text-orange-900 transition-colors"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    order._id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            ) : (
                                                <td className="py-2 pr-4 pl-3 text-left text-sm font-medium whitespace-nowrap sm:pr-0">
                                                    ({order.items.length})
                                                </td>
                                            )}
										</tr>

										{/* Expanded row showing order items */}
										{isExpanded && (
											<tr className="bg-gray-50">
												<td
													colSpan={9}
													className="px-4 py-4"
												>
													<div className="space-y-3">
														<div className="flex items-center justify-between border-b border-gray-300 pb-2">
															<h3 className="text-sm font-semibold text-gray-900">
																Detalles de la
																Orden
															</h3>
															<span className="text-xs text-gray-500">
																{new Date(
																	order.createdAt
																).toLocaleDateString(
																	"es-CL"
																)}
															</span>
														</div>

														<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
															<div className="">
                                                                <span className="text-gray-600">
                                                                    Orden Registrada el:
                                                                </span>
                                                                <span className="ml-2 font-medium text-gray-900">
																	{new Date(
																		order.createdAt
																	).toLocaleString(
																		"es-CL",
																		{
																			year: "numeric",
																			month: "long",
																			day: "numeric",
																		}
																	)}
                                                                </span>
															</div>
															<div>
																<span className="text-gray-600">
																	Última Actualización:
																</span>
																<span className="ml-2 font-medium text-gray-900">
																	{new Date(
																		order.updatedAt
																	).toLocaleString(
																		"es-CL",
																		{
																			year: "numeric",
																			month: "long",
																			day: "numeric",
																		}
																	)}
																</span>
															</div>
                                                            {admin ? (
                                                                <div>
                                                                    <span className="text-gray-600">
                                                                        Orden
                                                                        Realizada
                                                                        por:
                                                                    </span>
                                                                    <span className="ml-2 font-medium text-gray-900">
                                                                        {typeof order.user ===
                                                                        "string"
                                                                            ? order.user
                                                                            : order
                                                                                    .user
                                                                                    .name}
                                                                    </span>
                                                                </div>
                                                            ) : (
															<div>
																<span className="text-gray-600">
																	RUT de la Empresa:
																</span>
																<span className="ml-2 font-medium text-gray-900">
																	{order.businessRut}
																</span>
															</div>
                                                            )}
															<div>
																<span className="text-gray-600">
																	Método de
																	Pago:
																</span>
																<span className="ml-2 font-medium text-gray-900">
																	{
																		order.payment
																	}
																</span>
															</div>
														</div>

    													<div className="flex items-center justify-between border-b border-t border-gray-300 pt-4 pb-2">
															<h3 className="text-sm font-semibold text-gray-900">
																Fechas de Entrega
															</h3>
														</div>

                                                    	<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
															<div className="flex items-center gap-2">
                                                                <div className="group relative">
                                                                    <Dialog position="right">
                                                                        Copiar
                                                                    </Dialog>
                                                                    <Copy
                                                                        size={16}
                                                                        className="text-orange-400 hover:text-orange-600 duration-300 transition-colors cursor-pointer"
                                                                        onClick={() =>
                                                                            copyToClipboard(
                                                                                order.businessRut
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="">
                                                                    <span className="text-gray-600">
                                                                        Tracking Number {order.shipper}:
                                                                    </span>
                                                                    <span className="ml-2 font-medium text-gray-900">
                                                                        {order.trackingNumber}
                                                                    </span>
                                                                </div>
															</div>
															<div>
																<span className="text-gray-600">
																	Fecha Estimada:
																</span>
																<span className="ml-2 font-medium text-gray-900">
																	{new Date(
																		order.estimatedDelivery
																	).toLocaleString(
																		"es-CL",
																		{
																			year: "numeric",
																			month: "long",
																			day: "numeric",
																		}
																	)}
																</span>
															</div>
                                                            <div className="">
                                                                {order.deliveredAt && (
                                                                    <>
                                                                        <span className="text-gray-600">
                                                                            Cumplimiento:
                                                                        </span>
                                                                        <span className={`ml-2 font-medium text-gray-900 ${fulfillmentColor}`}>
                                                                            {fulfillmentLabel}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
															<div>
																<span className="text-gray-600">
																	Entregado el:
																</span>
																<span className="ml-2 font-medium text-gray-900">
																	{order.deliveredAt ? new Date(
																		order.deliveredAt
																	).toLocaleString(
																		"es-CL",
																		{
																			year: "numeric",
																			month: "long",
																			day: "numeric",
																		}
																	) : "Aún no Entregado"}
																</span>
															</div>
														</div>

														<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
															<div className="overflow-x-auto">
																<table className="min-w-full divide-y divide-gray-200">
																	<thead className="bg-gray-100">
																		<tr>
																			<th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
																				SKU
																			</th>
																			<th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
																				Producto
																			</th>
																			<th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
																				Precio
																				Unit.
																			</th>
																			<th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">
																				Cantidad
																			</th>
																			<th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
																				Subtotal
																			</th>
																		</tr>
																	</thead>
																	<tbody className="divide-y divide-gray-200">
																		{order.items.map(
																			(
																				item,
																				idx
																			) => (
																				<tr
																					key={
																						idx
																					}
																					className="hover:bg-gray-50"
																				>
																					<td className="px-4 py-2 text-xs text-gray-600 font-mono">
																						{
																							item.sku
																						}
																					</td>
																					<td className="px-4 py-2 text-sm text-gray-900">
																						{
																							item.name
																						}
																					</td>
																					<td className="px-4 py-2 text-sm text-right text-gray-900">
																						{formatToCLP(
																							item.price
																						)}
																					</td>
																					<td className="px-4 py-2 text-sm text-center text-gray-900">
																						{
																							item.quantity
																						}
																					</td>
																					<td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
																						{formatToCLP(
																							item.lineTotal
																						)}
																					</td>
																				</tr>
																			)
																		)}
																	</tbody>
																	<tfoot className="bg-gray-50">
																		<tr>
																			<td
																				colSpan={
																					4
																				}
																				className="px-4 py-3 text-right text-sm font-semibold text-gray-900"
																			>
																				Total:
																			</td>
																			<td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
																				{formatToCLP(
																					order.total
																				)}
																			</td>
																		</tr>
																	</tfoot>
																</table>
															</div>
														</div>
													</div>
												</td>
											</tr>
										)}
									</>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}