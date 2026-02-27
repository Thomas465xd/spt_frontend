import { forgotPasswordEmail } from "@/api/AuthAPI";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ForgotPasswwordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function ForgotPassword() {
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
        <form
            onSubmit={handleSubmit(handleForgotPassword)}
            className="form"
            noValidate
        >
            <div className="flex flex-col gap-5 border-b border-gray-400 pb-8">
                <div className="">
                    <label
                        className="font-normal text-2xl"
                        htmlFor="email"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Email de registro"
                        className="input mt-4"
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
            </div>

            <p className="text-sm text-gray-400">
                <span className="text-red-500">*</span> Las Instrucciones se enviarán a tu correo electrónico. En caso de no tener un password registrado, se te enviarán las instucciones para crearlo.
            </p>

            <input
                type="submit"
                value='Enviar Instrucciones'
                className="input-submit"
            />
        </form>
    )
}
