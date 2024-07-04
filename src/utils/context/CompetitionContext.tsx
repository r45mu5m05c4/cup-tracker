import React, { ReactNode, createContext, useContext, useState } from "react";
import { Competition } from "../types/Competition";

interface CompetitionContextType {
  competition: Competition | null;
  setCompetition: (comp: Competition | null) => void;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(
  undefined
);

export const CompetitionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [competition, setInternalCompetition] = useState<Competition | null>(
    null
  );
  const setCompetition = (comp: Competition | null) => {
    setInternalCompetition(comp);
  };

  return (
    <CompetitionContext.Provider value={{ competition, setCompetition }}>
      {children}
    </CompetitionContext.Provider>
  );
};

export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error("useCompetition must be used within a CompetitionProvider");
  }
  return context;
};
