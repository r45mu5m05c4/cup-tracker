import { useState } from "react";
import styled from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import NavHeader from "./NavHeader";
import NavLinks from "./NavLinks";
interface LeftBarProps {
  $collapsed: boolean;
}

const NavMenu = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  console.log("location", location)

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  }

  return (
    <LeftBar $collapsed={collapsed}>
      <NavHeader collapsed={collapsed} />
      <NavLinks collapsed={collapsed} />
      <NavFooter>
        <CollapseSideMenuButton onClick={handleCollapse}>
          {collapsed ? (
            <StyledChevronLeftIcon onClick={handleCollapse} />
          ) : (
            <StyledChevronRightIcon />
          )}
        </CollapseSideMenuButton>
      </NavFooter>
    </LeftBar>
  );
};
export default NavMenu;

const LeftBar = styled.div<LeftBarProps>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.$collapsed ? "60px" : "260px")};
  min-width: ${(props) => (props.$collapsed ? "60px" : "260px")};
  border-top-right-radius: 30px;
  height: 100vh;
  justify-content: space-between;
  -webkit-transition: all 0.25s ease-in-out;
  -moz-transition: all 0.25s ease-in-out;
  -o-transition: all 0.25s ease-in-out;
  transition: all 0.25s ease-in-out;
  position: sticky;
  top: 0;
`;

const StyledChevronRightIcon = styled(ChevronLeftIcon)`
  height: 24px;
  width: 24px;
  min-width: 24px;
  color: var(--color-text-primary);

  &:hover {
    cursor: pointer;
  }
`;

const StyledChevronLeftIcon = styled(ChevronRightIcon)`
  height: 24px;
  width: 24px;
  min-width: 24px;
  color: var(--color-text-primary);
  
  &:hover {
    cursor: pointer;
  }
`;

const NavFooter = styled("div")`
  display: flex;
  margin-bottom: 24px;
  margin-left: 10px;
`;

const CollapseSideMenuButton = styled("button")`
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 50%;
  color: var(--color-text-primary);
  background-color: #0F4644;
  width: 40px;
  min-width: 40px;
  height: 40px;
  border: none;

  &:hover {
    background-color: #1D715D;
    border: none;
  }

  &:focus {
    outline: 1px solid var(--color-text-primary);
  }
`;
