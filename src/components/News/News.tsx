import { styled } from "styled-components";
import PlayerTable from "../PlayerTable";
import TeamTable from "../TeamTable";
import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import {
  STARKALogo,
  EVT_white,
  FischerDarkLogo,
  VEDLogo,
} from "./../../assets";
import { useCompetition } from "../../utils/context/CompetitionContext";
import Countdown from "../../molecules/Countdown";
import Typography from "../../molecules/Typography";

interface NewsProps {
  hasScrolled: boolean;
}

const News = ({ hasScrolled }: NewsProps) => {
  const [readMore, setReadMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { competition } = useCompetition();

  const onClickFloatButton = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 3000); // Change the duration as needed (3000ms = 3 seconds)

    return () => clearInterval(interval);
  }, []);

  const logos = [
    { href: "https://www.starka.se/", src: STARKALogo },
    {
      href: "https://www.facebook.com/p/Energi-Ventilationsteknik-Syd-AB-100076233690420/?paipv=0&eav=Afa-qoVoEiQMchulzU3q-aUPJSk6nxrSBAOCpmfAHH35Od87d-3zCxVY9JVBXyXlEQg&_rdr",
      src: EVT_white,
    },
    {
      href: "https://www.facebook.com/groups/814348622554926",
      src: FischerDarkLogo,
    },
    { href: "https://www.instagram.com/ved_restaurang_bar/", src: VEDLogo },
  ];
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
    <Container>
      <RowFirst>
        <IntroContainer>
          <div>
            <Typography
              variant="h1"
              style={{ fontWeight: "bold", fontSize: "70px" }}
            >
              {competition?.location || ""}
            </Typography>
            <Typography
              variant="h1"
              style={{
                fontWeight: "bolder",
                fontSize: "100px",
                color: "#15BA83",
                lineHeight: "78px",
                paddingBottom: "12px",
              }}
            >
              {competition?.name || ""}
            </Typography>
            <Typography
              variant="h1"
              style={{ fontWeight: "bold", fontSize: "70px" }}
            >
              {getYearOfCompetition()}
            </Typography>
          </div>
          {competition?.startDate && (
            <div>
              <h2>{competition.name} begins in:</h2>
              <Countdown targetDate={competition.startDate} />
            </div>
          )}
        </IntroContainer>
      </RowFirst>
      <Row>
        <NewsContainer $readMore={false} $hasScrolled={hasScrolled}>
          <PlayerTable small={true} />
        </NewsContainer>
        <NewsContainer $readMore={false} $hasScrolled={hasScrolled}>
          <TeamTable small={true} />
        </NewsContainer>
      </Row>
      <Row>
        <NewsContainer
          style={{ padding: "24px" }}
          $readMore={readMore}
          $hasScrolled={hasScrolled}
        >
          {competition && (
            <ContentContainer $readMore={readMore}>
              <h2>Welcome to {competition.name} 2024</h2>
              {competition.name === "Folkets cup" ? (
                <>
                  <Typography variant="h3" style={{ fontWeight: "semibold" }}>
                    It's time for Folkets Cup 2024
                  </Typography>
                  <Typography variant="p" style={{ fontWeight: "semibold" }}>
                    Folkets Puck Hockeyklubb invites you to Folkets Cup for
                    veteran teams, recreational teams and corporate teams. The
                    focus will be on having fun both on and off the ice. We will
                    organise an after-party, offer lunch, and aim to create an
                    even tournament where everyone has a chance to win!
                  </Typography>
                  <Link href="https://drive.google.com/file/d/1JeJR4cDL32rKlIDix9B7QrZF06HAmaTd/view">
                    View Full Tournament Info via PDF
                  </Link>
                  <h3>Date, Time & Location</h3> November 16th & 17th 08.00 -
                  18.00 both days
                  <Link href="https://maps.app.goo.gl/JccSMdFjqRDeeiFP8">
                    Kirseberg Ishall, Malmö
                  </Link>
                  Österhagsgatan 3, 212 22 Malmö <h3>Tournament Level</h3> This
                  is an adult tournament. 19+ only. 1 Division. 8 Teams. 10-15
                  players + 1 goalie per team. Teams should ideally have a mix
                  of B & C series players. No A-series player / teams will be
                  accepted. (See details on player levels here).{" "}
                  <h3>The rules people really care about:</h3>
                  Icing: Hybrid. Slapshots: No “full” slapshots. “Snapshots” are
                  okay. Basically - keep your stick below your knees. Hitting:
                  No! All rules:
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
                  . Kristianstadsgatan 10A, 214 23 Malmö We will either stay
                  here or find something close by depending on how much space we
                  need. There are a ton of options within a couple blocks.
                  <Link href="https://drive.google.com/file/d/1JeJR4cDL32rKlIDix9B7QrZF06HAmaTd/view">
                    View Full Tournament Info via PDF
                  </Link>
                </>
              ) : (
                competition?.description
              )}
            </ContentContainer>
          )}
          <ReadMoreButton onClick={() => setReadMore(!readMore)}>
            {readMore ? (
              <>
                Read less
                <UpIconButton />
              </>
            ) : (
              <>
                Read more
                <DownIconButton />
              </>
            )}
          </ReadMoreButton>
        </NewsContainer>
      </Row>
      <Row>
        <NewsContainer $readMore={false} $hasScrolled={hasScrolled}>
          <SponsorContainer>
            {logos.map((logo, index) => (
              <SponsorLink
                key={index}
                href={logo.href}
                $isActive={index === currentIndex}
              >
                <SponsorLogo src={logo.src} />
              </SponsorLink>
            ))}
          </SponsorContainer>
        </NewsContainer>
      </Row>
      <Float $hasScrolled={hasScrolled} onClick={onClickFloatButton} />
    </Container>
  );
};

