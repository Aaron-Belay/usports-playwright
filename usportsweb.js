const { chromium, firefox, webkit } = require('playwright');

//Use to write files
const fs = require('fs');

// Helper function to wait
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
 
// The functions

const teamDataFields = [

// Offensive Shooting
'games_played',
'field_goals',
'field_goal_percentage',
'three_pointers',
'three_point_percentage',
'free_throws',
'free_throw_percentage',
'points_per_game',

// Offensive Rebounding
'off_rebounds_per_game',
'def_rebounds_per_game',
'total_rebounds_per_game',
'rebound_margin_per_game',

// Offensive Ball Control
'turnovers_per_game',
'steals_per_game',
'blocks_per_game',
'assists_per_game',

// Offensive PF/EFF
'fouls_per_game',
'off_efficiency',
'net_efficiency',

// Defensive Shooting
'field_goals_against',
'field_goals_percentage_against',
'three_points_against',
'three_points_percentage_against',
'points_per_game_against',

// Defensive Rebounding
'offensive_rebounds_per_game_against',
'defensive_rebounds_per_game_against',
'total_rebounds_per_game_against',
'rebound_margin_per_game_against',

// Defensive Ball Control
'turnovers_per_game_against',
'steals_per_game_against',
'blocks_per_game_against',
'assists_per_game_against',

// Defensive PF/EFF
'team_fouls_per_game_against',
'def_efficiency',

// From The Standings
'total_wins',
'total_losses',
'win_percentage',
'last_ten_games',
'streak',
'total_points',
'total_points_against'
        
];

const teamConference = {
    'Acadia': 'AUS',
    'Alberta': 'CW',
    'Algoma': 'OUA West',
    'Bishop\'s': 'RSEQ',
    'Brandon': 'CW',
    'Brock': 'OUA Central',
    'Calgary': 'CW',
    'Cape Breton': 'AUS',
    'Carleton': 'OUA East',
    'Concordia': 'RSEQ',
    'Dalhousie': 'AUS',
    'Guelph': 'OUA West',
    'Lakehead': 'OUA Central',
    'Laurentian': 'OUA East',
    'Laurier': 'OUA West',
    'Laval': 'RSEQ',
    'Lethbridge': 'CW',
    'MacEwan': 'CW',
    'Manitoba': 'CW',
    'McGill': 'RSEQ',
    'McMaster': 'OUA Central',
    'Memorial': 'AUS',
    'Mount Royal': 'CW',
    'Nipissing': 'OUA East',
    'Ontario Tech': 'OUA East',
    'Ottawa': 'OUA East',
    'Queen\'s': 'OUA East',
    'Regina': 'CW',
    'Saint Mary\'s': 'AUS',
    'Saskatchewan': 'CW',
    'StFX': 'AUS',
    'Thompson Rivers': 'CW',
    'Toronto': 'OUA Central',
    'Toronto Metropolitan': 'OUA Central',
    'Trinity Western': 'CW',
    'UBC': 'CW',
    'UBC Okanagan': 'CW',
    'UFV': 'CW',
    'UNB': 'AUS',
    'UNBC': 'CW',
    'UPEI': 'AUS',
    'UQAM': 'RSEQ',
    'Victoria': 'CW',
    'Waterloo': 'OUA West',
    'Western': 'OUA West',
    'Windsor': 'OUA West',
    'Winnipeg': 'CW',
    'York': 'OUA Central'
}

// Mapping of option text to their corresponding values
const statGroups = {
  "Offense Shooting": { value: "#sh-0", number_of_stats: 7},
  "Offense Rebounding": { value: "#rb-0", number_of_stats: 4},
  "Offense Ball Control": { value: "#bc-0", number_of_stats: 4},
  "Offense PF/EFF": { value: "#eff-0", number_of_stats: 3},
  "Defense Shooting": { value: "#dsh-0", number_of_stats: 5 },
  "Defense Rebounding": { value: "#drb-0", number_of_stats: 4 },
  "Defense Ball Control": { value: "#dbc-0", number_of_stats: 4 },
  "Defense PF/EFF": { value: "#deff-0", number_of_stats: 2 }
};

// Convert the keys to an array
const statGroupKeys = Object.keys(statGroups);

/**
 * Fetches team data from the specified stats URL and processes the table data.
 * @param {string} statsUrl - The URL of the page containing the stats.
 * @param {string} standingsUrl - The URL of the page containing the standings (not used in this function).
 * @param {number} noOfTeams - The number of teams to process (not used in this function).
 * @returns {Promise<void>}
 */

