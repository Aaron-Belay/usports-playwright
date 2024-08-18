// Import necessary modules
const fs = require("fs"); // Node.js File System module for file operations
const { chromium } = require("playwright"); // Import Chromium browser from Playwright for web scraping

// Import everything from helper.js under the name "helpers"
const helpers = require('./helperfunctions/helper.js');

const {fetchAllTeamData} = require('./teamstats/teamstatsfunctions.js');
const {fetchAllPlayersData} = require('./playerstats/playerstatsfunctions.js');

const dependencies = { chromium, helpers };

async function mergeUsportsData(mens_team_data, womens_team_data, mens_players_data, womens_players_data) {
    return {
        team:{
            mens: mens_team_data,
            womens: womens_team_data,
        },

        player: { 
            mens: mens_players_data,
            womens: womens_players_data,
        }
    }
}

// Main execution block
(async () => {
    // URLs for men’s and women’s teams and standings
    const menUrls = [
      "https://universitysport.prestosports.com/sports/mbkb/2023-24/teams?sort=&r=0&pos=off",
      "https://universitysport.prestosports.com/sports/mbkb/2023-24/standings-conf",
    ];
    const womenUrls = [
      "https://universitysport.prestosports.com/sports/wbkb/2023-24/teams?sort=&r=0&pos=off",
      "https://universitysport.prestosports.com/sports/wbkb/2023-24/standings-conf",
    ];
  
    // Fetch data for teams
    const mens_team_data = await fetchAllTeamData(menUrls[0], menUrls[1], dependencies);
    const womens_team_data = await fetchAllTeamData(womenUrls[0], womenUrls[1], dependencies);
    
    // Fetch data for players
    const mens_players_data = await fetchAllPlayersData("m", dependencies);
    const womens_players_data = await fetchAllPlayersData("w", dependencies);

    // Merge both sets of data
    const usports_data = await mergeUsportsData(mens_team_data, womens_team_data, mens_players_data, womens_players_data);
  
    // Save the combined data to a file
    fs.writeFile(
      "usports_data.json",
      JSON.stringify(usports_data, null, 2),
      (err) => {
        if (err) {
          console.error("Error saving data to file:", err);
        } else {
          console.log("Data saved to usports_data.json");
        }
      }
    );
  
    console.log("Data has been fetched.");
    
})();
  