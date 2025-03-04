import { Link, useNavigate } from "react-router-dom";
import { UserRegistrationForm } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { formatRUT } from "@/utilities/rut";

export default function RegisterView() {

    const initialValues : UserRegistrationForm = {
        name: '',
        businessName: '',
        rut: '',
        businessRut: '',
        email: '',
        phone: '',
        address: ''
    }

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UserRegistrationForm>({defaultValues: initialValues});
    const navigate = useNavigate();

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

    const handleRegister =(formData: UserRegistrationForm) => {
        console.log(formData.email)
        mutate(formData);
    }

    return (
        <>
            <div className="mx-auto max-w-xl px-4 lg:px-0">
                <h1 className="text-5xl font-black text-white">Registrar Cuenta</h1>
                <p className="text-2xl font-light text-white mt-5">
                    Bienvenido a Portal Spare Parts Trade, por favor ingresa tus datos {''}
                    <span className="font-bold">en el formulario</span>
                </p>

                <form 
                    className="mt-10 space-y-5 bg-white shadow-lg rounded-lg p-6 lg:p-10 border border-gray-200"
                    noValidate
                    onSubmit={handleSubmit(handleRegister)}
                >
                    {/* Agrupamos los inputs en un grid para mayor responsividad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-bold">Nombre</label>
                            <input 
                                type="text" 
                                id="name"
                                placeholder="Ingresa tu Nombre"
                                className="w-full p-3 rounded border border-gray-300"
                                {...register("name", { required: "El Nombre no puede ir vacío" })}
                            />
                            {errors.name && <ErrorMessage mini >{errors.name.message}</ErrorMessage>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="businessName" className="text-sm font-bold">Nombre de la Empresa</label>
                            <input 
                                type="text" 
                                id="businessName"
                                placeholder="Ingresa el Nombre de la Empresa"
                                className="w-full p-3 rounded border border-gray-300"
                                {...register("businessName", { required: "El Nombre de la Empresa no puede ir vacío" })}
                            />
                            {errors.businessName && <ErrorMessage mini >{errors.businessName.message}</ErrorMessage>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label htmlFor="rut" className="text-sm font-bold">RUT de registro</label>
                            <input 
                                type="text"
                                id="rut"
                                placeholder="Ingresa tu RUT personal (ej. 12.345.678-9)"
                                className="w-full p-3 rounded border border-gray-300"
                                maxLength={12}
                                {...register("rut", {
                                    required: "El RUT es obligatorio",
                                    pattern: {
                                        value: /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/,
                                        message: "Formato de RUT inválido. Ejemplo: 12.345.678-9"
                                    },
                                    onChange: (e) => {
                                        const formattedRUT = formatRUT(e.target.value);
                                        setValue("rut", formattedRUT, { shouldValidate: true });
                                    }
                                })}
                            />
                            {errors.rut && (
                                <ErrorMessage mini >{errors.rut.message}</ErrorMessage>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="businessRut" className="text-sm font-bold">RUT de la Empresa</label>
                            <input 
                                type="text"
                                id="businessRut"
                                placeholder="Ingresa el RUT de la Empresa (ej. 12.345.678-9)"
                                className="w-full p-3 rounded border border-gray-300"
                                maxLength={12}
                                {...register("businessRut", {
                                    required: "El RUT de la Empresa es obligatorio",
                                    pattern: {
                                        value: /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/,
                                        message: "Formato de RUT inválido. Ejemplo: 12.345.678-9"
                                    },
                                    onChange: (e) => {
                                        const formattedRUT = formatRUT(e.target.value);
                                        setValue("businessRut", formattedRUT, { shouldValidate: true });
                                    }
                                })}
                            />
                            {errors.businessRut && (
                                <ErrorMessage mini >{errors.businessRut.message}</ErrorMessage>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-bold">Email</label>
                            <input 
                                type="email" 
                                id="email"
                                placeholder="Ingresa tu Correo Electrónico"
                                className="w-full p-3 rounded border border-gray-300"
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
                            <label htmlFor="phone" className="text-sm font-bold">Número de Teléfono</label>
                            <input 
                                type="text" 
                                id="phone"
                                placeholder="Tu Número de Teléfono (ej. +56912345678)"
                                className="w-full p-3 rounded border border-gray-300"
                                {...register("phone", {
                                    required: "El Teléfono es obligatorio",
                                    pattern: {
                                        value: /^(\+56\s?9\d{8}|9\d{8})$/,
                                        message: "Formato de teléfono inválido. Ejemplo: +56912345678 o 912345678"
                                    }
                                })}
                            />
                            {errors.phone && <ErrorMessage mini >{errors.phone.message}</ErrorMessage>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-bold">Dirección</label>
                        <input 
                            type="text" 
                            id="address"
                            placeholder="Tu Dirección (ej. Calle 2901 Condominio Del Bosque Casa 1)"
                            className="w-full p-3 rounded border border-gray-300"
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
                        className="bg-slate-800 hover:bg-slate-900 w-full p-3  text-white font-black  text-md cursor-pointer rounded"
                    />
                </form>
            </div>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to={"/auth/login"}
                    className="text-center text-gray-100 hover:text-gray-300 transition-colors"
                >
                    ¿Ya tienes una cuenta? <span className="font-bold">Iniciar Sesión</span>
                </Link>

                <Link
                    to={"/auth/forgot-password"}
                    className="text-center text-gray-100 hover:text-gray-300 transition-colors"
                >
                    ¿Olvidaste tu contraseña? <span className="font-bold">Reestablecela aquí</span>
                </Link>
            </nav>
        </>
    )
}
