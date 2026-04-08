'use client';

import { useOAuthProviderUrl } from '@hikka/react';

import BxBxlGoogle from '@/components/icons/bx/BxBxlGoogle';
import { Button } from '@/components/ui/button';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import { getSiteUrl } from '@/utils/url';

interface Props {
    disabled?: boolean;
    buttonText?: string;
}

const OAuthLogin = ({
    disabled = false,
    buttonText = 'Увійти з Google',
}: Props) => {
    const { callbackUrl } = useFilterSearch<{ callbackUrl?: string }>();

    const { data: oauthUrl } = useOAuthProviderUrl({
        provider: 'google',
        options: {
            select: (data) => {
                const state = new URL(
                    callbackUrl ?? '/',
                    getSiteUrl(),
                ).toString();
                return {
                    url: data.url + `&state=${encodeURIComponent(state)}`,
                };
            },
        },
    });

    return (
        <>
            {/* OR Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="border-border w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">
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
                onClick={() => {
                    if (oauthUrl?.url) {
                        window.location.href = oauthUrl.url;
                    }
                }}
            >
                <BxBxlGoogle className="mr-2 size-4" />
                {buttonText}
            </Button>
        </>
    );
};

export default OAuthLogin;
