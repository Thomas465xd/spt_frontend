import { AuthUser, UserShippingForm } from "@/types/index"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateShippingInfo } from "@/api/ProfileAPI"
import { toast } from "react-toastify"
import ErrorMessage from "../ui/ErrorMessage"
import Swal from "sweetalert2"

type ProfileFormProps = {
    data: AuthUser
}

export default function ExtraProfileForm({ data }: ProfileFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<UserShippingForm>({
        defaultValues: data
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: updateShippingInfo, 
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success(data.message);
        }
    });

    const handleEditShipping = (formData: UserShippingForm) => {
        Swal.fire({
            title: "¿Revisaste los Datos Ingresados?",
            text: "¿Estás seguro de los cambios a realizar en tu perfil?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ed8936",
            cancelButtonColor: "#374151",
            confirmButtonText: "Sí, Actualizar ",
            cancelButtonText: "No, Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                mutate(formData);
            }
        });
    };

    return (
        <div className="mx-auto max-w-xl px-4 lg:px-0">
            <form 
                className="mt-10 space-y-5 bg-white shadow-lg rounded-lg p-6 lg:p-10 border border-gray-200"
                noValidate
                onSubmit={handleSubmit(handleEditShipping)}
            >
                {/* Agrupamos los inputs en un grid para mayor responsividad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label htmlFor="country" className="text-sm font-bold">País</label>
                        <input 
                            type="text" 
                            disabled
                            id="country"
                            placeholder="Tu País"
                            className="w-full p-3 rounded border border-gray-300 bg-gray-100 cursor-not-allowed"
                            value={"Chile"}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="region" className="text-sm font-bold">
                            Región
                        </label>
                        <select
                            id="region"
                            className="w-full p-3 rounded border border-gray-300"
                            {...register("region", {
                                required: false,
                            })}
                        >
                            <option value="">Selecciona una región</option>
                            <option value="Arica y Parinacota">
                                Arica y Parinacota
                            </option>
                            <option value="Tarapacá">Tarapacá</option>
                            <option value="Antofagasta">Antofagasta</option>
                            <option value="Atacama">Atacama</option>
                            <option value="Coquimbo">Coquimbo</option>
                            <option value="Valparaíso">Valparaíso</option>
                            <option value="Metropolitana de Santiago">
                                Metropolitana de Santiago
                            </option>
                            <option value="Libertador General Bernardo O'Higgins">
                                Libertador General Bernardo O'Higgins
                            </option>
                            <option value="Maule">Maule</option>
                            <option value="Ñuble">Ñuble</option>
                            <option value="Biobío">Biobío</option>
                            <option value="La Araucanía">La Araucanía</option>
                            <option value="Los Ríos">Los Ríos</option>
                            <option value="Los Lagos">Los Lagos</option>
                            <option value="Aysén del General Carlos Ibáñez del Campo">
                                Aysén del General Carlos Ibáñez del Campo
                            </option>
                            <option value="Magallanes y de la Antártica Chilena">
                                Magallanes y de la Antártica Chilena
                            </option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label htmlFor="city" className="text-sm font-bold">Ciudad</label>
                        <input 
                            type="city" 
                            id="city"
                            placeholder="Tu Ciudad"
                            className="w-full p-3 rounded border border-gray-300"
                            {...register("city", { required: false })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="province" className="text-sm font-bold">Comuna</label>
                        <input 
                            type="text" 
                            id="province"
                            placeholder="Tu Comuna"
                            className="w-full p-3 rounded border border-gray-300"
                            {...register("province", { required: false })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="reference" className="text-sm font-bold">Referencia</label>
                        <input 
                            type="text" 
                            id="reference"
                            placeholder="Número de Depto. u Oficina Ej. 101 Torre B"
                            className="w-full p-3 rounded border border-gray-300"
                            {...register("reference", { required: false })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="postalCode" className="text-sm font-bold">Código Postal</label>
                        <input 
                            type="text" 
                            id="postalCode"
                            placeholder="Tu Código Postal"
                            className="w-full p-3 rounded border border-gray-300"
                            {...register("postalCode", {
                                required: false,
                                pattern: {
									value: /^[0-9]{7}$/,
									message:
										"Formato de Código Postal inválido. Máximo 7 dígitos",
								},
                            })}
                        />
                        {errors.postalCode && (
                            <ErrorMessage mini>
                                {errors.postalCode.message}
                            </ErrorMessage>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-orange-500 w-full rounded p-3 text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                    {isPending ? "Guardando..." : "Guardar Cambios"}
                </button>
            </form>

            <p className="text-gray-400 text-sm my-5 text-center">Estos Datos serán utilizados para la Facturación</p>
        </div>
    );
}
