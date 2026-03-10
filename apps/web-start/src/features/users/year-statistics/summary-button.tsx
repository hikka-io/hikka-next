'use client';

import { useUserArtifactPrivacy } from '@hikka/react';
import { ChartLine } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils/cn';

interface Props {
    username: string;
    className?: string;
}

const SummaryButton = ({ username, className }: Props) => {
    const { data: artifactPrivacy } = useUserArtifactPrivacy({
        username,
        name: 'year-summary-2025',
    });

    if (!artifactPrivacy || artifactPrivacy?.private) {
        return null;
    }

    return (
        <Button
            variant="outline"
            asChild
            className={cn('relative overflow-hidden', className)}
        >
            <Link href={`/summary/${username}/2025`}>
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute left-2 -top-2 size-20 rounded-full bg-primary-foreground/10 blur-3xl" />
                    <div className="absolute bottom-2 -right-2 size-20 rounded-full bg-primary-foreground/5 blur-3xl" />
                    <div className="absolute left-1/2 top-2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/10 blur-2xl" />
                </div>
                <ChartLine /> Підсумки року
            </Link>
        </Button>
    );
};

export default SummaryButton;
