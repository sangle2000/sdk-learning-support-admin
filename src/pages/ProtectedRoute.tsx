import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }: {children: React.ReactElement}) {
    const accessToken = localStorage.getItem("adminAccessToken")

    if (!accessToken) {
        return <Navigate to={"/login"}/>
    }

    return children
}