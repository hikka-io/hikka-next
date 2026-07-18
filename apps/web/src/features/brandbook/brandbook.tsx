import { Download } from 'lucide-react';

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
import { cn } from '@/utils/cn';
import { SOCIAL_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';

import {
    BRAND_COLORS,
    FIGMA_URL,
    FONT_WEIGHTS,
    ICON_SETS,
    LOGO_ASSETS,
} from './constants';

const LogoSection = () => {
    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h3">Логотип</HeaderTitle>
                </HeaderContainer>
            </Header>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {LOGO_ASSETS.map((asset) => (
                    <Card key={asset.src} className="gap-2">
                        <div
                            className={cn(
                                'flex h-32 items-center justify-center rounded-md border border-border',
                                asset.previewClassName,
                            )}
                        >
                            <img
                                src={asset.src}
                                alt={asset.title}
                                className="max-h-16 max-w-[70%] object-contain"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-sm">
                                {asset.title}
                            </span>
                            <Button size="sm" variant="outline" asChild>
                                <a href={asset.src} download={asset.fileName}>
                                    <Download /> {asset.format}
                                </a>
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </Block>
    );
};

const ColorsSection = () => {
    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h3">Кольори</HeaderTitle>
                    <HeaderDescription>
                        Значення змінюються залежно від обраної теми
                    </HeaderDescription>
                </HeaderContainer>
            </Header>
            <Card>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {BRAND_COLORS.map((color) => (
                        <div
                            key={color.variable}
                            className="flex flex-col gap-2"
                        >
                            <div
                                className={cn(
                                    'h-16 w-full rounded-md border border-border',
                                    color.className,
                                )}
                            />
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">
                                    {color.title}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                    var({color.variable})
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ICON_SETS.map((set) => (
                    <Card key={set.title} className="gap-2">
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">
                                {set.title}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {set.description}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-2xl">
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
                </HeaderContainer>
            </Header>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="gap-2">
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">Figma</span>
                        <span className="text-muted-foreground text-xs">
                            Макети та дизайн-система проєкту
                        </span>
                    </div>
                    <div>
                        <Button size="sm" variant="outline" asChild>
                            <Link to={FIGMA_URL}>
                                <MaterialSymbolsOpenInNewRounded /> Відкрити
                            </Link>
                        </Button>
                    </div>
                </Card>
                {SOCIAL_LINKS.map((link) => (
                    <Card key={link.href} className="gap-2">
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">
                                {link.title}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {link.href}
                            </span>
                        </div>
                        <div>
                            <Button size="sm" variant="outline" asChild>
                                <Link to={link.href}>
                                    <link.icon /> Відкрити
                                </Link>
                            </Button>
                        </div>
                    </Card>
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
                        Логотипи, кольори, шрифти та інші ресурси бренду Hikka
                    </HeaderDescription>
                </Header>
            </Block>
            <LogoSection />
            <ColorsSection />
            <FontsSection />
            <IconsSection />
            <ResourcesSection />
        </div>
    );
};

export default Brandbook;
