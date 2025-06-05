# @hikka/client

A TypeScript client library for interacting with the Hikka API. This package provides a comprehensive set of tools to work with anime, manga, and novel data from the Hikka platform.

## Usage

```typescript
import { HikkaClient } from '@hikka/client';

// Initialize client
const client = new HikkaClient({
    baseUrl: 'https://api.hikka.io', // Optional, defaults to this value
    authToken: 'your-auth-token', // Optional
});

// Examples
async function examples() {
    // Get anime list with search filters
    const animeList = await client.anime.searchAnimes(
        { genres: ['action', 'fantasy'] },
        { page: 1, size: 20 },
    );

    // Get anime details by slug
    const animeDetails = await client.anime.getAnimeBySlug(
        'boku-no-hero-academia-77b5a8',
    );

    // Get anime characters
    const characters = await client.anime.getAnimeCharacters(
        'boku-no-hero-academia-77b5a8',
    );

    // Authentication
    const authResult = await client.auth.createUserSession(
        {
            email: 'user@example.com',
            password: 'password',
        },
        { captcha: 'captcha-token' },
    );

    client.setAuthToken(authResult.token);
}
```

## Available Modules

The client provides access to various modules for different parts of the Hikka API:

- **Read**: Track manga and novel reading status and progress
- **Watch**: Track anime watching status and progress
- **Anime**: Anime listings, details, characters, staff, episodes, and related data
- **Manga**: Manga listings, details, characters, and related data
- **Novel**: Light novel listings, details and related data
- **Auth**: User authentication, registration, token management
- **Articles**: Community articles and news
- **Characters**: Character information, relationships, and appearances
- **Client**: OAuth client application management and authorization
- **Collections**: User-created collections
- **Comments**: Comment system for all content types
- **Companies**: Production companies
- **Edit**: Content editing and moderation
- **Favourite**: User favorites management
- **Follow**: User following system
- **Genres**: Genre listings and metadata
- **History**: User activity history
- **Notifications**: User notification system
- **People**: Staff, voice actors, and other people data
- **Related**: Content relationship management
- **Schedule**: Seasonal content(anime) schedule
- **Settings**: User settings and preferences
- **Sitemap**: Site navigation data
- **Stats**: User and content statistics
- **Upload**: Media upload functionality
- **User**: User profiles and management
- **Vote**: Voting system

Each module provides methods for interacting with specific API endpoints.

## License

This package is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
