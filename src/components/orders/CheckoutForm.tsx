import { AuthUser, CartDetailData, UserCheckoutForm } from "@/types/index";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ui/ErrorMessage";
import { formatToCLP } from "@/utilities/price";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";

type CheckoutFormProps = {
	cartDetails: CartDetailData[];
	user: AuthUser;
};

export default function CheckoutForm({ cartDetails, user }: CheckoutFormProps) {
	const initialValue: UserCheckoutForm = {
		code: user.rut,
		generateDocument: 1,
		clientName: user.name,
		clientLastName: "...",
		clientEmail: user.email,
		clientPhone: user.phone,
		ptId: 2,
		payProcess: "for_validate",
		clientCountry: "Chile",
		clientState: "",
		clientCityZone: "",
		clientStreet: user.address,
		clientPostcode: "",
		clientBuildingNumber: "",
		cartDetails: cartDetails,
		extrasUserData: {
			user_rut: user.rut,
			razon_social: user.businessName,
			direccion: user.address,
			comuna: "",
		},
		isDispatch: true,
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm({
		defaultValues: initialValue,
	});

	useEffect(() => {
		setValue("cartDetails", cartDetails);
	}, [cartDetails, setValue]);

	const navigate = useNavigate();

	const isDispatch = watch("isDispatch"); // Estado controlado por react-hook-form

	const handleCancel = () => {
		Swal.fire({
			title: "¿Estas Seguro de esta Acción? ⚠️",
			text: "Al Cancelar la Orden todos los datos agregados al formulario se perderan",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Cancelar",
			cancelButtonText: "No, Volver",
		}).then((result) => {
			if (result.isConfirmed) {
				navigate("/cart");
			}
		});
	};

const handleCheckout = (formData: UserCheckoutForm) => {
    // Convert the submitted value to a boolean
    //@ts-expect-error //!BUG with Checkboxes
    const isDispatch = formData.isDispatch === "true";
    //console.log(isDispatch, typeof isDispatch); // ✅ Boolean

    // Exclude isDispatch before sending data
    const { isDispatch: _, ...apiData } = formData;

    const finalData = isDispatch
        ? { ...apiData, marketId: 1, withdrawStore: 1, shippingCost: 0 } // Dispatch data
        : { ...apiData, pickStoreId: 1, marketId: 1, withdrawStore: 1, shippingCost: 0 }; // Withdrawal data

    //console.log(finalData); // ✅ No isDispatch in the API payload

    
};

	// Calculate order total
	const subtotal = cartDetails.reduce(
		(sum, item) => sum + item.cd_sub_total,
		0
	);
	const iva = Math.round(subtotal * 0.19); // 19% IVA in Chile
	const total = subtotal + iva;

	return (
		<div className="mx-auto max-w-xl px-4 lg:px-0">
			<form
				className="mt-10 space-y-5 bg-white shadow-lg rounded-lg p-6 lg:p-10 border border-gray-200"
				noValidate
				onSubmit={handleSubmit(handleCheckout)}
			>
				{/* Agrupamos los inputs en un grid para mayor responsividad */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="space-y-2">
						<label
							htmlFor="clientName"
							className="text-sm font-bold"
						>
							Nombre
						</label>
						<input
							type="text"
							id="clientName"
							placeholder="Tu Nombre"
							className="w-full p-3 rounded border border-gray-300"
							{...register("clientName", {
								required: "El nombre es requerido (*)",
							})}
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="razon_social"
							className="text-sm font-bold"
						>
							Nombre de la Empresa
						</label>
						<input
							type="text"
							id="razon_social"
							placeholder="El nombre de la empresa"
							className="w-full p-3 rounded border border-gray-300"
							{...register("extrasUserData.razon_social", {
								required:
									"El nombre de la empresa es requerido (*)",
							})}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="space-y-2">
						<label htmlFor="code" className="text-sm font-bold">
							RUT de registro
						</label>
						<input
							type="text"
							disabled
							id="code"
							placeholder={user.rut}
							className="w-full p-3 rounded border border-gray-300 bg-gray-100"
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="businessRut"
							className="text-sm font-bold"
						>
							RUT de la Empresa
						</label>
						<input
							type="text"
							disabled
							id="businessRut"
							placeholder={user.businessRut}
							className="w-full p-3 rounded border border-gray-300 bg-gray-100"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="space-y-2">
						<label
							htmlFor="clientEmail"
							className="text-sm font-bold"
						>
							Email
						</label>
						<input
							type="clientEmail"
							id="clientEmail"
							placeholder="Tu Email"
							className="w-full p-3 rounded border border-gray-300"
							{...register("clientEmail", {
								required: "El Email no puede ir vacío (*)",
								pattern: {
									value: /\S+@\S+\.\S+/,
									message: "El Email no es válido",
								},
							})}
						/>
					</div>

					<div className="space-y-2">
						<label
							htmlFor="clientPhone"
							className="text-sm font-bold"
						>
							Número de Teléfono
						</label>
						<input
							type="text"
							id="clientPhone"
							placeholder="Tu Número de Teléfono"
							className="w-full p-3 rounded border border-gray-300"
							{...register("clientPhone", {
								required: "El Teléfono no puede ir vacío (*)",
								pattern: {
									value: /^(\+56\s?9\d{8}|9\d{8})$/,
									message:
										"Formato de teléfono inválido. Ejemplo: +56912345678 o 912345678",
								},
							})}
						/>
						{errors.clientPhone && (
							<ErrorMessage mini>
								{errors.clientPhone.message}
							</ErrorMessage>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="country" className="text-sm font-bold">
							País
						</label>
						<input
							type="text"
							disabled
							id="country"
							placeholder="Chile 🆑"
							className="w-full p-3 rounded border border-gray-300 bg-gray-100"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="region" className="text-sm font-bold">
							Región
						</label>
						<select
							id="region"
							className="w-full p-3 rounded border border-gray-300"
							{...register("clientState", {
								required: "La Región no puede ir vacía (*)",
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
						{errors.clientState && (
							<ErrorMessage mini>
								{errors.clientState.message}
							</ErrorMessage>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="city" className="text-sm font-bold">
							Ciudad
						</label>
						<input
							type="text"
							id="city"
							placeholder="Tu Ciudad"
							className="w-full p-3 rounded border border-gray-300"
							{...register("clientCityZone", {
								required: "La Ciudad no puede ir vacía (*)",
							})}
						/>
						{errors.clientCityZone && (
							<ErrorMessage mini>
								{errors.clientCityZone.message}
							</ErrorMessage>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="comuna" className="text-sm font-bold">
							Comuna
						</label>
						<input
							type="text"
							id="comuna"
							placeholder="Tu Comuna"
							className="w-full p-3 rounded border border-gray-300"
							{...register("extrasUserData.comuna", {
								required: "La Comuna no puede ir vacía (*)",
							})}
						/>
						{errors.extrasUserData?.comuna && (
							<ErrorMessage mini>
								{errors.extrasUserData?.comuna.message}
							</ErrorMessage>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<label htmlFor="address" className="text-sm font-bold">
						Dirección
					</label>
					<input
						type="text"
						id="address"
						placeholder="Tu Dirección (ej. Calle ### Condominio X Casa 1)"
						className="w-full p-3 rounded border border-gray-300"
						{...register("clientStreet", {
							required: "La Dirección no puede ir vacía (*)",
						})}
					/>
					{errors.clientStreet && (
						<ErrorMessage mini>
							{errors.clientStreet.message}
						</ErrorMessage>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="space-y-2">
						<label
							htmlFor="reference"
							className="text-sm font-bold"
						>
							Referencia
						</label>
						<input
							type="text"
							id="reference"
							placeholder="Número de Depto. u Oficina Ej. 101 Torre B"
							className="w-full p-3 rounded border border-gray-300"
							{...register("clientBuildingNumber", {
								required: "La Referencia no puede ir vacía (*)",
							})}
						/>
						{errors.clientBuildingNumber && (
							<ErrorMessage mini>
								{errors.clientBuildingNumber.message}
							</ErrorMessage>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="postcode" className="text-sm font-bold">
							Código Postal
						</label>
						<input
							type="number"
							id="postcode"
							placeholder="Tu Código Postal"
							maxLength={7}
							className="w-full p-3 rounded border border-gray-300"
							{...register("clientPostcode", {
								required:
									"El Código Postal no puede ir vacío (*)",
								pattern: {
									value: /^[0-9]{7}$/,
									message:
										"Formato de Código Postal inválido. Máximo 7 dígitos",
								},
							})}
						/>
						{errors.clientPostcode && (
							<ErrorMessage mini>
								{errors.clientPostcode.message}
							</ErrorMessage>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-bold">
						Método de Entrega
					</label>
					<div className="flex items-center justify-between my-6">
						{/* Retiro Option */}
						<label className="flex items-center space-x-2 cursor-pointer">
							<input
								type="radio"
								{...register("isDispatch", {
									required:
										"Debe seleccionar un método de entrega",
								})}
								checked={isDispatch === false}
								onChange={() => setValue("isDispatch", false)}
                                value="false"
								className="w-5 h-5 text-blue-500 focus:ring-blue-500 border-gray-300"
							/>
							<span
								className={`text-sm font-medium ${
									!isDispatch
										? "text-gray-900"
										: "text-gray-500"
								}`}
							>
								Retiro
							</span>
						</label>

						{/* Despacho Option */}
						<label className="flex items-center space-x-2 cursor-pointer">
							<input
								type="radio"
								{...register("isDispatch", {
									required:
										"Debe seleccionar un método de entrega",
								})}
								checked={isDispatch === true}
								onChange={() => setValue("isDispatch", true)}
                                value="true"
								className="w-5 h-5 text-blue-500 focus:ring-blue-500 border-gray-300"
							/>
							<span
								className={`text-sm font-medium ${
									isDispatch
										? "text-gray-900"
										: "text-gray-500"
								}`}
							>
								Despacho
							</span>
						</label>
					</div>

					{/* Error message if no selection is made */}
					{errors.isDispatch && (
						<p className="text-red-500 text-sm">
							{errors.isDispatch.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<h3 className="text-sm font-bold text-orange-500 underline">
						Resumen:{" "}
					</h3>
					<div className="space-y-2 border border-gray-300 p-2 rounded">
						{isDispatch && (
							<div className="flex justify-between">
								<span className="text-sm font-bold">Envio</span>
								<span className="text-sm font-bold text-green-500">
									Gratis
								</span>
							</div>
						)}

						<div className="flex justify-between">
							<span className="text-sm font-bold">Subtotal</span>
							<span className="text-sm font-bold">
								{formatToCLP(subtotal)}
							</span>
						</div>

						<div className="flex justify-between">
							<span className="text-sm font-bold">IVA</span>
							<span className="text-sm font-bold">
								{formatToCLP(iva)}
							</span>
						</div>

						<div className="flex justify-between border-t border-gray-300 pt-2">
							<span className="text-sm font-bold">Total</span>
							<span className="text-sm font-bold text-orange-500">
								{formatToCLP(total)}
							</span>
						</div>
					</div>
				</div>

				<input type="hidden" {...register("cartDetails")} />

				<div className="flex gap-5">
					<button
						type="submit"
						disabled={false}
						className="bg-orange-500 w-full rounded p-3 text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
					>
						{false ? "Guardando..." : "Generar Orden"}
					</button>

					<button
						type="button"
						className="bg-red-600 w-full rounded p-3 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
						onClick={handleCancel}
					>
						Cancelar
					</button>
				</div>
			</form>
		</div>
	);
}