async function fetchAllTeamData(statsUrl, standingsUrl) {
  // Launch a Chromium browser instance in headless mode (set to false to show the browser window)
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage(); // Open a new page

    // Select the dropdown element and choose 100 entries
    await page.selectOption('#dt-length-0', '100');

    // Object to store the extracted data, mapping team names to their data
    const data = {};

    // Initialize global indexes for stat fields and stat groups
    let global_stat_index = 1;
    let global_stat_group_index = 0;

    // Iterate over each stat group (total of 8 groups)
    for (let i = 0; i <= 7; i++) {
      // Access the stat group based on the current index
      const selectedStatGroup = statGroups[statGroupKeys[i]];

      // Select the dropdown element and choose the desired option for the current stat group
      await page.selectOption("#stats-team-secondary-select", selectedStatGroup.value);

      // Fetch data for the current stat group
      await fetchEachStatGroup(page, selectedStatGroup.number_of_stats, data, global_stat_index, global_stat_group_index);

      // Update global indexes for the next batch
      global_stat_index += selectedStatGroup.number_of_stats;
      global_stat_group_index++;
    }

    /* Standings */

    /* Just can't get the team name for some reason

    // Navigate to the stats URL with a timeout of 2 minutes
    await page.goto(standingsUrl, { timeout: 2 * 60 * 1000 });

    // Iterate over each conference
    for (let i = 0; i < 6; i++) {

      // Fetch data for the current stat group
      await fetchEachConference(page, data, global_stat_index, i);

      // global stat index is the same

    }

    */

    // Log the extracted data
    console.log(data);

    // Wait for the page to load completely before closing the browser
    await browser.close();

  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error fetching team data:", error);
  } finally {
    // Ensure the browser is closed even if an error occurs
    await browser.close();
  }
}

async function fetchEachConference(page, data, global_stat_index, tbody_index) {
  try {

    // Get all 'tbody' elements on the page
    const tbodies = await page.$$("tbody");

    // Check if 'tbody' elements are present
    if (tbodies.length === 0) {
        console.error("No tbody elements found");
        await browser.close();
        return;
    }

    // Select the appropriate 'tbody' element based on the current conference
    const tbody = tbodies[tbody_index];

    // Get all rows within the selected 'tbody'
    const rows = await tbody.$$("tr");

    

    // Log the number of rows for debugging purposes
    console.log(`Number of rows: ${rows.length}`);

    // Iterate through each row
    for (const row of rows) {
      // Select all 'td' elements within each row
      const cols = await row.$$('td');
      const special_row = await row.$$('th');
      const special_a = await special_row.$$('a'); // THIS DOENST WORK IDK WHY

      // Temporary index to track the current stat field
      let local_stat_index = global_stat_index;

      // Ensure the row has more than one column
      if (cols.length > 1) {

        // Extract the team name from the second column
        const teamName = await special_a.innerText(); // might have to change

        // There are the same 7 stats for each conference's teams
        for (let i = 0; i < 7; i++) {
          let inner_number = i + 2;

          // Ensure cols[inner_number] exists before accessing its innerText
          if (cols[inner_number]) {
            data[teamName][teamDataFields[local_stat_index]] = await cols[inner_number].innerText();
            local_stat_index++;
          }
        }
      }
    }
  } catch (error) {
    // Handle any errors that occur
    console.error("Error in fetchEachConference:", error);
  }
}

async function fetchEachStatGroup(page, number_of_stats, data, global_stat_index, global_stat_group_index) {
  try {
    // Select the dropdown element to change the number of entries displayed to '100'
    const select_id = "#dt-length-" + String(global_stat_group_index);
    await page.selectOption(select_id, "100"); // Ensure dropdown change is awaited

    // Get all 'tbody' elements on the page
    const tbodies = await page.$$("tbody");

    // Check if 'tbody' elements are present
    if (tbodies.length === 0) {
      console.error("No tbody elements found");
      return;
    }

    // Select the appropriate 'tbody' element based on the current stat group index
    const tbody = tbodies[global_stat_group_index];

    // Get all rows within the selected 'tbody'
    const rows = await tbody.$$("tr");

    // Log the number of rows for debugging purposes
    console.log(`Number of rows: ${rows.length}`);

    // Iterate through each row
    for (const row of rows) {
      // Select all 'td' elements within each row
      const cols = await row.$$('td');

      // Temporary index to track the current stat field
      let local_stat_index = global_stat_index;

      // Ensure the row has more than one column
      if (cols.length > 1) {
        // Extract the team name from the second column
        const teamName = await cols[1].innerText();

        // Create a new entry in the data map for this team if it doesn't already exist
        if (!data[teamName]) {
          data[teamName] = {}; // Initialize an empty object for the team
          data[teamName][teamDataFields[0]] = await cols[2].innerText(); // Set games_played field
        }

        // Populate the data for this team with the specified number of stats
        for (let i = 0; i < number_of_stats; i++) {
          let inner_number = i + 3;
          // Ensure cols[inner_number] exists before accessing its innerText
          if (cols[inner_number]) {
            data[teamName][teamDataFields[local_stat_index]] = await cols[inner_number].innerText();
            local_stat_index++;
          }
        }
      }
    }
  } catch (error) {
    // Handle any errors that occur
    console.error("Error in fetchEachStatGroup:", error);
  }
  
(async () => {
    const menUrls = [
      'https://universitysport.prestosports.com/sports/mbkb/2023-24/teams?sort=&r=0&pos=off',
      'https://universitysport.prestosports.com/sports/mbkb/2023-24/standings-conf'
    ];
    const womenUrls = [
      'https://universitysport.prestosports.com/sports/wbkb/2023-24/teams?sort=&r=0&pos=off',
      'https://universitysport.prestosports.com/sports/wbkb/2023-24/standings-conf'
    ];
  
    await fetchTeamData(menUrls[0], menUrls[1], 52);
  
    console.log('Data has been saved.');
  })();

  // Fetch data for men's teams
  await fetchAllTeamData(womenUrls[0], womenUrls[1]);

  console.log("Data has been fetched.");
})();
