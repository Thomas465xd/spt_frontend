import { Link } from "react-router-dom";

export default function ForgotPasswordView() {
    return (
        <>
            <h1 className="text-5xl font-black text-white">Reestablecer Contraseña</h1>
            <p className="text-2xl font-light text-white mt-5 mb-5">
                ¿Olvidaste tu Contraseña? Completa el formulario para {''}
                <span className=" text-white font-bold"> Reestablecerla </span>
            </p>

            <form
                onSubmit={() => {}}
                className="space-y-8 p-10  bg-white mt-10 rounded"
                noValidate
            >
                <div className="flex flex-col gap-5 border-b border-gray-400 pb-8">
                    <label
                        className="font-normal text-2xl"
                        htmlFor="email"
                    >Email</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Email de registro"
                        className="w-full p-3 border-gray-300 border"
                    />
                </div>

                <p className="text-sm text-gray-400">
                    <span className="text-red-500">*</span> Las Instrucciones se enviarán a tu correo electrónico.
                </p>

                <input
                    type="submit"
                    value='Enviar Instrucciones'
                    className="bg-slate-800 hover:bg-slate-900 rounded transition-colors w-full p-3  text-white font-black  text-xl cursor-pointer"
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
                    to={"/auth/login"}
                    className="text-center text-white hover:text-slate-300 transition-colors"
                >
                    ¿Ya tienes una Cuenta? <span className="font-bold">Iniciar Sesión</span>
                </Link>
            </nav>
        </>
    )
}
