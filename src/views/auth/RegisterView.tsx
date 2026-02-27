import RegisterForm from "@/components/auth/RegisterForm";
import { Link } from "react-router-dom";


export default function RegisterView() {
    return (
        <>
            <h1 className="text-5xl font-black text-white">Registrar Cuenta</h1>
            <p className="text-2xl font-light text-white mt-5">
                Bienvenido a Portal Spare Parts Trade, por favor ingresa tus datos {''}
                <span className="font-bold">en el formulario</span>
            </p>

            <RegisterForm/>

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
