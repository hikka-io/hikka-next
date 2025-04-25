export {
    useCreateFavourite as useAddFavourite,
    useDeleteFavourite as useRemoveFavourite,
} from './useFavouriteMutations';
export {
    prefetchFavouriteStatus,
    useFavouriteStatus,
} from './useFavouriteStatus';
export {
    prefetchUserFavourites as prefetchFavouriteList,
    useUserFavourites as useFavouriteList,
} from './useUserFavourites';
