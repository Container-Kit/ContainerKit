# Container Kit Release Directory

This directory contains the release artifacts for Container Kit versions, organized for distribution and automatic updates.

## Directory Structure

```
release/
├── README.md                 # This file
├── index.json               # Master index of all versions
└── {version}/               # Version-specific directories
    ├── update.json          # Tauri updater manifest
    └── macos/               # macOS release artifacts
        ├── Container Kit.app.tar.gz     # App bundle for updater
        ├── Container Kit.app.tar.gz.sig # Cryptographic signature
        ├── Container Kit.app/           # Uncompressed app directory
        └── Container Kit_{version}_aarch64.dmg # DMG installer
```

## Files Description

### Core Files

- **`index.json`**: Master index containing metadata for all versions, download links, and changelog information
- **`{version}/update.json`**: Tauri updater manifest for specific version containing signature and download URL
- **`{version}/macos/`**: Directory containing all macOS release artifacts for the version

### Release Artifacts

1. **DMG File** (`Container Kit_{version}_aarch64.dmg`)
   - Complete installer package for new users
   - Contains the app bundle and installation logic
   - Used for fresh installations from website downloads

2. **App Bundle** (`Container Kit.app.tar.gz`)
   - Compressed application bundle for automatic updates
   - Downloaded by the Tauri updater system
   - Verified using the accompanying signature file

3. **Signature File** (`Container Kit.app.tar.gz.sig`)
   - Cryptographic signature for the app bundle
   - Generated using Tauri's minisign implementation
   - Ensures update authenticity and integrity

4. **App Directory** (`Container Kit.app/`)
   - Uncompressed macOS application bundle
   - Contains the complete application structure
   - Useful for direct deployment or testing

## Updater Configuration

The updater system uses these files in the following workflow:

1. **Check for Updates**: App queries the update.json manifest
2. **Verify Version**: Compares current version with manifest version
3. **Download Update**: Downloads the .tar.gz file if newer version available
4. **Verify Signature**: Validates the download using the .sig file
5. **Install Update**: Extracts and replaces the current app bundle

### URLs and Hosting

Update your `tauri.conf.json` with the updater endpoint:

```json
{
  "plugins": {
    "updater": {
      "endpoints": ["https://container-kit.ethercorps.io/release/{version}/update.json"],
      "pubkey": "dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IDU3NzMwMDE5MkI4RjNGODcKUldTSFA0OHJHUUJ6Vjd2VDRnZHNFdGM0akhMd2NNSnR6dDBsQXkxRnBaYnJSQThrNnBtNDY3VkQK"
    }
  }
}
```

## Version Management

### Adding New Versions

1. Build your Tauri app with `tauri build`
2. Run the release creation script: `pnpm bundle:create`
3. Upload the updated release directory to your web server
4. Test the updater functionality

### Deployment

Upload the entire release directory to your web server. Ensure:

- All files are publicly accessible
- CORS headers allow your app domain to access the files
- HTTPS is used for security (required by Tauri updater)
- URLs in manifests match your actual hosting setup

## Security Notes

- The signature files (.sig) are critical for security - never modify them
- The public key in tauri.conf.json must match the key used to sign updates
- Always use HTTPS for serving update files
- Verify signatures locally before uploading new versions

## Automation

Use the provided scripts to automate release creation:

```bash
# Create release with default settings
pnpm bundle:create

# Create release with custom domain
pnpm bundle:create:custom https://container-kit.ethercorps.io/release

# Override version and force overwrite
pnpm bundle:create -- -v 0.3.0 -f

# Show help
pnpm bundle:help
```

## Current Version

- **Latest**: 0.2.0
- **Platform**: darwin-aarch64 (Apple Silicon)
- **Release Date**: 2025-07-21

## File Sizes

- DMG Installer: 7.98 MB
- App Bundle (compressed): 7.46 MB
- Total per version: 15.44 MB
