import * as React from 'react';
import { act } from 'react-test-renderer';
import renderer from 'react-test-renderer';
import PlayCard from '../../src/components/PlayCard';

// Mock React Native components
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
}));

// Mock the dependencies
jest.mock('../../lib/tw', () => (strings, ...args) => strings.join(''));
jest.mock('../../src/components/Logo', () => 'Logo');
jest.mock('../../src/components/GradientProgressBar', () => 'GradientProgressBar');
jest.mock('lucide-react-native', () => ({
  Share: 'Share',
}));

describe('PlayCard', () => {
  const mockBet = {
    id: 'test-bet-1',
    parsedBet: {
      league: 'NBA',
      event: 'LeBron Over 24.5 Points + Curry Over 3.5 Threes (LAL vs GSW)',
      market: 'Player Prop Parlay',
      line: '2-Leg',
      odds: 200,
      book: 'PrizePicks',
      eventTime: '2024-01-15T20:00:00Z',
      betType: 'parlay',
      liveProgress: {
        currentScore: '85-78',
        timeRemaining: 'Q3 8:45',
        progressPercentage: 65,
        keyStats: {
          points: 18,
          threes: 2
        },
        lastUpdate: new Date()
      }
    },
    status: 'live',
    stake: 10,
    startTime: new Date('2024-01-15T18:00:00Z')
  };

  it('renders correctly for live player prop parlay', () => {
    let tree;
    act(() => {
      tree = renderer.create(<PlayCard bet={mockBet} />).toJSON();
    });
    expect(tree).toMatchSnapshot();
  });

  it('renders player tracking section for parlay bets', () => {
    let component;
    act(() => {
      component = renderer.create(<PlayCard bet={mockBet} />);
    });
    
    const instance = component.root;
    
    // Check if player prop text is rendered (should show "LeBron Over 24.5 Points")
    const playerPropText = instance.findByProps({ children: 'LeBron Over 24.5 Points' });
    expect(playerPropText).toBeTruthy();
  });

  it('renders simplified tracking for spread/moneyline bets', () => {
    const spreadBet = {
      ...mockBet,
      parsedBet: {
        ...mockBet.parsedBet,
        betType: 'spread',
        event: 'Lakers -2.5 vs Warriors (LAL vs GSW)'
      }
    };

    let component;
    act(() => {
      component = renderer.create(<PlayCard bet={spreadBet} />);
    });
    
    const instance = component.root;
    
    // Check if simplified tracking section is rendered (should show Lakers -2.5 vs Warriors)
    const betTexts = instance.findAllByProps({ children: 'Lakers -2.5 vs Warriors' });
    expect(betTexts.length).toBeGreaterThan(0);
  });

  it('renders regular game progress for other bet types (totals)', () => {
    const totalBet = {
      ...mockBet,
      parsedBet: {
        ...mockBet.parsedBet,
        betType: 'total',
        event: 'Lakers vs Warriors Over 224.5 (LAL vs GSW)'
      }
    };

    let component;
    act(() => {
      component = renderer.create(<PlayCard bet={totalBet} />);
    });
    
    const instance = component.root;
    
    // Check if game progress section is rendered
    const gameProgressText = instance.findByProps({ children: 'Game Progress' });
    expect(gameProgressText).toBeTruthy();
  });
});
