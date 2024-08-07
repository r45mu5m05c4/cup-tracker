import styled from "styled-components";
import { FireIcon } from "@heroicons/react/20/solid";
import { Typography } from "../molecules/Typography";

interface DesktopMenuHeaderProps {
  collapsed: boolean;
  competitionName: string;
}

export const DesktopMenuHeader = ({
  collapsed,
  competitionName,
}: DesktopMenuHeaderProps) => (
  <Container>
    <LogoContainer>
      <StyledTrophyIcon />
    </LogoContainer>
    {!collapsed && <Typography variant="h4">{competitionName}</Typography>}
  </Container>
);

const Container = styled("div")`
  display: flex;
  align-items: center;
  padding: 8px;
  margin-top: 12px;
  color: #fff;

  h4 {
    font-family: "Roboto", sans-serif;
    white-space: nowrap;
  }
`;

const LogoContainer = styled("div")`
  width: 40px;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--decorative-brand-main);
`;

const StyledTrophyIcon = styled(FireIcon)`
  width: 26px;
  height: 26px;
  margin: auto;
  margin-left: 5%;
  margin-right: 5%;
`;
