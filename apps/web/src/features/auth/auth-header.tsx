import type { ReactNode } from 'react';

const AuthHeader = ({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) => {
    return (
        <div className="space-y-2 text-center">
            <h1 className="font-bold text-3xl">{title}</h1>
            <small className="text-muted-foreground">{children}</small>
        </div>
    );
};

export default AuthHeader;
