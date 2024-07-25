const { chromium } = require("playwright"); // Import only chromium browser from Playwright

/**
 * Fetches team data from the specified stats URL and processes the table data.
 * @param {string} statsUrl - The URL of the page containing the stats.
 * @param {string} standingsUrl - The URL of the page containing the standings (not used in this function).
 * @param {number} noOfTeams - The number of teams to process (not used in this function).
 * @returns {Promise<void>}
 */
async function fetchTeamData(statsUrl, standingsUrl, noOfTeams) {
  // Launch a Chromium browser instance in headless mode (set to true to hide the browser window)
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage(); // Open a new page

  try {
    // Navigate to the stats URL with a timeout of 2 minutes
    await page.goto(statsUrl, { timeout: 2 * 60 * 1000 });

    // Wait for the page to load completely
    await page.waitForTimeout(500);

    // Select the dropdown element and choose '100' entries to display
    await page.selectOption("#dt-length-0", "100");

    // Get all 'tbody' elements on the page
    const tbodies = await page.$$("tbody");

    // Check if 'tbody' elements are present
    if (tbodies.length === 0) {
      console.error("No tbody elements found");
      return;
    }

    // Select the first 'tbody' element
    const firstTbody = tbodies[0];

    // Get all rows within the first 'tbody'
    const rows = await firstTbody.$$("tr");

    // Log the number of rows for debugging
    console.log(`Number of rows: ${rows.length}`);

    const data = []; // Array to store the extracted data

    // Iterate over each row in the table
    for (const row of rows) {
      // Get all 'td' elements within each row
      const cols = await row.$$("td");

      // Check if there are more than one column in the row
      if (cols.length > 1) {
        // Push the extracted data into the array
        data.push({
          team_name: await cols[1].innerText(),
          games_played: await cols[2].innerText(),
          field_goals: await cols[3].innerText(),
          field_goal_percentage: await cols[4].innerText(),
          three_pointers: await cols[5].innerText(),
          three_point_percentage: await cols[6].innerText(),
          free_throws: await cols[7].innerText(),
          free_throw_percentage: await cols[8].innerText(),
          points_per_game: await cols[9].innerText(),
        });
      }
    }

    console.log(data);
  } catch (error) {
    console.error("Error fetching team data:", error);
  } finally {
    // Ensure the browser is closed even if an error occurs
    await browser.close();
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

  // Fetch data for men's teams
  await fetchTeamData(menUrls[0], menUrls[1], 52);

  console.log("Data has been fetched.");
})();
