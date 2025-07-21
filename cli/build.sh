#!/bin/bash

# Container Kit CLI Build Script
# This script builds the CLI binary for different platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BINARY_NAME="container-kit-cli"
VERSION=$(grep 'Version:' cmd/root.go | sed 's/.*Version: "\(.*\)".*/\1/')
BUILD_DIR="build"
DIST_DIR="dist"

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Clean previous builds
clean() {
    print_info "Cleaning previous builds..."
    rm -rf "${BUILD_DIR}"
    rm -rf "${DIST_DIR}"
    mkdir -p "${BUILD_DIR}"
    mkdir -p "${DIST_DIR}"
    print_success "Clean completed"
}

# Build for a specific platform
build_platform() {
    local goos=$1
    local goarch=$2
    local ext=$3

    local output_name="${BINARY_NAME}"
    if [ -n "$ext" ]; then
        output_name="${output_name}${ext}"
    fi

    local output_path="${BUILD_DIR}/${goos}-${goarch}/${output_name}"

    print_info "Building for ${goos}/${goarch}..."

    # Set environment variables and build
    GOOS=$goos GOARCH=$goarch go build \
        -ldflags "-X 'github.com/container-kit/cli/cmd.Version=${VERSION}'" \
        -o "$output_path" \
        .

    if [ $? -eq 0 ]; then
        print_success "Built ${goos}/${goarch}: ${output_path}"

        # Create archive
        local archive_name="${BINARY_NAME}-${VERSION}-${goos}-${goarch}"
        if [ "$goos" = "windows" ]; then
            archive_name="${archive_name}.zip"
            (cd "${BUILD_DIR}/${goos}-${goarch}" && zip -r "../../${DIST_DIR}/${archive_name}" .)
        else
            archive_name="${archive_name}.tar.gz"
            (cd "${BUILD_DIR}/${goos}-${goarch}" && tar -czf "../../${DIST_DIR}/${archive_name}" .)
        fi

        print_success "Created archive: ${DIST_DIR}/${archive_name}"
    else
        print_error "Failed to build for ${goos}/${goarch}"
        return 1
    fi
}

# Build for local platform only
build_local() {
    print_info "Building for local platform..."
    go build -ldflags "-X 'github.com/container-kit/cli/cmd.Version=${VERSION}'" -o "${BINARY_NAME}" .
    print_success "Local build completed: ${BINARY_NAME}"
}

# Build for all platforms
build_all() {
    print_info "Building Container Kit CLI v${VERSION} for all platforms..."

    # macOS (Apple Silicon first as primary target)
    build_platform "darwin" "arm64" ""
    build_platform "darwin" "amd64" ""

    # Linux
    build_platform "linux" "amd64" ""
    build_platform "linux" "arm64" ""

    # Windows
    build_platform "windows" "amd64" ".exe"
    build_platform "windows" "arm64" ".exe"

    print_success "All builds completed!"
    print_info "Archives created in ${DIST_DIR}/"
    ls -la "${DIST_DIR}/"
}

# Test the binary
test_build() {
    print_info "Testing build..."

    if [ ! -f "${BINARY_NAME}" ]; then
        print_error "Binary not found. Run 'build_local' first."
        return 1
    fi

    # Test basic functionality
    ./"${BINARY_NAME}" --version
    ./"${BINARY_NAME}" --help > /dev/null

    print_success "Build test passed"
}

# Install locally
install() {
    print_info "Installing locally..."

    if [ ! -f "${BINARY_NAME}" ]; then
        print_error "Binary not found. Run 'build_local' first."
        return 1
    fi

    # Determine install location
    if command -v brew >/dev/null 2>&1; then
        INSTALL_DIR="/opt/homebrew/bin"
    elif [ -d "/usr/local/bin" ]; then
        INSTALL_DIR="/usr/local/bin"
    else
        INSTALL_DIR="$HOME/.local/bin"
        mkdir -p "$INSTALL_DIR"
    fi

    cp "${BINARY_NAME}" "${INSTALL_DIR}/"
    chmod +x "${INSTALL_DIR}/${BINARY_NAME}"

    print_success "Installed to ${INSTALL_DIR}/${BINARY_NAME}"
    print_info "Make sure ${INSTALL_DIR} is in your PATH"
}

# Show usage
usage() {
    echo "Container Kit CLI Build Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  clean     Clean previous builds"
    echo "  local     Build for local platform only"
    echo "  all       Build for all platforms"
    echo "  test      Test the local build"
    echo "  install   Install locally"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 local     # Quick local build (Apple Silicon default)"
    echo "  $0 all       # Build for all platforms"
    echo "  $0 clean all # Clean and build all"
}

# Main script logic
main() {
    # Check if we're in the right directory
    if [ ! -f "go.mod" ] || [ ! -f "main.go" ]; then
        print_error "This script must be run from the CLI directory"
        exit 1
    fi

    # Ensure go is installed
    if ! command -v go >/dev/null 2>&1; then
        print_error "Go is not installed or not in PATH"
        exit 1
    fi

    case "${1:-help}" in
        "clean")
            clean
            ;;
        "local")
            build_local
            ;;
        "all")
            clean
            build_all
            ;;
        "test")
            test_build
            ;;
        "install")
            install
            ;;
        "help"|"--help"|"-h")
            usage
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
