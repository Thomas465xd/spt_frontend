export default function HomeLoader() {
	return (
		<div className="fixed inset-0 flex justify-center items-center bg-black transition-opacity duration-500 opacity-100 z-50">
			<div className="border-t-4 border-orange-600 border-solid rounded-full w-10 h-10 animate-spin"></div>
		</div>
	);
}
