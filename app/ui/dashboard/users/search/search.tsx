"use client";

import React, { useState } from "react";
import styles from "./search.module.css";
import { FaSearch } from "react-icons/fa";

interface SearchProps {
  placeholder: string;
  onSearch: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ placeholder, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className={styles.searchContainer}>
      <FaSearch className={styles.searchIcon} />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className={styles.searchInput}
        aria-label="Search for a user"
      />
    </div>
  );
};

export default Search;