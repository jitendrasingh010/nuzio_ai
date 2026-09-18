'use client';

import React from 'react';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto py-2 scrollbar-none no-scrollbar">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
              isSelected
                ? 'bg-[#1E2024] text-white shadow-xs'
                : 'bg-[#FFFFFF] text-[#555A64] border border-[#EAE6DF] hover:bg-[#F5F2EC] hover:text-[#18191B]'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
