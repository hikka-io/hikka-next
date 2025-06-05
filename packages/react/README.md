# @hikka/react

A React library that provides hooks and utilities for integrating with the Hikka API, making it easy to access anime, manga, novel data, and other Hikka platform features in React applications.

## Features

- **React Query Integration**: Built on TanStack Query for efficient data fetching, caching, and state management
- **React Hooks**: Ready-to-use hooks for all Hikka API endpoints
- **Server Components Support**: Dedicated utilities for server-side rendering and data prefetching
- **TypeScript Support**: Fully typed API for better developer experience

## Usage

### Client Components

```tsx
import { HikkaProvider, useAnimeBySlug } from '@hikka/react';

function AnimePage({ slug }) {
    const { data, isLoading, error } = useAnimeBySlug(slug);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>{data.title_ua}</h1>
            <p>{data.synopsis}</p>
        </div>
    );
}

// Wrap your application with the provider
function App() {
    return (
        <HikkaProvider
            clientConfig={{
                baseUrl: 'https://api.hikka.io',
                authToken: 'your-auth-token', // Optional
            }}
        >
            <AnimePage slug="boku-no-hero-academia-77b5a8" />
        </HikkaProvider>
    );
}
```

### Server Components

```tsx
import {
    animeKeys,
    createHikkaClient,
    createQueryClient,
} from '@hikka/react/core';
import {
    HydrationBoundary,
    dehydrate,
    prefetchQuery,
} from '@hikka/react/server';

// In a Server Component
async function AnimePage({ slug }) {
    await prefetchAnimeBySlug({ slug });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AnimePage slug={slug} />
        </HydrationBoundary>
    );
}
```

## License

This package is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
