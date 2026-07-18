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
    ICON_SETS,
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
                    <HeaderDescription>
                        Geist Variable — var(--font-sans)
                    </HeaderDescription>
                </HeaderContainer>
            </Header>
            <Card>
                <p className="text-2xl">
                    Українська енциклопедія аніме, манґи та ранобе
                </p>
                <p className="text-muted-foreground">
                    Аа Бб Вв Гг Ґг Дд Ее Єє Жж Зз Ии Іі Її Йй Кк Лл Мм Нн Оо Пп
                    Рр Сс Тт Уу Фф Хх Цц Чч Шш Щщ Ьь Юю Яя
                </p>
                <p className="text-muted-foreground">
                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt
                    Uu Vv Ww Xx Yy Zz 0 1 2 3 4 5 6 7 8 9
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {FONT_WEIGHTS.map((weight) => (
                        <div
                            key={weight.title}
                            className="flex flex-col gap-1 rounded-md border border-border p-3"
                        >
                            <span className="text-muted-foreground text-xs">
                                {weight.title}
                            </span>
                            <span className={cn('text-xl', weight.className)}>
                                Hikka
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

const IconsSection = () => {
    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h3">Іконки</HeaderTitle>
                    <HeaderDescription>
                        Набори іконок, що використовуються в інтерфейсі
                    </HeaderDescription>
                </HeaderContainer>
            </Header>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {ICON_SETS.map((set) => (
                    <Card key={set.title} className="gap-2 p-3">
                        <span className="font-medium text-xs">{set.title}</span>
                        <div className="flex items-center gap-3 text-xl">
                            {set.icons.map((Icon) => (
                                <Icon key={Icon.name} />
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </Block>
    );
};

const ResourcesSection = () => {
    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h3">Ресурси</HeaderTitle>
                    <HeaderDescription>
                        Корисні посилання та ресурси бренду
                    </HeaderDescription>
                </HeaderContainer>
            </Header>
            <Card className="gap-0 p-0">
                <div className="flex items-center justify-between gap-4 p-4">
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">Figma</span>
                        <span className="text-muted-foreground text-xs">
                            Макети та дизайн-система проєкту
                        </span>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                        <Link to={FIGMA_URL}>
                            <MaterialSymbolsOpenInNewRounded /> Відкрити
                        </Link>
                    </Button>
                </div>
                {SOCIAL_LINKS.map((link) => (
                    <div key={link.href}>
                        <Separator />
                        <div className="flex items-center justify-between gap-4 p-4">
                            <div className="flex items-center gap-3">
                                <link.icon className="text-lg" />
                                <span className="font-medium text-sm">
                                    {link.title}
                                </span>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                                <Link to={link.href}>
                                    <MaterialSymbolsOpenInNewRounded /> Відкрити
                                </Link>
                            </Button>
                        </div>
                    </div>
                ))}
            </Card>
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
                        Логотипи, шрифти, іконки та інші ресурси бренду Hikka
                    </HeaderDescription>
                </Header>
            </Block>
            <LogoSection />
            <FontsSection />
            <IconsSection />
            <ResourcesSection />
        </div>
    );
};

export default Brandbook;
