import { ReactNode } from "react";

type ErrorMessageProps = {
	children: ReactNode;
	mini?: boolean;
};

export default function ErrorMessage({ children, mini }: ErrorMessageProps) {
	return (
		<div
			className={`text-center rounded ${mini ? "bg-transparent text-red-500 text-xs font-medium p-0 text-left my-0" : "bg-red-100 text-red-600 font-bold p-3 my-2 uppercase text-sm"}`}
		>
			{children}
		</div>
	);
}
