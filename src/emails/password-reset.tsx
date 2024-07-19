import {
    Body,
    Button,
    Container,
    Font,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import * as React from 'react';

export const ConfirmEmail = () => {
    const previewText = `Відновлення паролю {username}`;

    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="sans-serif"
                    fontWeight={400}
                    fontStyle="normal"
                />
                <style>
                    {`
                         .body .gmail-blend-screen { background:#000; mix-blend-mode:screen; }
                         .body .gmail-blend-difference { background:#000; mix-blend-mode:difference; }
                    `}
                </style>
            </Head>
            <Preview>{previewText}</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                '--btn-focus-scale': '1',
                                primary: '#000',
                                'primary-content': '#fff',

                                secondary: '#292929',
                                'secondary-content': '#fff',

                                accent: '#e779c1',
                                'accent-content': '#000',

                                neutral: '#494949',

                                'base-content': '#C7C7C7',
                            },
                        },
                    },
                }}
            >
                <Body
                    style={{ backgroundImage: 'linear-gradient(#000, #000)' }}
                    className="body mx-auto my-auto bg-black font-sans"
                >
                    <Container className="mx-auto my-[40px] w-[465px] rounded-lg border border-solid border-secondary p-8">
                        <Section className="py-4 text-left">
                            <Img
                                title="Hikka"
                                src={`https://cdn.hikka.io/logo.png`}
                                width="80"
                                height="24"
                                alt="Hikka"
                            />
                        </Section>
                        <div className="gmail-blend-screen">
                            <div className="gmail-blend-difference">
                                <Heading
                                    style={{ color: '#fff' }}
                                    className="text-[20px] font-bold leading-[28px]"
                                >
                                    Вітаємо, {'{username}'}!
                                </Heading>
                                <Text className="text-[16px] leading-[24px] text-white">
                                    Ви зробили запит на{' '}
                                    <strong>відновлення паролю</strong> Вашого
                                    акаунту. Для продовження, будь ласка,
                                    підтвердіть процес{' '}
                                    <strong>зміни Вашого паролю</strong>.
                                </Text>
                            </div>
                        </div>
                        <div className="gmail-blend-screen">
                            <div className="gmail-blend-difference">
                                <Text className="text-[16px] leading-[24px] text-white">
                                    З повагою, команда hikka!
                                </Text>
                            </div>
                        </div>
                        <div className="flex items-center justify-center rounded-lg border border-solid border-secondary/60 bg-secondary/30 p-4">
                            <Button
                                className="w-full rounded-lg bg-accent p-4 text-center text-[14px] font-semibold text-black no-underline"
                                href={'https://hikka.io/auth/reset/{token}'}
                            >
                                Змінити пароль
                            </Button>
                        </div>
                        <div className="gmail-blend-screen">
                            <div className="gmail-blend-difference">
                                <Text className="text-[14px] leading-[20px] text-base-content">
                                    Якщо ви не робили цей запит, ви можете
                                    сміливо його ігнорувати.
                                </Text>
                            </div>
                        </div>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ConfirmEmail;
