import {createContext, Dispatch, useState} from 'react'


type GlobalContextType = {
    isNavDropdownOpen: boolean
    setIsNavDropdownOpen: Dispatch<any>
}

export const GlobalContext = createContext<GlobalContextType>({
    isNavDropdownOpen: false,
    setIsNavDropdownOpen: () => {},
});

const GlobalProvider = ({ children }) => {
    const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);


    return (
        <GlobalContext.Provider
            value={{
                isNavDropdownOpen,
                setIsNavDropdownOpen,
            }}
        >
          {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
