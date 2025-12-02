import { ReactNode } from "react";

export default function Dialog({
	children,
	position = "left-top",
}: {
	children: ReactNode;
	position?:
		| "left-top"
		| "right-top"
		| "left-bottom"
		| "right-bottom"
		| "top"
		| "bottom"
		| "left"
		| "right";
}) {
	// Map position values to appropriate Tailwind classes
	const positionClasses = {
		"left-top": "-left-3 -top-3",
		"right-top": "left-full -top-3",
		"left-bottom": "-left-3 top-full",
		"right-bottom": "left-full top-full",
		top: "left-1/2 -translate-x-1/2 -top-3",
		bottom: "left-1/2 -translate-x-1/2 top-full",
		left: "-left-3 top-1/2 -translate-y-1/2",
		right: "left-full top-1/2 -translate-y-1/2",
	};

	// Get the appropriate positioning classes or default to left-top
	const positionClass =
		positionClasses[position] || positionClasses["left-top"];

	return (
		<span
			className={`absolute ${positionClass} bg-gray-600 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10`}
		>
			{children}
		</span>
	);
}