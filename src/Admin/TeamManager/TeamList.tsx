import { styled } from "styled-components";

import { useEffect, useMemo, useState } from "react";
import { getTeams } from "../../utils/queries";
import { Team } from "../../utils/types/Team";
import { useCompetition } from "../../utils/context/CompetitionContext";
import RemoveTeamModal from "./RemoveTeamModal";
import { AddTeamModal } from "./AddTeamModal";
import { Typography } from "../../molecules/Typography";
import { Select } from "../../molecules/Select";
import { Button } from "../../molecules/Button";
import { UpdateTeamModal } from "./UpdateTeamModal";
import { TrashIcon } from "@heroicons/react/20/solid";

export const TeamList = () => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("");
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (competition)
        try {
          const teamsFromAPI = await getTeams(competition.id);
          setTeams(teamsFromAPI);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
    };

    fetchAllTeams();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTeamFilter(event.target.value);
  };
  const removeTeam = (p: Team) => {
    setSelectedTeam(p);
    setShowRemoveModal(true);
  };
  const editTeam = (p: Team) => {
    setSelectedTeam(p);
    setShowUpdateModal(true);
  };
  const addTeam = () => {
    setShowAddModal(true);
  };

  const filteredData = useMemo(() => {
    let filtered = teams;

    if (teamFilter && filtered) {
      filtered = filtered.filter((item: Team) => item.name === teamFilter);
    }
    if (searchQuery && filtered) {
      filtered = filtered.filter((item: Team) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [teams, teamFilter, searchQuery]);

  return (
    <Container>
      <TopRow>
        <Select
          placeholder="Filter on team"
          options={teams.map((team) => ({
            value: team.name,
            label: team.name,
          }))}
          onChange={handleFilterChange}
        />
        <SearchInput
          name="search-field"
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <AddTeamButtonContainer>
          <Button onClick={() => addTeam()}>Add team</Button>
        </AddTeamButtonContainer>
      </TopRow>
      <List>
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((t: Team) => (
            <TeamCard key={t.id}>
              <TeamCell>{t.name}</TeamCell>
              <TeamCell>
                <img src={t.logo} style={{ height: "24px", width: "24px" }} />
              </TeamCell>
              <CellButtonContainer>
                <TeamCell>
                  <Button onClick={() => editTeam(t)}>Edit</Button>
                </TeamCell>
                <TeamCell>
                  <StyledTrashIcon onClick={() => removeTeam(t)} />
                </TeamCell>
              </CellButtonContainer>
            </TeamCard>
          ))
        ) : (
          <Typography style={{ marginTop: "24px" }}>
            {teams === null ? "" : "No teams yet."}
          </Typography>
        )}
      </List>
      {selectedTeam && showRemoveModal && (
        <RemoveTeamModal
          team={selectedTeam}
          setShowModal={setShowRemoveModal}
        />
      )}
      {selectedTeam && showUpdateModal && (
        <UpdateTeamModal
          team={selectedTeam}
          setShowModal={setShowUpdateModal}
        />
      )}
      {showAddModal && <AddTeamModal setShowModal={setShowAddModal} />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 70%;
  @media (max-width: 768px) {
    font-size: 0.8em;
    width: 100%;
  }
`;
const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 14px;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 14px;
  }
`;
const StyledTrashIcon = styled(TrashIcon)`
  height: 24px;
  cursor: pointer;
  color: var(--decorative-brand-light);
  margin-left: 24px;
`;
const AddTeamButtonContainer = styled.div`
  height: 50% !important;
  margin: auto;
  @media (min-width: 768px) {
    margin-right: 0;
  }
`;
const TeamCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: left;
  border: 1px solid;
  margin-top: 5px;
  padding: 10px;
  width: 100%;
`;
const CellButtonContainer = styled.div`
  display: flex;
  margin-right: 10px;
  margin-left: auto;
`;
const TeamCell = styled.div`
  margin: auto;
  margin-left: 10px;

  @media (min-width: 768px) {
    width: 25%;
  }
`;
const SearchInput = styled.input`
  padding: 8px;
  font-size: 1em;
  border-bottom: 1px solid var(--neutral-border-onContrast);
  border-radius: 0;
  background-color: transparent;
  color: #fff;
  margin: auto;
  height: 50%;
  &:focus {
    outline: none;
    border-bottom: 2px solid white;
  }
`;
