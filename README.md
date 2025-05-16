<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/hikka-io/hikka-next">
    <img src="public/logo.svg" alt="Logo" width="80" height="80">
  </a>
  <p align="center">
    Ukrainian online anime encyclopedia. The entire list of anime, detailed content information, flexible and clean interface. Complete your own watch list, customize your profile and share with friends.
    <br />
    <br />
    <a href="https://hikka.io">View Project</a>
    ·
    <a href="https://github.com/hikka-io/hikka-next/issues">Report Bug</a>
    ·
    <a href="https://github.com/hikka-io/hikka-next/issues">Request Feature</a>
    ·
    <a href="https://github.com/hikka-io/hikka">Backend</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

### Built With

The list of frameworks and core libraries, that uses in the project

- [Next.js](https://nextjs.org/)
- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Typescript](https://www.typescriptlang.org/)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/hikka-io/hikka-next.git
   ```
1. Install and enable corepack to activate yarn as a default package manager
   ```sh
   npm install -g corepack && corepack enable yarn
   ```   
2. Install NPM packages
   ```sh
   yarn install
   ```
3. Run the Next.js development server
   ```sh
   yarn dev
   ```

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Environment Variables

The project uses several environment variables for configuration. Key variables include:

### Development Environment (.env.development)

- `NEXT_PUBLIC_API_URL` - API endpoint URL
- `API_URL` - Server-side API endpoint URL
- `SITE_URL` - Development site URL
- `NEXT_PUBLIC_SITE_URL` - Client-side site URL
- `COOKIE_HTTP_ONLY` - Cookie security setting
- `COOKIE_DOMAIN` - Cookie domain setting
- `NEXT_PUBLIC_DEV` - Development mode flag
- `USE_FAKE_CAPTCHA` - When set to 'true', bypasses captcha verification for local development. Default is 'false'. Use this when running without a local backend instance.

To use fake captcha locally:
```sh
# In your .env.development
USE_FAKE_CAPTCHA=true
```

Note: It's recommended to keep `USE_FAKE_CAPTCHA=false` by default and only enable it when you need to work without a local backend instance.

<!-- LICENSE -->
## License

Hikka is distributed under [AGPL-3.0-only](LICENSE). See `LICENSE` for more information.
