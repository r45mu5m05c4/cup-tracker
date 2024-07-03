import { styled } from "styled-components";
import { MOCK_COMPETITIONS } from "../../utils/MOCK_DATA";
import { useCompetition } from "../../utils/context/CompetitionContext";
import Typography from "../../molecules/Typography";

const CompetitionPicker = () => {
  const { setCompetition } = useCompetition();
  const competitions = MOCK_COMPETITIONS;

  return (
    <Container>
      <Typography variant="h1" children="Choose competition"></Typography>
      {competitions.map((comp) => (
        <Button key={comp.id} onClick={() => setCompetition(comp)}>
          {comp.name}
        </Button>
      ))}
    </Container>
  );
};
export default CompetitionPicker;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  gap: 24px;
  padding: 24px;
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
