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
  HomePage,
  MobileHomePage
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

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
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
              style={{ fontWeight: "bold", fontSize: "60px" }}
            >
              {competition?.location || ""}
            </Typography>
            <Typography
              variant="h1"
              style={{
                fontWeight: "bolder",
                fontSize: "90px",
                color: "#15BA83",
                lineHeight: "78px",
                paddingBottom: "12px",
                marginTop: "-10px"
              }}
            >
              {competition?.name === "MHL" ? "Hockey Legue" : "Folkets Cup" || ""}
            </Typography>
            <Typography
              variant="h1"
              style={{
                fontWeight: "bold",
                fontSize: "60px",
                marginTop: "-8px"
              }}
            >
              {getYearOfCompetition()}
            </Typography>
          </div>
          <Typography
            variant="p"
            style={{ fontWeight: "500", marginBottom: "-20px", padding: "0 32px 18px 32px" }}
          >
            {competition?.name === "Folkets cup" ?
              "Join us for an exciting event on November 15-17. Experience live updates and follow your favorite players and teams right here with us." :
              "Welcome to the Malmö Hockey League (MHL), where local amateur teams come together to play hockey for the love of the game. Join us as we celebrate teamwork, passion, and the thrill of the ice!"
            }
          </Typography>
          {competition?.startDate && (
            <Countdown targetDate={competition.startDate} />
          )}
        </IntroContainer>
      </RowFirst>
      <Row>
        <NewsContainer $readMore={false} $hasScrolled={hasScrolled}>
          <NewsContainerHeader>
            <Typography variant="h4">Standings</Typography>
          </NewsContainerHeader>
          <TeamTable small={true} />
        </NewsContainer>
        <NewsContainer $readMore={false} $hasScrolled={hasScrolled} style={{ backgroundColor: "#093A48" }}>
          <NewsContainerHeader>
            <Typography variant="h4">Players</Typography>
          </NewsContainerHeader>
          <PlayerTable small={true} />
        </NewsContainer>
      </Row>
      <Row>
        <NewsContainer
          $readMore={readMore}
          $hasScrolled={hasScrolled}
          style={{
            backgroundImage: "linear-gradient(228.48deg, #054c54 1.31%, #054c5400 50.25%)"
          }}
        >
          {competition && (
            <ContentContainer $readMore={readMore}>
              <Typography variant="h4" style={{
                fontFamily: "'Space Mono', sans-serif",
                fontWeight: "bold",
                padding: "12px 0"

              }}>
                Tournament information
              </Typography>
              {competition.name === "Folkets cup" ? (
                <>
                  <Typography variant="p">
                    Folkets Puck Hockeyklubb invites you to Folkets Cup for
                    veteran teams, recreational teams and corporate teams. The
                    focus will be on having fun both on and off the ice. We will
                    organise an after-party, offer lunch, and aim to create an
                    even tournament where everyone has a chance to win!
                  </Typography>
                  <Typography variant="p" style={{
                    fontWeight: "bold",
                    paddingTop: "14px"
                  }}>
                    Date, Time & Location
                  </Typography>
                  <Typography variant="p">
                    November 16th & 17th 08.00 -
                    18.00 both days
                  </Typography>
                  <Link href="https://maps.app.goo.gl/JccSMdFjqRDeeiFP8">
                    Kirseberg Ishall, Malmö
                  </Link>
                  <Typography variant="p" style={{
                    fontWeight: "bold",
                    paddingTop: "14px"
                  }}>
                    Tournament Level
                  </Typography>
                  <Typography variant="p">
                    This
                    is an adult tournament. 19+ only. 1 Division. 8 Teams. 10-15
                    players + 1 goalie per team. Teams should ideally have a mix
                    of B & C series players. No A-series player / teams will be
                    accepted. (See details on player levels here).
                  </Typography>
                  <Typography variant="p" style={{
                    fontWeight: "bold",
                    paddingTop: "14px"
                  }}>
                    The rules people really care about:
                  </Typography>
                  <Typography variant="p">
                    Icing: Hybrid. Slapshots: No “full” slapshots. “Snapshots” are
                    okay. Basically - keep your stick below your knees. Hitting:
                    No! All rules:
                  </Typography>
                  <Typography variant="p" style={{
                    fontWeight: "bold",
                    paddingTop: "14px"
                  }}>
                    Food
                  </Typography>
                  <Typography variant="p">
                    Locker Room Snacks: There will be a snack basket
                    (fruit, energy, snacks) provided for each team. Lunch: No.
                  </Typography>
                  <Typography variant="p" style={{
                    fontWeight: "bold",
                    paddingTop: "14px"
                  }}>
                    After-party
                  </Typography>
                  <Typography variant="p">
                    Meet 19.30 on SATURDAY at our official
                    clubhouse:
                  </Typography>
                  <Link href="https://maps.app.goo.gl/92gsykBKaX6HEPC97">
                    V.E.D Restaurang & Bar
                  </Link>
                  <Typography variant="p">
                    Kristianstadsgatan 10A, 214 23 Malmö We will either stay
                    here or find something close by depending on how much space we
                    need. There are a ton of options within a couple blocks.
                  </Typography>
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
      </Row>
      {!isMobileDevice() && <Float $hasScrolled={hasScrolled} onClick={onClickFloatButton} />}
    </Container>
  );
};

export default News;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const IntroContainer = styled.div`
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
    opacity: 0.1;
    z-index: -1; 
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .4);

    @media (max-width: 768px) {
      background-image: url(${MobileHomePage});
    }
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
  height: 120px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 24px;
  gap: 50px;
  background-color: #072B38;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .4);

  @media (max-width: 768px) {
    height: 100%;
    width: 88%;
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
  background-color: transparent;
  color: #42917E;
  cursor: pointer;
  transition: border-color 0.25s;
  align-self: flex-end;
  margin-bottom: 20px;
  margin-right: 12px;

  &:disabled {
    background-color: #bababa;
    cursor: default;
  }
  &:hover {
    border: 1px solid transparent;
    color: #4EAB95;
  }
  &:active {
    border: 1px solid transparent;
  }
  &:focus {
    border: 1px solid transparent;
    outline: none;
  }
  &:target {
    border: 1px solid transparent;
  }
`;

const RowFirst = styled.div`
  width: 100%;
  height: calc(100vh - 76px);
  display: flex;
  flex-direction: column;
  padding-bottom: 14px;
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
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 80%;
`;

const NewsContainer = styled.div<{ $readMore: boolean; $hasScrolled: boolean }>`
  opacity: ${(props) => (props.$hasScrolled ? "1" : "0")};
  background-color: #072B38;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .4);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  ${(props) =>
    !props.$readMore &&
    `
      height: 350px;
      overflow: hidden;
    `};
  transition: 1s;
  margin: 14px;

  @media (min-width: 768px) {
    width: 100%;
`;

const NewsContainerHeader = styled.div`
  border-bottom: 1px solid #0E4051;
  padding: 20px 24px;
  font-family: 'Space Mono', sans-serif;
`;

const Link = styled.a`
  display: flex;
  align-items: center;
  color: #42917e;
  padding: 12px 0;

  &:hover {
    color: #4EAB95;
  }
`;

const Float = styled(ArrowDownIcon) <{ $hasScrolled: boolean; }>`
	position: fixed;
	width: 28px;
	height: 28px;
	bottom: 40px;
	right: 40px;
  opacity: 0;
  transition: opacity .8s;
  padding: 10px;
  border: 2px solid #c4dcd9;
  border-radius: 50%;
  cursor: pointer;
  color: #C4DCD9;
  animation: pulse 1.5s infinite, floatfadein 3.5s .8s;
  animation-fill-mode: forwards;
  background-color: #052029;

  ${(props) =>
    props.$hasScrolled &&
    `
      animation: floatfadeout .8s;
    `};

  &:hover {
    animation: floatfadein 4s .8s;
    opacity: 1;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(.95);
    }
    70% {
      transform: scale(1);
    }
  }

  @keyframes floatfadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes floatfadeout {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  `
