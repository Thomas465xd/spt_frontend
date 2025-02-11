import { getConfirmedUsers } from "@/api/AdminAPI";
import { useQuery } from "@tanstack/react-query"

export default function AdminConfirmedTable() {

    const { data, isLoading, error } = useQuery({
        queryKey: ['confirmedUsers'],
        queryFn: getConfirmedUsers,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    })

    // Verificamos si data está definida y contiene la propiedad 'users'
    const users = data?.users || [];
    //console.log(users)

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8 my-20">
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 bg-white p-5">
                            {isLoading && <p className="text-center text-gray-500">Cargando usuarios...</p>}
                            {error && <p className="text-center text-red-500">Error al cargar usuarios</p>}
                            {!isLoading && !error && users && (
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
                                                <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
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
                                                    <td className="px-3 py-4 text-sm text-gray-900">{user.phone}</td>
                                                    <td className="px-3 py-4 text-sm text-gray-900">{user.address}</td>
                                                    <td className="px-3 py-4 text-sm text-gray-900">
                                                        <button className="text-red-600 hover:underline">
                                                            Bloquear Usuario
                                                        </button>
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
        </>
    );
}
