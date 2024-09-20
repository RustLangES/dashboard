inputs @ {
  pkgs,
  lib ? pkgs.lib,
  stdenv ? pkgs.stdenv,
  flake-utils,
  nodejs-22_9,
  ...
}: let

  devShellBuildInputs = (with pkgs; [
      nodejs-22_9
      nodePackages.pnpm
      (import ./nix/wrangler.nix inputs)

      # Develop
      deno
      nodePackages.prettier
      # nodePackages.prettier-plugin-svelte
      nodePackages.typescript-language-server
      nodePackages.svelte-language-server
      nodePackages.vscode-langservers-extracted
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
