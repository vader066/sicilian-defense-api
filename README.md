GET /api/players
returns all players
type:
{
message: string,
data: APPWRITE_PLAYERS,
status: number
}

GET /api/tournaments
returns all tournaments
type:
{
message: string,
data: APPWRITE_TOURNAMENT,
status: number
}

GET /api/lichess-tournament/:id
return games of lichess tournament of id: id
{
message: string,
data: ARENATOURNAMENTGAME[],
status: number
}
