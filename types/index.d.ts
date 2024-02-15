import { ReactElement, ReactNode } from 'react';

export {};

declare global {
    namespace JSX {
        // this merges with the existing intrinsic elements, adding 'my-custom-tag' and its props
        interface IntrinsicElements {
            spoiler: { children: ReactNode };
        }
    }

    interface Window {
        authModal: HTMLDialogElement;
        settingsModal: HTMLDialogElement;
        watchEditModal: HTMLDialogElement;
    }

    namespace Hikka {
        type FilterProperty<T extends string> = Record<
            T,
            {
                title_ua: string;
                title_en: string;
                icon?: (props: any) => ReactElement | ReactNode;
                color?: string;
                description?: string;
            }
        >;

        type NavRoute = {
            slug: string;
            title_ua: string;
            url: string;
            icon?: ReactNode;
            role?: Hikka.UserRole[];
            internals?: NavRoute[];
        };

        type WithPagination<T> = {
            pagination: Hikka.Pagination;
            list: T[];
        };

        type Error = {
            code: string;
            message: string;
        };

        type UserRole =
            | 'admin'
            | 'moderator'
            | 'user'
            | 'banned'
            | 'not_activated';

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

        type Stats = Record<StatType, number>;

        type Pagination = {
            total: number;
            pages: number;
            page: number;
        };

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

        type Company = {
            company: {
                image: string;
                slug: string;
                name: string;
            };
            type: 'producer' | 'studio';
        };

        type Watch = {
            reference: string;
            updated: number;
            created: number;
            note: string;
            status: Hikka.WatchStatus;
            rewatches: number;
            episodes: number;
            score: number;
            anime: Hikka.Anime;
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
        } & Anime;

        type Genre = {
            name_en: string;
            name_ua: string;
            slug: string;
            type: string;
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

        type EditParam<T> = {
            param: keyof T;
            title: string;
            placeholder: string;
        };

        type AnimeEditParams = {
            title_ua?: string;
            title_en?: string;
            title_ja?: string;
            synopsis_en?: string;
            synopsis_ua?: string;
            synonyms?: string[];
        };

        type CharacterEditParams = {
            name_ua: string;
            name_en: string;
            name_ja: string;
            description_ua: string;
        };

        type EditStatus = 'pending' | 'accepted' | 'denied' | 'closed';

        type Edit<
            TEditParams extends AnimeEditParams | CharacterEditParams =
                | Hikka.AnimeEditParams
                | Hikka.CharacterEditParams,
            TContent = Hikka.AnimeInfo | Hikka.Character,
        > = {
            content_type: ContentType;
            status: EditStatus;
            description: string | null;
            created: number;
            updated: number;
            edit_id: number;
            moderator: Hikka.User | null;
            author?: Hikka.User;
            after: TEditParams;
            before: TEditParams | null;
            content: TContent;
        };

        type Comment = {
            reference: string;
            author: Hikka.User;
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

        type ContentType =
            | 'edit'
            | 'anime'
            | 'character'
            | 'person'
            | 'comment';

        type HistoryType =
            | 'watch'
            | 'watch_delete'
            | 'watch_import'
            | 'favourite_anime_add'
            | 'favourite_anime_remove';

        type HistoryWatchData = {
            after: {
                score: number | null;
                status: Hikka.WatchStatus | null;
                episodes: number | null;
                rewatches: number | null;
            };
            before: {
                score: number | null;
                status: Hikka.WatchStatus | null;
                episodes: number | null;
                rewatches: number | null;
            };
            new_watch: boolean;
        };

        type HistoryFavoriteData = {};

        type HistoryImportData = {
            imported: boolean;
        };

        type History<
            TData extends
                | HistoryWatchData
                | HistoryFavoriteData
                | HistoryImportData = HistoryWatchData,
        > = {
            reference: string;
            content?: Hikka.Anime;
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
            | 'edit_accepted'
            | 'edit_denied';

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
        }

        type Notification<
            TData extends NotificationCommentData | NotificationCommentVoteData | NotificationEditData = NotificationCommentData,
        > = {
            notification_type: NotificationType;
            created: number;
            reference: string;
            seen: boolean;
            data: TData;
        };

        type TextNotification = {
            type: 'comment' | 'vote' | 'tag' | 'edit';
            icon: JSX.Element;
            title: string;
            description: JSX.Element;
            reference: string;
            created: number;
            href: string;
            seen: boolean;
        };

        type Activity = {
            timestamp: number;
            actions: number;
        }
    }
}
