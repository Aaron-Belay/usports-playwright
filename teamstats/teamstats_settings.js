// Define an array of field names representing the data attributes to be collected for each team
const teamDataFields = [
  // Offensive Shooting statistics
  "games_played",
  "field_goals",
  "field_goal_percentage",
  "three_pointers",
  "three_point_percentage",
  "free_throws",
  "free_throw_percentage",
  "points_per_game",

  // Offensive Rebounding statistics
  "off_rebounds_per_game",
  "def_rebounds_per_game",
  "total_rebounds_per_game",
  "rebound_margin_per_game",

  // Offensive Ball Control statistics
  "turnovers_per_game",
  "steals_per_game",
  "blocks_per_game",
  "assists_per_game",

  // Offensive Performance Efficiency (PF/EFF) statistics
  "fouls_per_game",
  "off_efficiency",
  "net_efficiency",

  // Defensive Shooting statistics
  "field_goals_against",
  "field_goals_percentage_against",
  "three_points_against",
  "three_points_percentage_against",
  "points_per_game_against",

  // Defensive Rebounding statistics
  "offensive_rebounds_per_game_against",
  "defensive_rebounds_per_game_against",
  "total_rebounds_per_game_against",
  "rebound_margin_per_game_against",

  // Defensive Ball Control statistics
  "turnovers_per_game_against",
  "steals_per_game_against",
  "blocks_per_game_against",
  "assists_per_game_against",

  // Defensive Performance Efficiency (PF/EFF) statistics
  "team_fouls_per_game_against",
  "def_efficiency",

  // Additional statistics from standings
  "total_wins",
  "total_losses",
  "random_T",
  "win_percentage",
  "last_ten_games",
  "streak",
  "total_points",
  "total_points_against",

  // Conference information
  "conference",
];

// Mapping of team names to their respective conferences
const teamConference = {
  Acadia: "AUS",
  Alberta: "CW",
  Algoma: "OUA West",
  "Bishop's": "RSEQ",
  Brandon: "CW",
  Brock: "OUA Central",
  Calgary: "CW",
  "Cape Breton": "AUS",
  Carleton: "OUA East",
  Concordia: "RSEQ",
  Dalhousie: "AUS",
  Guelph: "OUA West",
  Lakehead: "OUA Central",
  Laurentian: "OUA East",
  Laurier: "OUA West",
  Laval: "RSEQ",
  Lethbridge: "CW",
  MacEwan: "CW",
  Manitoba: "CW",
  McGill: "RSEQ",
  McMaster: "OUA Central",
  Memorial: "AUS",
  "Mount Royal": "CW",
  Nipissing: "OUA East",
  "Ontario Tech": "OUA East",
  Ottawa: "OUA East",
  "Queen's": "OUA East",
  Regina: "CW",
  "Saint Mary's": "AUS",
  Saskatchewan: "CW",
  StFX: "AUS",
  "Thompson Rivers": "CW",
  Toronto: "OUA Central",
  "Toronto Metropolitan": "OUA Central",
  "Trinity Western": "CW",
  UBC: "CW",
  "UBC Okanagan": "CW",
  UFV: "CW",
  UNB: "AUS",
  UNBC: "CW",
  UPEI: "AUS",
  UQAM: "RSEQ",
  Victoria: "CW",
  Waterloo: "OUA West",
  Western: "OUA West",
  Windsor: "OUA West",
  Winnipeg: "CW",
  York: "OUA Central",
};

// Mapping of stat group names to their respective dropdown values and number of stats
const statGroups = {
  "Offense Shooting": { value: "#sh-0", number_of_stats: 7 },
  "Offense Rebounding": { value: "#rb-0", number_of_stats: 4 },
  "Offense Ball Control": { value: "#bc-0", number_of_stats: 4 },
  "Offense PF/EFF": { value: "#eff-0", number_of_stats: 3 },
  "Defense Shooting": { value: "#dsh-0", number_of_stats: 5 },
  "Defense Rebounding": { value: "#drb-0", number_of_stats: 4 },
  "Defense Ball Control": { value: "#dbc-0", number_of_stats: 4 },
  "Defense PF/EFF": { value: "#deff-0", number_of_stats: 2 },
};

// Convert the keys from the statGroups object to an array for easier iteration
const statGroupKeys = Object.keys(statGroups);

// Export all constants and mappings at once
module.exports = {
  teamDataFields,
  teamConference,
  statGroups,
  statGroupKeys
};