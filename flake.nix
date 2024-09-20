{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    ...
  }:
  # Iterate over Arm, x86 for MacOs 🍎 and Linux 🐧
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

        bundle = import ./. {
          inherit system flake-utils pkgs nodejs-22_9;
        };
      in {
        inherit (bundle) apps devShells;
      }
    );
}
