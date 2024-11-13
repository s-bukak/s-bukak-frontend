import React from 'react';
import reverseLink from "../assets/icons/reverseLink.svg";
import Link from "../assets/icons/link.svg";

export default function PageNumber({ currentPage, startPage, totalPages, onPageChange, onNextClick, onPrevClick }) {
  return (
    <div className="w-full sm:w-3/4 md:w-full p-1 border border-gray-300 rounded-lg flex flex-wrap justify-center space-x-2 mt-12 mb-24">
      <img src={reverseLink} alt="Reverse Link icon" onClick={onPrevClick} className="cursor-pointer" />
      {Array.from({ length: Math.min(10, totalPages - startPage + 1) }, (_, i) => startPage + i).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-none flex items-center rounded-lg ${
            currentPage === page ? 'bg-sky-600 text-white' : 'bg-white text-black'
          }`}
        >
          {page}
        </button>
      ))}
      <img src={Link} alt="Link icon" onClick={onNextClick} className="cursor-pointer" />
    </div>
  );
}
