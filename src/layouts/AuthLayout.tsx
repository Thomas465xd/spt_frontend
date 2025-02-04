import { Outlet } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import { ToastContainer } from "react-toastify";
import Footer from "@/components/ui/Footer";

export default function AuthLayout() {
    return (
        <>
            <div className="bg-orange-500 min-h-screen flex items-center justify-center px-6">
                <div className="py-10 lg:py-20 mx-auto w-full max-w-md md:max-w-2xl 2xl:max-w-4xl">
                    <div className="flex justify-center">
                        <Logo />
                    </div>

                    <div className="">
                        <Outlet />
                    </div>
                </div>
            </div>

            <Footer />

            <ToastContainer
                position="top-right"
                autoClose={4000}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
            /> 
        </>
    )
}
