import CreateOrderForm from "@/components/orders/CreateOrderForm";
import Heading from "@/components/ui/Heading";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreateOrderView() {
    return (
        <section>
            <Heading>Registrar Orden</Heading>

            <div className="flex items-center justify-between mx-32 mt-10">
                <p className="text-gray-700 text-center">
                    Aquí puedes Registrar las Ordenes de tus clientes
                </p>

                <Link
                    to={"/admin/orders"}
                    className="flex items-center gap-2 text-orange-500 transition-colors duration-300 hover:text-orange-600"
                >
                    <ArrowLeft size={16}/>
                    Volver al Panel
                </Link>
            </div>

            <CreateOrderForm />
        </section>
    )
}
