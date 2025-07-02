import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentFamily, setCurrentFamily] = useState(null);
  const [familyAdmins, setFamilyAdmins] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPrincipalAdmin, setIsPrincipalAdmin] = useState(false);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setCurrentFamily(null);
    setFamilyAdmins([]);
    setIsAdmin(false);
    setIsPrincipalAdmin(false);
  };

  const setFamily = (family, admins = [], userId = null) => {
    setCurrentFamily(family);
    setFamilyAdmins(admins);
    if (userId) {
      const isUserAdmin = admins.some(a => a.id === userId);
      const isUserPrincipalAdmin = family.administradorPrincipalId === userId;
      
      setIsAdmin(isUserAdmin);
      setIsPrincipalAdmin(isUserPrincipalAdmin);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      currentFamily,
      login,
      logout,
      setFamily,
      familyAdmins,
      isAdmin,
      isPrincipalAdmin
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 