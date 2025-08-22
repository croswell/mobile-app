# Rewards Page

A new "Rewards" tab has been added to the mobile app with the following features:

## Features

### Signup Bonuses Tab
- List of available promotional offers from various sportsbooks
- Each offer shows:
  - Provider logo and name
  - Offer title and description
  - Claim button with reward amount
  - Clicking claim opens a deep link and marks the offer as claimed
- Total promo value calculation (sum of unclaimed offers)
- Pull-to-refresh functionality

### Refer Friends Tab
- Referral code display with share functionality
- Weekly progress tracking (0/5 invites needed)
- Progress bar visualization
- "Simulate 1 referral" button for testing

## Technical Implementation

### Files Added
- `src/types/rewards.ts` - TypeScript types for the rewards system
- `src/lib/mockRewards.ts` - Mock API with sample data
- `src/lib/currency.ts` - Utility for USD formatting
- `src/screens/RewardsScreen.tsx` - Main UI component
- `app/(tabs)/rewards.tsx` - Tab route component

### Mock Data
The app includes 6 sample promotional offers:
- ProphetX: $200 Prophet Cash
- Novig Sportsbook: $100 off first purchase
- Chalkboard Fantasy: $100 deposit match
- DraftKings: $50 bonus
- FanDuel: $75 no sweat bet
- Underdog Fantasy: $25 deposit match

### API Endpoints
- `getRewards(region)` - Returns available offers for a region
- `claimPromo(id)` - Marks an offer as claimed
- `incrementReferral()` - Simulates adding a referral

## Testing

1. Start the app: `npx expo start -c`
2. Navigate to the "Rewards" tab (Gift icon)
3. Test the Signup Bonuses tab:
   - View the list of offers
   - Pull to refresh
   - Tap claim buttons to see them change to "Claimed"
4. Test the Refer Friends tab:
   - View referral code and share button
   - Tap "Simulate 1 referral" to see progress increase
   - Progress bar should fill up as referrals are added

## Offline Support
All data is mocked locally, so the app works completely offline. The mock API includes artificial delays (300ms) to simulate real network requests.

## Styling
Uses Tailwind CSS classes with a dark theme matching the existing app design. Colors are consistent with the app's design system.
