import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ onSearch, placeholder = "Search...", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className={`relative ${className}`}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" 
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;