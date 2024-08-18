const {playerDataFields, sortCategories, playerStatGroups, playerStatGroupKeys } = require('./playerstats_settings.js');

async function fetchAllPlayersData(league, {chromium, helpers}, headless = true, timeout = 120000) {
  // Launch a Chromium browser instance in headless or visible mode
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage(); // Open a new page

  const headers = await helpers.getRandomHeader();
  await page.setExtraHTTPHeaders(headers)

  // Block unnecessary resources to speed up page load
  await page.route('**/*.{png,jpg,jpeg,gif,webp,css,woff2,woff,js}', route => route.abort());

  try {

    // Object to store the extracted data
    const data = {};

    for (let i = 0; i < 20; i++){
      console.log(sortCategories[i]);
      // Navigate to the stats URL with a specified timeout
      let statsUrl = `https://universitysport.prestosports.com/sports/${league}bkb/2023-24/players?sort=${sortCategories[i]}&view=&pos=sh&r=0`;

      await page.goto(statsUrl, { timeout });

      // Initialize global indexes for stat fields and stat groups
      let globalStatIndex = 2;

      // Iterate over each stat group (total of 3 groups)
      for (let i = 0; i <= 2; i++) {
      
        const tbodyindex = i + 3;
        console.log("thsi is tbody index"+ String(tbodyindex));

        // Get the current stat group based on index
        const selectedStatGroup = playerStatGroups[playerStatGroupKeys[i]];
        console.log(selectedStatGroup);

        await fetchEachPlayerStatGroup(
          page,
          selectedStatGroup.number_of_stats,
          data,
          tbodyindex,
          globalStatIndex
        );

        // Update global indexes for the next batch
        globalStatIndex += selectedStatGroup.number_of_stats;
      }
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

async function fetchEachPlayerStatGroup(page, numberOfStats, data, tbodyindex, globalStatIndex) {
  try {
    // Get all 'tbody' elements on the page
    const tbodies = await page.$$("tbody");

    // Check if 'tbody' elements are present
    if (tbodies.length === 0) {
      console.error("No tbody elements found");
      return;
    }

    // Select the appropriate 'tbody' element based on the stat group index
    const tbody = tbodies[tbodyindex];

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
        const playerName = await cols[1].innerText();

        // Create a new entry in the data map for this team if it doesn't already exist
        if (!data[playerName]) {
          data[playerName] = {};
          data[playerName][playerDataFields[0]] = await cols[3].innerText(); // Set games_played field
          data[playerName][playerDataFields[1]] = await cols[4].innerText(); // Set games_started field
          data[playerName][playerDataFields[19]] = await cols[5].innerText(); // Set team field
        }

        // Populate the data for this team with the specified number of stats
        for (let ind = 0; ind < numberOfStats; ind++) {
          let innerNumber = ind + 5;

          // Ensure cols[innerNumber] exists before accessing its innerText
          if (cols[innerNumber]) {
            data[playerName][playerDataFields[localStatIndex]] = await cols[innerNumber].innerText();
            //const field = playerDataFields[localStatIndex];
            //const shush = awaitcols[innerNumber].innerText();
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

// Export all constants and mappings at once
module.exports = {
    fetchAllPlayersData
};