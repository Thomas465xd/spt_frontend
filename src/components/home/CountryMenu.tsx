import { useCountry } from "@/hooks/useCountry";
import { Countries } from "@/types/auth";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import Flag from "react-flagpack";

export default function CountryMenu() {
	const { country, countryCode } = useCountry();

	const handleCountrySelect = (country: Countries) => {
		localStorage.setItem("country", country);
		window.location.reload();
	};

	return (
		<Menu as="div" className="relative inline-block">
			<MenuButton
				className="
                    inline-flex items-center w-full justify-center gap-x-1.5 rounded-md px-3 py-2 
                    text-sm font-semibold inset-ring-1 bg-white/10 text-white shadow-none 
                    inset-ring-white/5 hover:bg-white/20
                "
			>
				<Flag
					code={countryCode}
					gradient="real-linear"
					size="m"
					hasDropShadow
				/>

				{country}

				<ChevronDownIcon
					aria-hidden="true"
					className="-mr-1 size-5 text-slate-500"
				/>
			</MenuButton>

			<MenuItems
				transition
				className="
                    absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-white/10 rounded-md 
                    bg-slate-800 shadow-none outline-1 -outline-offset-1 outline-white/10 transition 
                    data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 
                    data-enter:ease-out data-leave:duration-75 data-leave:ease-in
                "
			>
				<div className="py-1">
					<MenuItem>
						<button
							onClick={() => handleCountrySelect(Countries.Chile)}
							className="space-x-2 group w-full flex items-center px-4 py-2 text-sm text-slate-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
						>
							<Flag
								code="CL"
								gradient="real-linear"
								size="m"
								hasDropShadow
							/>
							<span>Chile</span>
						</button>
					</MenuItem>
					<MenuItem>
						<button
							onClick={() => handleCountrySelect(Countries.Peru)}
							className="space-x-2 group w-full flex items-center px-4 py-2 text-sm text-slate-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
						>
							<Flag
								code="PE"
								gradient="real-linear"
								size="m"
								hasDropShadow
							/>
							<span>Perú</span>
						</button>
					</MenuItem>
				</div>
			</MenuItems>
		</Menu>
	);
}
