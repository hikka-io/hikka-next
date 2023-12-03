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
                <Body className="bg-black my-auto mx-auto font-sans">
                    <Container className="border border-solid  border-secondary rounded-lg my-[40px] mx-auto p-8 w-[465px]">
                        <Section className="py-4">
                            <Img
                                src={`https://hikka.io/static/hikka.png`}
                                width="80"
                                height="24"
                                alt="Hikka"
                            />
                        </Section>
                        <Heading className="text-white text-[20px] leading-[28px] font-bold">
                            Вітаємо, {"{username}"}!
                        </Heading>
                        <Text className="text-white text-[16px] leading-[24px]">
                            Ви зробили запит на <strong>відновлення паролю</strong> Вашого акаунту. Для продовження, будь ласка, підтвердіть процес <strong>зміни Вашого паролю</strong>.
                        </Text>
                        <Text className="text-white text-[16px] leading-[24px]">
                            З повагою, команда hikka!
                        </Text>
                        <div className="border p-4 border-solid border-secondary/60 rounded-lg bg-secondary/30 flex justify-center items-center">
                            <Button
                                className="bg-accent p-4 w-full rounded-lg text-black text-[14px] font-semibold no-underline text-center"
                                href={"https://hikka.io/auth/reset/{token}"}
                            >
                                Змінити пароль
                            </Button>
                        </div>
                        <Text className="text-base-content text-[14px] leading-[20px]">
                            Якщо ви не робили цей запит, ви можете сміливо його
                            ігнорувати.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ConfirmEmail;
