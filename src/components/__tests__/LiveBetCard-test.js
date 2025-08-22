import React from 'react';
import { render } from '@testing-library/react-native';
import LiveBetCard from '../LiveBetCard';

// Mock the GradientProgressBar component
jest.mock('../GradientProgressBar', () => {
  return function MockGradientProgressBar({ progress, height, colors }) {
    return (
      <div data-testid="gradient-progress-bar" style={{ width: `${progress * 100}%`, height }}>
        Mock Progress Bar
      </div>
    );
  };
});

// Mock the lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Share: () => <div data-testid="share-icon">Share</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
  TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
  TrendingDown: () => <div data-testid="trending-down-icon">TrendingDown</div>,
  Minus: () => <div data-testid="minus-icon">Minus</div>,
}));

// Mock the tw function
jest.mock('../../lib/tw', () => {
  return (strings, ...values) => {
    return strings.reduce((result, string, i) => {
      return result + string + (values[i] || '');
    }, '');
  };
});

describe('LiveBetCard', () => {
  const mockData = {
    id: 'test-bet-1',
    league: 'NBA',
    eventName: 'LAL vs GSW',
    dateTime: 'Today at 11:20 AM',
    status: 'live',
    score: {
      home: 'LAL',
      away: 'GSW',
      homeScore: 78,
      awayScore: 83
    },
    timeRemaining: 'Q4 • 02:13',
    location: 'Crypto.com Arena, Los Angeles',
    legs: [
      {
        id: 'leg-1',
        type: 'player_prop',
        description: 'LeBron Over 24.5 Points',
        odds: -110,
        progressCurrent: 22,
        progressTarget: 24.5,
        status: 'close',
        direction: 'over'
      }
    ],
    wager: 20.00,
    payout: 38.18,
    oddsTotal: -110,
    actions: {
      canCashOut: true,
      cashOutValue: 18.75,
      isTracked: false
    }
  };

  const mockHandlers = {
    onPress: jest.fn(),
    onShare: jest.fn(),
    onCashOut: jest.fn(),
    onToggleTrack: jest.fn()
  };

  it('renders without crashing', () => {
    const { getByText } = render(
      <LiveBetCard data={mockData} {...mockHandlers} />
    );
    
    expect(getByText('NBA • LAL vs GSW')).toBeTruthy();
    expect(getByText('Today at 11:20 AM')).toBeTruthy();
    expect(getByText('LIVE')).toBeTruthy();
  });

  it('displays correct score information', () => {
    const { getByText } = render(
      <LiveBetCard data={mockData} {...mockHandlers} />
    );
    
    expect(getByText('LAL 78 – 83 GSW')).toBeTruthy();
    expect(getByText('Q4 • 02:13')).toBeTruthy();
  });

  it('shows bet leg information correctly', () => {
    const { getByText } = render(
      <LiveBetCard data={mockData} {...mockHandlers} />
    );
    
    expect(getByText('player prop')).toBeTruthy();
    expect(getByText('LeBron Over 24.5 Points')).toBeTruthy();
    expect(getByText('-110')).toBeTruthy();
  });

  it('displays payout information', () => {
    const { getByText } = render(
      <LiveBetCard data={mockData} {...mockHandlers} />
    );
    
    expect(getByText('$20.00')).toBeTruthy();
    expect(getByText('$38.18')).toBeTruthy();
    expect(getByText('-110')).toBeTruthy();
  });

  it('shows action buttons', () => {
    const { getByText } = render(
      <LiveBetCard data={mockData} {...mockHandlers} />
    );
    
    expect(getByText('Share')).toBeTruthy();
    expect(getByText('Track')).toBeTruthy();
    expect(getByText('Cash Out $18.75')).toBeTruthy();
  });

  it('handles parlay bets with multiple legs', () => {
    const parlayData = {
      ...mockData,
      legs: [
        {
          id: 'leg-1',
          type: 'player_prop',
          description: 'LeBron Over 24.5 Points',
          odds: -110,
          progressCurrent: 22,
          progressTarget: 24.5,
          status: 'close',
          direction: 'over'
        },
        {
          id: 'leg-2',
          type: 'player_prop',
          description: 'Curry Over 3.5 Threes',
          odds: -105,
          progressCurrent: 4,
          progressTarget: 3.5,
          status: 'winning',
          direction: 'over'
        }
      ]
    };

    const { getByText } = render(
      <LiveBetCard data={parlayData} {...mockHandlers} />
    );
    
    expect(getByText('LeBron Over 24.5 Points')).toBeTruthy();
    expect(getByText('Curry Over 3.5 Threes')).toBeTruthy();
  });

  it('handles upcoming status correctly', () => {
    const upcomingData = {
      ...mockData,
      status: 'upcoming',
      timeRemaining: 'Not Started'
    };

    const { getByText } = render(
      <LiveBetCard data={upcomingData} {...mockHandlers} />
    );
    
    expect(getByText('UPCOMING')).toBeTruthy();
  });

  it('handles final status correctly', () => {
    const finalData = {
      ...mockData,
      status: 'final',
      timeRemaining: 'Final'
    };

    const { getByText } = render(
      <LiveBetCard data={finalData} {...mockHandlers} />
    );
    
    expect(getByText('FINAL')).toBeTruthy();
  });
});
