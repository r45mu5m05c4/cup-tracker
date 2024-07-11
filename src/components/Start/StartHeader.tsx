import { styled } from "styled-components";
import { HomePage, MobileHomePage } from "../../assets";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Countdown } from "../../molecules/Countdown";
import { Typography } from "../../molecules/Typography";

export const StartHeader = () => {
  const { competition } = useCompetition();

  const getYearOfCompetition = () => {
    if (competition) {
      const startYear = new Date(competition.startDate).getFullYear();
      const endYear = new Date(competition.endDate).getFullYear();

      if (startYear === endYear) {
        return startYear.toString();
      } else {
        return `${startYear}/${endYear}`;
      }
    }
  };

  return (
    <Row>
      <Container>
        <div>
          <Typography
            variant="h1"
            style={{ fontWeight: "bold", fontSize: "3.8em" }}
          >
            {competition?.location || ""}
          </Typography>
          <Typography
            variant="h1"
            style={{
              fontWeight: "900",
              fontSize: "6em",
              color: "var(--decorative-brand-main)",
              lineHeight: "78px",
              paddingBottom: "12px",
              marginTop: "-10px",
            }}
          >
            {competition?.name === "MHL"
              ? "Hockey League"
              : "Folkets Cup" || ""}
          </Typography>
          <Typography
            variant="h1"
            style={{
              fontWeight: "bold",
              fontSize: "3.8em",
              marginTop: "-8px",
            }}
          >
            {getYearOfCompetition()}
          </Typography>
        </div>
        <div style={{ padding: "0 32px" }}>
          <Typography style={{ fontWeight: "500" }}>
            {competition?.name === "Folkets cup"
              ? "Join us for an exciting event on November 15-17. Experience live updates and follow your favorite players and teams right here with us."
              : "Welcome to the Malmö Hockey League (MHL), where local amateur teams come together to play hockey for the love of the game. Join us as we celebrate teamwork, passion, and the thrill of the ice!"}
          </Typography>
          {competition?.startDate && (
            <Countdown targetDate={competition.startDate} />
          )}
        </div>
      </Container>
    </Row>
  );
};

const Container = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 54px;
  padding-top: 54px;

  h1 {
    margin: 0;
  }

  p {
    max-width: 560px;
  }

  @media (max-width: 768px) {
    padding-top: 0;
    gap: 12px;
  }

  &::before {
    content: "";
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-image: url(${HomePage});
    background-size: cover;
    background-position: center;
    opacity: 0.15;
    z-index: -1;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);

    @media (max-width: 768px) {
      background-image: url(${MobileHomePage});
    }
  }
`;

const Row = styled.div`
  width: 100%;
  height: calc(100vh - 76px);
  display: flex;
  flex-direction: column;
  padding-bottom: 14px;
`;
