import { useContext } from "react"
import { CartContext } from "../context/CartContext"

const useCart = () => {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error("useCart must be used within a CartContextProvider")
  }

  return cartContext
}

export default useCart
