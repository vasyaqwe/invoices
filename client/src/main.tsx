import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { BrowserRouter as Router } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import { GoogleOAuthProvider } from "@react-oauth/google"
import React from "react"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="62894844956-ia6ek9m4r3rrukl45s7aq5i6b2cfpi1f.apps.googleusercontent.com">
            <QueryClientProvider client={queryClient}>
                <Router>
                    <App />
                </Router>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
)
