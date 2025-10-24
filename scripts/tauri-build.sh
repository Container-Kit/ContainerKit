#!/bin/bash
# This script builds the Tauri application for macOS aarch64 architecture.
# It sources environment variables from the .env file and then runs the tauri build command.

source .env && TAURI_SIGNING_PRIVATE_KEY_PASSWORD=$TAURI_SIGNING_PRIVATE_KEY_PASSWORD TAURI_SIGNING_PRIVATE_KEY=$TAURI_SIGNING_PRIVATE_KEY APPLE_ID=$APPLE_ID APPLE_PASSWORD=$APPLE_PASSWORD APPLE_TEAM_ID=$APPLE_TEAM_ID APPLE_SIGNING_IDENTITY=$APPLE_SIGNING_IDENTITY tauri build --target aarch64-apple-darwin
