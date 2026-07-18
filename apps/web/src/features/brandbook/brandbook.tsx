import MaterialSymbolsOpenInNewRounded from '@/components/icons/material-symbols/MaterialSymbolsOpenInNewRounded';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderDescription,
    HeaderTitle,
} from '@/components/ui/header';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils/cn';
import { SOCIAL_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';

import {
    FIGMA_URL,
    FONT_SIZES,
    FONT_WEIGHTS,
    LOGO_ASSETS,
    LOGO_FORMATS,
} from './constants';
import { downloadImage } from './utils';

const LogoSection = () => {
    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h3">Логотипи</HeaderTitle>
                </HeaderContainer>
            </Header>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {LOGO_ASSETS.map((asset) => (
                    <Card
                        key={`${asset.title}-${asset.previewClassName}`}
                        className="items-center gap-4"
                    >
                        <span className="font-medium text-sm">
                            {asset.title}
                        </span>
                        <div
                            className={cn(
                                'flex h-40 w-full items-center justify-center rounded-md border border-border',
                                asset.previewClassName,
                            )}
                        >
                            <img
                                src={asset.src}
                                alt={asset.title}
                                className={cn(
                                    'max-w-[70%] object-contain',
                                    asset.imageClassName,
                                )}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            {LOGO_FORMATS.map((format) =>
                                format.format === 'svg' ? (
                                    <a
                                        key={format.label}
                                        href={asset.src}
                                        download={`${asset.fileName}.svg`}
                                        className="text-primary-foreground text-xs hover:underline"
                                    >
                                        {format.label}
                                    </a>
                                ) : (
                                    <button
                                        key={format.label}
                                        type="button"
                                        onClick={() =>
                                            downloadImage({
                                                src: asset.src,
                                                format: format.format,
                                                fileName: asset.fileName,
                                                width: asset.width,
                                                background: asset.background,
                                            })
                                        }
                                        className="cursor-pointer text-primary-foreground text-xs hover:underline"
                                    >
                                        {format.label}
                                    </button>
                                ),
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </Block>
    );
};

const FontsSection = () => {
    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h3">Шрифт</HeaderTitle>
                </HeaderContainer>
            </Header>
            <Card className="gap-6">
                <div className="flex flex-col gap-6 md:flex-row">
                    <div className="flex h-40 shrink-0 items-center justify-center rounded-md border border-border md:w-48">
                        <span className="text-7xl leading-none">Аа</span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex flex-col">
                            <span className="font-medium">Geist Variable</span>
                            <span className="text-muted-foreground text-xs">
                                var(--font-sans)
                            </span>
                        </div>
                        <p className="text-2xl">
                            Українська енциклопедія аніме, манґи та ранобе
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Аа Бб Вв Гг Ґг Дд Ее Єє Жж Зз Ии Іі Її Йй Кк Лл Мм
                            Нн Оо Пп Рр Сс Тт Уу Фф Хх Цц Чч Шш Щщ Ьь Юю Яя
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq
                            Rr Ss Tt Uu Vv Ww Xx Yy Zz 0 1 2 3 4 5 6 7 8 9
                        </p>
                    </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {FONT_WEIGHTS.map((weight) => (
                        <div
                            key={weight.title}
                            className="flex flex-col items-center gap-1 rounded-md border border-border py-3"
                        >
                            <span
                                className={cn(
                                    'text-4xl leading-none',
                                    weight.className,
                                )}
                            >
                                Аа
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {weight.title}
                            </span>
                        </div>
                    ))}
                </div>
                <Separator />
                <div className="flex flex-col">
                    {FONT_SIZES.map((fontSize) => (
                        <div
                            key={fontSize.title}
                            className="flex items-baseline justify-between gap-4 border-border border-b py-2 last:border-b-0"
                        >
                            <span className={fontSize.className}>Hikka</span>
                            <span className="shrink-0 text-muted-foreground text-xs">
                                {fontSize.title} · {fontSize.size}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </Block>
    );
};

const ResourcesSection = () => {
    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h3">Ресурси</HeaderTitle>
                </HeaderContainer>
            </Header>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                    <Link to={FIGMA_URL}>
                        Figma <MaterialSymbolsOpenInNewRounded />
                    </Link>
                </Button>
                {SOCIAL_LINKS.map((link) => (
                    <Button key={link.href} variant="outline" asChild>
                        <Link to={link.href}>
                            <link.icon /> {link.title}
                        </Link>
                    </Button>
                ))}
            </div>
        </Block>
    );
};

const Brandbook = () => {
    return (
        <div className="flex flex-col gap-12">
            <Block>
                <Header className="flex-col items-start gap-1">
                    <HeaderTitle variant="h2">Брендбук</HeaderTitle>
                    <HeaderDescription>
                        Логотипи, шрифти та інші ресурси бренду Hikka
                    </HeaderDescription>
                </Header>
            </Block>
            <LogoSection />
            <FontsSection />
            <ResourcesSection />
        </div>
    );
};

export default Brandbook;
