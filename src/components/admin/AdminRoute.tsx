import { NavLink } from "react-router-dom";

type AdminRouteProps = {
    link: {
        url: string;
        text: string;
        blank: boolean;
    };
};

export default function AdminRoute({ link }: AdminRouteProps) {
    return (
        <NavLink
            to={link.url}
            className={({ isActive }) =>
                `${isActive ? "bg-orange-600 hover:bg-orange-800 transition-colors" : ""} text-white font-bold text-lg border-t border-gray-200 p-3 last:border-b`
            }
            target={link.blank ? "_blank" : undefined}
            rel={link.blank ? "noopener noreferrer" : undefined}
        >
            {link.text}
        </NavLink>
    );
}
