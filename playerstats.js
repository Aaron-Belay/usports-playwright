// Import necessary modules
const fs = require("fs"); // Node.js File System module for file operations
const { chromium } = require("playwright"); // Import Chromium browser from Playwright for web scraping

// Import everything from helper.js under the name "helpers"
const helpers = require('./helperfunctions/helper.js');

// tbody 4, 5, 6

async function fetchAllPlayersData(statsUrl, headless = false, timeout = 120000) {
  // Launch a Chromium browser instance in headless or visible mode
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage(); // Open a new page

  const headers = await helpers.getRandomHeader();
  await page.setExtraHTTPHeaders(headers)

  // Block unnecessary resources to speed up page load
  await page.route('**/*.{png,jpg,jpeg,gif,webp,css,woff2,woff,js}', route => route.abort());

  try {
    // Navigate to the stats URL with a specified timeout
    await page.goto(statsUrl, { timeout });

    await page.waitForTimeout(200000); // Waits for 20 seconds (20,000 milliseconds)

    // Object to store the extracted data
    const data = {};

    // Initialize global indexes for stat fields and stat groups
    let globalStatIndex = 1;
    let globalStatGroupIndex = 0;

    // Iterate over each stat group (total of 8 groups)
    for (let i = 0; i <= 7; i++) {
      // Get the current stat group based on index
      const selectedStatGroup = statGroups[statGroupKeys[i]];

      // Fetch data for the current stat group
      await fetchEachStatGroup(
        page,
        selectedStatGroup.number_of_stats,
        data,
        globalStatIndex,
        globalStatGroupIndex
      );

      // Update global indexes for the next batch
      globalStatIndex += selectedStatGroup.number_of_stats;
      globalStatGroupIndex++;
    }

    // Navigate to the standings URL with a specified timeout
    await page.goto(standingsUrl, { timeout });

    // Iterate over each conference (total of 6 conferences)
    for (let i = 0; i < 6; i++) {
      await fetchEachConference(page, data, globalStatIndex, i);
    }

    // Return the processed data
    return data;

  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error fetching team data:", error);
    
  } finally {
    // Ensure the browser is closed even if an error occurs
    await browser.close();

  }
}



/**
 * Merges men's and women's data into a single object.
 * @param {object} mensData - The data for men's teams.
 * @param {object} womensData - The data for women's teams.
 * @returns {object} - The merged data object.
 */
async function mergePlayersData(mensData, womensData) {
  return {
    players:{
      mens: mensData,
      womens: womensData,
    }
  };
}

// Main execution block
(async () => {
  // URLs for men’s and women’s teams and standings
  const menUrl = "https://universitysport.prestosports.com/sports/wbkb/2023-24/players?sort=gp&view=&pos=sh&r=0";

  const womenUrl = "https://universitysport.prestosports.com/sports/wbkb/2023-24/players?pos=sh";

  // Fetch data for men's teams
  const mens_data = await fetchAllPlayersData(menUrl);
  const womens_data = await fetchAllPlayersData(womenUrl);

  // Merge both sets of data
  const player_data = await mergePlayersData(mens_data, womens_data);

  // Save the combined data to a file
  fs.writeFile(
    "players_data.json",
    JSON.stringify(player_data, null, 2),
    (err) => {
      if (err) {
        console.error("Error saving data to file:", err);
      } else {
        console.log("Data saved to team_data.json");
      }
    }
  );

  console.log("Data has been fetched.");
})();
