export default function Footer() {
    return (
        <footer className="bg-slate-800 py-4">
            <div className="max-w-screen-2xl mx-auto text-center text-white">
                <p className="text-sm">
                    Todos los derechos reservados Spare Parts Trade &copy;{" "}
                    <span className="font-bold">{new Date().getFullYear()}</span>
                </p>
            </div>
        </footer>
    )
}
