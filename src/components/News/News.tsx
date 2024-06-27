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
        <NewsContainer style={{ padding: "24px", overflow: "auto" }}>
          <h2>Welcome to Folkets Cup 2024</h2>
          <p>
            Folkets Puck Hockeyklubb invites you to Folkets Cup for veteran
            teams, recreational teams and corporate teams. The focus will be on
            having fun both on and off the ice. We will organise an after-party,
            offer lunch, and aim to create an even tournament where everyone has
            a chance to win!
            <Link href="https://drive.google.com/file/d/1JeJR4cDL32rKlIDix9B7QrZF06HAmaTd/view">
              View Full Tournament Info via PDF
            </Link>
            <h3>Date, Time & Location</h3> November 16th & 17th 08.00 - 18.00
            both days
            <Link href="https://maps.app.goo.gl/JccSMdFjqRDeeiFP8">
              Kirseberg Ishall, Malmö
            </Link>
            Österhagsgatan 3, 212 22 Malmö <h3>Tournament Level</h3> This is an
            adult tournament. 19+ only. 1 Division. 8 Teams. 10-15 players + 1
            goalie per team. Teams should ideally have a mix of B & C series
            players. No A-series player / teams will be accepted. (See details
            on player levels here). <h3>The rules people really care about:</h3>
            Icing: Hybrid. Slapshots: No “full” slapshots. “Snapshots” are okay.
            Basically - keep your stick below your knees. Hitting: No! All
            rules:
            <Link href="https://drive.google.com/file/d/1JeJR4cDL32rKlIDix9B7QrZF06HAmaTd/view">
              View Full Tournament Info via PDF
            </Link>
            <h3>Food</h3> Locker Room Snacks: There will be a snack basket
            (fruit, energy, snacks) provided for each team. Lunch: No.
            <h3>After-party</h3> Meet 19.30 on SATURDAY at our official
            clubhouse:
            <Link href="https://maps.app.goo.gl/92gsykBKaX6HEPC97">
              V.E.D Restaurang & Bar
            </Link>
            . Kristianstadsgatan 10A, 214 23 Malmö We will either stay here or
            find something close by depending on how much space we need. There
            are a ton of options within a couple blocks.
            <Link href="https://drive.google.com/file/d/1JeJR4cDL32rKlIDix9B7QrZF06HAmaTd/view">
              View Full Tournament Info via PDF
            </Link>
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
const Link = styled.a`
  display: flex;
  align-items: center;
  color: #000;
  padding: 10px;
  &:hover {
    color: #42917e;
  }
`;
