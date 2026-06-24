{ pkgs, ... }:

{
  # https://devenv.sh/basics/
  # https://devenv.sh/packages/
  packages = [ pkgs.git ];

  # https://devenv.sh/languages/
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_20;
    corepack.enable = true;
  };

  # https://devenv.sh/scripts/
  scripts = {
    install-deps.exec = "pnpm install";
    dev.exec = "pnpm dev";
  };

  # https://devenv.sh/processes/
  processes = {
    dev-server.exec = "pnpm dev";
  };

  enterShell = ''
    echo "Node version: $(node --version)"
    echo "pnpm version: $(pnpm --version)"
  '';

  # hehe
  env.NEXT_TELEMETRY_DISABLED = "1";
}