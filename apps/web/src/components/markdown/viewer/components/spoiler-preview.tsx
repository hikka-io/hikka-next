import type { FC, ReactNode } from 'react';

import SpoilerReveal from '../../spoiler-reveal';

type Props = {
    children: ReactNode;
};

const SpoilerPreview: FC<Props> = ({ children }) => {
    return <SpoilerReveal interactive={false}>{children}</SpoilerReveal>;
};

export default SpoilerPreview;
