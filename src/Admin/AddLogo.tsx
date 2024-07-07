import { useEffect, useState } from "react";
import { useUser } from "../utils/context/UserContext";
import { Team } from "../utils/types/Team";
import { getTeams, uploadLogo } from "../utils/queries";
import styled from "styled-components";
import { useCompetition } from "../utils/context/CompetitionContext";
import { Typography } from "../molecules/Typography";
import { Select } from "../molecules/Select";
import { Button } from "../molecules/Button";

export const AddLogo = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [updatedLogo, setUpdatedLogo] = useState<File | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [message, setMessage] = useState("");
  const { user, refreshAccessToken } = useUser();
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken && competition) {
        try {
          await refreshAccessToken();
          const teamsFromAPI = await getTeams(
            user.accessToken,
            competition.name
          );
          setTeams(teamsFromAPI);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
      }
    };

    fetchAllTeams();
  }, [user]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUpdatedLogo(e.target.files[0]);
    }
  };

  const handleTeamSelect = (teamId: string) => {
    const foundTeam = teams.length && teams.find((team) => team._id === teamId);

    if (foundTeam) {
      setSelectedTeam(foundTeam);
    }
  };

  const handleUpdateLogo = async () => {
    if (updatedLogo && selectedTeam) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(updatedLogo);
      reader.onloadend = async () => {
        if (reader.readyState === FileReader.DONE && reader.result) {
          const binary = new Uint8Array(reader.result as ArrayBuffer);

          try {
            await refreshAccessToken();
            const logoUpload =
              user?.accessToken &&
              competition &&
              (await uploadLogo(
                selectedTeam.name,
                binary,
                user.accessToken,
                competition.name
              ));
            console.log(logoUpload);
            setMessage("Logo updated");
          } catch (error) {
            console.error("Error uploading logo:", error);
            setMessage("Failed to upload logo");
          }
        }
      };
    }
  };

  return (
    <Container>
      <Select
        label="Team"
        placeholder="Select team"
        options={teams.map((team) => ({
          value: team._id,
          label: team.name,
        }))}
        onChange={(e) => handleTeamSelect(e.target.value)}
      />
      {selectedTeam && (
        <>
          <label>
            Logo:
            <input type="file" onChange={handleLogoChange} />
          </label>
          <br />
          <div>
            <Button disabled={!updatedLogo} onClick={handleUpdateLogo}>
              Update Logo
            </Button>
          </div>
          {message && <p>{message}</p>}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
