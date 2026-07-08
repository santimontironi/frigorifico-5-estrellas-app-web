import type { ReactNode } from "react";
import UseAuth from "../../hooks/UseAuth";
import Loader from "../ui/Loader";
import { Navigate } from "react-router-dom"

interface VerifyAuthProps {
    children: ReactNode,
    roles: Array<'admin' | 'user' | 'employee'>
}

const VerifyAuth = ({ children, roles }: VerifyAuthProps) => {

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

    if(!roles.includes(auth.role)){
        return <Navigate to={auth.role === 'user' ? '/panel-usuario' : '/panel-admin'} />
    }

    return (
        children
    )
}

export default VerifyAuth