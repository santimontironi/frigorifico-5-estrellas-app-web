import UseAuth from "../hooks/UseAuth";
import { Navigate } from "react-router-dom"

const VerifyAuth = (children: any) => {

    const { auth, loading } = UseAuth()

    if(loading.me){
        return <div>Loading...</div>
    }

    if(!auth){
        return <Navigate to="/ingreso-usuario" />
    }

    return (
        children
    )
}

export default VerifyAuth