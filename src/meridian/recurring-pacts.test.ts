import { describe, it, expect } from 'vitest';

// Recurring pact logic tests
// These test the date calculation and frequency logic

describe('recurring pacts: frequency calculations', () => {
  function getNextSettlementDate(
    frequency: 'weekly' | 'biweekly' | 'monthly',
    dayOfWeek?: number,
    dayOfMonth?: number,
    fromDate: Date = new Date(),
  ): Date {
    const next = new Date(fromDate);

    if (frequency === 'weekly' && dayOfWeek !== undefined) {
      const daysUntil = (dayOfWeek - fromDate.getDay() + 7) % 7 || 7;
      next.setDate(fromDate.getDate() + daysUntil);
    } else if (frequency === 'biweekly' && dayOfWeek !== undefined) {
      const daysUntil = (dayOfWeek - fromDate.getDay() + 14) % 14 || 14;
      next.setDate(fromDate.getDate() + daysUntil);
    } else if (frequency === 'monthly' && dayOfMonth !== undefined) {
      next.setDate(dayOfMonth);
      if (next <= fromDate) {
        next.setMonth(next.getMonth() + 1);
      }
    } else {
      // Default: next Monday
      const daysUntilMonday = (1 - fromDate.getDay() + 7) % 7 || 7;
      next.setDate(fromDate.getDate() + daysUntilMonday);
    }

    return next;
  }

  it('calculates next weekly settlement on Monday', () => {
    // Create a Wednesday (day 3)
    const fromDate = new Date(2026, 0, 14); // Wednesday, Jan 14, 2026
    const next = getNextSettlementDate('weekly', 1, undefined, fromDate); // Monday = 1

    expect(next.getDay()).toBe(1); // Monday
    expect(next.getDate()).toBe(19); // Jan 19, 2026
  });

  it('calculates next biweekly settlement', () => {
    const fromDate = new Date(2026, 0, 14); // Wednesday, Jan 14, 2026
    const next = getNextSettlementDate('biweekly', 5, undefined, fromDate); // Friday = 5

    expect(next.getDay()).toBe(5); // Friday
    // Should be 2 days later (Friday Jan 16, since Wed->Fri is 2 days)
    const diffDays = Math.ceil(
      (next.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    expect(diffDays).toBe(2);
  });

  it('calculates next monthly settlement', () => {
    const fromDate = new Date(2026, 0, 14); // Jan 14, 2026
    const next = getNextSettlementDate('monthly', undefined, 15, fromDate);

    expect(next.getMonth()).toBe(0); // January
    expect(next.getDate()).toBe(15);
  });

  it('calculates next monthly settlement when day has passed', () => {
    const fromDate = new Date(2026, 0, 20); // Jan 20, 2026
    const next = getNextSettlementDate('monthly', undefined, 15, fromDate);

    expect(next.getMonth()).toBe(1); // February
    expect(next.getDate()).toBe(15);
  });

  it('calculates default next Monday', () => {
    const fromDate = new Date(2026, 0, 14); // Wednesday, Jan 14, 2026
    const next = getNextSettlementDate('weekly', undefined, undefined, fromDate);

    expect(next.getDay()).toBe(1); // Monday
  });
});

describe('recurring pacts: settlement frequency labels', () => {
  function getFrequencyLabel(freq: string): string {
    switch (freq) {
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Bi-weekly';
      case 'monthly': return 'Monthly';
      default: return freq;
    }
  }

  it('returns correct labels', () => {
    expect(getFrequencyLabel('weekly')).toBe('Weekly');
    expect(getFrequencyLabel('biweekly')).toBe('Bi-weekly');
    expect(getFrequencyLabel('monthly')).toBe('Monthly');
    expect(getFrequencyLabel('unknown')).toBe('unknown');
  });
});

describe('recurring pacts: day labels', () => {
  function getDayLabel(
    frequency: string,
    dayOfWeek: number | null,
    dayOfMonth: number | null,
  ): string {
    if (frequency === 'monthly' && dayOfMonth !== null) {
      return `Day ${dayOfMonth}`;
    }
    if (dayOfWeek !== null) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[dayOfWeek];
    }
    return '';
  }

  it('returns day of week for weekly', () => {
    expect(getDayLabel('weekly', 1, null)).toBe('Mon');
    expect(getDayLabel('weekly', 5, null)).toBe('Fri');
  });

  it('returns day of month for monthly', () => {
    expect(getDayLabel('monthly', null, 15)).toBe('Day 15');
    expect(getDayLabel('monthly', null, 1)).toBe('Day 1');
  });

  it('returns empty string for missing day', () => {
    expect(getDayLabel('weekly', null, null)).toBe('');
  });
});