export default News;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const IntroContainer = styled.div`
  padding-top: 62px;
  height: 500px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 24px;

  h1 {
    margin: 0;
  }
`;

const SponsorLogo = styled.img`
  height: 100%;
  width: 100%;
`;

const SponsorLink = styled.a<{ $isActive: boolean }>`
  display: ${(props) => (props.$isActive ? "flex" : "none")};
  align-self: center;
  height: 100%;
  width: 100%;
  @media (min-width: 769px) {
    display: block; /* Always show logos side-by-side on desktop */
    width: 20%;
  }
`;

const SponsorContainer = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  gap: 50px;
  @media (max-width: 768px) {
    height: 100%;
    padding: 0;
  }
`;

const DownIconButton = styled(ChevronDownIcon)`
  height: 20px;
  margin: auto;
  cursor: pointer;
  &:hover {
    color: #42917e;
  }
`;

const UpIconButton = styled(ChevronUpIcon)`
  height: 20px;
  margin: auto;
  cursor: pointer;
  &:hover {
    color: #42917e;
  }
`;

const ReadMoreButton = styled.button`
  display: flex;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: transparent;
  color: #42917e;
  cursor: pointer;
  transition: border-color 0.25s;
  align-self: flex-end;
  &:disabled {
    background-color: #bababa;
    cursor: default;
  }
  &:hover {
    border: 1px solid transparent;
  }
  &:active {
    border: 1px solid transparent;
  }
  &:focus {
    border: 1px solid transparent;
  }
  &:target {
    border: 1px solid transparent;
  }
`;

const RowFirst = styled.div`
  height: calc(100vh - 96px);
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const Row = styled.div`
  width: 100%;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentContainer = styled.div<{ $readMore: boolean }>`
  flex: 1;
  overflow: ${(props) => (props.$readMore ? "auto" : "hidden")};
`;

const NewsContainer = styled.div<{ $readMore: boolean; $hasScrolled: boolean }>`
  opacity: ${(props) => (props.$hasScrolled ? "1" : "0")};
  background-color: #072B38;
  box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${(props) =>
    !props.$readMore &&
    `
      height: 300px;
      overflow: hidden;
    `};
  transition: 1s;
  margin: 14px;
  padding: 14px;

  @media (min-width: 768px) {
    width: 100%;
`;

const Link = styled.a`
  display: flex;
  align-items: center;
  color: #42917e;
  &:hover {
    color: #000;
  }
`;
const Float = styled(ArrowDownIcon)<{ $hasScrolled: boolean }>`
  position: fixed;
  width: 28px;
  height: 28px;
  bottom: 40px;
  right: 40px;
  opacity: ${(props) => (props.$hasScrolled ? "0" : "1")};
  transition: opacity 0.8s;
  padding: 10px;
  border: 2px solid #c4dcd9;
  border-radius: 50%;
  cursor: pointer;
  color: #c4dcd9;
  animation: pulse 1.5s infinite, floatfadein 4s 0.8s;

  &:hover {
    animation: floatfadein 3s 1;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.9);
    }
    70% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.9);
    }
  }

  @keyframes floatfadein {
    0% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
