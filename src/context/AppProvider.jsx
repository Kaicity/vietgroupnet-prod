import { useState } from 'react';
import { createContext } from 'react';

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [collaborator, setCollaborator] = useState(null);
  const [student, setStudent] = useState(null);

  return (
    <AppContext.Provider
      value={{
        collapsed,
        setCollapsed,
        collaborator,
        setCollaborator,
        student,
        setStudent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
