import React, { useState, useEffect } from 'react';
import IconSearch from 'assets/icons/magnify.svg';

const Search = () => {
    const [search, setSearch] = React.useState('');
    const [isInputFocused, setInputFocused] = React.useState(false);
    const [showSpinningIcon, setShowSpinningIcon] = useState(false);

    const handleSearchSubmit = e => {
        if (e.key === 'Enter') {
            // Call API to search
        }
    };
    useEffect(() => {
        let typingTimeout = null;

        if (search) {
            setShowSpinningIcon(true);
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            typingTimeout = setTimeout(() => {
                setShowSpinningIcon(false);
            }, 1000); // Hide spinning icon after 1000 milliseconds of inactivity
        } else {
            setShowSpinningIcon(false);
        }

        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [search]);

    return (
        <div
            className={`py-px pl-2 md:pl-4 flex border-2 justify-left items-center flex-1 rounded-md ${
                isInputFocused ? 'border-primary' : 'border-[#B6B6B6]'
            }`}
        >
            <div className="icon mr-2 md:mr-4">
                <img
                    // src={isInputFocused || search ? IconFocus : IconBlur}
                    src={isInputFocused || search ? IconSearch : IconSearch}
                    alt="Search Icon"
                    width={20}
                    height={20}
                />
            </div>
            <input
                className="w-full h-[2.125rem] border-0 outline-none"
                placeholder="What are you looking for?"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyUp={handleSearchSubmit}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
            />

            {showSpinningIcon && (
                <div className="icon mr-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary border-solid"></div>
                </div>
            )}
        </div>
    );
};

export default Search;
