import { describe, expect, it } from 'vitest';

import { FrameHealthMonitor } from './frame-health';

const CFG = {
    slowFrameMs: 22,
    windowSize: 10,
    slowRatio: 0.5,
    ignoreAboveMs: 250,
};

describe('FrameHealthMonitor', () => {
    it('does not degrade while frames are fast', () => {
        const m = new FrameHealthMonitor(CFG);
        for (let i = 0; i < 50; i++) {
            expect(m.record(16)).toBe(false);
        }
    });

    it('signals exactly at the window boundary when frames are slow', () => {
        const m = new FrameHealthMonitor(CFG);
        for (let i = 0; i < 9; i++) {
            expect(m.record(33)).toBe(false);
        }
        expect(m.record(33)).toBe(true);
    });

    it('does not signal when slow frames are a minority', () => {
        const m = new FrameHealthMonitor(CFG);
        let signalled = false;
        for (let i = 0; i < 10; i++) {
            signalled = m.record(i < 3 ? 33 : 16) || signalled;
        }
        expect(signalled).toBe(false);
    });

    it('ignores outlier stalls (tab switch, GC pause)', () => {
        const m = new FrameHealthMonitor(CFG);
        for (let i = 0; i < 9; i++) {
            m.record(16);
        }
        expect(m.record(5000)).toBe(false);
        expect(m.record(16)).toBe(false);
    });

    it('resets counters between windows', () => {
        const m = new FrameHealthMonitor(CFG);
        for (let i = 0; i < 10; i++) {
            m.record(33);
        }
        for (let i = 0; i < 10; i++) {
            expect(m.record(16)).toBe(false);
        }
    });
});
