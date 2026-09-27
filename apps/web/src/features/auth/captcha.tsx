import type { Ref } from 'react';

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

import { getCaptchaBypass } from '@/utils/captcha';

import { CAPTCHA_SITE_KEY } from './hooks/use-captcha';

type Props = {
    ref: Ref<TurnstileInstance | undefined>;
};

/**
 * The Turnstile widget, or nothing when the captcha is bypassed for local
 * development (see `utils/captcha.ts`): no Cloudflare script, no iframe.
 */
const Captcha = ({ ref }: Props) => {
    if (getCaptchaBypass()) return null;

    return (
        <Turnstile
            ref={ref}
            siteKey={CAPTCHA_SITE_KEY}
            className="flex justify-center"
        />
    );
};

export default Captcha;
