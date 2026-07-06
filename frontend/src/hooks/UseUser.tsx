import { useContext } from "react"
import { UserContext } from "../context/UserContext"

const UseUser = () => {

    const userContext = useContext(UserContext)

    if (!userContext) {
        throw new Error('useUser must be used within a UserProvider')
    }

    return userContext

}

export default UseUser
