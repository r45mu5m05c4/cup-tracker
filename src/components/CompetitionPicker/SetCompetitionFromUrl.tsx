import { useEffect } from "react";
import { useUser } from "../../utils/context/UserContext";
import { useParams } from "react-router-dom";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Competition } from "../../utils/types/Competition";
import { getCompetitions } from "../../utils/queries";

export const SetCompetitionFromUrl = () => {
  const { competitionName } = useParams<{ competitionName: string }>();
  const { setCompetition } = useCompetition();
  const { user } = useUser();
  useEffect(() => {
    const fetchAllCompetitions = async () => {
      if (user?.accessToken)
        try {
          const allCompetitions = await getCompetitions(user.accessToken);

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
  }, [user?.accessToken]);

  return null;
};
