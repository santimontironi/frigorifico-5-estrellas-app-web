import UseAuth from "../hooks/UseAuth";
import { Navigate } from "react-router-dom"

const VerifyAuth = (children: any) => {

    const { auth, loading } = UseAuth()

    if(!auth){
        return <Navigate to="/ingreso-usuario" />
    }

    if(loading){
        return <div>Loading...</div>
    }

    return (
        {children}
    )
}

export default VerifyAuth