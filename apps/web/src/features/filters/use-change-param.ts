import { useNavigate } from '@tanstack/react-router';

export const useChangeParam = () => {
    const navigate = useNavigate();

    const handleChangeParam = (
        name: string,
        value: string | string[] | number[] | boolean,
        clear: readonly string[] = [],
    ) => {
        navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => {
                const next: Record<string, unknown> = { ...prev };

                // Reset pagination on filter change
                delete next.page;

                for (const key of clear) delete next[key];

                if (
                    value === false ||
                    value === '' ||
                    value === undefined ||
                    value === null ||
                    (Array.isArray(value) && value.length === 0)
                ) {
                    delete next[name];
                } else {
                    next[name] = value;
                }

                return next;
            },
            replace: true,
            resetScroll: false,
        });
    };

    return handleChangeParam;
};
