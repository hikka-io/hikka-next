import { ReactNode } from 'react';

import CoverImage from '@/components/cover-image';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="container flex min-h-[inherit] max-w-lg items-center justify-center p-0">
            <CoverImage cover="/hikka.art.w.jpg" position="bottom" />
            {children}
        </div>
    );
}
