import { useNavigate } from "react-router-dom";
import {
	CountryEnum,
	IdentificationsEnum,
	UserRegistrationForm,
} from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {
	formatId,
	getCountryForIdType,
	getIdLabels,
	getMaxLength,
	getValidation,
	ID_TYPES,
} from "@/utilities/identification";
import { formatPhone, getPhoneConfig } from "@/utilities/phone";
import Flag from "react-flagpack";
import { useState } from "react";
import { privacyPolicyContent } from "./Policies";
import PolicyModal from "./PolicyModal";

export default function RegisterForm() {
	//^ Policy Modals State
	const [openPolicy, setOpenPolicy] = useState<"privacy" | null>(null);

	const initialValues: UserRegistrationForm = {
		name: "",
		businessName: "",
		idType: "RUT",
		country: "Chile",
		personalId: "",
		businessId: "",
		email: "",
		phone: "",
		address: "",
	};

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<UserRegistrationForm>({ defaultValues: initialValues });
	const navigate = useNavigate();

	const [acceptedPolicy, setAcceptedPolicy] = useState(false);
	const [policyError, setPolicyError] = useState(false);
	const selectedIdType = watch("idType") as IdentificationsEnum;
	const selectedCountry = (watch("country") || "Chile") as CountryEnum;
	const idLabels = getIdLabels(selectedIdType);
	const validation = getValidation(selectedIdType);
	const phoneConfig = getPhoneConfig(selectedCountry);

	const { mutate, isPending } = useMutation({
		mutationFn: createAccount,
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: () => {
			Swal.fire({
				title: "Cuenta Registrada Correctamente",
				text: "Serás Contactado por el Administrador en caso de ser aprobado. Se ha enviado un correo de seguimiento a tu Email.",
				icon: "success",
			});
			reset();
			navigate("/auth/login");
		},
	});

	const handleRegister = (formData: UserRegistrationForm) => {
		if (!acceptedPolicy) {
			setPolicyError(true);
			return;
		}
		mutate(formData);
	};

	const handleIdTypeChange = (newIdType: IdentificationsEnum) => {
		setValue("idType", newIdType);
		setValue("country", getCountryForIdType(newIdType));
		setValue("personalId", "", { shouldValidate: false });
		setValue("businessId", "", { shouldValidate: false });
		setValue("phone", "", { shouldValidate: false });
	};

	return (
		<>
			<form
				className="form"
				noValidate
				onSubmit={handleSubmit(handleRegister)}
			>
				{/* Agrupamos los inputs en un grid para mayor responsividad */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="space-y-2">
						<label htmlFor="name" className="label">
							Nombre y Apellido
						</label>
						<input
							type="text"
							id="name"
							placeholder="Ej. John Doe"
							className="input"
							{...register("name", {
								required: "El Nombre no puede ir vacío",
							})}
						/>
						{errors.name && (
							<ErrorMessage mini>
								{errors.name.message}
							</ErrorMessage>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="businessName" className="label">
							Nombre de Empresa
						</label>
						<input
							type="text"
							id="businessName"
							placeholder="Ej. Car Company & Co."
							className="input"
							{...register("businessName", {
								required:
									"El Nombre de la Empresa no puede ir vacío",
							})}
						/>
						{errors.businessName && (
							<ErrorMessage mini>
								{errors.businessName.message}
							</ErrorMessage>
						)}
					</div>
				</div>

				{/* ID Type & Country */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="space-y-2">
						<label htmlFor="idType" className="label">
							Tipo de Identificación
						</label>
						<select
							id="idType"
							className="input"
							{...register("idType", {
								required:
									"El tipo de identificación es obligatorio",
								onChange: (e) =>
									handleIdTypeChange(
										e.target.value as IdentificationsEnum,
									),
							})}
						>
							{ID_TYPES.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
						{errors.idType && (
							<ErrorMessage mini>
								{errors.idType.message}
							</ErrorMessage>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="country" className="label">
							País
						</label>
						<input
							type="text"
							id="country"
							className="input bg-gray-100 cursor-not-allowed"
							disabled
							{...register("country", {
								required: "El país es obligatorio",
							})}
						/>
						{errors.country && (
							<ErrorMessage mini>
								{errors.country.message}
							</ErrorMessage>
						)}
					</div>
				</div>

				{/* Personal & Business ID */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="space-y-2">
						<label htmlFor="personalId" className="label">
							{idLabels.personal}
						</label>
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
									message: validation.message,
								},
								onChange: (e) => {
									const formatted = formatId(
										e.target.value,
										selectedIdType,
									);
									setValue("personalId", formatted, {
										shouldValidate: true,
									});
								},
							})}
						/>
						{errors.personalId && (
							<ErrorMessage mini>
								{errors.personalId.message}
							</ErrorMessage>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="businessId" className="label">
							{idLabels.business}
						</label>
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
									message: validation.message,
								},
								onChange: (e) => {
									const formatted = formatId(
										e.target.value,
										selectedIdType,
									);
									setValue("businessId", formatted, {
										shouldValidate: true,
									});
								},
							})}
						/>
						{errors.businessId && (
							<ErrorMessage mini>
								{errors.businessId.message}
							</ErrorMessage>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="space-y-2">
						<label htmlFor="email" className="label">
							Correo
						</label>
						<input
							type="email"
							id="email"
							placeholder="Ej. correo@correo.com"
							className="input"
							autoCorrect="off"
							autoCapitalize="none"
							{...register("email", {
								required:
									"El Correo Electrónico es obligatorio",
								pattern: {
									value: /\S+@\S+\.\S+/,
									message: "El Email no es válido",
								},
							})}
						/>
						{errors.email && (
							<ErrorMessage mini>
								{errors.email.message}
							</ErrorMessage>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="phone" className="label">
							Celular
						</label>
						<div className="flex items-stretch border border-gray-300 rounded mt-1 w-full overflow-hidden focus-within:ring-1 focus-within:ring-orange-400 focus-within:border-orange-400">
							<div className="flex items-center gap-1.5 px-3 bg-gray-50 border-r border-gray-300 shrink-0">
								<Flag code={phoneConfig.flagCode} size="m" />
								<span className="text-sm font-medium text-gray-600">
									{phoneConfig.code}
								</span>
							</div>
							<input
								type="text"
								id="phone"
								placeholder={phoneConfig.placeholder}
								className="flex-1 p-3 outline-none bg-white text-sm"
								maxLength={phoneConfig.maxLength}
								{...register("phone", {
									required: "El Teléfono es obligatorio",
									pattern: {
										value: phoneConfig.pattern,
										message: phoneConfig.message,
									},
									onChange: (e) => {
										const formatted = formatPhone(
											e.target.value,
											selectedCountry,
										);
										e.target.value = formatted;
										setValue("phone", formatted, {
											shouldValidate: true,
										});
									},
								})}
							/>
						</div>
						{errors.phone && (
							<ErrorMessage mini>
								{errors.phone.message}
							</ErrorMessage>
						)}
					</div>
				</div>

				<div className="space-y-2 border-b border-gray-400 pb-8">
					<label htmlFor="address" className="label">
						Dirección
					</label>
					<input
						type="text"
						id="address"
						placeholder="Tu Dirección (ej. Calle 2901 Condominio Del Bosque Casa 1)"
						className="input"
						{...register("address", {
							required: "Tu Dirección no puede ir vacía",
						})}
					/>
					{errors.address && (
						<ErrorMessage mini>
							{errors.address.message}
						</ErrorMessage>
					)}
				</div>

				{/* Privacy Policy consent */}
				<div className="space-y-3">
					<label className="flex items-start gap-3 cursor-pointer select-none">
						<input
							type="checkbox"
							className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-orange-500"
							checked={acceptedPolicy}
							onChange={(e) => {
								setAcceptedPolicy(e.target.checked);
								if (e.target.checked) setPolicyError(false);
							}}
						/>
						<span className="text-sm text-gray-600">
							He leído y acepto la{" "}
							<button
								className="font-bold text-orange-500 hover:text-orange-600 underline transition-colors duration-200 cursor-pointer"
								onClick={() => setOpenPolicy("privacy")}
							>
								Política de Privacidad
							</button>{" "}
							de Portal SPT
						</span>
					</label>
					{policyError && (
						<ErrorMessage mini>
							Debes aceptar la Política de Privacidad para
							continuar
						</ErrorMessage>
					)}
				</div>

				<p className="text-sm text-gray-400">
					<span className="text-red-500">*</span> Estos datos serán
					enviados al equipo administrativo de SPT para la
					verificación de sus datos.
				</p>

				<input
					type="submit"
					value={isPending ? "Enviando..." : "Solicitar Cuenta"}
					disabled={isPending}
					className="input-submit disabled:opacity-60 disabled:cursor-not-allowed"
				/>
			</form>

			<PolicyModal
				isOpen={openPolicy === "privacy"}
				title="Política de Privacidad"
				content={privacyPolicyContent}
				onClose={() => setOpenPolicy(null)}
			/>
		</>
	);
}
