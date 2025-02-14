import { forgotPasswordEmail } from "@/api/AuthAPI";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ForgotPasswwordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {

    const initialValues: ForgotPasswwordForm = {
        email: ""
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: forgotPasswordEmail,
        onError: (error) => {
            toast.error(error.message);
        }, 
        onSuccess: () => {
            toast.success("Instrucciones enviadas a tu correo.");
            const disabledInputs = document.querySelectorAll("input:disabled");
            disabledInputs.forEach((input) => {
                input.removeAttribute("disabled");
            });
            reset();
        }
    })

    const handleForgotPassword = (formData: ForgotPasswwordForm) => {
        mutate(formData);
    }

    return (
        <>
            <h1 className="text-5xl font-black text-white">Reestablecer Contraseña</h1>
            <p className="text-2xl font-light text-white mt-5 mb-5">
                ¿Olvidaste tu Contraseña? Completa el formulario para {''}
                <span className=" text-white font-bold"> Reestablecerla </span>
            </p>

            <form
                onSubmit={handleSubmit(handleForgotPassword)}
                className="space-y-8 p-10  bg-white mt-10 rounded"
                noValidate
            >
                <div className="flex flex-col gap-5 border-b border-gray-400 pb-8">
                    <label
                        className="font-normal text-2xl"
                        htmlFor="email"
                    >Email</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Email de registro"
                        className="w-full p-3 border-gray-300 border"
                        {...register("email", {
                            required: "El Email de Registro es Obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Email inválido",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <p className="text-sm text-gray-400">
                    <span className="text-red-500">*</span> Las Instrucciones se enviarán a tu correo electrónico. En caso de no tener un password registrado, se te enviarán las instucciones para crearlo.
                </p>

                <input
                    type="submit"
                    value='Enviar Instrucciones'
                    className="bg-slate-800 hover:bg-slate-900 rounded transition-colors w-full p-3  text-white font-black  text-xl cursor-pointer"
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
                    to={"/auth/login"}
                    className="text-center text-white hover:text-slate-300 transition-colors"
                >
                    ¿Ya tienes una Cuenta? <span className="font-bold">Iniciar Sesión</span>
                </Link>
            </nav>
        </>
    )
}
