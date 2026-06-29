import { useEffect } from 'react';

import { usePathname } from '@/utils/navigation';

export function useCloseOnRouteChange(setOpen: (open: boolean) => void) {
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);
}
