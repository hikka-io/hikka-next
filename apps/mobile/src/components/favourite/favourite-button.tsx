import type { FC } from 'react';

import { Heart } from 'lucide-react-native';

import type { FavouriteContentTypeEnum } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import { favouriteHint, favouriteLabel } from './favourite-copy';
import { useFavourite } from './use-favourite';

type Props = {
    contentType: FavouriteContentTypeEnum;
    slug: string;
    variant?: 'secondary' | 'ghost';
    className?: string;
};

/** The web's `FavoriteButton`: a heart that fills red once the item is a favourite; guests go to login. */
const FavouriteButton: FC<Props> = ({
    contentType,
    slug,
    variant = 'secondary',
    className,
}) => {
    const favourite = useFavourite(contentType, slug);
    const { status, isFavourite, activeColor } = favourite;

    return (
        <Button
            variant={variant}
            size="icon-md"
            accessibilityLabel={favouriteLabel(favourite)}
            accessibilityHint={favouriteHint(favourite)}
            accessibilityState={{ selected: isFavourite }}
            disabled={status === 'loading'}
            className={className}
            onPress={favourite.onPress}
        >
            <Icon
                as={Heart}
                fill={isFavourite && activeColor ? activeColor : 'none'}
                className={cn(
                    'size-5',
                    isFavourite ? 'text-red-500' : 'text-foreground',
                )}
            />
        </Button>
    );
};

export default FavouriteButton;
