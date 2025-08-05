# Apple Container CLI Download Script Documentation

## Overview

The `download-apple-container-cli.sh` script automates the download and extraction of Apple's Container CLI tool from GitHub releases for use in the ContainerKit project. This tool is essential for container operations on macOS and is distributed as a signed `.pkg` file that requires special extraction procedures.

## Purpose

This script serves as a crucial component of the ContainerKit build process by:

- Downloading the official Apple Container CLI from GitHub releases
- Extracting the binary executables from the signed package
- Setting up the binaries for use as Tauri sidecars
- Ensuring proper permissions and directory structure

## How It Works

### Step-by-Step Process

1. **Download**: Fetches the signed `.pkg` file from Apple's GitHub releases
2. **Expand**: Uses macOS `pkgutil` to expand the package structure
3. **Extract**: Decompresses the payload using `gunzip` and `cpio`
4. **Copy**: Moves binaries from `bin/` and `libexec/` to the Tauri sidecar directory
5. **Permissions**: Sets proper executable permissions on all binaries
6. **Cleanup**: Removes temporary files and directories

### Technical Details

The script handles the complex process of extracting files from Apple's signed installer packages:

- **Package Format**: Apple distributes the CLI as a signed `.pkg` file
- **Extraction Method**: Uses native macOS tools (`pkgutil`, `gunzip`, `cpio`)
- **Payload Structure**: The package contains a compressed payload with the actual binaries
- **Directory Mapping**: Copies both `bin/` and `libexec/` directories to maintain CLI functionality

## Usage

### Basic Usage

```bash
# Before running, ensure the version in the script is updated as per requirements
./scripts/download-apple-container-cli.sh
```

### Prerequisites

- **Operating System**: macOS (required for `pkgutil`)
- **Tools**: `curl`, `gunzip`, `cpio` (typically pre-installed on macOS)
- **Permissions**: Write access to the project directory

### Configuration

The script uses several configurable variables at the top:

- `VERSION`: The version of Apple Container CLI to download (currently "0.3.0")
- `PKG_URL`: GitHub release URL pattern
- `FINAL_BINARIES_DIR`: Destination directory for extracted binaries

## Directory Structure

### Before Running

```
ContainerKit/
├── scripts/
│   └── download-apple-container-cli.sh
└── src-tauri/
    └── binaries/
        └── sidecar/
```

### After Running

```
ContainerKit/
├── scripts/
│   └── download-apple-container-cli.sh
└── src-tauri/
    └── binaries/
        └── sidecar/
            └── apple-container/
                ├── bin/
                │   └── container (main CLI binary)
                └── libexec/
                    └── [additional executables]
```

### Temporary Files (Cleaned Up)

During execution, the script creates temporary directories:

- `apple-container-cli/` - Download directory
- `temp_extracted_payload/` - Extraction working directory

## Error Handling

The script includes error handling for common issues:

### Download Failures

- **Cause**: Network issues, GitHub unavailability, invalid URLs
- **Detection**: curl exit codes and HTTP response validation
- **Resolution**: Check internet connection and GitHub status

### Extraction Failures

- **Cause**: Corrupted package, missing `pkgutil`, permission issues
- **Detection**: Command exit status monitoring
- **Resolution**: Verify macOS environment and file integrity

### Missing Files

- **Cause**: Changed package structure, version mismatches
- **Detection**: File existence checks before operations
- **Resolution**: Update script for new package formats

## Maintenance

### Updating Versions

To update to a new version of Apple Container CLI:

1. Check [Apple's GitHub releases](https://github.com/apple/container/releases)
2. Update the `VERSION` variable in the script
3. Test the script with the new version
4. Verify binary extraction and functionality

### Monitoring Changes

Watch for changes in:

- Package structure and naming conventions
- Binary locations within the package
- New dependencies or requirements

## Integration with ContainerKit

### Tauri Sidecar Integration

The extracted binaries are placed in the Tauri sidecar directory structure:

- Enables Tauri to bundle and execute the CLI
- Maintains proper file permissions for execution
- Follows Tauri's sidecar naming conventions

### Build Process Integration

This script should be run:

- Before building the Tauri application
- When updating to new CLI versions
- As part of CI/CD pipeline setup

## Troubleshooting

### Common Issues

#### Script Fails to Download

```bash
Error: Failed to download the package from [URL]
```

**Solution**: Check internet connection and GitHub accessibility

#### Package Expansion Fails

```bash
Error: Failed to expand the package
```

**Solution**: Ensure running on macOS with `pkgutil` available

#### No Files Copied

```bash
Warning: No directories were copied
```

**Solution**: Check if package structure has changed in newer versions

#### Permission Denied

**Solution**: Ensure write permissions in the project directory

### Debug Information

The script provides detailed output including:

- Download progress and status
- Extraction step results
- File copying operations
- Final directory listings

### Verification

After running, verify the installation:

```bash
ls -la src-tauri/binaries/sidecar/apple-container/
./src-tauri/binaries/sidecar/apple-container/bin/container --version
```

## Security Considerations

- The script downloads from Apple's official GitHub repository
- Package integrity is maintained through Apple's signing
- No modification of binaries occurs during extraction
- Temporary files are cleaned up to avoid security risks

## Contributing

When modifying this script:

1. Test on macOS v26
2. Update documentation for any changes
3. Follow shell scripting best practices
4. Maintain error handling coverage

## See Also

- [Apple Container CLI GitHub Repository](https://github.com/apple/container)
- [Tauri Sidecar Documentation](https://tauri.app/v1/guides/building/sidecar/)
- [macOS pkgutil Manual](https://ss64.com/osx/pkgutil.html)
