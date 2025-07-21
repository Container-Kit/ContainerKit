# Container Kit Release v{{VERSION}}

This directory contains the release artifacts for Container Kit v{{VERSION}}, organized for distribution and automatic updates.

## Developer Release Information

- **Version**: {{VERSION}} (from `src-tauri/tauri.conf.json`)
- **Platform**: darwin-aarch64 (Apple Silicon)
- **Build Date**: {{RELEASE_DATE}}
- **Release Domain**: {{DOMAIN}}
- **Total Build Size**: {{TOTAL_SIZE}}

## Directory Structure

```
release/
├── README.md                           # This file (auto-generated)
├── index.json                          # Master index of all versions
└── {{VERSION}}/                        # Version-specific directory
    ├── update.json                     # Tauri updater manifest
    └── macos/                          # macOS release artifacts
        ├── Container Kit.app.tar.gz    # App bundle for updater ({{APP_BUNDLE_SIZE}})
        ├── Container Kit.app.tar.gz.sig # Cryptographic signature
        ├── Container Kit.app/          # Uncompressed app directory
        └── Container Kit_{{VERSION}}_aarch64.dmg # DMG installer ({{DMG_SIZE}})
```

## Release Artifacts

### 1. DMG Installer (`Container Kit_{{VERSION}}_aarch64.dmg`)

- **Size**: {{DMG_SIZE}}
- **Purpose**: Complete installer package for distribution
- **Usage**: Direct download link for developers and QA testing
- **Contents**: Complete app bundle with installation logic
- **Download URL**: `{{DOMAIN}}/{{VERSION}}/macos/Container%20Kit_{{VERSION}}_aarch64.dmg`

### 2. App Bundle (`Container Kit.app.tar.gz`)

- **Size**: {{APP_BUNDLE_SIZE}}
- **Purpose**: Compressed application bundle for Tauri auto-updater
- **Usage**: Downloaded by Tauri updater system for in-app updates
- **Security**: Cryptographically signed for integrity verification
- **Download URL**: `{{DOMAIN}}/{{VERSION}}/macos/Container%20Kit.app.tar.gz`

### 3. Signature File (`Container Kit.app.tar.gz.sig`)

- **Purpose**: Cryptographic signature for app bundle verification
- **Algorithm**: Generated using Tauri's minisign implementation during build
- **Security**: Ensures update authenticity and prevents tampering
- **Critical**: Never modify - regenerated automatically with each build

### 4. App Directory (`Container Kit.app/`)

- **Purpose**: Uncompressed macOS application bundle
- **Usage**: Development testing, debugging, or manual deployment
- **Contents**: Complete application structure with all resources and binaries
- **Access**: Available for developer inspection and testing

## Update System Workflow

The Tauri updater system implements the following developer workflow:

1. **Version Detection**

    - App queries: `{{DOMAIN}}/{{VERSION}}/update.json`
    - Compares current version (from tauri.conf.json) with manifest version
    - Uses semantic versioning for update availability determination

2. **Artifact Download**

    - Downloads: `Container Kit.app.tar.gz` if newer version detected
    - Implements resumable downloads and integrity checking during transfer

3. **Cryptographic Verification**

    - Validates download using `Container Kit.app.tar.gz.sig`
    - Verifies against public key configured in tauri.conf.json
    - Rejects updates with invalid or missing signatures

4. **Application Update**
    - Extracts compressed bundle to temporary location
    - Atomically replaces current application bundle
    - Preserves user data and application state
    - Initiates restart with updated version

## Integration Configuration

### Tauri Configuration (`tauri.conf.json`)

Configure the updater in your `src-tauri/tauri.conf.json`:

```json
{
    "plugins": {
        "updater": {
            "endpoints": ["{{DOMAIN}}/{{VERSION}}/update.json"],
            "pubkey": "dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduIHB1YmxpYyBrZXk6IDU3NzMwMDE5MkI4RjNGODcKUldTSFA0OGJHUUJ6Vjd2VDRnZHNFdGM0akhMd2NNSnR6dDBsQXkxRnBaYnJSQThrNnBtNDY3VkQK"
        }
    }
}
```

**Note**: Version is automatically read from the same `tauri.conf.json` file by the build scripts.

### Web Server Configuration

Configure your web server for development and production:

- ✅ Serves all files with proper MIME types (`application/json`, `application/gzip`)
- ✅ Enables CORS headers for your application domain
- ✅ Uses HTTPS (required by Tauri updater for security)
- ✅ Sets appropriate cache headers for update manifests
- ✅ Supports range requests for large file downloads

### Development Server Configuration

```nginx
# Example nginx configuration for development
location /release/ {
    add_header 'Access-Control-Allow-Origin' 'tauri://localhost' always;
    add_header 'Access-Control-Allow-Methods' 'GET, HEAD, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Range' always;

    location ~* \.(json)$ {
        add_header 'Cache-Control' 'no-cache, must-revalidate' always;
    }
}
```

## Release Creation Workflow

This release was created using the Container Kit modular script system:

### Method 1: Complete Workflow

```bash
# Build and create release in one command
pnpm release -v {{VERSION}} -d {{DOMAIN}}

# With force overwrite if needed
pnpm release:force -v {{VERSION}} -d {{DOMAIN}}
```

### Method 2: Step-by-Step Process

```bash
# Step 1: Build Tauri application
pnpm build:tauri

# Step 2: Copy build files to release structure
pnpm copy:build-files -v {{VERSION}} -d {{DOMAIN}}
```

