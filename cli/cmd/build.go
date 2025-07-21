package cmd

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"
)

var buildCmd = &cobra.Command{
	Use:   "build",
	Short: "Build and sign your Tauri application",
	Long: `
Build and sign your Container Kit Tauri application.

This command builds your Tauri application with the specified target and configuration.

AVAILABLE TARGETS:
  aarch64-apple-darwin    Apple Silicon (M1/M2/M3) - Default for macOS 26+ (recommended)
  universal               Universal binary (Apple Silicon + Intel) - For broader compatibility
  x86_64-apple-darwin     Intel (x86_64) - For older Macs

BUILD MODES:
  release                 Production build - Optimized and smaller bundle
  debug                   Development build - Faster compilation, larger size

REQUIREMENTS:
• macOS with Xcode Command Line Tools
• Node.js and pnpm package manager
• Rust toolchain (cargo, rustc)
• Valid code signing certificate in .env file

OUTPUT FILES:
• macOS App Bundle: src-tauri/target/release/bundle/macos/Container Kit.app
• macOS DMG Image: src-tauri/target/release/bundle/dmg/Container Kit_*.dmg
`,
	Example: `
  # Production build (Apple Silicon - default)
  container-kit-cli build --mode release

  # Development build with verbose output
  container-kit-cli build --mode debug --verbose

  # Universal binary build (for broader compatibility)
  container-kit-cli build --target universal --mode release

  # Intel specific build
  container-kit-cli build --target x86_64-apple-darwin --mode release

  # Debug build for development
  container-kit-cli build --mode debug --target universal --verbose
`,
	RunE: func(cmd *cobra.Command, args []string) error {
		// Get flag values
		target, _ := cmd.Flags().GetString("target")
		mode, _ := cmd.Flags().GetString("mode")
		verbose, _ := cmd.Flags().GetBool("verbose")

		// Set default target if not specified
		if target == "" {
			target = "aarch64-apple-darwin"
		}

		// Validate we're in a Tauri project
		if err := validateTauriProject(); err != nil {
			return fmt.Errorf("not a valid Tauri project: %v", err)
		}

		// Print build configuration
		fmt.Printf("🚀 Building Container Kit Application\n")
		fmt.Printf("   Target: %s\n", target)
		fmt.Printf("   Mode: %s\n", mode)
		fmt.Printf("   Verbose: %t\n\n", verbose)

		// Run the build
		return runBuild(target, mode, verbose)
	},
}

func init() {
	rootCmd.AddCommand(buildCmd)

	// Build-specific flags
	buildCmd.Flags().StringP("target", "t", "aarch64-apple-darwin", "Build target (aarch64-apple-darwin, universal, x86_64-apple-darwin)")
	buildCmd.Flags().StringP("mode", "m", "release", "Build mode (release, debug)")
}

// validateTauriProject checks if we're in a valid Tauri project directory
func validateTauriProject() error {
	// Check for src-tauri directory
	srcTauriDir := filepath.Join("src-tauri")
	if _, err := os.Stat(srcTauriDir); os.IsNotExist(err) {
		return fmt.Errorf("src-tauri directory not found")
	}

	// Check for tauri.conf.json
	tauriConfig := filepath.Join(srcTauriDir, "tauri.conf.json")
	if _, err := os.Stat(tauriConfig); os.IsNotExist(err) {
		return fmt.Errorf("tauri.conf.json not found in src-tauri directory")
	}

	// Check for package.json in root
	packageJson := "package.json"
	if _, err := os.Stat(packageJson); os.IsNotExist(err) {
		return fmt.Errorf("package.json not found - not a valid Node.js/Tauri project")
	}

	return nil
}

// runBuild executes the build process
func runBuild(target, mode string, verbose bool) error {
	// Step 1: Install frontend dependencies
	fmt.Println("📦 Installing frontend dependencies...")
	if err := runCommand("pnpm", []string{"install"}, verbose); err != nil {
		return fmt.Errorf("failed to install frontend dependencies: %v", err)
	}

	// Step 2: Build frontend
	fmt.Println("🔨 Building frontend...")
	if err := runCommand("pnpm", []string{"run", "build"}, verbose); err != nil {
		return fmt.Errorf("failed to build frontend: %v", err)
	}

	// Step 3: Build Tauri application
	fmt.Println("⚙️  Building Tauri application...")

	// Prepare Tauri build command
	tauriArgs := []string{"tauri", "build"}

	// Add target if specified and not universal
	if target != "" && target != "universal" {
		tauriArgs = append(tauriArgs, "--target", target)
	}

	// Add debug flag if mode is debug
	if mode == "debug" {
		tauriArgs = append(tauriArgs, "--debug")
	}

	if err := runCommand("pnpm", tauriArgs, verbose); err != nil {
		return fmt.Errorf("failed to build Tauri application: %v", err)
	}

	// Step 4: Success message
	fmt.Println("\n✅ Build completed successfully!")

	// Show output locations
	fmt.Println("\n📁 Output files:")
	if mode == "debug" {
		fmt.Println("   App Bundle: src-tauri/target/debug/bundle/macos/Container Kit.app")
		fmt.Println("   DMG Image: src-tauri/target/debug/bundle/dmg/Container Kit_*.dmg")
	} else {
		fmt.Println("   App Bundle: src-tauri/target/release/bundle/macos/Container Kit.app")
		fmt.Println("   DMG Image: src-tauri/target/release/bundle/dmg/Container Kit_*.dmg")
	}

	return nil
}

// runCommand executes a command with optional verbose output
func runCommand(name string, args []string, verbose bool) error {
	cmd := exec.Command(name, args...)

	if verbose {
		fmt.Printf("Running: %s %s\n", name, strings.Join(args, " "))
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
	}

	return cmd.Run()
}
