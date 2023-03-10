import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Loader } from '../components/loader/Loader'

export const ProtectedRoute = ({ children, ...rest }) => {

    const { user, loading } = useAuth()

    if (loading) return <Loader />

    if (!user) {
        return <Navigate to={`/`} replace />;
    }

    return (children)

}

export default ProtectedRoute
