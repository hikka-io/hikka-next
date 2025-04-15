// Server utilities
export * from './server';

// Provider exports
export * from './provider';

// Core hook utilities
export * from './hooks/core/queryKeys';
export * from './hooks/core/useInfiniteQuery';
export * from './hooks/core/useMutation';
export * from './hooks/core/useQuery';

// Anime hooks
export * from './hooks/anime/useAnimeCharacters';
export * from './hooks/anime/useAnimeDetails';
export * from './hooks/anime/useAnimeEpisodes';
export * from './hooks/anime/useAnimeFranchise';
export * from './hooks/anime/useAnimeGenres';
export * from './hooks/anime/useAnimeRecommendations';
export * from './hooks/anime/useAnimeSearch';
export * from './hooks/anime/useAnimeStaff';

// Manga hooks
export * from './hooks/manga/useMangaCharacters';
export * from './hooks/manga/useMangaDetails';
export * from './hooks/manga/useMangaSearch';

// Novel hooks
export * from './hooks/novel/useNovelCharacters';
export * from './hooks/novel/useNovelDetails';
export * from './hooks/novel/useNovelSearch';

// Character hooks
export * from './hooks/characters/useCharacterAnime';
export * from './hooks/characters/useCharacterDetails';
export * from './hooks/characters/useCharacterManga';
export * from './hooks/characters/useCharacterNovel';
export * from './hooks/characters/useCharacterSearch';
export * from './hooks/characters/useCharacterVoices';

// People hooks
export * from './hooks/people/usePersonAnime';
export * from './hooks/people/usePersonCharacters';
export * from './hooks/people/usePersonDetails';
export * from './hooks/people/usePersonManga';
export * from './hooks/people/usePersonNovel';
export * from './hooks/people/usePersonSearch';

// Collection hooks
export * from './hooks/collections/useCollection';
export * from './hooks/collections/useCollections';
export * from './hooks/collections/useCreateCollection';
export * from './hooks/collections/useDeleteCollection';
export * from './hooks/collections/useUpdateCollection';

// Auth hooks
export * from './hooks/auth/useActivate';
export * from './hooks/auth/useConfirmPasswordReset';
export * from './hooks/auth/useLogin';
export * from './hooks/auth/useOAuthLogin';
export * from './hooks/auth/useOAuthUrl';
export * from './hooks/auth/useRequestPasswordReset';
export * from './hooks/auth/useResendActivation';
export * from './hooks/auth/useRevokeToken';
export * from './hooks/auth/useSignup';
export * from './hooks/auth/useThirdPartyTokens';
export * from './hooks/auth/useTokenInfo';

// User hooks
export * from './hooks/user/useCurrentUser';
export * from './hooks/user/useUserActivity';
export * from './hooks/user/useUserProfile';
export * from './hooks/user/useUserSearch';

// Watch hooks
export * from './hooks/watch/useDeleteWatchEntry';
export * from './hooks/watch/useRandomWatchEntry';
export * from './hooks/watch/useUpdateWatch';
export * from './hooks/watch/useUpdateWatchEntry';
export * from './hooks/watch/useWatchEntry';
export * from './hooks/watch/useWatchingUsers';
export * from './hooks/watch/useWatchList';
export * from './hooks/watch/useWatchStats';
export * from './hooks/watch/useWatchStatus';

// Read hooks
export * from './hooks/read/useDeleteReadEntry';
export * from './hooks/read/useRandomReadEntry';
export * from './hooks/read/useReadEntry';
export * from './hooks/read/useReadingUsers';
export * from './hooks/read/useReadList';
export * from './hooks/read/useReadStats';
export * from './hooks/read/useUpdateReadEntry';

// Settings hooks
export * from './hooks/settings/useChangeDescription';
export * from './hooks/settings/useChangeEmail';
export * from './hooks/settings/useChangePassword';
export * from './hooks/settings/useChangeUsername';
export * from './hooks/settings/useDeleteImage';
export * from './hooks/settings/useDeleteReadList';
export * from './hooks/settings/useDeleteWatchList';
export * from './hooks/settings/useExportLists';
export * from './hooks/settings/useIgnoredNotifications';
export * from './hooks/settings/useImportReadList';
export * from './hooks/settings/useImportWatchList';
export * from './hooks/settings/useUpdateIgnoredNotifications';

// Favourite hooks
export * from './hooks/favourite/useAddToFavourites';
export * from './hooks/favourite/useFavouriteList';
export * from './hooks/favourite/useFavouriteStatus';
export * from './hooks/favourite/useRemoveFromFavourites';

// Vote hooks
export * from './hooks/vote/useSetVote';
export * from './hooks/vote/useVote';

// Edit hooks
export * from './hooks/edit/useAddEdit';
export * from './hooks/edit/useApproveEdit';
export * from './hooks/edit/useEdit';
export * from './hooks/edit/useEditList';
export * from './hooks/edit/useRejectEdit';
export * from './hooks/edit/useUpdateEdit';

// Comments hooks
export * from './hooks/comments/useCommentsList';
export * from './hooks/comments/useCommentThread';
export * from './hooks/comments/useContentComments';
export * from './hooks/comments/useEditComment';
export * from './hooks/comments/useHideComment';
export * from './hooks/comments/useLatestComments';
export * from './hooks/comments/useWriteComment';

// Upload hooks
export * from './hooks/upload/useUploadImage';

// Stats hooks
export * from './hooks/stats/useEditsTop';

// Companies hooks
export * from './hooks/companies/useCompanySearch';

// Genres hooks
export * from './hooks/genres/useGenres';

// History hooks
export * from './hooks/history/useFollowingHistory';
export * from './hooks/history/useUserHistory';

// Notifications hooks
export * from './hooks/notifications/useMarkNotificationSeen';
export * from './hooks/notifications/useNotifications';
export * from './hooks/notifications/useNotificationsUnseenCount';

// Schedule hooks
export * from './hooks/schedule/useAnimeSchedule';

// Follow hooks
export * from './hooks/follow/useFollow';
export * from './hooks/follow/useFollowers';
export * from './hooks/follow/useFollowings';
export * from './hooks/follow/useFollowStats';
export * from './hooks/follow/useFollowStatus';
export * from './hooks/follow/useUnfollow';

// Articles hooks
export * from './hooks/articles/useArticle';
export * from './hooks/articles/useArticles';
export * from './hooks/articles/useArticleStats';
export * from './hooks/articles/useCreateArticle';
export * from './hooks/articles/useDeleteArticle';
export * from './hooks/articles/useUpdateArticle';

// Related hooks
export * from './hooks/related/useFranchise';

// Re-export types from the client for convenience
export type {
    AnimeInfoResponse,
    AnimeResponse,
    CharacterResponse,
    CollectionResponse,
    MangaResponse,
    NotificationResponse,
    NovelResponse,
    PersonResponse,
    ReadResponse,
    UserResponse,
    UserWithEmailResponse,
    WatchResponse,
} from '@hikka/client';

// Re-export enums from the client for convenience
export {
    AnimeStatusEnum,
    ContentStatusEnum,
    FavouriteContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
