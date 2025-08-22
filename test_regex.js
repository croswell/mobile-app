// Test the updated team abbreviation extraction logic
function extractTeamAbbreviations(event) {
  // Look for pattern like "(MIL vs BOS)" or "(TB vs ATL)" at the end - handle both 2 and 3 letter codes
  const teamMatch = event.match(/\(([A-Z]{2,3}\s+vs\s+[A-Z]{2,3})\)$/);
  if (teamMatch) {
    const teams = teamMatch[1]; // "MIL vs BOS" or "TB vs ATL"
    const cleanEvent = event.replace(/\s*\([A-Z]{2,3}\s+vs\s+[A-Z]{2,3}\)$/, ''); // Remove the teams part
    return { teams, cleanEvent };
  }
  return { teams: '', cleanEvent: event };
}

// Test cases including both 2-letter and 3-letter team codes
const testCases = [
  "Giannis Over 30.5 Points + Giannis Over 8.5 Rebounds (MIL vs BOS)",
  "Brady Over 2.5 TDs + Evans Over 75.5 Receiving Yards (TB vs ATL)",
  "Jokic Over 10.5 Assists + Murray Over 20.5 Points + Jokic Over 25.5 Points (DEN vs LAL)",
  "Mahomes Over 275.5 Yards + Kelce Over 6.5 Receptions + Chiefs ML (KC vs BUF)",
  "Simple bet without teams",
  "Another bet (LAL vs GSW)"
];

console.log("Testing updated team abbreviation extraction:");
console.log("===========================================");

testCases.forEach((testCase, index) => {
  const result = extractTeamAbbreviations(testCase);
  console.log(`\nTest ${index + 1}:`);
  console.log(`Input: "${testCase}"`);
  console.log(`Teams: "${result.teams}"`);
  console.log(`Clean Event: "${result.cleanEvent}"`);
});
