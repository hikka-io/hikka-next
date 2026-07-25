import type { ReactNode } from 'react';

const AuthHeader = ({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) => {
    return (
        <div className="flex flex-col gap-1.5 text-center">
            <h1 className="text-balance font-bold font-display text-2xl md:text-3xl">
                {title}
            </h1>
            <p className="text-balance text-muted-foreground text-sm">
                {children}
            </p>
        </div>
    );
};

export default AuthHeader;
