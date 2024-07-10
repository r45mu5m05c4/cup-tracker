import { useEffect, useMemo, useState } from "react";
import { Game } from "../../utils/types/Game";
import { useUser } from "../../utils/context/UserContext";
import { getGames, getTeams } from "../../utils/queries";
import { styled } from "styled-components";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Typography } from "../../molecules/Typography";
import { Button } from "../../molecules/Button";
import { Select } from "../../molecules/Select";
import { Team } from "../../utils/types/Team";
import { TrashIcon } from "@heroicons/react/20/solid";
import { format } from "date-fns";
import { GameManagerModal } from "./GameManagerModal";
import { ScheduleGameModal } from "./ScheduleGameModal";
import { RemoveGameModal } from "./RemoveGameModal";

export const GameList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshAccessToken } = useUser();
  const { competition } = useCompetition();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("");

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken && competition)
        try {
          await refreshAccessToken();
          const teamsFromAPI = await getTeams(
            user.accessToken,
            competition.name
          );
          setTeams(teamsFromAPI);
        } catch (error) {
          setError(`Error fetching games: ${error}`);
        }
    };
    const fetchAllGames = async () => {
      if (user?.accessToken && competition)
        try {
          await refreshAccessToken();
          const gamesFromAPI = await getGames(
            user.accessToken,
            competition.name
          );
          setGames(gamesFromAPI);
        } catch (error) {
          setError(`Error fetching games: ${error}`);
        }
    };

    fetchAllTeams();
    fetchAllGames();
  }, [user]);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTeamFilter(event.target.value);
  };
  const removeGame = (g: Game) => {
    setSelectedGame(g);
    setShowRemoveModal(true);
  };
  const liveGame = (g: Game) => {
    setSelectedGame(g);
    setShowUpdateModal(true);
  };
  const addGame = () => {
    setShowAddModal(true);
  };
  const filteredData = useMemo(() => {
    let filtered = games;

    if (teamFilter && filtered) {
      filtered = filtered.filter(
        (item: Game) =>
          item.homeTeam.toLowerCase() === teamFilter.toLowerCase() ||
          item.awayTeam.toLowerCase() === teamFilter.toLowerCase()
      );
    }
    if (searchQuery && filtered) {
      filtered = filtered.filter(
        (item: Game) =>
          item.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.awayTeam.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [games, teamFilter, searchQuery]);

  return (
    <Container>
      {games.length > 0 ? (
        <>
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
            <AddGameButtonContainer>
              <Button onClick={() => addGame()}>Add game</Button>
            </AddGameButtonContainer>
          </TopRow>
          <List>
            {filteredData.map((g) => (
              <GameWrapper key={g.gameId}>
                <GameCard key={g._id}>
                  <GameCell>
                    {g.awayTeam} @ {g.homeTeam}
                  </GameCell>
                  <GameCell>{g.gameStage}</GameCell>
                  <GameCell>{format(g.startTime, "HH:mm dd/MM")}</GameCell>
                  <GameCell>
                    <Button onClick={() => liveGame(g)}>Live</Button>
                  </GameCell>
                  <GameCell>
                    <StyledTrashIcon onClick={() => removeGame(g)} />
                  </GameCell>
                </GameCard>
              </GameWrapper>
            ))}
          </List>
        </>
      ) : (
        <Typography>No games yet.</Typography>
      )}
      {error && <p>{error}</p>}
      {selectedGame && showRemoveModal && (
        <RemoveGameModal
          game={selectedGame}
          setShowModal={setShowRemoveModal}
        />
      )}
      {selectedGame && showUpdateModal && (
        <GameManagerModal
          pickedGame={selectedGame}
          setShowModal={setShowUpdateModal}
        />
      )}
      {showAddModal && <ScheduleGameModal setShowModal={setShowAddModal} />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTrashIcon = styled(TrashIcon)`
  height: 24px;
  cursor: pointer;
  color: var(--decorative-brand-light);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GameWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 14px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 14px;
  }
`;
const AddGameButtonContainer = styled.div`
  height: 50% !important;
  margin: auto;
  @media (min-width: 768px) {
    margin-right: 0;
  }
`;
const GameCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: left;
  border: 1px solid;
  margin-top: 5px;
  padding: 10px;
  width: 100%;
  @media (max-width: 768px) {
    font-size: 0.8em;
    flex-direction: row;
  }
`;
const GameCell = styled.p`
  margin: auto;
  margin-left: 10px;
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
