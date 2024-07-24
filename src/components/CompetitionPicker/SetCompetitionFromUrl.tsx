import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Competition } from "../../utils/types/Competition";
import { getCompetitions } from "../../utils/queries";

export const SetCompetitionFromUrl = () => {
  const { competitionName } = useParams<{ competitionName: string }>();
  const { setCompetition } = useCompetition();
  useEffect(() => {
    const fetchAllCompetitions = async () => {
      try {
        const allCompetitions = await getCompetitions();

        const compByParam = allCompetitions.find(
          (comp: Competition) =>
            competitionName?.toLowerCase() === comp.name.toLowerCase()
        );
        compByParam && setCompetition(compByParam);
      } catch (error) {
        console.error("Error setting competition via URL:", error);
      }
    };

    fetchAllCompetitions();
  }, []);

  return null;
};
