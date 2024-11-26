import React from 'react';

import { MdArrowBackIos,MdArrowForwardIos } from "react-icons/md";


export default function PageNumber({ currentPage, startPage, totalPages, onPageChange, onNextClick, onPrevClick }) {
  return (
    <div
      className="w-full sm:w-3/4 md:w-full p-1 border border-gray-300 rounded-lg flex flex-wrap justify-center space-x-2 mt-12 mb-24">
      <div onClick={onPrevClick} className="cursor-pointer flex items-center text-gray-500">
        <MdArrowBackIos/>
      </div>

      {Array.from({length: Math.min(10, totalPages - startPage + 1)}, (_, i) => startPage + i).map((page) => (
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
      <div onClick={onNextClick} className="cursor-pointer flex items-center text-gray-500">
        <MdArrowForwardIos/>
      </div>
    </div>
  );
}
