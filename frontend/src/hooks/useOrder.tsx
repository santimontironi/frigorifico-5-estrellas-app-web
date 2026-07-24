import { useContext } from "react"
import { OrderContext } from "../context/OrderContext"

const useOrder = () => {
  const orderContext = useContext(OrderContext)

  if (!orderContext) {
    throw new Error("useOrder must be used within an OrderContextProvider")
  }

  return orderContext
}

export default useOrder
