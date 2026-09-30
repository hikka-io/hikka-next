import { useInView } from 'react-intersection-observer';

import { VISIBLE_ROOT_MARGIN } from './visibility';

export const useVisible = () => {
    const { ref, inView } = useInView({ rootMargin: VISIBLE_ROOT_MARGIN });

    return { ref, visible: inView };
};
