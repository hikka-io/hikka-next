import { useState } from 'react';

import { useInView } from 'react-intersection-observer';

export const VISIBLE_ROOT_MARGIN = '400px';

export const useVisibleOnce = () => {
    const [seen, setSeen] = useState(false);
    const { ref } = useInView({
        triggerOnce: true,
        rootMargin: VISIBLE_ROOT_MARGIN,
        skip: seen,
        onChange: (inView) => inView && setSeen(true),
    });

    return { ref, visible: seen };
};
