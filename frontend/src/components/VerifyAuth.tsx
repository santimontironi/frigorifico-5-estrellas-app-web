import type { ReactNode } from "react";
import UseAuth from "../hooks/UseAuth";
import { Navigate } from "react-router-dom"

interface VerifyAuthProps {
    children: ReactNode;
    role?: 'user' | 'admin';
}

const VerifyAuth = ({ children, role }: VerifyAuthProps) => {

    const { auth, loading } = UseAuth()

    if (loading.me) {
        return <div>Loading...</div>
    }

    if (!auth) {
        return <Navigate to="/ingreso-usuario" />
    }

    if (role && auth.role !== role) {
        return <Navigate to={auth.role === 'admin' ? '/dashboard-admin' : '/dashboard-usuario'} />
    }

    return <>{children}</>
}

export default VerifyAuth