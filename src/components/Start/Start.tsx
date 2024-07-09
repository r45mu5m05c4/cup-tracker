import { styled } from "styled-components";
import PlayerTable from "../PlayerTable";
import TeamTable from "../TeamTable";
import { ArrowDownIcon } from "@heroicons/react/20/solid";
import { isMobileDevice } from "../../utils/devices";
import { StartHeader } from "./StartHeader";
import { WidgetContainer } from "../../molecules/WidgetContainer";
import { StartInfoWidget } from "./StartInfoWidget";
import { SponsorsContainer } from "./SponsorsContainer";

interface StartProps {
  hasScrolled: boolean;
}

export const Start = ({ hasScrolled }: StartProps) => {
  const onClickFloatButton = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <Container>
      <StartHeader />
      <Row>
        <WidgetContainer title="Standings" fadeIn={hasScrolled}>
          <TeamTable small={true} />
        </WidgetContainer>
        <WidgetContainer
          title="Stats"
          fadeIn={hasScrolled}
          style={{ backgroundColor: "var(--neutral-surface-second)" }}
        >
          <PlayerTable small={true} />
        </WidgetContainer>
      </Row>
      <Row>
        <StartInfoWidget fadeIn={hasScrolled} />
      </Row>
      <Row>
        <SponsorsContainer />
      </Row>
      {!isMobileDevice() && (
        <FloatButton $hasScrolled={hasScrolled} onClick={onClickFloatButton} />
      )}
    </Container>
  );
};

const Container = styled.div`
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

const FloatButton = styled(ArrowDownIcon)<{ $hasScrolled: boolean }>`
  position: fixed;
  width: 28px;
  height: 28px;
  bottom: 40px;
  right: 40px;
  opacity: 0;
  transition: opacity 0.8s;
  padding: 10px;
  border: 2px solid var(--neutral-icon-base);
  border-radius: 50%;
  cursor: pointer;
  color: var(--neutral-icon-base);
  animation:
    pulse 1.5s infinite,
    floatfadein 3.5s 0.8s;
  animation-fill-mode: forwards;
  background-color: var(--neutral-surface-base);

  ${(props) =>
    props.$hasScrolled &&
    `
      animation: floatfadeout .8s;
    `};

  &:hover {
    animation: floatfadein 4s 0.8s;
    opacity: 1;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(0.95);
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
`;
