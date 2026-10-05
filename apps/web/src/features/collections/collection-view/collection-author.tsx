import { useQuery } from '@tanstack/react-query';

import { getCollectionOptions } from '@hikka/api';

import FollowButton from '@/components/action-buttons/follow-button';
import RelativeTime from '@/components/relative-time';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { useMediaQuery } from '@/services/hooks/use-media-query';
import { Link, useParams } from '@/utils/navigation';

import { useCollectionMembers } from '../collection-members/use-collection-members';

const CollectionAuthor = () => {
    const params = useParams();
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference: String(params.reference) } }),
    );
    const { accepted, owner } = useCollectionMembers(String(params.reference));

    // The author created the collection and may have handed it over or left
    // since, so co-authors (owner included) are listed apart from them
    const coauthors = accepted.filter(
        (member) => member.user.username !== collection?.author.username,
    );

    return (
        <Card>
            <HorizontalCard>
                <HorizontalCardImage
                    image={collection?.author.avatar}
                    imageRatio={1}
                    to={`/u/${collection?.author.username}`}
                />
                <HorizontalCardContainer className="gap-1">
                    <HorizontalCardTitle
                        href={`/u/${collection?.author.username}`}
                    >
                        {collection?.author.username}
                    </HorizontalCardTitle>
                    <HorizontalCardDescription>
                        <RelativeTime value={collection!.updated} />
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
                <FollowButton
                    size={!isDesktop ? 'icon-md' : 'md'}
                    iconOnly={!isDesktop}
                    user={collection?.author}
                />
            </HorizontalCard>
            {coauthors.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-xs">
                    <span>Співавтори:</span>
                    {coauthors.map((member) => (
                        <Link
                            key={member.user.reference}
                            to={`/u/${member.user.username}`}
                            className="flex min-w-0 items-center gap-2 transition-colors duration-100 hover:text-foreground"
                        >
                            <Avatar className="size-5 shrink-0 rounded-sm">
                                <AvatarImage
                                    className="size-5 rounded-sm"
                                    src={member.user.avatar}
                                />
                                <AvatarFallback
                                    className="size-5 rounded-sm text-[10px]"
                                    title={member.user.username?.[0]}
                                />
                            </Avatar>
                            <span className="truncate">
                                {member.user.username}
                                {member === owner && ' · власник'}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default CollectionAuthor;
