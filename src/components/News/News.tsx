import { styled } from "styled-components";

const News = () => {
    return (
        <Container>
            <Row>
                <NewsContainer />
                <NewsContainer />
            </Row>
            <Row>
                <NewsContainer />
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
`;
const NewsContainer = styled.div`
  background-color: var(--color-background-primary-darker);
  box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 300px;
  border-radius: 8px;
`;
