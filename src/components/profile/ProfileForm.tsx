import { AuthUser, CountryEnum, UserProfileForm } from "@/types/index"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "@/api/ProfileAPI"
import { toast } from "react-toastify"
import ErrorMessage from "../ui/ErrorMessage"
import Swal from "sweetalert2"
import Flag from "react-flagpack"
import { useState } from "react"
import { formatPhone, getPhoneConfig } from "@/utilities/phone"
import { privacyPolicyContent } from "@/components/auth/Policies"
import PolicyModal from "@/components/auth/PolicyModal"

type ProfileFormProps = {
	data: AuthUser
}

export default function ProfileForm({ data }: ProfileFormProps) {
	const [openPolicy, setOpenPolicy] = useState<"privacy" | null>(null);
	const phoneConfig = getPhoneConfig(data.country as CountryEnum);

	const { register, handleSubmit, setValue, formState: { errors } } = useForm<UserProfileForm>({
		defaultValues: {
			name: data.name,
			businessName: data.businessName,
			email: data.email,
			phone: data.phone,
			address: data.address,
		}
	});

	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: updateProfile,
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			toast.success(data.message);
		}
	});

	const handleEditProfile = (formData: UserProfileForm) => {
		Swal.fire({
			title: "¿Revisaste los Datos Ingresados?",
			text: "¿Estás seguro de los cambios a realizar en tu perfil?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sí, Actualizar ✅",
			cancelButtonText: "No, Cancelar",
		}).then((result) => {
			if (result.isConfirmed) {
				mutate(formData);
			}
		});
	};

	return (
		<>
			<div className="mx-auto max-w-xl px-4 lg:px-0">
				<h1 className="text-5xl font-black text-center border-b border-gray-300 pb-5">Mi Perfil</h1>
				<p className="text-lg font-light text-gray-500 mt-3 text-center">
					Usa este formulario para actualizar tus datos de registro
				</p>

				<form
					className="mt-10 space-y-5 bg-white shadow-lg rounded-lg p-6 lg:p-10 border border-gray-200"
					noValidate
					onSubmit={handleSubmit(handleEditProfile)}
				>
					{/* Name & Business Name */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div className="space-y-2">
							<label htmlFor="name" className="label">Nombre</label>
							<input
								type="text"
								id="name"
								placeholder="Tu Nombre"
								className="input"
								{...register("name", { required: "El Nombre no puede ir vacío" })}
							/>
							{errors.name && <ErrorMessage mini>{errors.name.message}</ErrorMessage>}
						</div>

						<div className="space-y-2">
							<label htmlFor="businessName" className="label">Nombre de la Empresa</label>
							<input
								type="text"
								id="businessName"
								placeholder="El nombre de la empresa"
								className="input"
								{...register("businessName", { required: "El Nombre de la Empresa no puede ir vacío" })}
							/>
							{errors.businessName && <ErrorMessage mini>{errors.businessName.message}</ErrorMessage>}
						</div>
					</div>

					{/* Read-only identity fields */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						<div className="space-y-2">
							<label className="label">País</label>
							<input
								type="text"
								disabled
								value={data.country}
								className="input bg-gray-100 cursor-not-allowed"
							/>
						</div>
						<div className="space-y-2">
							<label className="label">ID Personal</label>
							<input
								type="text"
								disabled
								value={data.personalId}
								className="input bg-gray-100 cursor-not-allowed"
							/>
						</div>
						<div className="space-y-2">
							<label className="label">ID Empresa</label>
							<input
								type="text"
								disabled
								value={data.businessId}
								className="input bg-gray-100 cursor-not-allowed"
							/>
						</div>
					</div>
					<p className="text-xs text-gray-400">País, ID Personal e ID de Empresa no pueden modificarse.</p>

					{/* Email & Phone */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div className="space-y-2">
							<label htmlFor="email" className="label">Email</label>
							<input
								type="email"
								id="email"
								placeholder="Tu Email"
								className="input"
								autoCorrect="off"
								autoCapitalize="none"
								{...register("email", {
									required: "El Email no puede ir vacío",
									pattern: {
										value: /\S+@\S+\.\S+/,
										message: "El Email no es válido",
									},
								})}
							/>
							{errors.email && <ErrorMessage mini>{errors.email.message}</ErrorMessage>}
						</div>

						<div className="space-y-2">
							<label htmlFor="phone" className="label">Celular</label>
							<div className="flex items-stretch border border-gray-300 rounded mt-1 w-full overflow-hidden focus-within:ring-1 focus-within:ring-orange-400 focus-within:border-orange-400">
								<div className="flex items-center gap-1.5 px-3 bg-gray-50 border-r border-gray-300 shrink-0">
									<Flag code={phoneConfig.flagCode} size="m" />
									<span className="text-sm font-medium text-gray-600">{phoneConfig.code}</span>
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
											const formatted = formatPhone(e.target.value, data.country as CountryEnum);
											e.target.value = formatted;
											setValue("phone", formatted, { shouldValidate: true });
										},
									})}
								/>
							</div>
							{errors.phone && <ErrorMessage mini>{errors.phone.message}</ErrorMessage>}
						</div>
					</div>

					{/* Address */}
					<div className="space-y-2 border-b border-gray-400 pb-8">
						<label htmlFor="address" className="label">Dirección</label>
						<input
							type="text"
							id="address"
							placeholder="Tu Dirección (ej. Calle ### Condominio X Casa 1)"
							className="input"
							{...register("address", { required: "Tu Dirección no puede ir vacía" })}
						/>
						{errors.address && <ErrorMessage mini>{errors.address.message}</ErrorMessage>}
					</div>

					{/* Privacy Policy link */}
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-400">
							<span className="text-red-500">*</span> Tus datos son almacenados de manera segura.
						</p>
						<button
							type="button"
							className="text-sm font-bold text-orange-500 hover:text-orange-600 underline transition-colors duration-200"
							onClick={() => setOpenPolicy("privacy")}
						>
							Ver Política de Privacidad
						</button>
					</div>

					<button
						type="submit"
						disabled={isPending}
						className="bg-orange-500 w-full rounded p-3 text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isPending ? "Guardando..." : "Guardar Cambios"}
					</button>
				</form>
			</div>

			<PolicyModal
				isOpen={openPolicy === "privacy"}
				title="Política de Privacidad"
				content={privacyPolicyContent}
				onClose={() => setOpenPolicy(null)}
			/>
		</>
	);
}
