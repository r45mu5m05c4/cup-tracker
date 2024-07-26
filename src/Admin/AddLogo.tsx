import { useState } from "react";
import styled from "styled-components";
import { useCompetition } from "../utils/context/CompetitionContext";
import { Button } from "../molecules/Button";
import supabase from "../utils/supabase/server";

interface AddLogoProps {
  newTeam: boolean;
  teamId: number | undefined;
  setLogoUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const AddLogo = ({ newTeam, teamId, setLogoUrl }: AddLogoProps) => {
  const [updatedLogo, setUpdatedLogo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const { competition } = useCompetition();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUpdatedLogo(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!competition) return;
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

    setLogoUrl(publicUrl);

    setUploading(false);
    setMessage("File uploaded successfully!");
  };

  return (
    <Container>
      <>
        <label>
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
