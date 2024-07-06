import React, { useEffect } from "react";
import { useUser } from "../../utils/context/UserContext";
import { useParams } from "react-router-dom";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { competitionPosters } from "./../../utils/Logos";
import { Competition } from "../../utils/types/Competition";
import { getCompetitions } from "../../utils/queries";

const SetCompetitionFromUrl: React.FC = () => {
  const { competitionName } = useParams<{ competitionName: string }>();
  const { setCompetition } = useCompetition();
  const { user } = useUser();

  useEffect(() => {
    const fetchAllCompetitions = async () => {
      if (user?.accessToken)
        try {
          const allCompetitions = await getCompetitions(user.accessToken);
          const compLogoLoop = allCompetitions.map((c: Competition) => {
            const compLogo = competitionPosters.find(
              (l: { compName: string; logo: string }) => c.name === l.compName
            );

            return { ...c, logo: compLogo?.logo };
          });
          const compByParam = compLogoLoop.find(
            (comp: Competition) => competitionName === comp.name
          );
          compByParam && setCompetition(compByParam);
        } catch (error) {
          console.error("Error adding teams:", error);
        }
    };

    fetchAllCompetitions();
  }, []);

  return null;
};

export default SetCompetitionFromUrl;
