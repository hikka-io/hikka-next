'use client';

import P from '@/components/typography/p';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const ArticleCover = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>Обкладинка статті</Label>
                <P className="text-sm text-muted-foreground">
                    Рекомендований розмір обкладинки 1500x500
                </P>
            </div>
            <div className="relative mb-4 flex h-48 w-full cursor-pointer">
                <Card className="flex-1 overflow-hidden bg-secondary/60 p-0 transition-opacity hover:opacity-60"></Card>
            </div>
        </div>
    );
};

export default ArticleCover;
