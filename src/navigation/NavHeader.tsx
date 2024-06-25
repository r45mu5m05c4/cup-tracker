
import styled from "styled-components";
import Typography from "../molecules/Typography";
import { FireIcon } from "@heroicons/react/20/solid";

interface NavHeaderProps {
  collapsed: boolean;
}

const NavHeader = ({ collapsed }: NavHeaderProps) => (
  <Container>
    <LogoContainer>
      <StyledTrophyIcon />
    </LogoContainer>
    {!collapsed && <Typography variant="h4" style={{ whiteSpace: "nowrap" }}>Folkets cup</Typography>}
  </Container>
);

export default NavHeader;

const Container = styled("div")`
  display: flex;
  align-items: center;
  padding: 8px;
  margin-top: 6px;
  color: #fff;
`;

const LogoContainer = styled("div")`
  width: 40px;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #42917E;
`;

const StyledTrophyIcon = styled(FireIcon)`
  width: 26px;
  height: 26px;
  margin: auto;
  margin-left: 5%;
  margin-right: 5%;
`;
