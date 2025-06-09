{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    wrangler.url = "github:ryand56/wrangler";
    wrangler.inputs.nixpkgs.follows = "nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    wrangler,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachSystem (flake-utils.lib.defaultSystems) (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};

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

        wrangler-pkg = wrangler.packages.${system}.wrangler;
      in {
        # `nix develop`
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs-22_9
            nodePackages.pnpm
            wrangler-pkg

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
