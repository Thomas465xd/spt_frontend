import { setUserDiscount } from "@/api/AdminAPI";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { UserDiscountForm } from "@/types/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PercentCircle, User, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type AdminDiscountFormProps = {
    userId: string; 
    userName?: string;
    currentDiscount?: number;
}

export default function AdminDiscountForm({ userId, userName, currentDiscount = 0 } : AdminDiscountFormProps) {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: setUserDiscount, 
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            // "deletes de user from query cache"
            queryClient.invalidateQueries({ queryKey: ["userDiscount"] });
            toast.success(data.message);
        }
    });

    const initialValues = {
        userId, 
        discount: currentDiscount
    };

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UserDiscountForm>({
        defaultValues: initialValues
    });

    const watchedDiscount = watch("discount");

    const handleDiscountForm = (formData: UserDiscountForm) => {
        const discount = Number(formData.discount);
        mutate({ userId, discount });
    };

    // Predefined discount buttons
    const quickDiscounts = [5, 10, 15, 20, 25, 30, 50];

    const handleQuickDiscount = (discountValue: number) => {
        setValue("discount", discountValue);
    };

	return (
        <div className="w-full max-w-3xl mx-auto mt-8">
            <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-100 rounded-full">
                        <PercentCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Asignar Descuento</h2>
                        {userName && (
                            <p className="text-gray-600 flex items-center gap-2 mt-1">
                                <User size={16} />
                                Usuario: {userName}
                            </p>
                        )}
                    </div>
                </div>

                {/* Current Discount Display */}
                {currentDiscount > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-800 font-medium">
                                Descuento actual: {currentDiscount}%
                            </span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(handleDiscountForm)} className="space-y-6">
                    {/* Quick Discount Buttons */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Descuentos Rápidos
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {quickDiscounts.map((discount) => (
                                <button
                                    key={discount}
                                    type="button"
                                    onClick={() => handleQuickDiscount(discount)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        watchedDiscount === discount
                                            ? 'bg-orange-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {discount}%
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setValue("discount", 0)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    watchedDiscount === 0
                                        ? 'bg-red-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Sin descuento
                            </button>
                        </div>
                    </div>

                    {/* Manual Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descuento Personalizado (0-100%)
                        </label>
                        <div className="relative">
                            <input 
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                placeholder="Ingresa un valor entre 0 y 100"
                                className={`w-full p-4 border-2 rounded-lg text-lg transition-all duration-200 pr-12 ${
                                    errors.discount 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                        : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                                } focus:outline-none focus:ring-4`}
                                {...register("discount", {
                                    required: "El descuento es obligatorio",
                                    min: {
                                        value: 0,
                                        message: "El descuento no puede ser menor a 0%"
                                    },
                                    max: {
                                        value: 100,
                                        message: "El descuento no puede ser mayor a 100%"
                                    },
                                    valueAsNumber: true
                                })}
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <span className="text-gray-500 font-medium text-lg">%</span>
                            </div>
                        </div>
                        
                        {errors.discount && (
                            <div className="mt-2">
                                <ErrorMessage>{errors.discount.message}</ErrorMessage>
                            </div>
                        )}
                    </div>

                    {/* Discount Preview */}
                    {watchedDiscount !== undefined && watchedDiscount >= 0 && (
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-orange-800 font-medium">
                                    Vista previa del descuento:
                                </span>
                                <span className="text-2xl font-bold text-orange-600">
                                    {watchedDiscount}%
                                </span>
                            </div>
                            {watchedDiscount > 0 && (
                                <p className="text-sm text-orange-700 mt-2">
                                    El usuario recibirá un {watchedDiscount}% de descuento en todos los productos
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button 
                            type="submit" 
                            disabled={isPending || Object.keys(errors).length > 0}
                            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PercentCircle size={20} />
                            {isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Asignando descuento...
                                </>
                            ) : (
                                "Asignar Descuento"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}