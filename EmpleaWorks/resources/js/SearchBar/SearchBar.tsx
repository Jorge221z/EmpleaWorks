import { useState, useEffect, useCallback } from "react";
import { Offer } from "@/types/types";
import { useTranslation } from "@/utils/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  data: Offer[];
  onFilteredResults: (results: Offer[]) => void;
  categories: string[];
  contractTypes: string[];
  primaryColor?: string;
  accentColor?: string;
}

function SearchBar({ data, onFilteredResults, categories, contractTypes, primaryColor = '#7c28eb', accentColor = '#FDC231' }: SearchBarProps) {
  // ----- HOOKS & STATE -----
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedContractType, setSelectedContractType] = useState("all");
  const [resultsCount, setResultsCount] = useState(data.length);
  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(false);

  // ----- COLOR THEMING SYSTEM -----
  // Colores principales (púrpura)
  const purpleColor = '#7c28eb';
  const purpleHoverColor = '#6620c5';
  
  // Colores de acento (ámbar)
  const amberColor = '#FDC231';
  const amberDarkColor = '#E3B100';
  const amberLightColor = '#FFDE7A';

  // ----- DATA PREPARATION -----
  const availableCategories = categories || [...new Set(data.map(offer => offer.category).filter(Boolean))];
  const availableContractTypes = contractTypes || [...new Set(data.map(offer => offer.contract_type).filter(Boolean))];

  // ----- SEARCH & FILTER LOGIC -----
  const filterData = useCallback(() => {
    if ((!query.trim() && (!selectedCategory || selectedCategory === "all") && (!selectedContractType || selectedContractType === "all"))) {
      return data;
    }

    const searchTerm = query.toLowerCase();

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.filter((offer) => {
      if (!offer) return false;

      const safeSearch = (value: any) => {
        if (value === null || value === undefined) return false;
        if (typeof value !== 'string') return false;
        return value.toLowerCase().includes(searchTerm);
      };

      if (selectedCategory && selectedCategory !== "all" && offer.category !== selectedCategory) {
        return false;
      }

      if (selectedContractType && selectedContractType !== "all" && offer.contract_type !== selectedContractType) {
        return false;
      }

      if (!query.trim()) {
        return true;
      }

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
  }, [query, selectedCategory, selectedContractType, data]);

  // ----- SIDE EFFECTS -----
  useEffect(() => {
    const filteredData = filterData();
    setResultsCount(filteredData.length);
    onFilteredResults(filteredData);
  }, [filterData, onFilteredResults]);

  // ----- EVENT HANDLERS -----
  const clearSearch = () => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedContractType("all");
    setIsFiltersDialogOpen(false);
  };

  const activeFiltersCount = 
    (selectedCategory !== "all" ? 1 : 0) + 
    (selectedContractType !== "all" ? 1 : 0);

  // ----- THEMING & STYLES -----
  // Determinar colores para elementos de la UI
  const buttonBgColor = { backgroundColor: purpleColor, color: 'white' };
  const buttonHoverBgColor = { backgroundColor: purpleHoverColor }; 

  // Determinar colores para badges
  const categoryBadgeStyle = { 
    backgroundColor: `${amberColor}20`, 
    color: amberDarkColor 
  };
    
  const contractBadgeStyle = { 
    backgroundColor: `${purpleColor}15`, 
    color: purpleColor 
  };

  // Determinar colores para counter badge
  const counterBadgeStyle = { 
    backgroundColor: amberColor,
    color: "#333"
  };

  // ----- HOVER HANDLERS -----
  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = purpleHoverColor;
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = purpleColor;
  };

  // ----- RENDER COMPONENT -----
  return (
    <div className="w-full">
      <div className="grid grid-cols-12 bg-white dark:bg-gray-950 rounded-2xl shadow-md overflow-hidden">
        {/* Ícono de búsqueda */}
        <div className="col-span-1 flex items-center justify-center border-r border-gray-100 dark:border-gray-700">
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Campo de búsqueda - Ajustado para todos los breakpoints */}
        <div className="col-span-5 sm:col-span-6 md:col-span-6 lg:col-span-3">
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-full px-3 py-3 bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-gray-900 dark:text-white"
          />
        </div>
        
        {/* Botón de filtros para móvil y tablet - Visible en sm y md */}
        <Dialog open={isFiltersDialogOpen} onOpenChange={setIsFiltersDialogOpen}>
          <DialogTrigger asChild>
            <button className="lg:hidden col-span-4 sm:col-span-3 md:col-span-3 flex items-center justify-center gap-2 border-l border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg className="w-4 h-4" fill="none" stroke={purpleColor} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-sm">{t('filters')}</span>
              {activeFiltersCount > 0 && (
                <span 
                  className="flex items-center justify-center w-5 h-5 text-xs rounded-full"
                  style={counterBadgeStyle}
                >
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md dark:bg-gray-900 border-purple-100 dark:border-purple-600/30">
            <DialogHeader>
              <DialogTitle className="text-[#7c28eb] dark:text-purple-300">{t('filters')}</DialogTitle>
              <DialogDescription>
                {t('filter_description')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#7c28eb] dark:text-purple-300">{t('category')}</label>
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                  <SelectTrigger className="focus-visible:ring-purple-500 border-purple-100 dark:border-purple-600/30">
                    <SelectValue placeholder={t('select_category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_categories')}</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#7c28eb] dark:text-purple-300">{t('contract_type')}</label>
                <Select value={selectedContractType} onValueChange={(value) => setSelectedContractType(value)}>
                  <SelectTrigger className="focus-visible:ring-purple-500 border-purple-100 dark:border-purple-600/30">
                    <SelectValue placeholder={t('select_contract_type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_contract_types')}</SelectItem>
                    {availableContractTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between mt-4">
                <button 
                  onClick={clearSearch}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  {t('clear_filters')}
                </button>
                <button 
                  onClick={() => setIsFiltersDialogOpen(false)}
                  className="px-3 py-2 text-sm text-white rounded-md"
                  style={buttonBgColor}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  {t('apply_filters')}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Categoría con icono - Visible SOLO en lg y superiores */}
        <div className="hidden lg:block col-span-3 border-l border-gray-100 dark:border-gray-700">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full h-full border-none shadow-none focus:ring-0 pl-3">
              <div className="flex items-center text-sm">
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="none" 
                  stroke={amberColor}
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <SelectValue 
                  placeholder={t('category')}
                  className="truncate text-gray-600 dark:text-gray-300"
                />
              </div>
            </SelectTrigger>
            <SelectContent className="border-purple-100 dark:border-purple-600/30">
              <SelectItem value="all">{t('all_categories')}</SelectItem>
              {availableCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Tipo de contrato con icono - Visible SOLO en lg y superiores */}
        <div className="hidden lg:block col-span-3 border-l border-gray-100 dark:border-gray-700">
          <Select value={selectedContractType} onValueChange={setSelectedContractType}>
            <SelectTrigger className="w-full h-full border-none shadow-none focus:ring-0 pl-3">
              <div className="flex items-center text-sm">
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="none" 
                  stroke={purpleColor}
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <SelectValue 
                  placeholder={t('contract')}
                  className="truncate text-gray-600 dark:text-gray-300"
                />
              </div>
            </SelectTrigger>
            <SelectContent className="border-purple-100 dark:border-purple-600/30">
              <SelectItem value="all">{t('all_contract_types')}</SelectItem>
              {availableContractTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Botón de búsqueda/limpiar */}
        <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 border-l border-gray-100 dark:border-gray-700">
          {(query || selectedCategory !== "all" || selectedContractType !== "all") ? (
            <button
              onClick={clearSearch}
              className="w-full h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="w-full h-full flex items-center justify-center text-white"
              style={buttonBgColor}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Resultados */}
      <div className="flex justify-between items-center mt-4 px-1 text-xs text-gray-500 dark:text-gray-400">
        <div>
          {resultsCount === 0
            ? t('no_results_found', { query: query || t('selected_filters') })
            : t('results_found', { count: resultsCount, query: query || t('selected_filters') })}
        </div>
        
        {/* Filtros activos como badges pequeños */}
        <div className="flex items-center gap-1">
          {selectedCategory !== "all" && (
            <span 
              className="px-2 py-0.5 rounded text-xs"
              style={categoryBadgeStyle}
            >
              {selectedCategory}
            </span>
          )}
          {selectedContractType !== "all" && (
            <span 
              className="px-2 py-0.5 rounded text-xs"
              style={contractBadgeStyle}
            >
              {selectedContractType}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;