"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface BackToTopButtonProps {
	showAfter?: number; // Scroll distance before showing (default: viewport height)
	className?: string; // Custom className for styling overrides
}

export default function BackToTopButton({
	showAfter,
	className,
}: BackToTopButtonProps = {}) {
	const [showButton, setShowButton] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const threshold = showAfter ?? window.innerHeight;

			if (scrollY > threshold && !showButton) {
				setShowButton(true);
				// Small delay to trigger CSS animation
				setTimeout(() => setIsVisible(true), 10);
			} else if (scrollY <= threshold && showButton) {
				setIsVisible(false);
				// Hide after animation completes
				setTimeout(() => setShowButton(false), 300);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [showButton, showAfter]);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	if (!showButton) return null;

	return (
		<button
			onClick={scrollToTop}
			className={`
                    fixed bottom-6 right-6 z-50 
                    bg-slate-700 hover:bg-slate-800 
                    text-white p-3 rounded-full 
                    shadow-lg hover:shadow-xl
                    transition-all duration-300 ease-out
                    transform hover:scale-110
                    focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
                    dark:focus:ring-offset-gray-800
                    ${
						isVisible
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-4 pointer-events-none"
					}
                    ${className || ""}
                    
            `.trim()}
			aria-label="Back to top"
			title="Back to top"
		>
			<ArrowUp className="w-5 h-5" />
		</button>
	);
}
