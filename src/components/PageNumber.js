import React from 'react';
import { HiChevronLeft, HiChevronRight, HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi2";

export default function PageNumber({
                                       currentPage,
                                       startPage,
                                       totalPages,
                                       onPageChange,
                                       onNextClick,
                                       onPrevClick,
                                       onPrevGroupClick,
                                       onNextGroupClick
                                   }) {
    const isPrevDisabled = currentPage === 1;
    const isNextDisabled = currentPage === totalPages;
    const isPrevGroupDisabled = startPage === 1;
    const isNextGroupDisabled = startPage + 10 > totalPages;

    return (
        <div className="flex justify-center items-center space-x-2">
            <button
                onClick={onPrevGroupClick}
                disabled={isPrevGroupDisabled}
                className={`p-2 rounded-full ${
                    isPrevGroupDisabled
                        ? 'cursor-not-allowed'
                        : 'text-black hover:bg-gray-200'
                }`}
            >
                <HiChevronDoubleLeft size={16} />
            </button>
            <button
                onClick={onPrevClick}
                disabled={isPrevDisabled}
                className={`p-2 rounded-full ${
                    isPrevDisabled
                        ? 'cursor-not-allowed'
                        : 'text-black hover:bg-gray-200'
                }`}
            >
                <HiChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(10, totalPages - startPage + 1) }, (_, i) => startPage + i).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition ${
                        currentPage === page
                            ? 'bg-sky-600 text-white hover:bg-sky-700'
                            : 'bg-transparent text-black hover:bg-gray-200'
                    }`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={onNextClick}
                disabled={isNextDisabled}
                className={`p-2 rounded-full ${
                    isNextDisabled
                        ? 'cursor-not-allowed'
                        : 'text-black hover:bg-gray-200'
                }`}
            >
                <HiChevronRight size={16} />
            </button>
            <button
                onClick={onNextGroupClick}
                disabled={isNextGroupDisabled}
                className={`p-2 rounded-full ${
                    isNextGroupDisabled
                        ? 'cursor-not-allowed'
                        : 'text-black hover:bg-gray-200'
                }`}
            >
                <HiChevronDoubleRight size={16} />
            </button>
        </div>
    );
}
