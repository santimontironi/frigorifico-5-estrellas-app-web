import { useContext } from "react"
import { AdminContext } from "../context/AdminContext"

const UseAdmin = () => {

    const adminContext = useContext(AdminContext)

    if(!adminContext) {
        throw new Error('useAdmin must be used within a AdminProvider')
    }

    return adminContext

}

export default UseAdmin
