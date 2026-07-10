import { useContext } from "react"
import { OfferContext } from "../context/OfferContext"

const useOffer = () => {
  const offerContext = useContext(OfferContext)

  if (!offerContext) {
    throw new Error("useOffer must be used within an OfferContextProvider")
  }

  return offerContext
}

export default useOffer
