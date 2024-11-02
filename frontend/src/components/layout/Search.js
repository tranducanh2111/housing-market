import React, { useState, useEffect } from 'react';
import IconSearch from 'assets/icons/magnify.svg';
import { debounce } from 'lodash';

const Search = () => {
    const [search, setSearch] = useState('');
    const [isInputFocused, setInputFocused] = useState(false);
    const [showSpinningIcon, setShowSpinningIcon] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const debouncedSearch = React.useCallback(
        debounce(async (searchTerm) => {
            if (!searchTerm) {
                setSearchResults([]);
                return;
            }
            
            try {
                setShowSpinningIcon(true);
                const response = await fetch(`/api/search?q=${searchTerm}`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setShowSpinningIcon(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSearch(search);
        return () => debouncedSearch.cancel();
    }, [search, debouncedSearch]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className={`py-px pl-2 md:pl-4 flex border-2 justify-left items-center flex-1 rounded-md ${
            isInputFocused ? 'border-primary' : 'border-[#B6B6B6]'
        }`}>
            <div className="icon mr-2 md:mr-4">
                <img
                    src={IconSearch}
                    alt="Search Icon"
                    width={20}
                    height={20}
                />
            </div>
            <input
                className="w-full h-[2.125rem] border-0 outline-none"
                placeholder="What are you looking for?"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
            />
            {showSpinningIcon && (
                <div className="icon mr-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary border-solid"></div>
                </div>
            )}
            {searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-md mt-1">
                    {/* Render search results */}
                </div>
            )}
        </div>
    );
};

export default Search;
