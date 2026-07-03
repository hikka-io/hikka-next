export interface FrameHealthConfig {
    /** A frame slower than this (ms) counts as slow. */
    slowFrameMs: number;
    /** Frames per evaluation window. */
    windowSize: number;
    /** Fraction of slow frames within a window that triggers degrade. */
    slowRatio: number;
    /** Discard samples above this (ms) — tab switches and GC stalls. */
    ignoreAboveMs: number;
}

/**
 * Sliding-window frame-time judge for the adaptive render-scale fallback.
 * Pure logic (no DOM) so it stays unit-testable under jsdom.
 */
export class FrameHealthMonitor {
    private slow = 0;
    private total = 0;

    constructor(private cfg: FrameHealthConfig) {}

    /**
     * Record one frame delta. Returns true (once per window) when the
     * window contained enough slow frames to judge the device too slow.
     */
    record(msPassed: number): boolean {
        if (msPassed <= 0 || msPassed > this.cfg.ignoreAboveMs) return false;
        this.total++;
        if (msPassed > this.cfg.slowFrameMs) this.slow++;
        if (this.total < this.cfg.windowSize) return false;
        const degrade = this.slow / this.total >= this.cfg.slowRatio;
        this.slow = 0;
        this.total = 0;
        return degrade;
    }
}
