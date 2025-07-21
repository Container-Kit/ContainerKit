#!/bin/bash

# Build and Sign Tauri Bundle Script
# This script builds the Tauri application and signs the DMG bundle

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

print_header() {
    echo -e "${BLUE}🚀 $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Validate environment
validate_environment() {
    print_info "Validating environment..."

    # Check if .env file exists
    if [ ! -f ".env" ]; then
        print_error ".env file not found in project root"
        exit 1
    fi

    # Load environment variables
    source .env

    # Check required environment variables
    if [ -z "$TAURI_SIGNING_PRIVATE_KEY" ]; then
        print_error "TAURI_SIGNING_PRIVATE_KEY not found in .env file"
        exit 1
    fi

    if [ -z "$TAURI_SIGNING_PRIVATE_KEY_PASSWORD" ]; then
        print_error "TAURI_SIGNING_PRIVATE_KEY_PASSWORD not found in .env file"
        exit 1
    fi

    # Check if src-tauri directory exists
    if [ ! -d "src-tauri" ]; then
        print_error "src-tauri directory not found"
        exit 1
    fi

    # Check if required commands exist
    if ! command_exists pnpm; then
        print_error "pnpm is not installed or not in PATH"
        exit 1
    fi

    print_success "Environment validation passed"
}

# Build frontend
build_frontend() {
    print_info "Building frontend..."

    if pnpm build; then
        print_success "Frontend build completed"
    else
        print_error "Frontend build failed"
        exit 1
    fi
}

# Build Tauri bundle
build_tauri_bundle() {
    print_info "Building Tauri bundle with DMG signing..."

    # Export environment variables for Tauri
    export TAURI_SIGNING_PRIVATE_KEY
    export TAURI_SIGNING_PRIVATE_KEY_PASSWORD

    # Build arguments
    local build_args=("tauri" "build")

    # Add target bundles
    build_args+=("--bundles" "dmg,app")

    # Add debug flag if requested
    if [ "$DEBUG" = "true" ]; then
        build_args+=("--debug")
        print_info "Building in debug mode"
    fi

    # Add verbose flag if requested
    if [ "$VERBOSE" = "true" ]; then
        build_args+=("--verbose")
        print_info "Verbose output enabled"
    fi

    # Add target if specified
    if [ -n "$TARGET" ]; then
        build_args+=("--target" "$TARGET")
        print_info "Building for target: $TARGET"
    fi

    if pnpm "${build_args[@]}"; then
        print_success "Tauri bundle build completed successfully"
    else
        print_error "Tauri bundle build failed"
        exit 1
    fi
}

# Log build information
log_build_info() {
    print_header "Starting Tauri bundle build process..."
    echo "📂 Project root: $(pwd)"
    echo "📂 Tauri source: $(pwd)/src-tauri"
    echo "🔐 Signing enabled: $([ -n "$TAURI_SIGNING_PRIVATE_KEY" ] && echo "Yes" || echo "No")"
    echo "📱 Target platforms: DMG, App"
    echo "=================================================="
}

# Log build completion
log_build_complete() {
    echo "=================================================="
    print_success "Build process completed successfully!"
    echo "📦 Generated bundles:"
    echo "   - macOS App (.app)"
    echo "   - macOS DMG (.dmg) - Signed"
    echo "📂 Check src-tauri/target/release/bundle/ for output files"
}

# Show help
show_help() {
    cat << EOF
Usage: ./scripts/build-tauri.sh [options]

Options:
  --debug             Build in debug mode
  --verbose           Enable verbose output
  --target <target>   Specify build target
  --help, -h          Show this help message

Environment Variables (from .env):
  TAURI_SIGNING_PRIVATE_KEY           RSA private key for signing
  TAURI_SIGNING_PRIVATE_KEY_PASSWORD  Password for the private key

Examples:
  ./scripts/build-tauri.sh
  ./scripts/build-tauri.sh --verbose
  ./scripts/build-tauri.sh --debug --verbose
  ./scripts/build-tauri.sh --target x86_64-apple-darwin

EOF
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --debug)
                DEBUG="true"
                shift
                ;;
            --verbose)
                VERBOSE="true"
                shift
                ;;
            --target)
                TARGET="$2"
                shift 2
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# Main function
main() {
    # Parse command line arguments
    parse_args "$@"

    # Load environment variables
    if [ -f ".env" ]; then
        source .env
    fi

    # Run build process
    log_build_info
    validate_environment
    build_frontend
    build_tauri_bundle
    log_build_complete
}

# Run main function with all arguments
main "$@"
