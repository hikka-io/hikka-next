'use client';

import { useRouter } from '@tanstack/react-router';

const useChangeParam = () => {
    const router = useRouter();

    const handleChangeParam = (
        name: string,
        value: string | string[] | number[] | boolean,
    ) => {
        router.navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => {
                const next: Record<string, unknown> = { ...prev };

                // Reset pagination on filter change
                delete next.page;

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
        } as any);
    };

    return handleChangeParam;
};

export default useChangeParam;
