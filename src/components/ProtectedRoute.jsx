import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Loader } from '../components/loader/Loader'
import { getAuth } from 'firebase/auth'

export const ProtectedRoute = ({ children, ...rest }) => {

    const { user, loading } = useAuth()
    // if (loading) return <Loader />

    const prueba = getAuth();

    if (!user) {
        return <Navigate to={`/`} replace />;
    }

    return <Outlet />;

}

export default ProtectedRoute
