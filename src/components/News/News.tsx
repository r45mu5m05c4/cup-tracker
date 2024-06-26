import { styled } from "styled-components";
import PlayerTable from "../PlayerTable";
import TeamTable from "../TeamTable";

const News = () => {
  return (
    <Container>
      <Row>
        <NewsContainer>
          <PlayerTable small={true} />
        </NewsContainer>
        <NewsContainer>
          <TeamTable small={true} />
        </NewsContainer>
      </Row>
      <Row>
        <NewsContainer style={{ padding: "24px" }}>
          <h2>Welcome to Folkets Cup</h2>
          <p>
            Peter will write a nice introduction along with some general info
            here
          </p>
        </NewsContainer>
      </Row>
    </Container>
  );
};

export default News;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
`;
const Row = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const NewsContainer = styled.div`
  background-color: var(--color-background-primary-darker);
  box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.05);

  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  @media (min-width: 768px) {
    width: 100%;
  }
`;
