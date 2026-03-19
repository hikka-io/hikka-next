'use client';

import { useRouterState } from '@tanstack/react-router';

import { Button, ButtonProps } from '@/components/ui/button';

import { Link } from '@/utils/navigation';

const LoginButton = (props: ButtonProps) => {
    const currentUrl = useRouterState({
        select: (s) => s.location.pathname + s.location.searchStr,
    });

    return (
        <Button size="md" variant="ghost" asChild {...props}>
            <Link to="/login" search={{ callbackUrl: currentUrl }}>
                Увійти
            </Link>
        </Button>
    );
};

export default LoginButton;
