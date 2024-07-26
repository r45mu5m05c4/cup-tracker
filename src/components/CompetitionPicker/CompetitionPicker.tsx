import { styled } from "styled-components";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { useEffect, useState } from "react";
import { getCompetitions } from "../../utils/queries";
import { Competition } from "../../utils/types/Competition";
import { Typography } from "../../molecules/Typography";

export const CompetitionPicker = () => {
  const { setCompetition } = useCompetition();
  const [competitions, setCompetitions] = useState<Competition[] | null>(null);

  useEffect(() => {
    const fetchAllCompetitions = async () => {
      try {
        const allCompetitions = await getCompetitions();

        setCompetitions(allCompetitions);
      } catch (error) {
        console.error("Error adding teams:", error);
      }
    };

    fetchAllCompetitions();
  }, []);

  return (
    <Container>
      <Typography variant="h2">Change competition</Typography>
      <Typography>Choose the cup you would like to view.</Typography>
      <Row>
        {competitions?.map((comp: Competition, i) =>
          comp.logo ? (
            <ImgButton
              key={i}
              src={comp.logo}
              style={{ height: i === 0 ? "230px" : "200px" }}
              onClick={() => setCompetition(comp)}
            />
          ) : (
            <Button key={i} onClick={() => setCompetition(comp)}>
              {comp.name}
            </Button>
          )
        )}
      </Row>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  z-index: 170;
  inset: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #121a1c;
  gap: 12px;
  padding: 24px;
  align-items: center;
  overflow-y: auto;
  margin-bottom: 24px;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 54px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin: 32px 0;
`;

const ImgButton = styled.img`
  cursor: pointer;
  width: 190px;
`;

const Button = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.25s;
  margin: auto;
`;
