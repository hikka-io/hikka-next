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
    install-deps.exec = "yarn install";
    dev.exec = "yarn dev";
  };

  # https://devenv.sh/processes/
  processes = {
    dev-server.exec = "yarn dev";
  };

  enterShell = ''
    echo "Node version: $(node --version)"
    echo "Yarn version: $(yarn --version)"
  '';

  # hehe
  env.NEXT_TELEMETRY_DISABLED = "1";
}