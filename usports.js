const { chromium, firefox, webkit } = require('playwright');

//start with m or f
//then which year
//then which 
/*
(async () => {
  const browser = await chromium.launch({ headless: false});  //  // Or 'firefox' or 'webkit'.
  const page = await browser.newPage();
  await page.goto('https://universitysport.prestosports.com/sports/mbkb/2023-24/teams?sort=&r=0&pos=off');
  // other actions...
  //await browser.close();
  //await browser.close();
})();
*/

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
  
  await page.goto(statsUrl, { timeout: 2 * 60 * 1000}); //Time out if takes too long

  await wait(3000); // wait a few seconds on page 
  const teamData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr'));
    const data = [];

    rows.forEach(row => {
      const columns = row.querySelectorAll('td');
      const teamNameElement = row.querySelector('td.text.dtfc-fixed-start.dtfc-fixed-left a');
      const teamName = teamNameElement ? teamNameElement.textContent.trim() : '';

      data.push({
        team_name: teamName,
        // Add other data extraction here if needed
        /*
        games_played: columns[0].textContent.trim(),
        field_goals: columns[1].textContent.trim(),
        field_goal_percentage: columns[2].textContent.trim(),
        three_pointers: columns[3].textContent.trim(),
        three_point_percentage: columns[4].textContent.trim(),
        free_throws: columns[5].textContent.trim(),
        free_throw_percentage: columns[6].textContent.trim(),
        points_per_game: columns[7].textContent.trim()
        */
      });
    });

    return data;
  });

  /*
  await page.goto(standingsUrl);
  await wait(2000); // Wait for page to load
  
  const standingsData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table.stats-table tr'));
    const data = [];

    rows.forEach(row => {
      const teamNameElement = row.querySelector('td.stats-team a');
      if (teamNameElement) {
        const columns = row.querySelectorAll('td');
        data.push({
          team_name: teamNameElement.textContent.trim(),
          total_wins: columns[2].textContent.trim(),
          total_losses: columns[3].textContent.trim(),
          win_percentage: columns[4].textContent.trim(),
          last_ten_games: columns[5].textContent.trim(),
          streak: columns[6].textContent.trim(),
          total_points: columns[7].textContent.trim(),
          total_points_against: columns[8].textContent.trim()
        });
      }
    });

    return data;
  });

  await browser.close();
  */

  standingsData = {};
  return { teamData, standingsData };
}

function mergeData(teamData, standingsData) {
  /*
  const dataMap = new Map();

  teamData.forEach(team => {
    dataMap.set(team.team_name, team);
  });

  standingsData.forEach(team => {
    if (dataMap.has(team.team_name)) {
      Object.assign(dataMap.get(team.team_name), team);
    }
  });
  

  return Array.from(dataMap.values());
  */
}

function saveData(data, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}



//The Code
(async () => {
  const menUrls = [
    'https://universitysport.prestosports.com/sports/mbkb/2023-24/teams?sort=&r=0&pos=off',
    'https://universitysport.prestosports.com/sports/mbkb/2023-24/standings-conf'
  ];
  const womenUrls = [
    'https://universitysport.prestosports.com/sports/wbkb/2023-24/teams?sort=&r=0&pos=off',
    'https://universitysport.prestosports.com/sports/wbkb/2023-24/standings-conf'
  ];

  const { teamData: menTeamData, standingsData: menStandingsData } = await fetchTeamData(menUrls[0], menUrls[1], 52);
  const menData = mergeData(menTeamData, menStandingsData);
  saveData(menData, 'men_team_stats.json');

  /*
  const { teamData: menTeamData, standingsData: menStandingsData } = await fetchTeamData(menUrls[0], menUrls[1], 52);
  const menData = mergeData(menTeamData, menStandingsData);
  saveData(menData, 'men_team_stats.json');

  const { teamData: womenTeamData, standingsData: womenStandingsData } = await fetchTeamData(womenUrls[0], womenUrls[1], 48);
  const womenData = mergeData(womenTeamData, womenStandingsData);
  saveData(womenData, 'women_team_stats.json');
  */

  console.log('Data has been saved.');
})();

await retry (main, {
  retries: 3,
  onRetry : (err) => {
    console.error('bruh', err);
  },




})