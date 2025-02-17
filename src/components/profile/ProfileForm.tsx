import { User, UserProfileForm } from "@/types/index"
import Heading from "../ui/Heading"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "@/api/ProfileAPI"
import { toast } from "react-toastify"
import ErrorMessage from "../ui/ErrorMessage"
import Swal from "sweetalert2"

type ProfileFormProps = {
    data: User
}

export default function ProfileForm({ data }: ProfileFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<UserProfileForm>({
        defaultValues: data
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: updateProfile, 
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success(data.message);
        }
    });

    const handleEditProfile = (formData: UserProfileForm) => {
        Swal.fire({
            title: "¿Revisaste los Datos Ingresados?",
            text: "¿Estás seguro de los cambios a realizar en tu perfil?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, Actualizar ✅",
            cancelButtonText: "No, Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                mutate(formData);
            }
        });
    };

    return (
        <div className="mx-auto max-w-xl px-4 lg:px-0">
            <h1 className="text-5xl font-black text-center border-b border-gray-300 pb-5">Mi Perfil</h1>
            <p className="text-lg font-light text-gray-500 mt-3 text-center">
                Usa este formulario para actualizar tus datos de registro
            </p>

            <form 
                className="mt-10 space-y-5 bg-white shadow-lg rounded-lg p-6 lg:p-10 border border-gray-200"
                noValidate
                onSubmit={handleSubmit(handleEditProfile)}
            >
                {/* Agrupamos los inputs en un grid para mayor responsividad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-bold">Nombre</label>
                        <input 
                            type="text" 
                            id="name"
                            placeholder="Tu Nombre"
                            className="w-full p-3 rounded border border-gray-300"
                            {...register("name", { required: "El Nombre no puede ir vacío" })}
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="businessName" className="text-sm font-bold">Nombre de la Empresa</label>
                        <input 
                            type="text" 
                            id="businessName"
                            placeholder="El nombre de la empresa"
                            className="w-full p-3 rounded border border-gray-300"
                            {...register("businessName", { required: "El Nombre de la Empresa no puede ir vacío" })}
                        />
                        {errors.businessName && <ErrorMessage>{errors.businessName.message}</ErrorMessage>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label htmlFor="rut" className="text-sm font-bold">RUT de registro</label>
                        <input 
                            type="text"
                            disabled 
                            id="rut"
                            placeholder={data.rut}
                            className="w-full p-3 rounded border border-gray-300 bg-gray-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="businessRut" className="text-sm font-bold">RUT de la Empresa</label>
                        <input 
                            type="text"
                            disabled 
                            id="businessRut"
                            placeholder={data.businessRut}
                            className="w-full p-3 rounded border border-gray-300 bg-gray-100"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            placeholder="Tu Email"
                            className="w-full p-3 rounded border border-gray-300"
                            {...register("email", { required: "El Email no puede ir vacío" })}
                        />
                        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-bold">Número de Teléfono</label>
                        <input 
                            type="text" 
                            id="phone"
                            placeholder="Tu Número de Teléfono"
                            className="w-full p-3 rounded border border-gray-300"
                            {...register("phone", { required: "El Número de Teléfono no puede ir vacío" })}
                        />
                        {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-bold">Dirección</label>
                    <input 
                        type="text" 
                        id="address"
                        placeholder="Tu Dirección (ej. Calle ### Condominio X Casa 1)"
                        className="w-full p-3 rounded border border-gray-300"
                        {...register("address", { required: "Tu Dirección no puede ir vacía" })}
                    />
                    {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-orange-500 w-full rounded p-3 text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                    {isPending ? "Guardando..." : "Guardar Cambios"}
                </button>
            </form>
        </div>
    );
}
