// src/context/CompareContext.jsx
import { createContext, useState, useEffect } from 'react';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const localData = localStorage.getItem('ferremaxCompare');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ferremaxCompare', JSON.stringify(compareItems));
  }, [compareItems]);

  const toggleCompare = (product) => {
    setCompareItems(prev => {
      const isInCompare = prev.some(item => item.ID_Producto === product.ID_Producto);
      if (isInCompare) {
        return prev.filter(item => item.ID_Producto !== product.ID_Producto);
      } else {
        // Limitar a un máximo de 4 productos para comparar
        if (prev.length < 4) {
          return [...prev, product];
        } else {
            alert("Puedes comparar un máximo de 4 productos a la vez.");
            return prev;
        }
      }
    });
  };

  const clearCompare = () => {
    setCompareItems([]);
  };
  
  const isInCompare = (productId) => compareItems.some(item => item.ID_Producto === productId);

  const value = { compareItems, toggleCompare, clearCompare, isInCompare };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};