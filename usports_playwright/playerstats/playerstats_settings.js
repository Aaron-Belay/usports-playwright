// Array of player data fields categorized into Offensive, Ball Control (Defensive), and Ball Control Extended statistics.
const playerDataFields = [

    // Offensive
    "games_played",
    "games_started",

    "minutes_played",
    "field_goal_made",
    "field_goal_percentage",
    "three_pointers_made",
    "three_pointers_percentage",
    "free_throws_made",
    "free_throws_percentage",
    "total_points",

    // Ball Control (Defensive)
    "offensive_rebounds",
    "defensive_rebounds",
    "total_rebounds",
    "assists",
    "turnovers",
    "steals",
    "blocks",

    // Ball Control Extended
    "personal_fouls",
    "disqualifications",
    "assist_to_turnover_ratio",
    "team"
];
  
// Mapping of team names to their respective conferences
const sortCategories = [
    
    "gp",
    "gs",
    "min",
    "pts",
    "fgp",
    "fgpt",
    "fgp3",
    "fgpt3",
    "ftp",
    "ftpt",
    "oreb",
    "dreb",
    "treb",
    "ast",
    "to",
    "stl",
    "blk",
    "pf",
    "dq",
    "ato"
  
];

// Mapping of stat group names to their respective dropdown values and number of stats
const playerStatGroups = {
    "Offense": { number_of_stats: 8 },
    "Defense": { number_of_stats: 7 },
    "Ball Control": { number_of_stats: 3 },
};

// Convert the keys from the statGroups object to an array for easier iteration
const playerStatGroupKeys = Object.keys(playerStatGroups);

// Export all constants and mappings at once
module.exports = {
    playerDataFields,
    sortCategories,
    playerStatGroups,
    playerStatGroupKeys
};