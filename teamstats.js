/**
 * This script scrapes and processes usports' sbasketball team statistics using Playwright.
 * It fetches data from specified stats and standings pages, covering various 
 * metrics such as shooting percentages, rebounding, ball control, efficiency, 
 * and defensive stats. The data is organized by team names and includes 
 * conference affiliations.
 * 
 * Key Components:
 * - `fs` for file operations
 * - `chromium` from Playwright for browser automation
 * - `teamDataFields` for defining data attributes
 * - `teamConference` for team-to-conference mapping
 * - `statGroups` for statistical categories and their dropdown values
 * 
 * This script is useful for gathering comprehensive team profiles for analysis.
 */

// Import necessary modules
const fs = require("fs"); // Node.js File System module for file operations
const { chromium } = require("playwright"); // Import Chromium browser from Playwright for web scraping

// Import everything from helper.js under the name "helpers"
const helpers = require('./helperfunctions/helper.js');
const { teamDataFields, teamConference, statGroups, statGroupKeys } = require('./usports_settings.js');


/**
 * Fetches team data from the specified stats and standings URLs and processes the table data.
 * @param {string} statsUrl - The URL of the page containing the stats.
 * @param {string} standingsUrl - The URL of the page containing the standings.
 * @param {boolean} headless - Whether to run the browser in headless mode.
 * @param {number} timeout - The timeout for page navigation in milliseconds.
 * @returns {Promise<object>} - The processed data for all teams.
 */
async function fetchAllTeamData(statsUrl, standingsUrl, headless = true, timeout = 120000) {
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
 * Fetches data for each conference.
 * @param {object} page - The Puppeteer page object.
 * @param {object} data - The data object to store team data.
 * @param {number} globalStatIndex - The global index for stat fields.
 * @param {number} tbodyIndex - The index of the 'tbody' element for the conference.
 */
async function fetchEachConference(page, data, globalStatIndex, tbodyIndex) {
  try {
    // Get all 'tbody' elements on the page
    const tbodies = await page.$$("tbody");

    // Check if 'tbody' elements are present
    if (tbodies.length === 0) {
      console.error("No tbody elements found");
      return;
    }

    // Select the appropriate 'tbody' element based on the conference index
    const tbody = tbodies[tbodyIndex];

    // Get all rows within the selected 'tbody'
    const rows = await tbody.$$("tr");

    // Log the number of rows for debugging purposes
    console.log(`Number of rows: ${rows.length}`);

    // Iterate through each row
    for (const row of rows) {
      // Select the 'th' element within each row to get the team name
      const thElement = await row.$("th.team-name");
      const teamName = (await thElement.innerText()).trim();

      // Select all 'td' elements within each row
      const cols = await row.$$("td");
      let localStatIndex = globalStatIndex;

      // Ensure the row has more than one column
      if (cols.length > 1) {
        // Iterate through the columns and fetch data
        for (let i = 0; i < 7; i++) {
          const innerNumber = i + 1;

          // Ensure cols[innerNumber] exists before accessing its innerText
          if (cols[innerNumber]) {
            data[teamName][teamDataFields[localStatIndex]] = await cols[innerNumber].innerText();
            localStatIndex++;
          }
        }
      }

      // Add the team's conference information
      data[teamName][teamDataFields[globalStatIndex + 8]] = teamConference[teamName];
    }
  } catch (error) {
    // Handle any errors that occur
    console.error("Error in fetchEachConference:", error);
  }
}

/**
 * Fetches data for each stat group.
 * @param {object} page - The Puppeteer page object.
 * @param {number} numberOfStats - The number of stats in the current group.
 * @param {object} data - The data object to store team data.
 * @param {number} globalStatIndex - The global index for stat fields.
 * @param {number} globalStatGroupIndex - The index for the stat group.
 */
async function fetchEachStatGroup(page, numberOfStats, data, globalStatIndex, globalStatGroupIndex) {
  try {
    // Get all 'tbody' elements on the page
    const tbodies = await page.$$("tbody");

    // Check if 'tbody' elements are present
    if (tbodies.length === 0) {
      console.error("No tbody elements found");
      return;
    }

    // Select the appropriate 'tbody' element based on the stat group index
    const tbody = tbodies[globalStatGroupIndex];

    // Get all rows within the selected 'tbody'
    const rows = await tbody.$$("tr");

    // Log the number of rows for debugging purposes
    console.log(`Number of rows: ${rows.length}`);

    // Iterate through each row
    for (const row of rows) {
      // Select all 'td' elements within each row
      const cols = await row.$$("td");
      let localStatIndex = globalStatIndex;

      // Ensure the row has more than one column
      if (cols.length > 1) {
        // Extract the team name from the second column
        const teamName = await cols[1].innerText();

        // Create a new entry in the data map for this team if it doesn't already exist
        if (!data[teamName]) {
          data[teamName] = {};
          data[teamName][teamDataFields[0]] = await cols[2].innerText(); // Set games_played field
        }

        // Populate the data for this team with the specified number of stats
        for (let i = 0; i < numberOfStats; i++) {
          const innerNumber = i + 3;

          // Ensure cols[innerNumber] exists before accessing its innerText
          if (cols[innerNumber]) {
            data[teamName][teamDataFields[localStatIndex]] = await cols[innerNumber].innerText();
            localStatIndex++;
          }
        }
      }
    }
  } catch (error) {
    // Handle any errors that occur
    console.error("Error in fetchEachStatGroup:", error);
  }
}

/**
 * Merges men's and women's data into a single object.
 * @param {object} mensData - The data for men's teams.
 * @param {object} womensData - The data for women's teams.
 * @returns {object} - The merged data object.
 */
async function mergeData(mensData, womensData) {
  return {
    mens: mensData,
    womens: womensData,
  };
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

  // Fetch data for men's teams
  const mens_data = await fetchAllTeamData(menUrls[0], menUrls[1]);
  const womens_data = await fetchAllTeamData(womenUrls[0], womenUrls[1]);

  // Merge both sets of data
  const team_data = await mergeData(mens_data, womens_data);

  // Save the combined data to a file
  fs.writeFile(
    "team_data.json",
    JSON.stringify(team_data, null, 2),
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
