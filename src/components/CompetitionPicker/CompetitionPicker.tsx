import { styled } from "styled-components";
import { useCompetition } from "../../utils/context/CompetitionContext";
import Typography from "../../molecules/Typography";
import { useUser } from "../../utils/context/UserContext";
import { useEffect, useRef, useState } from "react";
import { getCompetitions } from "../../utils/queries";
import { Competition } from "../../utils/types/Competition";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import LoginModal from "../../home/LoginModal";
import { competitionPosters } from "./../../utils/Logos";

interface CompetitionWithLogo extends Competition {
  logo: string;
}

const CompetitionPicker = () => {
  const { setCompetition } = useCompetition();
  const { user } = useUser();
  const [competitions, setCompetitions] = useState<
    CompetitionWithLogo[] | null
  >(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [popupPosition, setPopupPosition] = useState(0);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const fetchAllCompetitions = async () => {
      if (user?.accessToken)
        try {
          const allCompetitions = await getCompetitions(user.accessToken);
          const compLogoLoop = allCompetitions.map((c: Competition) => {
            const compLogo = competitionPosters.find(
              (l: { compName: string; logo: string }) => c.name === l.compName
            );

            return { ...c, logo: compLogo?.logo };
          });
          setCompetitions(compLogoLoop);
        } catch (error) {
          console.error("Error adding teams:", error);
        }
    };

    fetchAllCompetitions();
  }, [user]);

  const togglePopup = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition(rect.bottom + window.scrollY);
    }
    setShowLoginModal(!showLoginModal);
  };

  return (
    <Container>
      <Header>
        <Typography variant="h1" children="Choose competition"></Typography>
        <IconButton ref={buttonRef} onClick={() => togglePopup()}>
          <HamburgerMenuIcon />
          {showLoginModal && (
            <LoginModal
              popupPosition={popupPosition}
              showLoginModal={setShowLoginModal}
            />
          )}
        </IconButton>
      </Header>
      <Row>
        {competitions?.map((comp: CompetitionWithLogo) =>
          comp.logo ? (
            <ImgButton src={comp.logo} onClick={() => setCompetition(comp)} />
          ) : (
            <Button key={comp.id} onClick={() => setCompetition(comp)}>
              {comp.name}
            </Button>
          )
        )}
      </Row>
    </Container>
  );
};
export default CompetitionPicker;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  gap: 24px;
  padding: 24px;
  @media (max-width: 768px) {
    gap: 0;
  }
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 24px;
  gap: 24px;
  align-items: center;
  margin: auto;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const ImgButton = styled.img`
  cursor: pointer;
  width: 20%;
  height: auto;
  padding: 10px;
  &:hover {
    border: 1px solid #000;
    padding: 9px;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.25s;
  margin: auto;
`;
const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 60%;
  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 0;
    flex-direction: column;
  }
`;
const IconButton = styled.button`
  background-color: transparent;
  border: 1px solid transparent;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;

  &:hover {
    border-color: #e0e0e0;
  }

  &:active {
    border-color: #e0e0e0;
  }
`;
const HamburgerMenuIcon = styled(UserCircleIcon)`
  color: #e0e0e0;
  width: 28px;
  height: 28px;
`;
