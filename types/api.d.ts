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

        type StatType =
            | WatchStatus
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

        type MediaType = 'tv' | 'movie' | 'ova' | 'ona' | 'special' | 'music';

        type AgeRating = 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'rx';

        type Status =
            | 'ongoing'
            | 'finished'
            // | 'discontinued'
            // | 'paused'
            | 'announced';

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
            | 'edit'
            | 'anime'
            | 'character'
            | 'person'
            | 'comment'
            | 'collection';

        type HistoryType =
            | 'watch'
            | 'watch_delete'
            | 'watch_import'
            | 'favourite_anime_add'
            | 'favourite_anime_remove';

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
        };

        type WithPagination<T> = {
            pagination: Pagination;
            list: T[];
        };

        type Stats = Record<StatType, number>;

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

        type Anime = {
            media_type: MediaType;
            title_ua: string;
            title_en: string;
            title_ja: string;
            episodes_released: number;
            episodes_total: number;
            poster: string;
            status: Status;
            scored_by: number;
            score: number;
            slug: string;
            year: number;
            watch: Watch[];
        };

        type AnimeInfo = {
            companies: Company[];
            genres: Genre[];
            start_date: number;
            end_date: number;
            synopsis_en: string;
            synopsis_ua: string;
            duration: number;
            source: Source;
            rating: AgeRating;
            has_franchise: boolean;
            nsfw: boolean;
            synonyms: string[];
            external: External[];
            videos: Video[];
            ost: OST[];
            stats: Stats;
            comments_count: number;
        } & Anime;

        type GenreType = 'theme' | 'explicit' | 'demographic' | 'genre';

        type Genre = {
            name_en: string;
            name_ua: string;
            slug: string;
            type: GenreType;
        };

        type Character = {
            name_ua: string;
            name_en: string;
            name_ja: string;
            description_ua: string;
            image: string;
            slug: string;
        };

        type Person = {
            name_native: string;
            name_ua: string;
            name_en: string;
            image: string;
            slug: string;
        };

        type Company = {
            company: {
                image: string;
                slug: string;
                name: string;
            };
            type: 'producer' | 'studio';
        };

        type Edit<
            TEditParams extends Record<string, any> = Record<string, any>,
            TContent extends API.Content = API.Content<'anime'> | API.Content<'character'>,
        > = {
            content_type: ContentType;
            status: EditStatus;
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
            text: string;
            replies: Comment[];
            total_replies: number;
            depth: number;
            score: number;
            my_score?: number;
            hidden: boolean;
        };

        type External = {
            url: string;
            text: string;
            type: 'general' | 'watch';
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

        type HistoryImportData = {
            imported: number;
        };

        type History<
            TData extends
                | HistoryWatchData
                | HistoryFavoriteData
                | HistoryImportData = HistoryWatchData,
        > = {
            reference: string;
            content?: API.Anime;
            history_type: HistoryType;
            created: number;
            updated: number;
            data: TData;
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
            | 'hikka_update';

        type NotificationCommentData = {
            slug: string;
            comment_text: string;
            content_type: ContentType;
            comment_depth: number;
            comment_author: string;
            comment_reference: string;
            base_comment_reference: string;
        };

        type NotificationCommentVoteData = {
            slug: string;
            content_type: ContentType;
            comment_reference: string;
            comment_depth: number;
            comment_text: string;
            base_comment_reference: string;
            user_score: number;
            old_score: number;
            new_score: number;
        };

        type NotificationEditData = {
            description: string;
            edit_id: number;
        };

        type NotificationHikkaData = {
            description: string;
            title: string;
            link: string;
        };

        type Notification<
            TData extends
                | NotificationCommentData
                | NotificationCommentVoteData
                | NotificationEditData
                | NotificationHikkaData = NotificationCommentData,
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

        type CollectionItem<TContent extends Content> = {
            content: TContent;
            comment: string | null;
            label: string | null;
            content_type: API.ContentType;
            order: number;
        };

        type Collection<TContent extends API.Content = API.Content<'anime'>> = {
            author: API.User;
            created: number;
            updated: number;
            content_type: API.ContentType;
            description: string;
            tags: string[];
            reference: string;
            private: boolean;
            spoiler: boolean;
            entries: number;
            title: string;
            nsfw: boolean;
            comments_count: number;
            collection: CollectionItem<TContent>[];
        };

        type Contents = {
            anime: API.AnimeInfo;
            character: API.Character;
            collection: API.Collection;
            comment: API.Comment;
            edit: API.Edit;
            person: API.Person;
        };

        type Content<K extends keyof Contents = keyof Contents> = Contents[K]
    }
}
