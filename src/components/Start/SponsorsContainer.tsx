import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { sponsorLogos } from "../../constants/sponsors";

export const SponsorsContainer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      {sponsorLogos.map((logo, index) => (
        <Link key={index} href={logo.href} $isActive={index === currentIndex}>
          <Logo src={logo.src} />
        </Link>
      ))}
    </Container>
  );
};

const Container = styled.div`
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
  background-color: var(--neutral-surface-contrast);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    height: 100%;
    width: 88%;
  }
`;

const Logo = styled.img`
  height: 100%;
  width: 100%;
`;

const Link = styled.a<{ $isActive: boolean }>`
  display: ${(props) => (props.$isActive ? "flex" : "none")};
  align-self: center;
  height: 100%;
  width: 100%;
  @media (min-width: 769px) {
    display: block; /* Always show logos side-by-side on desktop */
    width: 20%;
  }
`;
