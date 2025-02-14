import { resetPassword, setPassword } from "@/api/AuthAPI";
import { ConfigurePasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ErrorMessage from "../ui/ErrorMessage";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

type SetPasswordFormProps = {
    type: "reset_password" | "set_password"
    token: string;
}

export default function SetPasswordForm({ type, token } : SetPasswordFormProps) {

    const initialValues: ConfigurePasswordForm = {
        password: "",
        confirmPassword: "",
    }

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ConfigurePasswordForm>({
        defaultValues: initialValues
    });

    const navigate = useNavigate();

    const { mutate: setNewPassword, isPending: isPendingSetting } = useMutation({
        mutationFn: setPassword,
        onError: (error) => {
            toast.error(error.message);
        }, 
        onSuccess: () => {
            reset();
            Swal.fire({
                title: "Contraseña Establecida Correctamente",
                text: "Ahora puedes Iniciar Sesión con tu Nueva Contraseña",
                icon: "success",
            }).then(() => {
                navigate("/auth/login");
            })
        }
    })

    const handleSetPassword = (formData: ConfigurePasswordForm) => {
        const data = {
            token,
            formData, 
        }
        setNewPassword(data);
    }

    const { mutate: resetOldPassword, isPending: isPendingReset } = useMutation({
        mutationFn: resetPassword, 
        onError: (error) => {
            toast.error(error.message);
        }, 
        onSuccess: () => {
            reset();
            Swal.fire({
                title: "Contraseña Restablecida Correctamente",
                text: "Ahora puedes Iniciar Sesión con tu Nueva Contraseña",
                icon: "success",
            }).then(() => {
                navigate("/auth/login");
            })
        }
    })

    const handleResetPassword = (formData: ConfigurePasswordForm) => {
        const data = {
            token,
            formData, 
        }
        resetOldPassword(data);
    }

    const password = watch('password');

    return (
        <form
            onSubmit={type === "reset_password" ? handleSubmit(handleResetPassword) : handleSubmit(handleSetPassword)}
            className="space-y-8 p-10  bg-white mt-10 rounded"
            noValidate
        >
                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Contraseña</label>

                    <input
                        type="password"
                        placeholder="Nueva Contraseña"
                        className="w-full p-3  border-gray-300 border rounded"
                        {...register("password", {
                            required: "La Contraseña es Obligatoria",
                            minLength: {
                                value: 8,
                                message: 'La Contraseña debe de ser de al menos 8 caracteres'
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Repetir Contraseña</label>

                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repetir Nueva Contraseña"
                        className="w-full p-3  border-gray-300 border rounded"
                        {...register("confirmPassword", {
                            required: "Repetir la Contraseña es Obligatoria",
                            validate: value => value === password || 'Las Contraseñas no coinciden'
                        })}
                    />

                    {errors.confirmPassword && (
                        <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
                    )}
                </div>

            <p className="text-sm text-gray-400 border-t border-gray-300 pt-5">
                <span className="text-red-500">*</span> Escoge una contraseña fuerte y intenta incluir caracteres especiales.
            </p>

            <input
                type="submit"
                value={type === "reset_password" ? "Restablecer Contraseña" : "Establecer Contraseña"}
                className="bg-slate-800 hover:bg-slate-900 rounded transition-colors w-full p-3  text-white font-black  text-xl cursor-pointer"
                disabled={type === "reset_password" ? isPendingReset : isPendingSetting}
            />
        </form>
    )
}
