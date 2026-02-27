import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

export default function LoginView() {


    return (
        <>
            <h1 className="text-5xl font-black text-white">Iniciar Sesión</h1>
            <p className="text-2xl font-light text-white mt-5 mb-5">
                Bienvenido a Portal Spare Parts Trade
            </p>

            <LoginForm />

            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to={"/auth/register"}
                    className="text-center text-white hover:text-slate-300 transition-colors"
                >
                    ¿Aún no tienes una Cuenta? <span className="font-bold">Registrate</span>
                </Link>

                <Link
                    to={"/auth/forgot-password"}
                    className="text-center text-white hover:text-slate-300 transition-colors"
                >
                    ¿Olvidaste tu Contraseña? <span className="font-bold">Restablecela aquí</span>
                </Link>
            </nav>
        </>
    )
}