### Method 3: Development Iteration

```bash
# Fast iteration (skip dependency installation)
pnpm build:tauri:skip-deps
pnpm copy:build-files:force -v {{VERSION}} -d {{DOMAIN}}

# Version is automatically detected from src-tauri/tauri.conf.json if not specified
pnpm copy:build-files:force -d {{DOMAIN}}
```

## Version Management

### Release Index (`index.json`)

The master index contains:

- Metadata for all built versions
- Build artifacts and file sizes
- Development build information
- Updater endpoint configuration for testing

### Update Manifest (`{{VERSION}}/update.json`)

Version-specific manifest includes:

- Version number (from tauri.conf.json) and build date
- Platform-specific download URLs for artifacts
- Cryptographic signatures for build verification
- Build notes and development changelog

## Security and Verification

### Signature Verification

```bash
# Verify signature locally (requires minisign)
minisign -Vm Container\ Kit.app.tar.gz -P RWS4P48rGPQbzV7vT4gdsEtc4jHLwcMJtz40lAy1FpZbrRA8k6pm467VD
```

### File Integrity

```bash
# Check file sizes match expected values
ls -lh {{VERSION}}/macos/

# Verify JSON manifest validity and structure
jq . {{VERSION}}/update.json
jq . index.json

# Verify version consistency
jq -r '.version' {{VERSION}}/update.json
grep -o '"version":\s*"[^"]*"' src-tauri/tauri.conf.json
```

## Deployment Instructions

### 1. Upload Release Artifacts

```bash
# Upload entire release directory to development/staging server
rsync -avz release/ user@dev-server:/var/www/releases/

# Or use your preferred deployment method
scp -r release/ user@staging-server:/var/www/releases/

# For production deployments
rsync -avz --exclude='*.log' release/ user@prod-server:/var/www/releases/
```

### 2. Verify Deployment

- Test download URLs and CORS headers for development builds
- Verify HTTPS certificate validity in staging environment
- Test updater functionality with development builds
- Validate JSON manifests are properly served

### 3. Development Workflow Integration

- Update development environment configurations
- Test automatic updates in development builds
- Verify build artifacts integrity
- Document any deployment-specific configurations

## Troubleshooting

### Common Issues

**Updates Not Detected**

- Verify update.json is accessible at configured URL in development
- Check version format in tauri.conf.json matches semantic versioning (e.g., "1.0.0")
- Ensure CORS headers allow your development app domain access
- Validate updater endpoint configuration in tauri.conf.json

**Download Failures**

- Verify file URLs are accessible from development environment
- Check file sizes match manifest specifications exactly
- Ensure HTTPS is properly configured (required by Tauri)
- Test with development certificates if using self-signed certs

**Signature Verification Failures**

- Verify public key in tauri.conf.json matches the signing key used during build
- Check signature file wasn't modified after generation
- Ensure app bundle wasn't altered after signing process
- Validate signing keys are properly configured in development environment

### Debug Commands

```bash
# Test updater endpoint with proper CORS headers
curl -H "Origin: tauri://localhost" {{DOMAIN}}/{{VERSION}}/update.json

# Check file accessibility and headers
curl -I {{DOMAIN}}/{{VERSION}}/macos/Container%20Kit.app.tar.gz

# Validate JSON manifests structure
curl {{DOMAIN}}/index.json | jq .
curl {{DOMAIN}}/{{VERSION}}/update.json | jq .

# Verify version consistency across files
jq -r '.version' {{DOMAIN}}/{{VERSION}}/update.json
```

## Development and Testing

### Local Development Testing

```bash
# Serve release directory locally for development testing
cd release && python -m http.server 8000

# Test with local endpoint by updating tauri.conf.json temporarily:
# "endpoints": ["http://localhost:8000/{{VERSION}}/update.json"]

# Or use development server with CORS
npx http-server release -p 8000 --cors
```

### Development Environment Setup

- Deploy to development server first for team testing
- Test complete update workflow with development builds
- Verify all download links work in development environment
- Validate updater behavior with development app instances
- Test version detection from tauri.conf.json

## Monitoring and Analytics

### Development Build Monitoring

Monitor development server logs for:

- Update check frequency from development builds
- Download success rates for different artifacts
- Build verification and integrity check results
- Error rates and common failure patterns

### Development Metrics

Track for development workflow optimization:

- Update detection rates in development environment
- Download completion rates for large artifacts
- Build verification success rates
- Development team adoption of new builds

## Support and Documentation

### Developer Documentation

- **Complete Guide**: `scripts/docs/README.md`
- **Copy Script**: `scripts/docs/copy-to-release.md`
- **Build Script**: `scripts/docs/build-tauri.md`
- **Quick Reference**: `scripts/docs/quick-reference.md`
- **Shared Utilities**: `scripts/docs/shared-utils.md`

### Development Resources

- Tauri Updater Documentation: [https://tauri.app/v1/guides/distribution/updater](https://tauri.app/v1/guides/distribution/updater)
- Minisign Documentation: [https://jedisct1.github.io/minisign/](https://jedisct1.github.io/minisign/)
- Tauri Configuration: [https://tauri.app/v1/api/config](https://tauri.app/v1/api/config)

---

**Build Generated**: {{RELEASE_DATE}}
**Version Source**: `src-tauri/tauri.conf.json`
**Build System**: Container Kit Modular Scripts v2.0
**Documentation**: Auto-generated from developer template system
