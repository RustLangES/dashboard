{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    wrangler = {
      # Use 4.19.1
      url = "github:ryand56/wrangler/1141a859c59e05ceb901d14790f0f75a6c5de3f5";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs @ {
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachSystem (flake-utils.lib.defaultSystems) (
      system: let
        pkgs = import nixpkgs {inherit system;};

        wrangler-fix = inputs.wrangler.packages.${system};

        nodejs-22_9 = pkgs.stdenv.mkDerivation rec {
          pname = "nodejs";
          version = "22.9.0";

          src = pkgs.fetchurl {
            url = "https://nodejs.org/dist/v${version}/node-v${version}-linux-x64.tar.xz";
            hash = "sha256-G/rp7yGrQ8ktgnTxvQMr9h9C6gBBkqGNTGRHdQhiYUI=";
          };

          installPhase = ''
            mkdir -p $out
            mv * $out/
          '';
        };
      in {
        nix.settings = {
          substituters = ["https://wrangler.cachix.org"];
          trusted-public-keys = ["wrangler.cachix.org-1:N/FIcG2qBQcolSpklb2IMDbsfjZKWg+ctxx0mSMXdSs="];
        };

        # `nix develop`
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs-22_9
            nodePackages.pnpm
            wrangler-fix.wrangler

            # Develop
            deno
            nodePackages.prettier
            # nodePackages.prettier-plugin-svelte
            nodePackages.typescript-language-server
            nodePackages.svelte-language-server
            nodePackages.vscode-langservers-extracted
          ];
        };
      }
    );
}
