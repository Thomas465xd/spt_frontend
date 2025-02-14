import { Link } from "react-router-dom";
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

    const { mutate } = useMutation({
        mutationFn: createAccount, 
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            Swal.fire({
                title: "Cuenta Registrada Correctamente",
                text: "Serás Contactado por el Administrador en caso de ser aprobado",
                icon: "success",
            })
            reset();
        }
    });

    const handleRegister =(formData: UserRegistrationForm) => {
        mutate(formData);
    }

    return (
        <>
            <h1 className="text-5xl font-black text-white">Registrar Cuenta</h1>
            <p className="text-2xl font-light text-white mt-5">
                Bienvenido a Portal Spare Parts Trade, por favor ingresa tus datos {''}
                <span className="font-bold">en el formulario</span>
            </p>

            <form
                className="space-y-8 p-10 bg-white shadow-md rounded mt-10"
                onSubmit={handleSubmit(handleRegister)}
                noValidate
            >
                <div className="flex flex-col gap-5">
                    <label 
                        htmlFor="nombre"
                        className="font-normal text-2xl"
                    >
                        Nombre
                    </label>
                    <input 
                        type="text"
                        id="nombre"
                        placeholder="Ingresa tu Nombre"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
                        {...register('name', {
                            required: 'El Nombre es obligatorio'
                        })}
                    />
                    {errors.name && (
                        <ErrorMessage>{errors.name.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label 
                        htmlFor="empresa"
                        className="font-normal text-2xl"
                    >
                        Nombre de la Empresa
                    </label>
                    <input 
                        type="text"
                        id="empresa"
                        placeholder="Ingresa el nombre de tu Empresa"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
                        {...register('businessName', {
                            required: 'El Nombre de la Empresa es obligatorio'
                        })}
                        />
                        {errors.businessName && (
                            <ErrorMessage>{errors.businessName.message}</ErrorMessage>
                        )}
                </div>

                <div className="flex flex-col gap-5">
                    <label 
                        htmlFor="rut"
                        className="font-normal text-2xl"
                    >
                        RUT
                    </label>
                    <input 
                        type="text"
                        id="rut"
                        placeholder="Ingresa tu RUT personal (ej. 12.345.678-9)"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
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
                        <ErrorMessage>{errors.rut.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label 
                        htmlFor="rutempresa"
                        className="font-normal text-2xl"
                    >
                        RUT de la Empresa
                    </label>
                    <input 
                        type="text"
                        id="rutempresa"
                        placeholder="Ingresa el RUT de la Empresa (ej. 12.345.678-9)"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
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
                        <ErrorMessage>{errors.businessRut.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label 
                        htmlFor="telefono"
                        className="font-normal text-2xl"
                    >
                        Teléfono
                    </label>
                    <input 
                        type="text"
                        id="telefono"
                        placeholder="Ingresa tu número de teléfono (ej. +56912345678)"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
                        {...register("phone", {
                            required: "El Teléfono es obligatorio",
                            pattern: {
                                value: /^(\+56\s?9\d{8}|9\d{8})$/,
                                message: "Formato de teléfono inválido. Ejemplo: +56912345678 o 912345678"
                            }
                        })}
                    />
                    {errors.phone && (
                        <ErrorMessage>{errors.phone.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label 
                        htmlFor="email"
                        className="font-normal text-2xl"
                    >
                        Email
                    </label>
                    <input 
                        type="email"
                        id="email"
                        placeholder="Ingresa tu correo electrónico"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
                        {...register("email", {
                            required: "El Correo Electrónico es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "El Email no es válido"
                            }
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5 border-b border-gray-400 pb-8">
                    <label 
                        htmlFor="direccion"
                        className="font-normal text-2xl"
                    >
                        Dirección
                    </label>
                    <input 
                        type="text"
                        id="direccion"
                        placeholder="Ingresa tu Dirección (ej. Calle 1 # 2 - 3)"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
                        {...register("address", {
                            required: "La Dirección no puede ir vacía"
                        })}
                    />
                    {errors.address && (
                        <ErrorMessage>{errors.address.message}</ErrorMessage>
                    )}
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
