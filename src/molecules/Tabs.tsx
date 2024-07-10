import { ReactElement, useState } from "react";
import styled from "styled-components";
import { Typography } from "./Typography";

interface TabsProps {
  items: { label: string; content: ReactElement | ReactElement[] }[];
}

export const Tabs = ({ items }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <TabsContainer>
      <TabHeaders>
        {items.map((child, index) => (
          <TabHeader
            key={index}
            $active={activeTab === index}
            onClick={() => handleTabClick(index)}
            tabIndex={0}
          >
            <Typography>{child.label}</Typography>
          </TabHeader>
        ))}
      </TabHeaders>
      <TabContent>
        {items.map((child, index) => (
          <TabPanel
            key={index}
            $active={activeTab === index}
          >
            {child.content}
          </TabPanel>
        ))}
      </TabContent>
    </TabsContainer>
  );
};

interface StyleProps {
  $active: boolean;
}

const TabsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TabHeaders = styled.div`
  display: flex;
  border-bottom: 1px solid var(--decorative-brand-light);
`;

const TabHeader = styled.div<StyleProps>`
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) =>
      props.$active ? "var(--decorative-brand-light)" : "transparent"};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  color: ${(props) =>
    props.$active ? "var(--text-base)" : "var(--text-muted)"};

  &:hover {
    color: var(--decorative-brand-lighter);
  }
  &:active {
    border: 1px solid transparent;
  }
  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;

const TabContent = styled.div`
  padding-top: 24px;
`;

const TabPanel = styled.div<StyleProps>`
  display: ${(props) => (props.$active ? "block" : "none")};
`;
