export * from './config';
// Hand-maintained enums, re-exported explicitly. ContentTypeEnum must be named
// here so our canonical superset shadows the backend's narrower generated
// ContentTypeEnum (collection|comment|article) of the same name.
export {
    ContentTypeEnum,
    GenreTypeEnum,
    MainContentTypeEnum,
    UserRoleEnum,
} from './enums';
export * from './errors';
export * from './gen';
// The backend's own ContentTypeEnum (collection|comment|article) is shadowed by
// our superset below; re-export it under an explicit name for the vote endpoints
// that consume it.
export { ContentTypeEnum as VoteContentTypeEnum } from './gen';
export { ContentStatusEnum as AnimeStatusEnum } from './gen';
export * from './gen/@tanstack/react-query.gen';
export type { Client, Config, Options } from './gen/client';
export * from './pagination';
export * from './transport';
