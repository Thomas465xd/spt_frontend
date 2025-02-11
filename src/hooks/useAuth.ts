import { getUser } from "@/api/AdminAPI"
import { useQuery } from "@tanstack/react-query"

export const useAuth = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        retry: 1, 
        refetchOnWindowFocus: false,
    });

    //console.log(data);

    return { data, isError, isLoading };
}