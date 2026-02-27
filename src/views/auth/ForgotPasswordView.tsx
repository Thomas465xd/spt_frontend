import ForgotPassword from "@/components/auth/ForgotPassword";
import { Link } from "react-router-dom";


export default function ForgotPasswordView() {
    return (
        <>
            <h1 className="text-5xl font-black text-white">Reestablecer Contraseña</h1>
            <p className="text-2xl font-light text-white mt-5 mb-5">
                ¿Olvidaste tu Contraseña? Completa el formulario para {''}
                <span className=" text-white font-bold"> Reestablecerla </span>
            </p>

            <ForgotPassword />

            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to={"/auth/register"}
                    className="text-center text-white hover:text-slate-300 transition-colors"
                >
                    ¿Aún no tienes una Cuenta? <span className="font-bold">Registrate</span>
                </Link>

                <Link
                    to={"/auth/login"}
                    className="text-center text-white hover:text-slate-300 transition-colors"
                >
                    ¿Ya tienes una Cuenta? <span className="font-bold">Iniciar Sesión</span>
                </Link>
            </nav>
        </>
    )
}
