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

type AdminConfirmedTableProps = {
    type: "confirmed" | "unconfirmed",
    users: UsersResponse['users'],
    isLoading: boolean, 
    error: null
}

const AdminConfirmedTable: FC<AdminConfirmedTableProps> = ({ type, users, isLoading, error }) => {

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
        }
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
    }

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
        }
    })

    const handleDeleteUser = (userId: string) => {
        Swal.fire({
            title: "¿Estas Seguro de esta Acción? ⚠️",
            text: "🚨 Recuerda que esta acción no es reversible 🚨",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteNoPasswordUser( userId );
            }
        });
    }

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8 my-20">
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 bg-white p-5">
                            {isLoading && <Loader />}
                            {error && <p className="text-center text-red-500">Error al cargar usuarios</p>}
                            {!isLoading && !error && users && users.length === 0 && (
                                <p className="text-center text-gray-500">No hay usuarios disponibles.</p>
                            )}
                            {!isLoading && !error && users && users.length > 0 && (
                                <div className="flex justify-center overflow-x-auto">
                                    <table className="min-w-max sm:min-w-max md:min-w-full divide-y divide-gray-300 last-of-type:border-b border-b-gray-300">
                                        <thead>
                                            <tr>
                                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                    Nombre
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    RUT
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    RUT Empresa
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
                                                <tr key={user._id}>
                                                    <td className="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-900">{user.rut}</td>
                                                    <td className="px-3 py-4 text-sm text-gray-900">{user.businessRut}</td>
                                                    <td className="py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-900">{formatPhone(user.phone)}</td>
                                                    <td className="px-3 py-4 text-sm text-gray-900">{user.address}</td>
                                                    <td className="px-3 py-4 text-sm text-gray-900">
                                                        {type === "unconfirmed" ? (
                                                            user.passwordSet ? (
                                                                <button 
                                                                    className="text-blue-600 hover:underline"
                                                                    type="button"
                                                                    onClick={() => handleUserStatus(user._id)}
                                                                >
                                                                    Desbloquear Usuario
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    className="text-green-600 hover:underline"
                                                                    type="button"
                                                                    onClick={() => navigate(location.pathname + `?confirmUser=${user._id}`)}
                                                                >
                                                                    Confirmar Usuario
                                                                </button>
                                                            )
                                                        ) : (
                                                            user.passwordSet ? (
                                                                <button 
                                                                    className="text-orange-600 hover:underline font-bold"
                                                                    type="button"
                                                                    onClick={() => handleUserStatus(user._id)}
                                                                >
                                                                    Bloquear Usuario
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="text-red-700 hover:underline font-bold"
                                                                    type="button"
                                                                    onClick={() => handleDeleteUser(user._id)}
                                                                >
                                                                    Eliminar Usuario
                                                                </button>
                                                            )
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