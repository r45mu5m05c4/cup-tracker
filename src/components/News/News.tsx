import { styled } from "styled-components";
import PlayerTable from "../PlayerTable";
import TeamTable from "../TeamTable";
import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import {
  STARKALogo,
  EVT_black,
  FischerDarkLogo,
  VEDLogo,
} from "./../../assets";

const News = () => {
  const [readMore, setReadMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      src: EVT_black,
    },
    {
      href: "https://www.facebook.com/groups/814348622554926",
      src: FischerDarkLogo,
    },
    { href: "https://www.instagram.com/ved_restaurang_bar/", src: VEDLogo },
  ];

  return (
    <Container>
      <Row>
        <NewsContainer $readMore={false}>
          <PlayerTable small={true} />
        </NewsContainer>
        <NewsContainer $readMore={false}>
          <TeamTable small={true} />
        </NewsContainer>
      </Row>
      <Row>
        <NewsContainer style={{ padding: "24px" }} $readMore={readMore}>
          <ContentContainer $readMore={readMore}>
            <h2>Welcome to Folkets Cup 2024</h2>
            Folkets Puck Hockeyklubb invites you to Folkets Cup for veteran
            teams, recreational teams and corporate teams. <br />
            <br /> The focus will be on having fun both on and off the ice. We
            will organise an after-party, offer lunch, and aim to create an even
            tournament where everyone has a chance to win!
            <br />
            <br />
            <Link href="https://drive.google.com/file/d/1JeJR4cDL32rKlIDix9B7QrZF06HAmaTd/view">
              View Full Tournament Info via PDF
            </Link>
            <h3>Date, Time & Location</h3> November 16th & 17th 08.00 - 18.00
            both days
            <Link href="https://maps.app.goo.gl/JccSMdFjqRDeeiFP8">
              Kirseberg Ishall, Malmö
            </Link>
            Österhagsgatan 3, 212 22 Malmö <h3>Tournament Level</h3>
            <ul>
              <li>This is an adult tournament. 19+ only.</li>
              <li> 1 Division. </li>
              <li> 8 Teams. </li>
              <li> 10-15 players + 1 goalie per team.</li>
              <li>Teams should ideally have a mix of B & C series players.</li>
              <li>
                No A-series player / teams will be accepted.
                <Link href="https://drive.google.com/file/d/1JeJR4cDL32rKlIDix9B7QrZF06HAmaTd/view?usp=sharing">
                  See details on player levels here
                </Link>
              </li>
            </ul>
            <h3>The rules people really care about:</h3>
            <ul>
              <li>Icing: Hybrid.</li>
              <li>
                Slapshots: No “full” slapshots. “Snapshots” are okay. Basically
                - keep your stick below your knees.
              </li>
              <li>Hitting: No! </li>
              <li>
                All rules:
                <Link href="https://drive.google.com/file/d/1JeJR4cDL32rKlIDix9B7QrZF06HAmaTd/view?usp=sharing">
                  View Full Tournament Info via PDF
                </Link>
              </li>
            </ul>
            <h3>Food</h3> Locker Room Snacks: There will be a snack basket
            (fruit, energy, snacks) provided for each team. <br />
            Lunch: No.
            <h3>After-party</h3> Meet 19.30 on SATURDAY at our official
            clubhouse:
            <Link href="https://maps.app.goo.gl/92gsykBKaX6HEPC97">
              V.E.D Restaurang & Bar
            </Link>
            Kristianstadsgatan 10A <br /> 214 23 Malmö
            <br />
            <br />
            We will either stay here or find something close by depending on how
            much space we need. There are a ton of options within a couple
            blocks.
            <Link href="https://drive.google.com/file/d/1JeJR4cDL32rKlIDix9B7QrZF06HAmaTd/view?usp=sharing">
              View Full Tournament Info via PDF
            </Link>
          </ContentContainer>
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
        <NewsContainer $readMore={false}>
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

const Row = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentContainer = styled.div<{ $readMore: boolean }>`
  flex: 1;
  overflow: ${(props) => (props.$readMore ? "auto" : "hidden")};
`;

const NewsContainer = styled.div<{ $readMore: boolean }>`
  background-color: var(--color-background-primary-darker);
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
  @media (min-width: 768px) {
    width: 100%;
  }
`;

const Link = styled.a`
  display: flex;
  align-items: center;
  color: #42917e;
  &:hover {
    color: #000;
  }
`;
