import { useInView } from 'react-intersection-observer';

import { VISIBLE_ROOT_MARGIN } from './use-visible-once';

export const useVisible = () => {
    const { ref, inView } = useInView({ rootMargin: VISIBLE_ROOT_MARGIN });

    return { ref, visible: inView };
};
