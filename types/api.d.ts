export {};

declare global {
    namespace API {
        type UserRole =
            | 'admin'
            | 'moderator'
            | 'user'
            | 'banned'
            | 'not_activated';

        type WatchStatus =
            | 'completed'
            | 'watching'
            | 'planned'
            | 'dropped'
            | 'on_hold';

        type ReadStatus =
            | 'completed'
            | 'reading'
            | 'on_hold'
            | 'dropped'
            | 'planned';

        type StatType =
            | API.ReadStatus
            | API.WatchStatus
            | 'score_1'
            | 'score_2'
            | 'score_3'
            | 'score_4'
            | 'score_5'
            | 'score_6'
            | 'score_7'
            | 'score_8'
            | 'score_9'
            | 'score_10';

        type Season = 'summer' | 'winter' | 'fall' | 'spring';

        type MangaMediaType =
            | 'one_shot'
            | 'doujin'
            | 'manhua'
            | 'manhwa'
            | 'manga';

        type AnimeMediaType =
            | 'tv'
            | 'movie'
            | 'ova'
            | 'ona'
            | 'special'
            | 'music';

        type NovelMediaType = 'light_novel' | 'novel';

        type MediaType =
            | API.MangaMediaType
            | API.AnimeMediaType
            | API.NovelMediaType;

        type AgeRating = 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'rx';

        type Status =
            | 'ongoing'
            | 'finished'
            | 'announced'
            | 'paused'
            | 'discontinued';

        type VideoType = 'video_promo' | 'video_music';

        type OSTType = 'opening' | 'ending';

        type Source =
            | 'digital_manga'
            | 'picture_book'
            | 'visual_novel'
            | '4_koma_manga'
            | 'light_novel'
            | 'card_game'
            | 'web_manga'
            | 'original'
            | 'manga'
            | 'music'
            | 'novel'
            | 'other'
            | 'radio'
            | 'game'
            | 'book';

        type EditStatus = 'pending' | 'accepted' | 'denied' | 'closed';

        type ContentType =
            | 'novel'
            | 'manga'
            | 'edit'
            | 'anime'
            | 'character'
            | 'person'
            | 'comment'
            | 'collection';

        type HistoryType =
            | 'watch'
            | 'watch_delete'
            | 'read_novel'
            | 'read_novel_delete'
            | 'read_manga'
            | 'read_manga_delete'
            | 'watch_import'
            | 'read_import'
            | 'favourite_anime_add'
            | 'favourite_anime_remove'
            | 'favourite_manga_add'
            | 'favourite_manga_remove'
            | 'favourite_novel_add'
            | 'favourite_novel_remove';

        type Error = {
            code: string;
            message: string;
        };

        type User = {
            reference: string;
            description: string | null;
            username: string;
            created: number;
            avatar: string;
            cover?: string;
            role: UserRole;
            active: boolean;
            is_followed?: boolean;
            updated: number;
        };

        type WithPagination<T> = {
            pagination: Pagination;
            list: T[];
        };

        type Stats = Record<API.StatType, number>;

        type Pagination = {
            total: number;
            pages: number;
            page: number;
        };

        type Video = {
            url: string;
            title: string;
            description: string;
            video_type: VideoType;
        };

        type OST = {
            index: number;
            title: string;
            author: string;
            spotify: string;
            ost_type: OSTType;
        };

        type Watch = {
            reference: string;
            updated: number;
            created: number;
            note: string;
            status: API.WatchStatus;
            rewatches: number;
            episodes: number;
            score: number;
            anime: API.Anime;
        };

        type Read = {
            reference: string;
            note: string;
            updated: number;
            created: number;
            status: API.ReadStatus;
            chapters: number;
            volumes: number;
            rereads: number;
            score: number;
            content: API.Manga | API.Novel;
        };

        type Schedule = {
            episode: number;
            airing_at: number;
        };

        type AnimeSchedule = {
            anime: API.AnimeInfo;
            time_left: number;
        } & API.Schedule;

        type Anime = {
            data_type: 'anime';
            media_type: API.AnimeMediaType;
            title_ua: string;
            title_en: string;
            title_ja: string;
            episodes_released: number;
            episodes_total: number;
            image: string;
            status: API.Status;
            scored_by: number;
            score: number;
            slug: string;
            year: number;
            watch: API.Watch[];
            title?: string;
        };

        type AnimeInfo = {
            companies: API.CompanyWithType[];
            genres: API.Genre[];
            start_date: number;
            end_date: number;
            synopsis_en: string;
            synopsis_ua: string;
            duration: number;
            source: API.Source;
            rating: API.AgeRating;
            has_franchise: boolean;
            nsfw: boolean;
            synonyms: string[];
            external: API.External[];
            videos: API.Video[];
            ost: API.OST[];
            stats: API.Stats;
            comments_count: number;
            updated: number;
            schedule: API.Schedule[];
            mal_id: number;
        } & Anime;

        type GenreType = 'theme' | 'explicit' | 'demographic' | 'genre';

        type Genre = {
            name_en: string;
            name_ua: string;
            slug: string;
            type: API.GenreType;
        };

        type Magazine = {
            name_en: string;
            slug: string;
        };

        type Manga = {
            data_type: 'manga';
            title?: string;
            title_original: string;
            media_type: API.MangaMediaType;
            title_ua: string;
            title_en: string;
            chapters: number;
            volumes: number;
            translated_ua: boolean;
            status: API.Status;
            image: string;
            year: number;
            scored_by: number;
            score: number;
            slug: string;
            read: API.Read[];
        };

        type MangaInfo = {
            authors: {
                person: API.Person;
                roles: {
                    name_ua: string;
                    name_en: string;
                    slug: string;
                }[];
            }[];
            magazines: API.Magazine[];
            external: API.External[];
            start_date: number;
            end_date: number;
            genres: API.Genre[];
            stats: API.Stats;
            synopsis_en: string;
            synopsis_ua: string;
            updated: number;
            synonyms: string[];
            comments_count: number;
            has_franchise: boolean;
            mal_id: number;
            nsfw: boolean;
        } & API.Manga;

        type Novel = {
            data_type: 'novel';
            title?: string;
            title_original: string;
            media_type: API.NovelMediaType;
            title_ua: string;
            title_en: string;
            chapters: number;
            volumes: number;
            translated_ua: boolean;
            status: API.Status;
            image: string;
            year: number;
            scored_by: number;
            score: number;
            slug: string;
            read: API.Read[];
        };

        type NovelInfo = {
            authors: {
                person: API.Person;
                roles: {
                    name_ua: string;
                    name_en: string;
                    slug: string;
                }[];
            }[];
            magazines: API.Magazine[];
            external: API.External[];
            start_date: number;
            end_date: number;
            genres: API.Genre[];
            stats: API.Stats;
            synopsis_en: string;
            synopsis_ua: string;
            updated: number;
            synonyms: string[];
            comments_count: number;
            has_franchise: boolean;
            mal_id: number;
            nsfw: boolean;
        } & API.Novel;

        type Character = {
            data_type: 'character';
            name_ua: string;
            name_en: string;
            name_ja: string;
            description_ua: string;
            image: string;
            slug: string;
        };

        type Person = {
            data_type: 'person';
            name_native: string;
            name_ua: string;
            name_en: string;
            image: string;
            slug: string;
            description_ua: string | null;
            synonyms: string[];
            characters_count: number;
            anime_count: number;
        };

        type CompanyType = 'producer' | 'studio';

        type Company = {
            image: string;
            slug: string;
            name: string;
        };

        type CompanyWithType = {
            company: API.Company;
            type: API.CompanyType;
        };

        type Edit<TEditParams = Record<string, any>, TContent = MainContent> = {
            content_type: ContentType;
            status: API.EditStatus;
            description: string | null;
            created: number;
            updated: number;
            edit_id: number;
            moderator: API.User | null;
            author?: API.User;
            after: TEditParams;
            before: TEditParams | null;
            content: TContent;
        };

        type Comment = {
            reference: string;
            author: API.User;
            created: number;
            updated: number;
            text: string;
            replies: API.Comment[];
            total_replies: number;
            depth: number;
            vote_score: number;
            my_score?: number;
            hidden: boolean;
            is_editable: boolean;
            parent: string | null;
            content_type: API.ContentType;
            preview: { slug: string; image?: string };
        };

        type External = {
            url: string;
            text: string;
            type: 'general' | 'watch' | 'read';
        };

        type HistoryReadData = {
            after: {
                score: number | null;
                status: API.ReadStatus | null;
                chapters: number | null;
                volumes: number | null;
                rereads: number | null;
            };
            before: {
                score: number | null;
                status: API.ReadStatus | null;
                chapters: number | null;
                volumes: number | null;
                rereads: number | null;
            };
            new_read: boolean;
        };

        type HistoryWatchData = {
            after: {
                score: number | null;
                status: API.WatchStatus | null;
                episodes: number | null;
                rewatches: number | null;
            };
            before: {
                score: number | null;
                status: API.WatchStatus | null;
                episodes: number | null;
                rewatches: number | null;
            };
            new_watch: boolean;
        };

        type HistoryFavoriteData = {};

        type HistoryWatchImportData = {
            imported: number;
        };

        type HistoryReadImportData = {
            imported_manga: number;
            imported_novel: number;
        };

        type History<
            TData =
                | HistoryWatchData
                | HistoryFavoriteData
                | HistoryWatchImportData
                | HistoryReadImportData
                | HistoryReadData,
        > = {
            reference: string;
            content?: API.Anime | API.Manga | API.Novel;
            history_type: API.HistoryType;
            created: number;
            updated: number;
            data: TData;
            user: API.User;
        };

        type NotificationType =
            | 'comment_reply'
            | 'comment_vote'
            | 'comment_tag'
            | 'edit_comment'
            | 'collection_comment'
            | 'edit_accepted'
            | 'edit_denied'
            | 'edit_updated'
            | 'hikka_update'
            | 'schedule_anime'
            | 'follow'
            | 'collection_vote';

        type NotificationFollowData = {
            username: string;
            avatar: string;
        };

        type NotificationCommentData = {
            slug: string;
            comment_text: string;
            content_type: API.ContentType;
            comment_depth: number;
            comment_reference: string;
            base_comment_reference: string;
            username: string;
            avatar: string;
        };

        type NotificationVoteData = {
            slug: string;
            user_score: number;
            old_score: number;
            new_score: number;
            username: string;
            avatar: string;
        };

        type NotificationCommentVoteData = {
            content_type: API.ContentType;
            comment_reference: string;
            comment_depth: number;
            comment_text: string;
            base_comment_reference: string;
        } & NotificationVoteData;

        type NotificationEditData = {
            description: string;
            edit_id: number;
        };

        type NotificationHikkaData = {
            description: string;
            title: string;
            link: string;
        };

        type NotificationScheduleAnimeData = {
            slug: string;
            after: {
                status: API.Status;
                episodes_released: number;
            };
            before: {
                status: API.Status;
                episodes_released: number;
            };
            image: string;
            title_en: string;
            title_ja: string;
            title_ua: string;
        };

        type Notification<
            TData =
                | NotificationCommentData
                | NotificationCommentVoteData
                | NotificationEditData
                | NotificationHikkaData
                | NotificationScheduleAnimeData
                | NotificationVoteData
                | NotificationFollowData,
        > = {
            notification_type: NotificationType;
            created: number;
            reference: string;
            seen: boolean;
            data: TData;
        };

        type Activity = {
            timestamp: number;
            actions: number;
        };

        type CollectionItem<TContent extends API.MainContent = unknown> = {
            content: TContent;
            comment: string | null;
            label: string | null;
            content_type: API.ContentType;
            order: number;
        };

        type Collection<
            TContent extends API.MainContent & { title?: string } = unknown,
        > = {
            data_type: 'collection';
            author: API.User;
            created: number;
            updated: number;
            content_type: API.ContentType;
            description: string;
            tags: string[];
            reference: string;
            visibility: 'private' | 'public' | 'unlisted';
            spoiler: boolean;
            entries: number;
            title: string;
            nsfw: boolean;
            comments_count: number;
            vote_score: number;
            my_score: number | null;
            collection: CollectionItem<TContent>[];
        };

        type Content =
            | API.Anime
            | API.Manga
            | API.Novel
            | API.AnimeInfo
            | API.MangaInfo
            | API.NovelInfo
            | API.Character
            | API.Person
            | API.Collection;

        type MainContent = Exclude<API.Content, API.Collection>;
    }
}
