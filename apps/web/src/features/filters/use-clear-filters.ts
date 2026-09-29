import { useNavigate } from '@tanstack/react-router';

type Options = {
    preserve: readonly string[];
};

export const useClearFilters = ({ preserve }: Options) => {
    const navigate = useNavigate();

    return () =>
        navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => {
                const next: Record<string, unknown> = {};
                preserve.forEach((key) => {
                    if (prev[key]) next[key] = prev[key];
                });
                return next;
            },
            replace: true,
        });
};
