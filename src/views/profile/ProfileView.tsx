import ProfileForm from "@/components/profile/ProfileForm";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function ProfileView() {
    const { data, isLoading, isError } = useAuth()

    if(isLoading) return <Loader />
    if(isError) return <Navigate to="/auth/login" replace />
    if(data) return <ProfileForm data={data} />
}
