import { useNProgress } from '@tanem/react-nprogress';
import { useRouterState } from '@tanstack/react-router';

const ANIMATION_DURATION = 300;

export default function RouterProgressBar() {
    const isLoading = useRouterState({ select: (s) => s.isLoading });
    const { animationDuration, isFinished, progress } = useNProgress({
        isAnimating: isLoading,
        animationDuration: ANIMATION_DURATION,
        incrementDuration: 500,
        minimum: 0.08,
    });

    return (
        <div
            className="pointer-events-none fixed inset-x-0 top-0 z-9999"
            style={{
                opacity: isFinished ? 0 : 1,
                transition: `opacity ${animationDuration}ms ease`,
            }}
        >
            <div
                className="h-0.5 bg-primary-foreground shadow-[0_0_10px_var(--primary-foreground),0_0_5px_var(--primary-foreground)]"
                style={{
                    width: `${progress * 100}%`,
                    transition: `width ${animationDuration}ms ease`,
                }}
            />
        </div>
    );
}
