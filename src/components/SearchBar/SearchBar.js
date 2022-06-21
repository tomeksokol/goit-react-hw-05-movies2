import React from "react";
import { useState } from "react";
// import { toast } from "react-toastify";
import styles from "./SearchBar.module.css";

const SearchBar = ({ onHandleSubmit }) => {
  const [query, setQuery] = useState("");
  const onSubmit = (event) => {
    event.preventDefault();
    if (query.trim() === "") {
      alert("Wprowadź tytuł filmu");
    }
    onHandleSubmit(query.trim());
    setQuery("");
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        className={styles.input}
        type="text"
        value={query}
        autoComplete="off"
        autoFocus
        placeholder="Wyszukaj filmu..."
        onChange={({ target }) => setQuery(target.value)}
      />
      <button type="submit" className={styles.btn}>
        <span className={styles.label}>Szukaj</span>
      </button>
    </form>
  );
};

export default SearchBar;
