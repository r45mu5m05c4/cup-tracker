import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Competition } from "../types/Competition";

interface CompetitionContextType {
  competition: Competition | null;
  setCompetition: (comp: Competition | null) => void;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(
  undefined
);

export const CompetitionProvider = ({ children }: { children: ReactNode }) => {
  const [competition, setCompetition] = useState<Competition | null>(null);
  useEffect(() => {
    // Optionally, load initial competition state from localStorage or other persistence layer
    const savedCompetition = localStorage.getItem("competition");
    if (savedCompetition) {
      setCompetition(JSON.parse(savedCompetition));
    }
  }, []);

  useEffect(() => {
    // Save competition state to localStorage or other persistence layer
    if (competition) {
      localStorage.setItem("competition", JSON.stringify(competition));
    }
  }, [competition]);

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
