import React, { useState, useEffect } from 'react'
// import IconBlur from '../assets/icons/magnify-blur.svg'
// import IconFocus from '../assets/icons/magnify-focus.svg'
import IconSearch from '../assets/icons/magnify.svg'

const Search = () => {
  const [search, setSearch] = React.useState('')
  const [isInputFocused, setInputFocused] = React.useState(false)
  const [showSpinningIcon, setShowSpinningIcon] = useState(false)

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      // Call API to search
    }
  }
  useEffect(() => {
    let typingTimeout = null

    if (search) {
      setShowSpinningIcon(true)
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
      typingTimeout = setTimeout(() => {
        setShowSpinningIcon(false)
      }, 1000) // Hide spinning icon after 1000 milliseconds of inactivity
    } else {
      setShowSpinningIcon(false)
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [search])

  return (
    <div
      className={`py-[1px] pl-[8px] md:pl-[16px] flex border-[2px] justify-left items-center flex-1 rounded-md ${
        isInputFocused ? 'border-primary' : 'border-[#B6B6B6]'
      }`}>
      <div className="icon mr-[8px] md:mr-[16px]">
        <img
          // src={isInputFocused || search ? IconFocus : IconBlur}
          src={isInputFocused || search ? IconSearch : IconSearch}
          alt="Search Icon"
          width={20}
          height={20}
        />
      </div>
      <input
        className="w-[100%] h-[34px] border-0 outline-none"
        placeholder="What are you looking for?"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyUp={handleSearchSubmit}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      />

      {showSpinningIcon && (
        <div className="icon mr-[16px]">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary border-solid"></div>
        </div>
      )}
    </div>
  )
}

export default Search
