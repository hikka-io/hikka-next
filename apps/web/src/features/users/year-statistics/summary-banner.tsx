'use client';

import { useSession } from '@hikka/react';
import { ChartLine } from 'lucide-react';
import { usePlausible } from 'next-plausible';
import Link from 'next/link';
import { FC } from 'react';

import H3 from '@/components/typography/h3';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

import { YEAR } from './constants';

interface Props {}

const SummaryBanner: FC<Props> = () => {
    const { user } = useSession();
    const plausible = usePlausible<Hikka.PlausibleEvents>();

    if (!user) {
        return null;
    }

    const handleTrackEvent = () => {
        plausible('year-summary-banner-click');
    };

    return (
        <Card className="isolate relative flex-col justify-between overflow-hidden bg-secondary/20 backdrop-blur md:flex-row">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute -left-20 -top-20 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-primary-foreground/5 blur-3xl" />
                <div className="absolute left-1/2 top-0 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/10 blur-2xl" />
            </div>
            <div className="flex items-center gap-4">
                <ChartLine className="size-6" />
                <div className="flex flex-col justify-center gap-1">
                    <H3 className="leading-5">Підсумки {YEAR} року</H3>
                    <span className="text-sm text-muted-foreground">
                        Перегляньте свої статистику та досягнення
                    </span>
                </div>
            </div>
            <Button onClick={handleTrackEvent} asChild>
                <Link href={`/summary/${user.username}/${YEAR}`}>
                    <ChartLine />
                    Переглянути підсумки
                </Link>
            </Button>
        </Card>
    );
};

export default SummaryBanner;
