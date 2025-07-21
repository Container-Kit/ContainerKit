package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "container-kit-cli",
	Short: "CLI for building and signing Container Kit Tauri applications",
	Long: `
🚀 Container Kit CLI

A command-line interface for building and signing your Tauri applications.

Features:
• Build and package Tauri applications
• Automatic code signing for macOS DMG and App bundles
• Database migration management
• Support for multiple build targets and configurations
`,
	Version: "1.0.0",
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() error {
	return rootCmd.Execute()
}

func init() {
	// Global flags
	rootCmd.PersistentFlags().BoolP("verbose", "v", false, "Enable verbose output")

	// Version template
	rootCmd.SetVersionTemplate(`{{printf "%s version %s" .Name .Version}}
`)

	// Help template with better styling
	rootCmd.SetHelpTemplate(`{{.Long}}

Usage:
  {{.UseLine}}{{if .HasAvailableSubCommands}}

Available Commands:{{range .Commands}}{{if (or .IsAvailableCommand (eq .Name "help"))}}
  {{rpad .Name .NamePadding }} {{.Short}}{{end}}{{end}}{{end}}{{if .HasAvailableLocalFlags}}

Flags:
{{.LocalFlags.FlagUsages | trimTrailingWhitespaces}}{{end}}{{if .HasAvailableInheritedFlags}}

Global Flags:
{{.InheritedFlags.FlagUsages | trimTrailingWhitespaces}}{{end}}{{if .HasHelpSubCommands}}

Additional help topics:{{range .Commands}}{{if .IsAdditionalHelpTopicCommand}}
  {{rpad .Name .NamePadding }} {{.Short}}{{end}}{{end}}{{end}}{{if .HasAvailableSubCommands}}

Use "{{.CommandPath}} [command] --help" for more information about a command.{{end}}
`)

	// Disable completion command
	rootCmd.CompletionOptions.DisableDefaultCmd = true

	// Custom usage function
	rootCmd.SetUsageFunc(func(cmd *cobra.Command) error {
		fmt.Fprintf(cmd.OutOrStderr(), "Usage: %s\n", cmd.UseLine())
		if cmd.HasAvailableSubCommands() {
			fmt.Fprintf(cmd.OutOrStderr(), "\nAvailable Commands:\n")
			for _, c := range cmd.Commands() {
				if c.IsAvailableCommand() || c.Name() == "help" {
					fmt.Fprintf(cmd.OutOrStderr(), "  %-15s %s\n", c.Name(), c.Short)
				}
			}
		}
		fmt.Fprintf(cmd.OutOrStderr(), "\nUse \"%s --help\" for more information.\n", cmd.CommandPath())
		return nil
	})
}
