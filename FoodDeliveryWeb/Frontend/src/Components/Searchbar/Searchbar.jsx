import React from "react";
import "./Searchbar.css";

function Searchbar({ setquery }) {
  return (
    <>
      <div className="search-container">
        <input
          type="text"
          name=""
          id=""
          placeholder="Search here"
          onChange={(e) => setquery(e.target.value.toLowerCase())}
        />
      </div>
    </>
  );
}

export default Searchbar;
