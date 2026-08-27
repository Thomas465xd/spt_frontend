import { getUser } from "@/api/AdminAPI";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
	const { data, isError, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: getUser,
		retry: 1,
		refetchOnWindowFocus: false,
	});

	//^ Set country
	if (!localStorage.getItem("country")) {
		localStorage.setItem("country", data?.country || "");
	}

	return { data, isError, isLoading };
};
