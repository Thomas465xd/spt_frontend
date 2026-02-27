import { useNavigate } from "react-router-dom";
import { UserRegistrationForm } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { formatId, getCountryForIdType, getIdLabels, getMaxLength, getValidation, ID_TYPES, type IdType } from "@/utilities/identification";

export default function RegisterForm() {
    const initialValues : UserRegistrationForm = {
        name: '',
        businessName: '',
        idType: 'RUT',
        country: 'Chile',
        personalId: '',
        businessId: '',
        email: '',
        phone: '',
        address: ''
    }

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<UserRegistrationForm>({defaultValues: initialValues});
    const navigate = useNavigate();

    const selectedIdType = watch("idType") as IdType;
    const idLabels = getIdLabels(selectedIdType);
    const validation = getValidation(selectedIdType);

    const { mutate } = useMutation({
        mutationFn: createAccount, 
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            Swal.fire({
                title: "Cuenta Registrada Correctamente",
                text: "Serás Contactado por el Administrador en caso de ser aprobado. Se ha enviado un correo de seguimiento a tu Email.",
                icon: "success",
            })
            reset();
            navigate("/auth/login");
        }
    });

    const handleRegister = (formData: UserRegistrationForm) => {
        mutate(formData);
    }

    const handleIdTypeChange = (newIdType: IdType) => {
        setValue("idType", newIdType);
        setValue("country", getCountryForIdType(newIdType));
        // Clear ID fields when switching type to avoid format mismatch
        setValue("personalId", "", { shouldValidate: false });
        setValue("businessId", "", { shouldValidate: false });
    };

    return (
        <form 
            className="form"
            noValidate
            onSubmit={handleSubmit(handleRegister)}
        >
            {/* Agrupamos los inputs en un grid para mayor responsividad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label htmlFor="name" className="label">Nombre</label>
                    <input 
                        type="text" 
                        id="name"
                        placeholder="Ingresa tu Nombre"
                        className="input"
                        {...register("name", { required: "El Nombre no puede ir vacío" })}
                    />
                    {errors.name && <ErrorMessage mini >{errors.name.message}</ErrorMessage>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="businessName" className="label">Nombre de la Empresa</label>
                    <input 
                        type="text" 
                        id="businessName"
                        placeholder="Ingresa el Nombre de la Empresa"
                        className="input"
                        {...register("businessName", { required: "El Nombre de la Empresa no puede ir vacío" })}
                    />
                    {errors.businessName && <ErrorMessage mini >{errors.businessName.message}</ErrorMessage>}
                </div>
            </div>

            {/* ID Type & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label htmlFor="idType" className="label">Tipo de Identificación</label>
                    <select
                        id="idType"
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
                    {errors.idType && <ErrorMessage mini>{errors.idType.message}</ErrorMessage>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="country" className="label">País</label>
                    <input 
                        type="text" 
                        id="country"
                        className="input bg-gray-100 cursor-not-allowed"
                        disabled
                        {...register("country", { required: "El país es obligatorio" })}
                    />
                    {errors.country && <ErrorMessage mini>{errors.country.message}</ErrorMessage>}
                </div>
            </div>

            {/* Personal & Business ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label htmlFor="personalId" className="label">{idLabels.personal}</label>
                    <input 
                        type="text"
                        id="personalId"
                        placeholder={idLabels.personalPlaceholder}
                        className="input"
                        maxLength={getMaxLength(selectedIdType, "personal")}
                        {...register("personalId", {
                            required: `El ${idLabels.personal} es obligatorio`,
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
                        <ErrorMessage mini >{errors.personalId.message}</ErrorMessage>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="businessId" className="label">{idLabels.business}</label>
                    <input 
                        type="text"
                        id="businessId"
                        placeholder={idLabels.businessPlaceholder}
                        className="input"
                        maxLength={getMaxLength(selectedIdType, "business")}
                        {...register("businessId", {
                            required: `El ${idLabels.business} es obligatorio`,
                            pattern: {
                                value: validation.pattern,
                                message: validation.message
                            },
                            onChange: (e) => {
                                const formatted = formatId(e.target.value, selectedIdType);
                                setValue("businessId", formatted, { shouldValidate: true });
                            }
                        })}
                    />
                    {errors.businessId && (
                        <ErrorMessage mini >{errors.businessId.message}</ErrorMessage>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label htmlFor="email" className="label">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        placeholder="Ingresa tu Correo Electrónico"
                        className="input"
                        autoCorrect="off"
                        autoCapitalize="none"
                        {...register("email", {
                            required: "El Correo Electrónico es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "El Email no es válido"
                            }
                        })}
                    />
                    {errors.email && <ErrorMessage mini >{errors.email.message}</ErrorMessage>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="label">Número de Teléfono</label>
                    <input 
                        type="text" 
                        id="phone"
                        placeholder="Tu Número de Teléfono"
                        className="input"
                        {...register("phone", {
                            required: "El Teléfono es obligatorio",
                        })}
                    />
                    {errors.phone && <ErrorMessage mini >{errors.phone.message}</ErrorMessage>}
                </div>
            </div>

            <div className="space-y-2 border-b border-gray-400 pb-8">
                <label htmlFor="address" className="label">Dirección</label>
                <input 
                    type="text" 
                    id="address"
                    placeholder="Tu Dirección (ej. Calle 2901 Condominio Del Bosque Casa 1)"
                    className="input"
                    {...register("address", { required: "Tu Dirección no puede ir vacía" })}
                />
                {errors.address && <ErrorMessage mini >{errors.address.message}</ErrorMessage>}
            </div>

            <p className="text-sm text-gray-400">
                <span className="text-red-500">*</span> Estos datos serán enviados al equipo administrativo de SPT para la verificación de sus datos.
            </p>

            <input
                type="submit"
                value='Solicitar Cuenta'
                className="input-submit"
            />
        </form>
    )
}
