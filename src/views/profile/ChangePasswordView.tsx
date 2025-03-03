import ChangePasswordForm from "@/components/profile/ChangePasswordForm"

export default function ChangePasswordView() {
    return (
        <>
            <div className="mx-auto max-w-3xl">

                <h1 className="text-5xl font-black text-center border-b border-gray-300 pb-5">Actualizar tu Contraseña</h1>
                <p className="text-2xl font-light text-gray-500 mt-5 text-center">Completa este formulario para actualizar tu contraseña. Recuerda usar caracteres especiales como @, #, !, etc...</p>

                <ChangePasswordForm />
            </div>
        </>
    )
}
