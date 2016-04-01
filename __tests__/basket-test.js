jest.unmock('../src/App'); 

import { roundToTwo, getDiscount, getDeliveryFromTotal, getProductTotal, getTotal } from '../src/App';

describe('roundToTwo', () => {
  it('rounds 1.475 to 1.48', () => {
    expect(roundToTwo(1.475)).toBe(1.48);
  });
});

describe('getDiscount', () => {
  it('returns 0 when there isn\'t more than one pair of jeans in the basket', () => {
    let state = [];
    expect(getDiscount(state)).toBe(0);
  });
  it('returns 16.48 when two pairs of jeans are in the basket', () => {
    let state = [{ id: 'J01', quantity: 2 }];
    expect(getDiscount(state)).toBe(16.48);
  });
  it('returns 16.48 when three pairs of jeans are in the basket', () => {
    let state = [{ id: 'J01', quantity: 3 }];
    expect(getDiscount(state)).toBe(16.48);
  });
  it('returns 32.95 when four pairs of jeans are in the basket', () => {
    let state = [{ id: 'J01', quantity: 4 }];
    expect(getDiscount(state)).toBe(32.95);
  });
});

describe('getDeliveryFromTotal', () => {
  it('returns 4.95 when total is less than 50', () => {
    expect(getDeliveryFromTotal(40)).toBe(4.95);
  });
  it('returns 2.95 when total is less than 90', () => {
    expect(getDeliveryFromTotal(80)).toBe(2.95);
  });
  it('returns 0 when total is greater than 90', () => {
    expect(getDeliveryFromTotal(100)).toBe(0);
  });
});

describe('getProductTotal', () => {
  it('returns the sum of the items in the basket', () => {
    // Ideally products would be mocked
    let state = [{ id: 'J01', quantity: 1 }, { id: 'S01', quantity: 2 }];
    expect(getProductTotal(state)).toBe(48.85);
  });
});

describe('getTotal', () => {
  it('should return the correct price for product combinations', () => {
    let state = [{ id: 'S01', quantity: 1 }, { id: 'B01', quantity: 1 }];
    expect(getTotal(state)).toBe(37.85);
    state = [{ id: 'J01', quantity: 2 }];
    expect(getTotal(state)).toBe(54.37);
    state = [{ id: 'J01', quantity: 1 }, { id: 'B01', quantity: 1 }];
    expect(getTotal(state)).toBe(60.85);
    state = [{ id: 'S01', quantity: 2 }, { id: 'J01', quantity: 3 }];
    expect(getTotal(state)).toBe(98.27);
  });
});

