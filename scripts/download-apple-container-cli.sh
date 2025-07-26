#!/bin/bash

# ==============================================================================
# Apple Container CLI Download Script for ContainerKit
# ==============================================================================
#
# WHAT THIS SCRIPT DOES:
# I've created this script to automate the download and extraction of Apple's
# Container CLI tool from GitHub releases. The CLI comes as a signed .pkg file
# that We need to unpack and extract the actual binary executables from.
#
# WHY I BUILT THIS:
# - Apple distributes their Container CLI as a .pkg installer
# - We need the raw binaries for my Tauri application's sidecar functionality
# - Manual extraction is tedious and error-prone
# - We need a reproducible builds with version control
#
# HOW IT WORKS:
# 1. Download the signed .pkg file from GitHub releases
# 2. Use macOS pkgutil to expand the package structure
# 3. Extract the compressed payload using gunzip and cpio
# 4. Copy the binaries from bin/ and libexec/ to my Tauri sidecar directory
# 5. Set proper executable permissions
# 6. Clean up temporary files
#
# DIRECTORY STRUCTURE AFTER RUNNING:
# src-tauri/binaries/sidecar/{VERSION}/
# ├── container (main CLI binary)
# └── [other executables from libexec/]
#
# USAGE:
# ./scripts/download-apple-container-cli.sh
#
# REQUIREMENTS:
# - macOS (for pkgutil command)
# - curl (for downloading)
# - Internet connection
# - Write permissions in project directory
#
# TROUBLESHOOTING:
# - If download fails: Check your internet connection and GitHub availability
# - If extraction fails: Verify you're on macOS with pkgutil available
# - If no files copied: The payload structure might have changed in newer versions
#
# MAINTENANCE:
# - Update VERSION variable when new releases are available
# - Check GitHub releases: https://github.com/apple/container/releases
#
# ==============================================================================

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# Set the version of the Apple Container CLI you want to download.
# You will need to update this variable for new releases.
VERSION="0.2.0"

# Set the URL and filename for the signed installer package.
PKG_URL="https://github.com/apple/container/releases/download/${VERSION}/container-${VERSION}-installer-signed.pkg"
PKG_FILE="container-${VERSION}-installer-signed.pkg"
PKG_FILE_EXPAND_DIR="container-${VERSION}-expanded"

# --- Directory Setup ---
# Define directories for downloading, temporary extraction, and final binaries.
DOWNLOAD_DIR="apple-container-cli"
EXTRACT_DIR="temp_extracted_payload"
FINAL_BINARIES_DIR="src-tauri/binaries/sidecar/${VERSION}"

# Create necessary directories
echo "Creating directories..."
mkdir -p "${DOWNLOAD_DIR}"
mkdir -p "${FINAL_BINARIES_DIR}"

# --- Download the Package ---
echo "Downloading the Apple Container CLI installer..."

# Check if the package file already exists and remove it.
if [ -f "${DOWNLOAD_DIR}/${PKG_FILE}" ]; then
    echo "Found existing package file. Removing it..."
    rm -f "${DOWNLOAD_DIR}/${PKG_FILE}"
fi

# Check if expanded directory exists and remove it
if [ -d "${DOWNLOAD_DIR}/${PKG_FILE_EXPAND_DIR}" ]; then
    echo "Found existing expanded directory. Removing it..."
    rm -rf "${DOWNLOAD_DIR}/${PKG_FILE_EXPAND_DIR}"
fi

# Download the package with better error handling
if ! curl -L -f -o "${DOWNLOAD_DIR}/${PKG_FILE}" "${PKG_URL}"; then
    echo "Error: Failed to download the package from ${PKG_URL}"
    exit 1
fi

echo "Download complete. File saved to ${DOWNLOAD_DIR}/${PKG_FILE}"

# --- Expand the PKG and Extract the Payload ---
echo "Expanding the package..."

# Expand the PKG file
if ! pkgutil --expand "${DOWNLOAD_DIR}/${PKG_FILE}" "${DOWNLOAD_DIR}/${PKG_FILE_EXPAND_DIR}"; then
    echo "Error: Failed to expand the package"
    exit 1
fi

# Check if Payload exists
if [ ! -f "${DOWNLOAD_DIR}/${PKG_FILE_EXPAND_DIR}/Payload" ]; then
    echo "Error: Payload file not found in expanded package"
    exit 1
fi

echo "Package expanded successfully"

# --- Extract the Payload ---
echo "Extracting the payload..."

# Remove existing extract directory if it exists
if [ -d "${EXTRACT_DIR}" ]; then
    rm -rf "${EXTRACT_DIR}"
fi

# Create extract directory
mkdir -p "${EXTRACT_DIR}"

# Extract the payload using gunzip and cpio
# Change to the extract directory first, then extract
cd "${EXTRACT_DIR}"
if ! gunzip -c "../${DOWNLOAD_DIR}/${PKG_FILE_EXPAND_DIR}/Payload" | cpio -i -d 2>/dev/null; then
    echo "Error: Failed to extract payload"
    cd ..
    exit 1
fi
cd ..

echo "Payload extracted to ${EXTRACT_DIR}"

# --- Copy Directories to the Final Destination ---
echo "Copying bin and libexec directories..."

# Track if we copied any directories
dirs_copied=false

# Copy the entire 'bin' directory
if [ -d "${EXTRACT_DIR}/bin" ]; then
    echo "Copying /bin directory..."
    cp -rv "${EXTRACT_DIR}/bin" "${FINAL_BINARIES_DIR}/" 2>/dev/null || echo "Failed to copy bin directory"
    if [ $? -eq 0 ]; then
        dirs_copied=true
    fi
else
    echo "Warning: 'bin' directory not found in the payload"
fi

# Copy the entire 'libexec' directory
if [ -d "${EXTRACT_DIR}/libexec" ]; then
    echo "Copying /libexec directory..."
    cp -rv "${EXTRACT_DIR}/libexec" "${FINAL_BINARIES_DIR}/" 2>/dev/null || echo "Failed to copy libexec directory"
    if [ $? -eq 0 ]; then
        dirs_copied=true
    fi
else
    echo "Warning: 'libexec' directory not found in the payload"
fi

# Check if we copied any directories
if [ "$dirs_copied" = false ]; then
    echo "Warning: No directories were copied. Let's check the payload structure:"
    find "${EXTRACT_DIR}" -type d -name "*" | head -10
fi

# Make copied files executable
if [ -d "${FINAL_BINARIES_DIR}" ]; then
    find "${FINAL_BINARIES_DIR}" -type f -exec chmod +x {} \; 2>/dev/null || true
fi

# --- Cleanup ---
echo "Cleaning up temporary files..."
rm -rf "${DOWNLOAD_DIR}"
rm -rf "${EXTRACT_DIR}"

echo "Script finished successfully!"
echo "Binaries are now located in: ${FINAL_BINARIES_DIR}"

# List the final binaries
echo "Files in destination directory:"
ls -la "${FINAL_BINARIES_DIR}/" 2>/dev/null || echo "No files found in destination directory"
