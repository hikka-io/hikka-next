import { useState } from 'react';

import { useInView } from 'react-intersection-observer';

import { VISIBLE_ROOT_MARGIN } from './visibility';

export const useVisibleOnce = () => {
    const [seen, setSeen] = useState(false);
    const { ref } = useInView({
        rootMargin: VISIBLE_ROOT_MARGIN,
        skip: seen,
        onChange: (inView) => inView && setSeen(true),
    });

    return { ref, visible: seen };
};
