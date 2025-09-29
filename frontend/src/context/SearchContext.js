import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]); // Danh sách sản phẩm load 1 lần
  const [searchTerm, setSearchTerm] = useState("");   // Từ khóa người dùng nhập

  return (
    <SearchContext.Provider
      value={{
        allProducts,
        setAllProducts,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Hook để dùng nhanh context
export const useSearch = () => useContext(SearchContext);
