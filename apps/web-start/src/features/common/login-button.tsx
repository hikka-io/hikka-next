'use client';

import { Link } from '@tanstack/react-router';
import { usePathname, useSearchParams } from '@/utils/navigation';

import { Button, ButtonProps } from '@/components/ui/button';

const LoginButton = (props: ButtonProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    return (
        <Button size="md" variant="ghost" asChild {...props}>
            <Link to={`/login?callbackUrl=${currentUrl}`}>Увійти</Link>
        </Button>
    );
};

export default LoginButton;
