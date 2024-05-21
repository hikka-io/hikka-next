import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const NoSpoiler = ({ children }: Props) => {
    return (
        <div className="bg-muted-foreground text-muted-foreground">
            {children}
        </div>
    );
};

export default NoSpoiler;
