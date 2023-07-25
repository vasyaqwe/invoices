import { Navigate, Route, Routes } from "react-router-dom"
import { PersistLogin } from "./wrappers/PersistLogin"
import { RequireAuth } from "./wrappers/RequireAuth"
import { Dashboard } from "./pages/Dashboard"
import { Layout } from "./layout/Layout"
import { Invoice } from "./pages/Invoice"
import { Login } from "./pages/Login"
import { SignUp } from "./pages/SignUp"

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Layout />}
            >
                <Route
                    path="signup"
                    element={<SignUp />}
                />
                <Route
                    path="login"
                    element={<Login />}
                />

                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth />}>
                        <Route
                            index
                            element={<Dashboard />}
                        />
                        <Route
                            path="/invoices/:id"
                            element={<Invoice />}
                        />
                    </Route>
                </Route>

                <Route
                    path="*"
                    element={<Navigate to={"/"} />}
                />
            </Route>
        </Routes>
    )
}

export default App
