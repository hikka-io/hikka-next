'use client';

import { useOAuthProviderUrl } from '@hikka/react';
import Link from 'next/link';

import BxBxlGoogle from '@/components/icons/bx/BxBxlGoogle';
import { Button } from '@/components/ui/button';

interface Props {
    disabled?: boolean;
    buttonText?: string;
}

const OAuthLogin = ({
    disabled = false,
    buttonText = 'Увійти з Google',
}: Props) => {
    const { data: oauthUrl } = useOAuthProviderUrl({
        provider: 'google',
        options: {
            select: (data) => {
                return {
                    url: data.url + `&state=${window.location.href}`,
                };
            },
        },
    });

    return (
        <>
            {/* OR Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        АБО
                    </span>
                </div>
            </div>

            {/* Google Button */}
            <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={disabled || !oauthUrl}
                asChild
            >
                <Link href={oauthUrl?.url ?? ''}>
                    <BxBxlGoogle className="mr-2 size-4" />
                    {buttonText}
                </Link>
            </Button>
        </>
    );
};

export default OAuthLogin;
