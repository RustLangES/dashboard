inputs @ {
  pkgs,
  lib ? pkgs.lib,
  stdenv ? pkgs.stdenv,
  flake-utils,
  ...
}: let

  devShellBuildInputs = (with pkgs; [
      # deno
      nodejs
      nodePackages.pnpm
      # nodePackages.prettier
      # nodePackages.typescript-language-server
      # nodePackages.svelte-language-server
      (import ./nix/wrangler.nix inputs)
    ]);
in {
  # `nix run .#zellij`
  apps.zellij = flake-utils.lib.mkApp {
    drv = pkgs.writeShellApplication {
      name = "run-zellij";

      runtimeInputs = with pkgs;
        devShellBuildInputs
        ++ [
          zellij
        ];

      text = ''
        zellij --layout ${./nix/zellij/layout.kdl}
      '';
    };
  };

  # `nix develop`
  devShells = {
    default = pkgs.mkShell {
      buildInputs =
        devShellBuildInputs;
    };
  };
}
