import { styled } from "styled-components";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Typography } from "../../molecules/Typography";
import { WidgetContainer } from "../../molecules/WidgetContainer";

interface StartProps {
  fadeIn: boolean;
}

export const StartInfoWidget = ({ fadeIn }: StartProps) => {
  const [readMore, setReadMore] = useState(false);
  const { competition } = useCompetition();

  return (
    <WidgetContainer
      readMore={readMore}
      fadeIn={fadeIn}
      style={{
        backgroundImage: `linear-gradient(228.48deg, 
          var(--neutral-surface-linear-gradient-base) 1.31%, 
          var(--neutral-surface-linear-gradient-contrast) 50.25%)`,
      }}
    >
      {competition ? (
        <ContentContainer $readMore={readMore}>
          <Typography
            variant="h4"
            style={{
              fontFamily: "'Space Mono', sans-serif",
              fontWeight: "bold",
              padding: "12px 0",
            }}
          >
            Tournament information
          </Typography>
          {competition.name === "Folkets cup" ? (
            <>
              <Typography>
                Folkets Puck Hockeyklubb invites you to Folkets Cup for veteran
                teams, recreational teams and corporate teams. The focus will be
                on having fun both on and off the ice. We will organise an
                after-party, offer lunch, and aim to create an even tournament
                where everyone has a chance to win!
              </Typography>
              <Typography
                style={{
                  fontWeight: "bold",
                  paddingTop: "14px",
                }}
              >
                Date, Time & Location
              </Typography>
              <Typography>
                November 16th & 17th 08.00 - 18.00 both days
              </Typography>
              <Link href="https://maps.app.goo.gl/JccSMdFjqRDeeiFP8">
                Kirseberg Ishall, Malmö
              </Link>
              <Typography
                style={{
                  fontWeight: "bold",
                  paddingTop: "14px",
                }}
              >
                Tournament Level
              </Typography>
              <Typography>
                This is an adult tournament. 19+ only. 1 Division. 8 Teams.
                10-15 players + 1 goalie per team. Teams should ideally have a
                mix of B & C series players. No A-series player / teams will be
                accepted. (See details on player levels here).
              </Typography>
              <Typography
                style={{
                  fontWeight: "bold",
                  paddingTop: "14px",
                }}
              >
                The rules people really care about:
              </Typography>
              <Typography>
                Icing: Hybrid. Slapshots: No “full” slapshots. “Snapshots” are
                okay. Basically - keep your stick below your knees. Hitting: No!
                All rules:
              </Typography>
              <Typography
                style={{
                  fontWeight: "bold",
                  paddingTop: "14px",
                }}
              >
                Food
              </Typography>
              <Typography>
                Locker Room Snacks: There will be a snack basket (fruit, energy,
                snacks) provided for each team. Lunch: No.
              </Typography>
              <Typography
                style={{
                  fontWeight: "bold",
                  paddingTop: "14px",
                }}
              >
                After-party
              </Typography>
              <Typography>
                Meet 19.30 on SATURDAY at our official clubhouse:
              </Typography>
              <Link href="https://maps.app.goo.gl/92gsykBKaX6HEPC97">
                V.E.D Restaurang & Bar
              </Link>
              <Typography>
                Kristianstadsgatan 10A, 214 23 Malmö We will either stay here or
                find something close by depending on how much space we need.
                There are a ton of options within a couple blocks.
              </Typography>
              <Link href="https://drive.google.com/file/d/1JeJR4cDL32rKlIDix9B7QrZF06HAmaTd/view">
                View Full Tournament Info via PDF
              </Link>
            </>
          ) : (
            competition?.description
          )}
        </ContentContainer>
      ) : (
        <></>
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
    </WidgetContainer>
  );
};

const ContentContainer = styled.div<{ $readMore: boolean }>`
  flex: 1;
  overflow: ${(props) => (props.$readMore ? "auto" : "hidden")};
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 80%;
`;

const DownIconButton = styled(ChevronDownIcon)`
  height: 20px;
  margin: auto;
  cursor: pointer;
  &:hover {
    color: var(--decorative-brand-light);
  }
`;

const UpIconButton = styled(ChevronUpIcon)`
  height: 20px;
  margin: auto;
  cursor: pointer;
  &:hover {
    color: var(--decorative-brand-light);
  }
`;

const ReadMoreButton = styled.button`
  display: flex;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 600;
  background-color: transparent;
  color: var(--decorative-brand-light);
  cursor: pointer;
  transition: border-color 0.25s;
  align-self: flex-end;
  margin-bottom: 20px;
  margin-right: 12px;

  &:disabled {
    background-color: var(--text-muted);
    cursor: default;
  }
  &:hover {
    border: 1px solid transparent;
    color: var(--decorative-brand-lighter);
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

const Link = styled.a`
  display: flex;
  align-items: center;
  color: var(--decorative-brand-light);
  padding: 12px 0;

  &:hover {
    color: var(--decorative-brand-lighter);
  }
`;
