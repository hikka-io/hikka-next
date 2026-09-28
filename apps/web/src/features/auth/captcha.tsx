import type { Ref } from 'react';

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

import { CAPTCHA_SITE_KEY, getCaptchaBypass } from './captcha-config';

type Props = {
    ref: Ref<TurnstileInstance | undefined>;
};

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
