import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }: {children: React.ReactElement}) {
    const accessToken = localStorage.getItem("accessToken")

    if (!accessToken) {
        return <Navigate to={"/login"}/>
    }

    return children
}