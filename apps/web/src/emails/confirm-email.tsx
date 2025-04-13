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

export const ConfirmEmail = () => {
    const previewText = `{username}, підтвердіть вашу електронну пошту`;

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
                    className="body m-auto bg-black font-sans"
                >
                    <Container className="mx-auto my-[40px] w-[465px] rounded-lg border border-solid border-border p-8">
                        <Section className="py-4 text-left">
                            <Img
                                title="Hikka"
                                src={`https://www.cdn.hikka.io/logo.png`}
                                width="80"
                                height="24"
                                alt="Hikka"
                            />
                        </Section>
                        <div className="gmail-blend-screen">
                            <div className="gmail-blend-difference">
                                <Heading className="text-[20px] font-bold leading-[28px] text-white">
                                    Вітаємо, {'{username}'}!
                                </Heading>
                                <Text className="text-[16px] leading-[24px] text-white">
                                    Ви успішно зареєструватились на{' '}
                                    <strong>hikka</strong>. Щоб залишати Ваш
                                    акаунт у безпеці та дати Вам більше
                                    можливостей на сайті, будь ласка,
                                    підтвердіть Вашу електронну пошту. Дякуємо
                                    Вам за підтримку та до зустрічі!
                                </Text>
                            </div>
                        </div>
                        <div className="flex items-center justify-center rounded-lg border border-solid border-border bg-secondary/20 p-4">
                            <Button
                                className="w-full rounded-lg bg-accent p-4 text-center text-[14px] font-semibold text-black no-underline"
                                href={'https://hikka.io/auth/activate/{token}'}
                            >
                                Підтвердити email
                            </Button>
                        </div>
                        <div className="gmail-blend-screen">
                            <div className="gmail-blend-difference">
                                <Text className="text-base-content text-[14px] leading-[20px]">
                                    Якщо ви не реєструвались за цією електронною
                                    поштою, нема про що хвилюватися – ви можете
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
