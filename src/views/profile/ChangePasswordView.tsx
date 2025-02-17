import { changePassword } from "@/api/ProfileAPI"
import ErrorMessage from "@/components/ui/ErrorMessage"
import { UserUpdatePasswordForm } from "@/types/index"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

export default function ChangePasswordView() {

    const initialValues : UserUpdatePasswordForm = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    }

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: initialValues
    })

    const { mutate } = useMutation({
        mutationFn: changePassword,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) =>{
            toast.success(data.message)
        }
    })

    const newPassword = watch('newPassword');

    const handleChangePassword = (formData : UserUpdatePasswordForm) => {
        Swal.fire({
            title: "Confirmar Cambio de Contraseña",
            text: `¿Estas Seguro de Establecer "${formData.newPassword}" como tu nueva Contraseña?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, Cambiar ⚙️",
            cancelButtonText: "No, Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                mutate(formData);
            }
        });
    }

    return (
        <>
            <div className="mx-auto max-w-3xl">

                <h1 className="text-5xl font-black text-center border-b border-gray-300 pb-5">Actualizar tu Contraseña</h1>
                <p className="text-2xl font-light text-gray-500 mt-5 text-center">Completa este formulario para actualizar tu contraseña. Recuerda usar caracteres especiales como @, #, !, etc...</p>

                <form
                    onSubmit={handleSubmit(handleChangePassword)}
                    className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg border border-gray-200"
                    noValidate
                >
                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="currentPassword"
                        >Contraseña Actual (<span className="text-red-500">*</span>)</label>

                        <input
                            id="currentPassword"
                            type="password"
                            placeholder="Ingresar Contraseña Actual"
                            className="w-full p-3  border border-gray-200 rounded focus:outline-orange-500"
                            {...register("currentPassword", {
                                required: "La Contraseña Actual es Obligatoria",
                            })}
                        />
                        {errors.currentPassword && (
                        <ErrorMessage>{errors.currentPassword.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="newPassword"
                        >Nueva Contraseña (<span className="text-red-500">*</span>)</label>

                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Ingresa tu nueva contraseña"
                            className="w-full p-3  border border-gray-200 rounded focus:outline-orange-500"
                            {...register("newPassword", {
                                required: "La Nueva Contraseña no puede ir Vacía",
                                minLength: {
                                value: 8,
                                message: 'La Contraseña debe tener como minimo 8 caracteres'
                                }
                            })}
                        />
                        {errors.newPassword && (
                        <ErrorMessage>{errors.newPassword.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="mb-5 space-y-3">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm uppercase font-bold"
                        >
                            Repeat Password (<span className="text-red-500">*</span>)
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Repeat your new Password"
                            className="w-full p-3  border border-gray-200 rounded focus:outline-orange-500"
                            {...register("confirmPassword", {
                                required: "This Field is required",
                                validate: value => value === newPassword|| 'Passwords do Not Match'
                            })}
                        />
                        {errors.confirmPassword && (
                        <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
                        )}
                    </div>

                    <input
                        type="submit"
                        value='Cambiar Contraseña'
                        className="bg-orange-500 w-full p-3 text-white uppercase font-bold hover:bg-orange-600 cursor-pointer transition-colors rounded"
                    />
                </form>
            </div>
        </>
    )
}
