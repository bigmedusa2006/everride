{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.undollar
    pkgs.sudo
    # add any other packages you need here
  ];
}