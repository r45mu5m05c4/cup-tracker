import { useEffect, useState } from "react";
import { useUser } from "../utils/context/UserContext";
import { Team } from "../utils/types/Team";
import { getTeams, uploadLogo } from "../utils/queries";
import styled from "styled-components";
import { useCompetition } from "../utils/context/CompetitionContext";
import { Select } from "../molecules/Select";
import { Button } from "../molecules/Button";
import supabase from "../utils/supabase/server";

export const AddLogo = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [updatedLogo, setUpdatedLogo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [message, setMessage] = useState("");
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (competition) {
        try {
          const teamsFromAPI = await getTeams(competition.id);
          setTeams(teamsFromAPI);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
      }
    };

    fetchAllTeams();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUpdatedLogo(e.target.files[0]);
    }
  };

  const handleTeamSelect = (teamId: string) => {
    const foundTeam = teams.length && teams.find((team) => team.id === teamId);

    if (foundTeam) {
      setSelectedTeam(foundTeam);
    }
  };
  const handleUpload = async () => {
    setUploading(true);
    setError(null);

    if (!updatedLogo) {
      setError("Please select a file to upload");
      setUploading(false);
      return;
    }

    const fileName = `${Date.now()}_${updatedLogo.name}`;

    const { data, error } = await supabase.storage
      .from("team-logo")
      .upload(fileName, updatedLogo);

    if (error) {
      setError(`Error uploading file: ${error.message}`);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("team-logo")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // Save the file URL to your Supabase table
    const { data: saveData, error: saveError } = await supabase
      .from("team")
      .insert([{ logo: publicUrl }]);
    console.log(data, saveData);
    if (saveError) {
      setError("Error saving file URL: " + saveError.message);
      setUploading(false);
      return;
    }

    setUploading(false);
    setMessage("File uploaded successfully!");
  };

  return (
    <Container>
      <Select
        label="Team"
        placeholder="Select team"
        options={teams.map((team) => ({
          value: team.id,
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
            <Button disabled={!updatedLogo} onClick={handleUpload}>
              {uploading ? "Uploading..." : "Upload logo"}
            </Button>
          </div>
          {message && <p>{message}</p>}
          {error && <p>{error}</p>}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
