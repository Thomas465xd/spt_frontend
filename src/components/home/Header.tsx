import { Link, useLocation } from "react-router-dom";
import Logo from "../ui/Logo";
import NavMenu from "../ui/NavMenu";
import "react-flagpack/dist/style.css";
import {
	Boxes,
	ClipboardList,
	Home,
	LogOut,
	ShoppingCart,
	User2,
} from "lucide-react";
import CountryMenu from "./CountryMenu";

type HeaderProps = {
	name: string;
	onLogoutClick: () => void;
};

export default function Header({ onLogoutClick, name }: HeaderProps) {
	const location = useLocation();

	const currentPath = location.pathname;

	return (
		<header className="bg-gradient-to-r from-orange-600 to-orange-400 shadow-lg">
			<div className="max-w-screen-2xl mx-auto px-5 py-4 flex flex-col md:flex-row items-center justify-between">
				<div className="flex items-center space-x-4">
					<Link
						to={"/"}
						className="transform hover:scale-101 transition-transform duration-200"
					>
						<Logo />
					</Link>
				</div>

				<div className="mt-2 md:mt-0">
					<h1 className="text-xl md:text-2xl font-bold text-white text-center md:text-left drop-shadow-sm">
						Bienvenido a Portal Spare Parts Trade
					</h1>
				</div>

				<div className="mt-3 md:mt-0">
					<NavMenu name={name} />
				</div>
			</div>

			<nav>
				<div className="mx-auto flex flex-wrap justify-center md:justify-between bg-slate-800 w-full p-4 mt-4 md:mt-0 shadow-inner">
					<div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 ">
						<Link
							to={"/"}
							className={`group font-medium ${currentPath == "/" ? "text-orange-300" : "text-white"} hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700`}
						>
							<Home
								size={18}
								className="group-hover:-translate-y-0.5 transition-all duration-500"
							/>
							<span>Inicio</span>
						</Link>
						<Link
							to={"/profile"}
							className={`group font-medium ${currentPath == "/profile" ? "text-orange-300" : "text-white"} hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700`}
						>
							<User2
								size={18}
								className="group-hover:-translate-y-0.5 transition-all duration-500"
							/>
							<span>Perfil</span>
						</Link>
						<Link
							to={"/products"}
							className={`group font-medium ${currentPath == "/products" ? "text-orange-300" : "text-white"} hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700`}
						>
							<Boxes
								size={18}
								className="group-hover:-translate-y-0.5 transition-all duration-500"
							/>
							<span>Productos</span>
						</Link>
						<Link
							to={"/cart"}
							className={`group font-medium ${currentPath == "/cart" ? "text-orange-300" : "text-white"} hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700`}
						>
							<ShoppingCart
								size={18}
								className="group-hover:-translate-y-0.5 transition-all duration-500"
							/>
							<span>Carrito</span>
						</Link>
						<Link
							to={"/orders"}
							className={`group font-medium ${currentPath == "/orders" ? "text-orange-300" : "text-white"} hover:text-orange-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700`}
						>
							<ClipboardList
								size={18}
								className="group-hover:-translate-y-0.5 transition-all duration-500"
							/>
							<span>Ordenes</span>
						</Link>
					</div>

					<div className="flex items-center gap-4 mt-2 sm:mt-0">
						<div className="space-x-4">
							<CountryMenu />
						</div>

						<button
							className="flex gap-2 p-2 font-medium text-red-400 hover:text-red-500 transition-colors duration-300"
							type="button"
							onClick={onLogoutClick}
						>
							<LogOut />
							Cerrar Sesión
						</button>
					</div>
				</div>
			</nav>
		</header>
	);
}
