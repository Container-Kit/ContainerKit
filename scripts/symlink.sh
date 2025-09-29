#!/bin/sh

# This script creates or deletes symlinks for the apple-container CLI tools.

# --- Configuration ---
# Get the absolute path of the project root directory, assuming the script is in `scripts/`
SCRIPT_DIR=$(cd -- "$(dirname -- "$0")" && pwd)
PROJECT_ROOT="$SCRIPT_DIR/.."

# Source directory for the binaries
SOURCE_BASE="$PROJECT_ROOT/src-tauri/binaries/sidecar/apple-container"

# List of binaries to link
ITEMS="container container-apiserver uninstall-container.sh"

# Destination paths
BIN_PATH="/usr/local/bin"
LIBEXEC_PATH="/usr/local/libexec"


# --- Functions ---

# Creates the symlinks
create_links() {
    echo "Creating symlinks in /usr/local/..."

    # Create symlinks for binaries
    for item in $ITEMS; do
        sudo ln -sf "$SOURCE_BASE/bin/$item" "$BIN_PATH/$item"
    done

    # For the libexec directory, we want /usr/local/libexec to BE the symlink.
    # If /usr/local/libexec already exists as a directory, `ln -s` would create a link INSIDE it.
    # To prevent this, we forcefully remove it before creating the new symlink.
    sudo rm -rf "$LIBEXEC_PATH"
    sudo ln -s "$SOURCE_BASE/libexec" "$LIBEXEC_PATH"

    echo "Symlinks created successfully."
}

# Deletes the symlinks
delete_links() {
    echo "Deleting symlinks from /usr/local/..."

    for item in $ITEMS; do
        sudo rm -f "$BIN_PATH/$item"
    done

    sudo rm -rf "$LIBEXEC_PATH"

    echo "Symlinks deleted successfully."
}

# Displays usage information
usage() {
    echo "Usage: $0 [up|down]"
    echo "  up:   Create symlinks for apple-container CLI."
    echo "  down: Delete symlinks for apple-container CLI."
    exit 1
}


# --- Main Logic ---

# Check the first argument passed to the script
case "$1" in
    up)
        create_links
        ;;
    down)
        delete_links
        ;;
    *)
        usage
        ;;
esac
