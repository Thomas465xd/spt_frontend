import { Order, OrderStatusEnum } from "@/types/order";
import { Pen } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteOrder, updateOrderStatus } from "@/api/OrderAPI";
import OrderTableEntry from "./OrderTableEntry";

type OrderTableProps = {
	orders: Order[];
	admin: boolean;
};

export default function OrderTable({ orders, admin }: OrderTableProps) {
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
		orders.reduce(
			(acc, order) => ({ ...acc, [order.id]: order.status }),
			{},
		),
	);

	// Update orderStatuses whenever orders prop changes (ej. going back to this page using the paginator)
	useEffect(() => {
		const newStatuses = orders.reduce(
			(acc, order) => ({ ...acc, [order.id]: order.status }),
			{},
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
										ID Empresa
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
							{orders.map((order) => (
								<OrderTableEntry
									key={order.id}
									order={order}
									admin={admin}
									isExpanded={expandedRows.has(order.id)}
									currentStatus={orderStatuses[order.id]}
									onToggleRow={toggleRow}
									onStatusChange={handleStatusChange}
									onDelete={handleDelete}
								/>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
