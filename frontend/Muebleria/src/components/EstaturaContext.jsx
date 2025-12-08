import React, { createContext, useState, useEffect } from 'react';

export const EstaturaContext = createContext();

export const EstaturaProvider = ({ children }) => {
const [estatura, setEstatura] = useState(() => {

const saved = localStorage.getItem('estatura');
return saved ? JSON.parse(saved) : null;
});

useEffect(() => {

if (estatura !== null) {
    localStorage.setItem('estatura', JSON.stringify(estatura));
}
}, [estatura]);


const resetEstatura = () => {
localStorage.removeItem('estatura');
setEstatura(null);
};

return (
<EstaturaContext.Provider value={{ estatura, setEstatura, resetEstatura }}>
    {children}
</EstaturaContext.Provider>
);
};
