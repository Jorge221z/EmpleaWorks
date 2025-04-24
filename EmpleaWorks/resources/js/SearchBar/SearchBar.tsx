import { useState, useEffect, useCallback } from "react";
import { Offer } from "@/types/types";

interface SearchBarProps {
  data: Offer[];
  onFilteredResults: (results: Offer[]) => void;
}

function SearchBar({ data, onFilteredResults }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [resultsCount, setResultsCount] = useState(data.length);

  // Usar useCallback para evitar recrear la función en cada render
  const filterData = useCallback(() => {
    if (!query.trim()) {
      return data;
    }

    const searchTerm = query.toLowerCase();

    // Verificar si data es un array válido antes de filtrar
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.filter((offer) => {
      // Verificar si offer es un objeto válido
      if (!offer) return false;
      
      // Función de ayuda para búsqueda segura más robusta
      const safeSearch = (value: any) => {
        if (value === null || value === undefined) return false;
        if (typeof value !== 'string') return false;
        return value.toLowerCase().includes(searchTerm);
      };

      // Acceder a las propiedades de manera segura usando operador opcional
      // y verificación de tipo
      return (
        safeSearch(offer.name) ||
        safeSearch(offer.description) ||
        safeSearch(offer.category) ||
        safeSearch(offer.degree) ||
        safeSearch(offer.contract_type) ||
        safeSearch(offer.job_location) ||
        safeSearch(offer.company?.name) ||
        safeSearch(offer.company?.description)
      );
    });
  }, [query, data]);

  // Usar useEffect con dependencias correctas
  useEffect(() => {
    const filteredData = filterData();
    setResultsCount(filteredData.length);
    onFilteredResults(filteredData);
  }, [filterData, onFilteredResults]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="relative flex items-center">
          <svg
            className="absolute left-3 w-5 h-5 text-gray-500 dark:text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por título, empresa, ubicación, etc..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                      bg-white dark:bg-gray-800 
                      text-gray-900 dark:text-white 
                      placeholder-gray-500 dark:placeholder-gray-400 
                      shadow-sm dark:shadow-none
                      transition duration-200 
                      focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 
                      focus:border-blue-500 dark:focus:border-blue-500 
                      outline-none"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 p-1 rounded-full text-gray-400 
                        hover:text-gray-600 dark:hover:text-white 
                        hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Limpiar búsqueda"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {query && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {resultsCount === 0
            ? `No se encontraron resultados para "${query}"`
            : `Se encontraron ${resultsCount} resultado(s) para "${query}"`}
        </div>
      )}
    </div>
  );
}

export default SearchBar;