import { useEffect, useRef } from 'react';

import { BRANCH_TOP_OFFSET_DESKTOP, BRANCH_TOP_OFFSET_MOBILE } from './config';
import SakuraCanvas from './sakura-canvas';

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

const SakuraEffect = () => {
    const branchCanvasRef = useRef<HTMLCanvasElement>(null);
    const particleCanvasRef = useRef<HTMLCanvasElement>(null);
    const isNarrowRef = useRef(false);

    useEffect(() => {
        const branchCanvas = branchCanvasRef.current;
        const particleCanvas = particleCanvasRef.current;
        if (!branchCanvas || !particleCanvas) return;

        const mql = window.matchMedia(MOBILE_MEDIA_QUERY);

        let controller: SakuraCanvas | null = null;
        let resizeRaf = 0;

        const buildController = () => {
            const isNarrow = mql.matches;
            isNarrowRef.current = isNarrow;
            branchCanvas.classList.toggle('top-7', isNarrow);
            branchCanvas.classList.toggle('top-8', !isNarrow);

            controller = new SakuraCanvas(branchCanvas, particleCanvas, {
                isNarrow,
                branchTopOffset: isNarrow
                    ? BRANCH_TOP_OFFSET_MOBILE
                    : BRANCH_TOP_OFFSET_DESKTOP,
            });
        };

        buildController();

        // Coalesce burst resize events (dragging the window corner fires
        // dozens per second and each resize rebuilds the branch fractal).
        const onResize = () => {
            if (resizeRaf) return;
            resizeRaf = requestAnimationFrame(() => {
                resizeRaf = 0;
                controller?.resize();
            });
        };
        const onVisibilityChange = () => {
            if (document.hidden) {
                controller?.pause();
            } else {
                controller?.play();
            }
        };
        // Mobile↔desktop flip: particle DPR and sprite cache are baked into
        // the instance, so we must fully rebuild on a breakpoint crossing.
        const onBreakpointChange = () => {
            if (mql.matches === isNarrowRef.current) return;
            controller?.dispose();
            controller = null;
            buildController();
        };

        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', onVisibilityChange);
        mql.addEventListener('change', onBreakpointChange);

        return () => {
            if (resizeRaf) cancelAnimationFrame(resizeRaf);
            window.removeEventListener('resize', onResize);
            document.removeEventListener(
                'visibilitychange',
                onVisibilityChange,
            );
            mql.removeEventListener('change', onBreakpointChange);
            controller?.dispose();
        };
    }, []);

    return (
        <>
            <canvas
                ref={branchCanvasRef}
                className="pointer-events-none fixed top-8 left-0 z-50"
            />
            <canvas
                ref={particleCanvasRef}
                className="pointer-events-none absolute top-0 left-0 z-50"
            />
        </>
    );
};

export default SakuraEffect;
