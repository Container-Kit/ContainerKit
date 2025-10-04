# Symlink Script for `apple-container` CLI

This script is designed for developers to manage symbolic links for the `apple-container` CLI tool, allowing them to run the tools from the command line as if they were installed system-wide, while actually using the development versions from the project's source directory.

## Overview

The script automates the process of creating and deleting symlinks from system paths (`/usr/local/bin` and `/usr/local/libexec`) to the binaries located within the project at `src-tauri/binaries/sidecar/apple-container`.

This is particularly useful during development, as it allows you to test and run the CLI tools directly in your terminal without needing to go through a full installation process after every code change.

## Usage

The script accepts two commands: `up` and `down`.

### Create Symlinks

To create the symlinks, run:

```sh
./scripts/symlink.sh up
```

This command will:

1.  Create symbolic links for `container`, `container-apiserver`, and `uninstall-container.sh` from the project's `bin` directory to `/usr/local/bin`.
2.  Forcefully remove any existing `/usr/local/libexec` directory or symlink.
3.  Create a symbolic link for the project's `libexec` directory at `/usr/local/libexec`.

### Delete Symlinks

To delete the symlinks, run:

```sh
./scripts/symlink.sh down
```

This command will:

1.  Remove the symbolic links for the binaries from `/usr/local/bin`.
2.  Remove the `/usr/local/libexec` symbolic link.

## Important Notes

- **Permissions**: The script uses `sudo` for creating and deleting symlinks in `/usr/local/`, so it will prompt for your administrator password.
- **Development Use Only**: This script is intended for development purposes only. It modifies system directories and should not be used in a production environment.
