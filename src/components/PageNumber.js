import React, { useState } from 'react';
import Link from "../assets/icons/link.svg";
import reverseLink from "../assets/icons/reverseLink.svg";

export default function PageNumber() {
  const [startPage, setStartPage] = useState(1);

  const handlePageClick = (page) => {
    console.log(`Page ${page} clicked`);
  };

  const handleLinkClick = () => {
    setStartPage((prevStartPage) => prevStartPage + 10);
  };

  const handleReverseLinkClick = () => {
    if (startPage > 1) {
      setStartPage((prevStartPage) => prevStartPage - 10);
    }
  };

  return (
    <div className="w-full sm:w-3/4 md:w-full p-1 border border-gray-300 rounded-lg flex flex-wrap justify-center space-x-2 mt-12 mb-24">
      <img src={reverseLink} alt="Reverse Link icon" onClick={handleReverseLinkClick} className="cursor-pointer" />
      {Array.from({ length: 10 }, (_, i) => startPage + i).map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className="px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-none flex items-center"
        >
          {page}
        </button>
      ))}
      <img src={Link} alt="Link icon" onClick={handleLinkClick} className="cursor-pointer" />
    </div>
  );
}