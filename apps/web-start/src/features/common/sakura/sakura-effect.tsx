import { useEffect, useRef } from 'react';

import { useIsMobile } from '@/services/hooks/use-mobile';
import { useReducedMotion } from '@/services/hooks/use-reduced-motion';
import { cn } from '@/utils/cn';

import { BRANCH_TOP_OFFSET_DESKTOP, BRANCH_TOP_OFFSET_MOBILE } from './config';
import SakuraCanvas from './sakura-canvas';

const SakuraCanvasView = ({ isNarrow }: { isNarrow: boolean }) => {
    const branchCanvasRef = useRef<HTMLCanvasElement>(null);
    const particleCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const branchCanvas = branchCanvasRef.current;
        const particleCanvas = particleCanvasRef.current;
        if (!branchCanvas || !particleCanvas) return;

        const controller = new SakuraCanvas(branchCanvas, particleCanvas, {
            isNarrow,
            branchTopOffset: isNarrow
                ? BRANCH_TOP_OFFSET_MOBILE
                : BRANCH_TOP_OFFSET_DESKTOP,
        });

        // Coalesce burst resize events (dragging the window corner fires
        // dozens per second and each resize rebuilds the branch fractal).
        let resizeRaf = 0;
        const onResize = () => {
            if (resizeRaf) return;
            resizeRaf = requestAnimationFrame(() => {
                resizeRaf = 0;
                controller.resize();
            });
        };
        const onVisibilityChange = () => {
            if (document.hidden) {
                controller.pause();
            } else {
                controller.play();
            }
        };

        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            if (resizeRaf) cancelAnimationFrame(resizeRaf);
            window.removeEventListener('resize', onResize);
            document.removeEventListener(
                'visibilitychange',
                onVisibilityChange,
            );
            controller.dispose();
        };
    }, [isNarrow]);

    return (
        <>
            <canvas
                ref={branchCanvasRef}
                className={cn(
                    'pointer-events-none fixed left-0 z-50',
                    isNarrow ? 'top-7' : 'top-8',
                )}
            />
            <div className="pointer-events-none absolute top-0 left-0 z-50 h-screen w-full overflow-hidden">
                <canvas
                    ref={particleCanvasRef}
                    className="pointer-events-none absolute top-0 left-0"
                />
            </div>
        </>
    );
};

const SakuraEffect = () => {
    const isMobile = useIsMobile();
    const reducedMotion = useReducedMotion();
    const isNarrow = isMobile ?? false;

    if (reducedMotion) return null;

    // Remount on viewport-class flip so petal counts and branch geometry
    // rebuild from scratch — simpler than diffing through updateConfig.
    return <SakuraCanvasView key={String(isNarrow)} isNarrow={isNarrow} />;
};

export default SakuraEffect;
