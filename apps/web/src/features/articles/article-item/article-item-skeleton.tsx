import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { Skeleton } from '@/components/ui/skeleton';

const ArticleItemSkeleton = () => {
    return (
        <Card className="-mx-4 overflow-hidden md:mx-0">
            <HorizontalCard>
                <HorizontalCardImage
                    image={<Skeleton className="size-full" />}
                    imageRatio={1}
                    href="#"
                />
                <HorizontalCardContainer className="gap-1">
                    <HorizontalCardTitle href="#">
                        <Skeleton className="h-4 w-24 rounded-lg" />
                    </HorizontalCardTitle>
                    <HorizontalCardContainer className="flex-row items-center">
                        <HorizontalCardDescription>
                            <Skeleton className="h-2 w-10 rounded-lg" />
                        </HorizontalCardDescription>
                        <Skeleton className="size-1 rounded-full" />
                        <HorizontalCardDescription>
                            <Skeleton className="h-2 w-16 rounded-lg" />
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                </HorizontalCardContainer>
                <Skeleton className="h-10 w-20 rounded-lg" />
            </HorizontalCard>
            <div className="relative flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <Skeleton className="h-2 w-24 rounded-lg" />
                    <Skeleton className="h-6 w-full rounded-lg" />
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-2 w-full rounded-lg" />
                    <Skeleton className="h-2 w-full rounded-lg" />
                    <Skeleton className="h-2 w-1/3 rounded-lg" />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <div className="flex gap-1">
                    <Skeleton className="h-8 w-12 rounded-lg" />
                    <Skeleton className="h-8 w-12 rounded-lg" />
                </div>
            </div>
        </Card>
    );
};

export default ArticleItemSkeleton;
