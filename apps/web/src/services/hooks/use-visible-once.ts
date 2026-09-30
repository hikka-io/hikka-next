import { useInView } from 'react-intersection-observer';

const VISIBLE_ROOT_MARGIN = '400px';

export const useVisibleOnce = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin: VISIBLE_ROOT_MARGIN,
    });

    return { ref, visible: inView };
};
