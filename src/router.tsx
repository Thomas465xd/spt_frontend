import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthView from "./views/AuthView";
import ClientView from "./views/ClientView";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<ClientView />} index />
                </Route>
                <Route element={<AppLayout />}>
                    <Route path="/auth" element={<AuthView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}