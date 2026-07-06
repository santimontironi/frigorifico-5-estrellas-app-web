import type { ProfileResponse } from "../../types/auth.types"
import { useForm } from "react-hook-form"

interface MyProfileProps {
  profile: ProfileResponse | null
}

const MyProfile = ({profile} : MyProfileProps) => {

  const {register, handleSubmit, formState:{errors}, reset} = useForm()

  return (
    <div>MyProfile</div>
  )
}

export default MyProfile