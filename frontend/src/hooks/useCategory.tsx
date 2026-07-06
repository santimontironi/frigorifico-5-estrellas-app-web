import { CategoryContext } from "../context/CategoryContext";
import { useContext } from "react";

const useCategory = () => {
  const categoryContext = useContext(CategoryContext);

  if (!categoryContext) {
    throw new Error(
      "useCategory must be used within a CategoryContextProvider",
    );
  }
  return categoryContext;
};

export default useCategory;
