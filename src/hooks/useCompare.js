// src/hooks/useCompare.js
import { useContext } from 'react';
import { CompareContext } from '../context/CompareContext';

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare debe ser usado dentro de un CompareProvider');
  }
  return context;
};