import { login } from "@/api/AuthAPI";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { UserLoginForm } from "@/types/index"
import { formatRUT } from "@/utilities/rut";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function LoginView() {

    const initialValues : UserLoginForm = {
        rut: "",
        email: "",
        password: ""
    }

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<UserLoginForm>({defaultValues: initialValues});

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: login,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            if(data.admin) {
                Swal.fire({
                    title: "Sesión Iniciada como Administrador",
                    text: data.message, 
                    icon: "success",
                }).then(() => {
                    navigate("/admin/dashboard");
                })
            } else {
                Swal.fire({
                    title: "Sesion Iniciada Correctamente",
                    text: data.message, 
                    icon: "success",
                }).then(() => {
                    navigate("/");
                })
            }

            reset()
        }
    })

    const handleLogin = (formData: UserLoginForm) => {
        mutate(formData);
    }

    return (
        <>
            <h1 className="text-5xl font-black text-white">Iniciar Sesión</h1>
            <p className="text-2xl font-light text-white mt-5 mb-5">
                Bienvenido a Portal Spare Parts Trade
            </p>

            <form 
                className="bg-white shadow-md rounded space-y-8 p-10"
                onSubmit={handleSubmit(handleLogin)}
                noValidate
            >
                <div className="flex flex-col gap-5">
                    <label 
                        className="font-normal text-2xl"
                    >
                        RUT
                    </label>
                    <input 
                        type="text"
                        placeholder="Ingresa el RUT de registro (ej. 12.345.678-9)"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
                        maxLength={12}
                        {...register("rut", {
                            required: "El RUT no puede ir vacío",
                            pattern: {
                                value: /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/,
                                message: "Formato de RUT inválido. Ejemplo: 12.345.678-9"
                            },
                            onChange: (e) => {
                                const formattedRUT = formatRUT(e.target.value);
                                setValue("rut", formattedRUT, { shouldValidate: true });
                            }
                        })}
                    />
                    {errors.rut && (
                        <ErrorMessage>{errors.rut.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label 
                        className="font-normal text-2xl"
                    >
                        Email
                    </label>
                    <input 
                        type="email"
                        placeholder="Ingresa el Email de tu usuario"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
                        {...register("email", {
                            required: "El Email es no puede ir vacío",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "El Email no es valido"
                            }
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex-flex-col-gap-5 border-b border-gray-400 pb-8">
                    <label
                        className="font-normal text-2xl"
                    >
                        Contraseña
                    </label>
                    <input 
                        type="password"
                        placeholder="Ingresa tu Contraseña"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
                        {...register("password", {
                            required: "La Contraseña no puede ir vacía",
                            minLength: {
                                value: 8,
                                message: "La Contraseña debe tener al menos 8 caracteres"
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <p className="text-sm text-gray-400">
                    <span className="text-red-500">*</span> Para iniciar sesión su cuenta debe estar confirmada y tener la contraseña configurada.
                </p>

                <input 
                    type="submit"
                    value="Iniciar Sesión"
                    className="bg-slate-800 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-slate-900 transition-colors"
                />
            </form>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to={"/auth/register"}
                    className="text-center text-white hover:text-slate-300 transition-colors"
                >
                    ¿Aún no tienes una Cuenta? <span className="font-bold">Registrate</span>
                </Link>

                <Link
                    to={"/auth/forgot-password"}
                    className="text-center text-white hover:text-slate-300 transition-colors"
                >
                    ¿Olvidaste tu Contraseña? <span className="font-bold">Restablecela aquí</span>
                </Link>
            </nav>
        </>
    )
}
