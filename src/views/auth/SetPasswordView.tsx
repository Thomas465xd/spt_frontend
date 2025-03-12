import { validatePasswordToken } from "@/api/AuthAPI";
import SetPasswordForm from "@/components/auth/SetPasswordForm"
import Loader from "@/components/ui/Loader";
import { PasswordToken } from "@/types/index"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

export default function SetPasswordView() {

    const { token } = useParams<PasswordToken>();
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

    useEffect(() => {
        if (!token) {
            setIsValidToken(false);
            return;
        }

        // Validar el token en el backend
        validatePasswordToken(token)
            .then(setIsValidToken)
            .catch(() => setIsValidToken(false));
    }, [token]);

    if (isValidToken === null) {
        return <Loader />;
    }
    

    if(!isValidToken) {
        return (
            <>
                <h1 className="text-5xl font-black text-white">Token Invalido o Expirado</h1>
                <p className="text-2xl font-light text-white mt-5 mb-5">
                    En caso de haber pedido el token hace más de una semana {''}
                    <span className=" text-white font-bold"> Contacta al Administrador </span>
                </p>

                <div className="flex flex-col bg-white rounded p-5 shadow-md">
                    <nav className="my-10 flex flex-col space-y-4">
                    <Link
                        to={"/auth/login"}
                        className="text-center bg-slate-800 p-5  text-white hover:bg-slate-900 rounded transition-colors"
                    >
                        Volver al Login <span className="font-bold">Aqui</span>
                    </Link>

                    <Link
                        to={"/auth/register"}
                        className="text-center bg-slate-600 p-5  text-white hover:bg-slate-700 rounded transition-colors"
                    >
                        ¿Aún no te has registrado? <span className="font-bold">Registrate Aquí</span>
                    </Link>
                </nav>

                <p className="text-sm text-gray-400 border-t border-gray-400 pt-5 text-center">
                    <span className="text-red-500">*</span> En caso de que creas que esto es un error, por favor contactar al Administrador
                </p>
                </div>
            </>
        )
    }

    if(token) return (
        <>
            <h1 className="text-5xl font-black text-white">Solo un paso mas!</h1>
            <p className="text-2xl font-light text-white mt-5 mb-5">
                Completa el formulario para Establecer tu {''}
                <span className=" text-white font-bold"> Contraseña de Ingreso </span>
            </p>

            <SetPasswordForm 
                token={token}
                type="set_password"
            />
        </>
    )
}
