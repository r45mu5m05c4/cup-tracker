import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
} from "@heroicons/react/20/solid";
import NavHeader from "./NavHeader";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import { useCompetition } from "../utils/context/CompetitionContext";

interface LeftBarProps {
  $collapsed: boolean;
}

const NavMenu = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { competition } = useCompetition();

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    isMobileDevice() && setCollapsed(true);
  }, []);

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  return isMobileDevice() ? (
    <>
      {isMobileNavOpen ? (
        <MobileMenu isOpenProp={setIsMobileNavOpen} />)
        : (
          <HamburgerButton onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
            <StyledHamburgerIcon />
          </HamburgerButton>
        )}
    </>
  ) : (
    <LeftBar $collapsed={collapsed}>
      <NavHeader
        collapsed={collapsed}
        competitionName={competition ? competition.name : ""}
      />
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
  background-color: var(--neutral-surface-navMenu);
  border-right: 1px solid var(--neutral-border-onBase);
  z-index: 1;
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
const StyledHamburgerIcon = styled(Bars3Icon)`
  height: 34px;
  width: 34px;
  min-width: 24px;
  color: var(--neutral-icon-base);

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
  background-color: var(--decorative-brand-darker);
  width: 40px;
  min-width: 40px;
  height: 40px;
  border: none;

  &:hover {
    background-color: var(--decorative-brand-dark);
    border: none;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid var(--neutral-icon-base);
    outline-offset: 2px;
  }
`;
const HamburgerButton = styled.button`
  background-color: transparent;
  height: 46px;
  border: none;
  border-radius: 8px;
  position: fixed;
  z-index: 160;
  margin-top: 8px;
  margin-left: 8px;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;
