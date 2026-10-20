import { type FC, type PropsWithChildren, useState } from 'react';

import { Redirect } from 'expo-router';
import {
    Bell,
    Bookmark,
    Heart,
    MessageCircle,
    Plus,
    Star,
    Users,
} from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';

import PosterCard from '@/components/content-card/poster-card';
import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';

const POSTER =
    'https://cdn.hikka.io/content/anime/sousou-no-frieren-ad4e3e/8D-SGEkCBMAUE7CgEt9UPQ.jpg';
const AVATAR =
    'https://cdn.hikka.io/content/characters/frieren-7f706c/zX7V8YWM3zljrr80U3aPIw.jpg';

const BUTTON_VARIANTS = [
    'default',
    'secondary',
    'outline',
    'ghost',
    'destructive',
    'success',
    'warning',
    'info',
    'link',
] as const;

const BADGE_VARIANTS = [
    'default',
    'secondary',
    'success',
    'warning',
    'destructive',
    'outline',
] as const;

const STATUSES = [
    'watching',
    'reading',
    'planned',
    'completed',
    'on_hold',
    'dropped',
    'ongoing',
    'finished',
    'announced',
    'discontinued',
    'paused',
] as const;

type SectionProps = {
    title: string;
};

const CHIP_OPTIONS = ['Усі', 'Аніме', 'Манґа', 'Ранобе'] as const;

const Section: FC<PropsWithChildren<SectionProps>> = ({ title, children }) => (
    <View className="gap-3">
        <Header>
            <HeaderTitle size="subsection">{title}</HeaderTitle>
        </Header>
        {children}
    </View>
);

