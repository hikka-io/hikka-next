import { useNavigate, useRouter, useRouterState } from '@tanstack/react-router';

export function useGraphOverlay() {
    // The pending location, so the overlay reacts before the route loaders settle.
    const open = useRouterState({
        select: (state) => state.location.search.graph === true,
    });
    const pushed = useRouterState({
        select: (state) => state.location.state.graphOverlay === true,
    });
    const navigate = useNavigate();
    const router = useRouter();

    const setOpen = (next: boolean) => {
        if (next === open) return;

        if (next) {
            navigate({
                to: '.',
                search: (prev) => ({ ...prev, graph: true }),
                state: { graphOverlay: true },
                resetScroll: false,
            });
            return;
        }

        // Back only over the entry the overlay pushed; a shared link closes in place.
        if (pushed) {
            router.history.back();
            return;
        }

        navigate({
            to: '.',
            search: (prev) => ({ ...prev, graph: undefined }),
            replace: true,
            resetScroll: false,
        });
    };

    return [open, setOpen] as const;
}
