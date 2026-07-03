import { useEffect, useRef } from 'react';

import { BRANCH_TOP_OFFSET_DESKTOP, BRANCH_TOP_OFFSET_MOBILE } from './config';
import SakuraCanvas from './sakura-canvas';

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';
const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

const SakuraEffect = () => {
    const branchCanvasRef = useRef<HTMLCanvasElement>(null);
    const particleCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const branchCanvas = branchCanvasRef.current;
        const particleCanvas = particleCanvasRef.current;
        if (!branchCanvas || !particleCanvas) return;

        const narrowMql = window.matchMedia(MOBILE_MEDIA_QUERY);
        const motionMql = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);

        let controller: SakuraCanvas | null = null;
        let resizeRaf = 0;

        const buildController = () => {
            const isNarrow = narrowMql.matches;
            const branchTopOffset = isNarrow
                ? BRANCH_TOP_OFFSET_MOBILE
                : BRANCH_TOP_OFFSET_DESKTOP;
            branchCanvas.style.top = `${branchTopOffset}px`;

            controller = new SakuraCanvas(branchCanvas, particleCanvas, {
                isNarrow,
                branchTopOffset,
                reducedMotion: motionMql.matches,
            });
        };

        buildController();

        // Coalesce burst resize events (dragging the window corner fires
        // dozens per second and each resize rebuilds the branch bitmap).
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
        // Breakpoint or motion-preference flip: render scale, sprite cache
        // and entity population are baked into the instance — full rebuild.
        const onEnvironmentChange = () => {
            controller?.dispose();
            controller = null;
            buildController();
        };

        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', onVisibilityChange);
        narrowMql.addEventListener('change', onEnvironmentChange);
        motionMql.addEventListener('change', onEnvironmentChange);

        return () => {
            if (resizeRaf) cancelAnimationFrame(resizeRaf);
            window.removeEventListener('resize', onResize);
            document.removeEventListener(
                'visibilitychange',
                onVisibilityChange,
            );
            narrowMql.removeEventListener('change', onEnvironmentChange);
            motionMql.removeEventListener('change', onEnvironmentChange);
            controller?.dispose();
        };
    }, []);

    return (
        <>
            <canvas
                ref={branchCanvasRef}
                className="pointer-events-none fixed left-0 z-50"
            />
            <canvas
                ref={particleCanvasRef}
                className="mask-[linear-gradient(to_bottom,rgba(0,0,0,1)_75%,rgba(0,0,0,0))] pointer-events-none absolute top-0 left-0 z-50 h-lvh w-full"
            />
        </>
    );
};

export default SakuraEffect;
