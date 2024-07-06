import { useEffect, useState } from "react";
import { useUser } from "../utils/context/UserContext";
import { Team } from "../utils/types/Team";
import { getTeams, uploadLogo } from "../utils/queries";
import styled from "styled-components";
import { useCompetition } from "../utils/context/CompetitionContext";

const AddLogo = () => {
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
      <h2>Admin Page - Update Teams</h2>
      <select onChange={(e) => handleTeamSelect(e.target.value)}>
        <option value="">Select a team to update</option>
        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
      </select>
      {selectedTeam && (
        <>
          <label>
            Logo:
            <input type="file" onChange={handleLogoChange} />
          </label>
          <br />
          <Button onClick={handleUpdateLogo}>Update Logo</Button>
          {message && <p>{message}</p>}
        </>
      )}
    </Container>
  );
};

export default AddLogo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: grey;
  color: var(--text-base);
  cursor: pointer;
  transition: border-color 0.25s;
  margin: auto;
`;
