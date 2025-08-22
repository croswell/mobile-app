export function calculateUnit(bankroll: number, unitSizePercent: number = 0.02) {
  return bankroll * unitSizePercent;
}

export function formatBetRecommendation(
  bankroll: number,
  odds: number,
  units: number = 1,
  unitSizePercent: number = 0.02
) {
  const unitValue = calculateUnit(bankroll, unitSizePercent);
  const stake = unitValue * units;

  let payout: number;
  if (odds > 0) {
    payout = (stake * odds) / 100;
  } else {
    payout = (stake * 100) / Math.abs(odds);
  }

  return {
    units,
    stake: stake.toFixed(2),
    payout: payout.toFixed(2),
  };
}
