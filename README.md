# U Sports Data Scraping Package (`usports-playwright`)

`usports-playwright` is a JavaScript package that leverages Playwright to scrape and retrieve detailed basketball statistics from the U Sports website. This package enables the extraction of comprehensive data for both men's and women's leagues, allowing for in-depth analysis of team and player performance.

## 🚀 Features

- **Comprehensive Data Retrieval**: Extracts over 40 statistics for each team and 20 for each player, covering various metrics like field goals, rebounds, assists, turnovers, and more.
- **Broad Coverage**: Scrapes data across more than 200 pages of the U Sports website, ensuring a wide range of data is collected for analysis.
- **Robust Data Handling**: Includes error handling and validation mechanisms to ensure data accuracy and reliability.
- **In-Depth Analysis Potential**: Facilitates detailed analysis of team and player performance, such as identifying top performers, analyzing specific metrics, and graphing these insights for better visualization.

## 📥 Installation

First, ensure you have Node.js installed. Then, you can install `usports-playwright` via npm:

```bash
npm install usports-playwright
```
## 🧩 Dependencies

This package relies on the following dependencies:

- **Playwright**: For browser automation and web scraping.
- **JavaScript**: The core language used in the package.

## 🛠️ Usage

To use `usports-playwright`, follow these steps:

### Set Up Playwright

After installing the package, you'll need to install Playwright's Chromium browser. Run the following command:

```bash
npx playwright install chromium
```
### Fetch Data

Use the package to scrape and retrieve basketball statistics from the U Sports website. Here’s an example of how to do that:

```javascript
const { fetchTeamStats, fetchPlayerStats } = require('usports-playwright');

// Fetch men's team stats
const mensTeamStats = await fetchTeamStats('mens');

// Fetch women's player stats
const womensPlayerStats = await fetchPlayerStats('womens');
```

### Analyze and Use the Data

Once fetched, the data can be analyzed or exported to different formats (e.g., JSON, CSV) for further processing or visualization.

## 📊 Example

Here's how you can fetch and process data for men's teams:

```javascript
const { fetchTeamStats } = require('usports-playwright');

(async () => {
    const mensTeamStats = await fetchTeamStats('mens');
    console.log(mensTeamStats);
})();
```

## 📚 Documentation

For more detailed documentation, please visit the [GitHub repository](#).

## 🙌 Contributing

Contributions, bug reports, and feature requests are welcome! Feel free to open an issue or submit a pull request on GitHub.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

