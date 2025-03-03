import ExtraProfileForm from "@/components/profile/ExtraProfileForm";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function ExtraProfileView() {

    const { data, isLoading, isError } = useAuth();

    if(isLoading) return <Loader />
    if(isError) return <Navigate to="/auth/login" replace />

    if(data) return (
        <>
            <div className="mx-auto max-w-3xl">

                <h1 className="text-5xl font-black text-center border-b border-gray-300 pb-5">Información de Envío 🚚</h1>
                <p className="text-2xl font-light text-gray-500 mt-5 text-center">Completa este formulario para actualizar o establecer tu información de envío de manera segura</p>

                <ExtraProfileForm
                    data={data}
                />
            </div>
        </>
    )
}
