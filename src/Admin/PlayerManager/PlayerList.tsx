import { styled } from "styled-components";

import { useEffect, useMemo, useState } from "react";
import { Team } from "../../utils/types/Team";
import { getPlayers, getTeams } from "../../utils/queries";
import { useUser } from "../../utils/context/UserContext";
import { Player } from "../../utils/types/Player";
import { useCompetition } from "../../utils/context/CompetitionContext";
import RemovePlayerModal from "./RemovePlayerModal";
import { UpdatePlayerModal } from "./UpdatePlayerModal";
import { Typography } from "../../molecules/Typography";
import { Select } from "../../molecules/Select";
import { Button } from "../../molecules/Button";
import { AddPlayerModal } from "./AddPlayerModal";
import { TrashIcon } from "@heroicons/react/20/solid";

export const PlayerList = () => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("");
  const { user, refreshAccessToken } = useUser();
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
    const fetchAllPlayers = async () => {
      if (user?.accessToken && competition)
        try {
          await refreshAccessToken();
          const playersFromAPI = await getPlayers(
            user.accessToken,
            competition.name
          );
          setPlayers(playersFromAPI);
        } catch (error) {
          console.error("Error fetching players:", error);
        }
    };
    fetchAllPlayers();
    fetchAllTeams();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTeamFilter(event.target.value);
  };
  const removePlayer = (p: Player) => {
    setSelectedPlayer(p);
    setShowRemoveModal(true);
  };
  const editPlayer = (p: Player) => {
    setSelectedPlayer(p);
    setShowUpdateModal(true);
  };
  const addPlayer = () => {
    setShowAddModal(true);
  };

  const filteredData = useMemo(() => {
    let filtered = players;

    if (teamFilter && filtered) {
      filtered = filtered.filter(
        (item: Player) => item.teamName === teamFilter
      );
    }
    if (searchQuery && filtered) {
      filtered = filtered.filter((item: Player) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [players, teamFilter, searchQuery]);

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
        <AddPlayerButtonContainer>
          <Button onClick={() => addPlayer()}>Add player</Button>
        </AddPlayerButtonContainer>
      </TopRow>
      <List>
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((p: Player) => (
            <PlayerCard key={p.id}>
              <PlayerCell>{p.name}</PlayerCell>
              <PlayerCell>{p.jerseyNumber}</PlayerCell>
              <PlayerCell>{p.position}</PlayerCell>
              <CellButtonContainer>
                <PlayerCell>
                  <Button onClick={() => editPlayer(p)}>Edit</Button>
                </PlayerCell>
                <PlayerCell>
                  <StyledTrashIcon onClick={() => removePlayer(p)} />
                </PlayerCell>
              </CellButtonContainer>
            </PlayerCard>
          ))
        ) : (
          <Typography style={{ marginTop: "24px" }}>
            {players === null ? "" : "No players yet."}
          </Typography>
        )}
      </List>
      {selectedPlayer && showRemoveModal && (
        <RemovePlayerModal
          player={selectedPlayer}
          setShowModal={setShowRemoveModal}
        />
      )}
      {selectedPlayer && showUpdateModal && (
        <UpdatePlayerModal
          player={selectedPlayer}
          setShowModal={setShowUpdateModal}
        />
      )}
      {showAddModal && <AddPlayerModal setShowModal={setShowAddModal} />}
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
const AddPlayerButtonContainer = styled.div`
  height: 50%;
  margin: auto;
  @media (min-width: 768px) {
    margin-right: 0;
  }
`;
const PlayerCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: left;
  border: 1px solid;
  margin-top: 5px;
  padding: 10px;
  width: 100%;
`;
const StyledTrashIcon = styled(TrashIcon)`
  height: 24px;
  cursor: pointer;
  color: var(--decorative-brand-light);
  margin-left: 24px;
`;
const CellButtonContainer = styled.div`
  display: flex;
  margin-right: 10px;
  margin-left: auto;
`;
const PlayerCell = styled.p`
  margin: auto;
  margin-left: 10px;
  width: 25%;
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
