import { CSSProperties, styled } from "styled-components";
import { ReactElement } from "react";
import { Typography } from "./Typography";

interface StartProps {
  children: ReactElement | ReactElement[];
  fadeIn?: boolean;
  readMore?: boolean;
  title?: string;
  style?: CSSProperties;
}

export const WidgetContainer = (props: StartProps) => (
  <Container
    $readMore={props.readMore}
    $fadeIn={props.fadeIn}
    style={props.style}
  >
    {props.title && (
      <ContainerHeader>
        <Typography variant="h4">{props.title}</Typography>
      </ContainerHeader>
    )}
    {props.children}
  </Container>
);

const Container = styled.div<{ $readMore?: boolean; $fadeIn?: boolean }>`
  background-color: var(--neutral-surface-contrast);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .4);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin: 14px;
  opacity: ${(props) => (props.$fadeIn ? "1" : "0")};
  transition: 1s;

    ${(props) =>
      !props.$readMore &&
      `
      height: 350px;
      overflow: hidden;
    `};

  @media (min-width: 768px) {
    width: 100%;
`;

const ContainerHeader = styled.div`
  border-bottom: 1px solid var(--neutral-border-onContrast);
  padding: 20px 24px;
  font-family: "Space Mono", sans-serif;
`;
