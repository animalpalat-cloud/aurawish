import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalResults
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Search Input Box */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by theme, style, or vibe (e.g. Luxury, Cyber, Floral)..."
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#11141e] border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sort and Count */}
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400">
        <span>{totalResults} {totalResults === 1 ? 'template' : 'templates'} found</span>
        <div className="flex items-center gap-2 bg-[#11141e] border border-slate-800 px-3 py-2 rounded-xl">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort templates"
            className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
          >
            <option value="popular" className="bg-slate-900 text-slate-200">Most Popular</option>
            <option value="name" className="bg-slate-900 text-slate-200">Alphabetical (A-Z)</option>
            <option value="category" className="bg-slate-900 text-slate-200">Category</option>
          </select>
        </div>
      </div>
    </div>
  );
};
