import { login } from "@/api/AuthAPI";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { UserLoginForm } from "@/types/index"
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { formatId, getIdLabels, getMaxLength, getValidation, ID_TYPES, type IdType } from "@/utilities/identification";

export default function LoginForm() {
    const initialValues : UserLoginForm = {
        idType: "RUT",
        personalId: "",
        email: "",
        password: ""
    }

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<UserLoginForm>({defaultValues: initialValues});

    const selectedIdType = watch("idType") as IdType;
    const idLabels = getIdLabels(selectedIdType);
    const validation = getValidation(selectedIdType);

    const handleIdTypeChange = (newIdType: IdType) => {
        setValue("idType", newIdType);
        setValue("personalId", "", { shouldValidate: false });
    };

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
                    title: "Sesión Iniciada Correctamente",
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
        <form 
            className="form"
            onSubmit={handleSubmit(handleLogin)}
            noValidate
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="">
                    <label 
                        className="label text-2xl font-normal"
                    >
                        Tipo de ID
                    </label>
                    <select
                        className="input"
                        {...register("idType", {
                            required: "El tipo de identificación es obligatorio",
                            onChange: (e) => handleIdTypeChange(e.target.value as IdType)
                        })}
                    >
                        {ID_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {errors.idType && (
                        <ErrorMessage>{errors.idType.message}</ErrorMessage>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label 
                        className="label text-2xl font-normal"
                    >
                        {idLabels.personal}
                    </label>
                    <input 
                        type="text"
                        placeholder={idLabels.personalPlaceholder}
                        className="input"
                        maxLength={getMaxLength(selectedIdType, "personal")}
                        {...register("personalId", {
                            required: `El ${idLabels.personal} no puede ir vacío`,
                            pattern: {
                                value: validation.pattern,
                                message: validation.message
                            },
                            onChange: (e) => {
                                const formatted = formatId(e.target.value, selectedIdType);
                                setValue("personalId", formatted, { shouldValidate: true });
                            }
                        })}
                    />
                    {errors.personalId && (
                        <ErrorMessage>{errors.personalId.message}</ErrorMessage>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <div className="">
                    <label 
                        className="label text-2xl font-normal"
                    >
                        Email
                    </label>
                    <input 
                        type="email"
                        placeholder="Ingresa el Email de tu usuario"
                        className="input"
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
            </div>

            <div className="flex-flex-col-gap-5 border-b border-gray-400 pb-8">
                <label
                    className="label text-2xl font-normal"
                >
                    Contraseña
                </label>
                <input 
                    type="password"
                    placeholder="Ingresa tu Contraseña"
                    className="input"
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
                className="input-submit"
            />
        </form>
    )
}
