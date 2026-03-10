import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const NoSpoiler = ({ children }: Props) => {
    return <span className="spoiler-blur-xs">{children}</span>;
};

export default NoSpoiler;
