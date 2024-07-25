const { chromium, firefox, webkit } = require('playwright');

//Use to write files
const fs = require('fs');

// Helper function to wait
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
 
// The functions

async function fetchTeamData(statsUrl, standingsUrl, noOfTeams) {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
  
    await page.goto(statsUrl, { timeout: 2 * 60 * 1000 }); // Time out if it takes too long
  
    await page.waitForTimeout(500); // Wait a few seconds on the page 

    // Select the dropdown element and choose 100 entries
    await page.selectOption('#dt-length-0', '100');

    // Get all tbody elements
    const tbodies = await page.$$('tbody');

    if (tbodies.length === 0) {
        console.error("No tbody elements found");
        await browser.close();
        return;
    }

    // Select the first tbody element
    const firstTbody = tbodies[0];

    // Get all rows within the first tbody
    const rows = await firstTbody.$$('tr');
    
    // Log the number of rows
    console.log(`Number of rows: ${rows.length}`);
    const data = [];
  
    for (const row of rows) { // All of the rows in the table
      const cols = await row.$$('td'); // Select all 'td' elements within each row
      if (cols.length > 1) {
        data.push({
          team_name: await cols[1].innerText(), 
          games_played: await cols[2].innerText(),
          field_goals: await cols[3].innerText(),
          field_goal_percentage: await cols[4].innerText(),
          three_pointers: await cols[5].innerText(),
          three_point_percentage: await cols[6].innerText(),
          free_throws: await cols[7].innerText(),
          free_throw_percentage: await cols[8].innerText(),
          points_per_game: await cols[9].innerText()
        });
      }
    }
    console.log(data);
  
    await browser.close();
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

