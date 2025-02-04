import { Link } from "react-router-dom"

export default function LoginView() {

    const handleLogin = () => {

    }

    return (
        <>
            <h1 className="text-5xl font-black text-white">Iniciar Sesión</h1>
            <p className="text-2xl font-light text-white mt-5 mb-5">
                Bienvenido a Portal Spare Parts Trade
            </p>

            <form 
                className="bg-white shadow-md rounded space-y-8 p-10"
                onSubmit={() => handleLogin()}
                noValidate
            >
                <div className="flex flex-col gap-5">
                    <label 
                        className="font-normal text-2xl"
                    >
                        Email
                    </label>
                    <input 
                        type="email"
                        placeholder="Ingresa el Email de tu usuario"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
                    />
                </div>

                <div className="flex-flex-col-gap-5 border-b border-gray-400 pb-8">
                    <label
                        className="font-normal text-2xl"
                    >
                        Contraseña
                    </label>
                    <input 
                        type="text"
                        placeholder="Ingresa tu Contraseña"
                        className="border border-gray-300 w-full p-3 mt-3 bg-gray-50 rounded"
                    />
                </div>

                <p className="text-sm text-gray-400">
                    <span className="text-red-500">*</span> Para iniciar sesión su cuenta debe estar confirmada y tener la contraseña configurada.
                </p>

                <input 
                    type="submit"
                    value="Iniciar Sesión"
                    className="bg-slate-800 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-slate-900 transition-colors"
                />
            </form>

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