const UICatalog: FC = () => {
    const [chip, setChip] = useState<(typeof CHIP_OPTIONS)[number]>(
        CHIP_OPTIONS[0],
    );

    if (!__DEV__) return <Redirect href="/" />;

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="gap-6 px-4 py-4 pb-16"
            contentInsetAdjustmentBehavior="automatic"
        >
            <Section title="Header">
                <Card>
                    <Header>
                        <HeaderTitle size="page">Сторінка</HeaderTitle>
                    </Header>
                    <Header>
                        <HeaderTitle count={128}>Секція</HeaderTitle>
                        <HeaderActions>
                            <Button
                                size="icon-sm"
                                variant="outline"
                                accessibilityLabel="Додати"
                            >
                                <Icon as={Plus} />
                            </Button>
                        </HeaderActions>
                    </Header>
                    <Header>
                        <HeaderTitle
                            countPending
                            onPress={() => toast('Header')}
                        >
                            З посиланням
                        </HeaderTitle>
                    </Header>
                    <Header>
                        <HeaderTitle size="subsection" count={12}>
                            Підсекція
                        </HeaderTitle>
                        <HeaderActions>
                            <Button size="sm" variant="ghost">
                                Усі
                            </Button>
                        </HeaderActions>
                    </Header>
                </Card>
            </Section>

            <Section title="Card">
                <Card>
                    <Text>surface</Text>
                </Card>
                <Card variant="inset">
                    <Text>inset</Text>
                </Card>
                <Card variant="plain">
                    <Text>plain</Text>
                </Card>
            </Section>

            <Section title="Button">
                <View className="flex-row flex-wrap gap-2">
                    {BUTTON_VARIANTS.map((variant) => (
                        <Button
                            key={variant}
                            variant={variant}
                            size="md"
                            onPress={() => toast(variant)}
                        >
                            {variant}
                        </Button>
                    ))}
                </View>
                <View className="flex-row flex-wrap items-center gap-2">
                    <Button size="lg">lg</Button>
                    <Button>default</Button>
                    <Button size="md">md</Button>
                    <Button size="sm">sm</Button>
                    <Button size="sm" disabled>
                        disabled
                    </Button>
                </View>
                <View className="flex-row flex-wrap items-center gap-2">
                    <Button size="icon" accessibilityLabel="Улюблене">
                        <Icon as={Heart} />
                    </Button>
                    <Button
                        size="icon-md"
                        variant="secondary"
                        accessibilityLabel="Закладка"
                    >
                        <Icon as={Bookmark} />
                    </Button>
                    <Button
                        size="icon-sm"
                        variant="outline"
                        accessibilityLabel="Сповіщення"
                    >
                        <Icon as={Bell} />
                    </Button>
                    <Button variant="secondary">
                        <Icon as={Plus} />З іконкою
                    </Button>
                </View>
            </Section>

            <Section title="Badge">
                <View className="flex-row flex-wrap gap-2">
                    {BADGE_VARIANTS.map((variant) => (
                        <Badge key={variant} variant={variant}>
                            {variant}
                        </Badge>
                    ))}
                    <Badge>
                        <Icon as={Star} />
                        8.92
                    </Badge>
                </View>
                <View className="flex-row flex-wrap gap-2">
                    {STATUSES.map((status) => (
                        <Badge key={status} variant="status" status={status}>
                            {status}
                        </Badge>
                    ))}
                </View>
            </Section>

            <Section title="Chip">
                <View className="flex-row flex-wrap gap-2">
                    {CHIP_OPTIONS.map((option) => (
                        <Chip
                            key={option}
                            selected={chip === option}
                            className={chip === option ? '' : 'bg-secondary'}
                            onPress={() => setChip(option)}
                        >
                            {option}
                        </Chip>
                    ))}
                    <Chip className="bg-secondary/20">
                        <Icon as={MessageCircle} />
                        Статичний
                    </Chip>
                </View>
            </Section>

            <Section title="Stat item">
                <StatItemGroup>
                    <StatItem onPress={() => toast('Like')}>
                        <Icon as={Heart} />
                        24
                    </StatItem>
                    <StatItem onPress={() => toast('Comments')}>
                        <Icon as={MessageCircle} />8
                    </StatItem>
                </StatItemGroup>
                <StatItemGroup size="sm">
                    <StatItem size="sm">
                        <Icon as={Users} />1 204
                    </StatItem>
                    <StatItem size="sm">
                        <Icon as={Star} />
                        8.92
                    </StatItem>
                </StatItemGroup>
            </Section>

            <Section title="Avatar">
                <View className="flex-row items-center gap-3">
                    <Avatar>
                        <AvatarImage src={AVATAR} alt="hikka" />
                        <AvatarFallback>HK</AvatarFallback>
                    </Avatar>
                    <Avatar>
                        <AvatarImage src="https://invalid.hikka.io/x.jpg" />
                        <AvatarFallback>ОК</AvatarFallback>
                    </Avatar>
                    <Avatar className="size-12 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                            <Icon as={Users} />
                        </AvatarFallback>
                    </Avatar>
                </View>
            </Section>

            <Section title="Skeleton">
                <Card>
                    <View className="flex-row items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <SkeletonText className="flex-1 text-sm" lines={2} />
                    </View>
                    <SkeletonText className="text-base" lines={3} />
                </Card>
            </Section>

            <Section title="Separator">
                <Separator />
                <View className="h-6 flex-row items-center gap-3">
                    <Text className="text-sm">ТБ</Text>
                    <Separator orientation="vertical" />
                    <Text className="text-sm">2023</Text>
                </View>
            </Section>

            <Section title="Poster card">
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <PosterCard
                            image={POSTER}
                            title="Проводжальниця Фрірен"
                            href="/"
                            overlay={
                                <View className="absolute top-1 right-1">
                                    <Button
                                        size="icon-sm"
                                        variant="secondary"
                                        accessibilityLabel="Додати до списку"
                                        onPress={() => toast('Overlay')}
                                    >
                                        <Icon as={Plus} />
                                    </Button>
                                </View>
                            }
                        />
                    </View>
                    <View className="flex-1">
                        <PosterCard
                            image={POSTER}
                            title="Фрірен"
                            leftSubtitle="2023"
                            rightSubtitle="ТБ"
                            description="Аніме"
                        >
                            <View className="absolute top-2 right-2">
                                <Badge variant="status" status="watching">
                                    8.9
                                </Badge>
                            </View>
                        </PosterCard>
                    </View>
                    <View className="flex-1">
                        <PosterCard
                            image={POSTER}
                            title="Приховано"
                            href="/dev/markdown"
                            imageBlur
                            titleBlur
                        />
                    </View>
                </View>
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <PosterCard title="Без зображення" />
                    </View>
                    <View className="flex-1">
                        <PosterCardSkeleton />
                    </View>
                    <View className="flex-1">
                        <PosterCardSkeleton subtitles={false} titleLines={2} />
                    </View>
                </View>
            </Section>

            <Section title="Horizontal card">
                <Card>
                    <HorizontalCard
                        href="/"
                        action={
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                accessibilityLabel="Додати до списку"
                                onPress={() => toast('Action')}
                            >
                                <Icon as={Plus} />
                            </Button>
                        }
                    >
                        <HorizontalCardImage image={POSTER} />
                        <HorizontalCardContainer>
                            <HorizontalCardTitle
                                titleMeta={<Badge>8.92</Badge>}
                            >
                                Проводжальниця Фрірен
                            </HorizontalCardTitle>
                            <HorizontalCardDescription>
                                ТБ
                                <View className="size-1 rounded-full bg-muted-foreground" />
                                2023
                            </HorizontalCardDescription>
                        </HorizontalCardContainer>
                    </HorizontalCard>
                    <HorizontalCard>
                        <HorizontalCardImage image={AVATAR} imageRatio={1} />
                        <HorizontalCardContainer>
                            <HorizontalCardTitle>Фрірен</HorizontalCardTitle>
                            <HorizontalCardDescription>
                                Без посилання
                            </HorizontalCardDescription>
                        </HorizontalCardContainer>
                    </HorizontalCard>
                </Card>
            </Section>

            <Section title="Empty state">
                <Card className="p-0">
                    <EmptyState
                        size="sm"
                        title="Нічого не знайдено"
                        description="Спробуйте змінити фільтри"
                    />
                </Card>
                <EmptyState
                    bordered
                    title="Список порожній"
                    description="Додайте аніме, щоб воно зʼявилось тут"
                    icon={<Icon as={Bookmark} />}
                    action={<Button size="md">Перейти до каталогу</Button>}
                />
                <EmptyState size="lg" title="Великий стан" />
            </Section>

            <Section title="Toast">
                <View className="flex-row flex-wrap gap-2">
                    <Button
                        size="md"
                        variant="success"
                        onPress={() => toast.success('Збережено')}
                    >
                        success
                    </Button>
                    <Button
                        size="md"
                        variant="destructive"
                        onPress={() =>
                            toast.error('Помилка', {
                                description: 'Спробуйте ще раз',
                            })
                        }
                    >
                        error
                    </Button>
                    <Button
                        size="md"
                        variant="info"
                        onPress={() => toast.info('Інформація')}
                    >
                        info
                    </Button>
                    <Button
                        size="md"
                        variant="secondary"
                        onPress={() =>
                            toast.promise(
                                new Promise((resolve) =>
                                    setTimeout(resolve, 2500),
                                ),
                                {
                                    loading: 'Збереження',
                                    success: () => 'Збережено',
                                    error: () => 'Помилка',
                                },
                            )
                        }
                    >
                        loading
                    </Button>
                </View>
            </Section>
        </ScrollView>
    );
};

export default UICatalog;
