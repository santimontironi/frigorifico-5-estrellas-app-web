import type { ReactNode } from "react";
import UseAuth from "../../hooks/UseAuth";
import Loader from "../ui/Loader";
import { Navigate } from "react-router-dom"

interface VerifyAuthProps {
    children: ReactNode,
    role: 'admin' | 'user'
}

const VerifyAuth = ({ children, role }: VerifyAuthProps) => {

    const { auth, loading } = UseAuth()

    if(loading.me){
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
                <Loader />
            </div>
        )
    }

    if(!auth){
        return <Navigate to="/" />
    }

    if(auth.role !== role){
        return <Navigate to={auth.role === 'admin' ? '/panel-admin' : '/panel-usuario'} />
    }

    return (
        children
    )
}

export default VerifyAuth