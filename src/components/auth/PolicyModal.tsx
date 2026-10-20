import { X } from "lucide-react";
import { useEffect } from "react";

type PolicyModalProps = {
	isOpen: boolean;
	title: string;
	content: React.ReactNode;
	onClose: () => void;
};

export default function PolicyModal({
	isOpen,
	title,
	content,
	onClose,
}: PolicyModalProps) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	return (
		<>
			{/* Backdrop */}
			<div
				className={`
                    ${
						isOpen
							? "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 p-8"
							: "fixed opacity-0"
					}
                `}
				onClick={onClose}
				role="button"
				tabIndex={0}
				aria-label="Cerrar modal"
			>
				{/* Modal */}
				<div className="flex-center">
					<div
						className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 p-6 flex items-center justify-between border-b border-orange-400">
							<h2 className="text-xl font-bold text-white">
								{title}
							</h2>
							<button
								onClick={onClose}
								className="p-2 hover:bg-orange-700 rounded-lg transition-colors duration-200"
								aria-label="Cerrar modal"
							>
								<X size={20} className="text-white" />
							</button>
						</div>

						{/* Content */}
						<div className="p-6 text-gray-700 space-y-4 text-sm leading-relaxed">
							{content}
						</div>

						{/* Footer */}
						<div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 flex justify-end gap-3">
							<button
								onClick={onClose}
								className="button duration-100"
							>
								Entendido
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
