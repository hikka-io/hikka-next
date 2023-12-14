import NProgress from 'nprogress';

import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter as useBaseRouter } from 'next/navigation';

export default function useRouter() {
    const router = useBaseRouter();

    const { push } = router;

    router.push = async (...args: [string, NavigateOptions]) => {
        NProgress.start();
        return push(...args);
    };

    return router;
}
