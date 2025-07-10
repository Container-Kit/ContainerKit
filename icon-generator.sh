#!/bin/bash

# --- Configuration ---
# input file (SVG or PNG)
INPUT_FILE="./static/logo-bg.png" # IMPORTANT: Replace with the actual name of your SVG or PNG file!

# Directory to save the output PNGs, ICO, and ICNS
OUTPUT_DIR="./src-tauri/icons"

# --- Script Start ---

echo "--- Universal Icon Generator Script for Tauri ---"

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Homebrew is not installed. Please install it first: /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

# Determine input file type and install necessary tools
FILE_EXTENSION="${INPUT_FILE##*.}"
FILE_TYPE=""
TOOL_COMMAND="" # This will be 'rsvg-convert' for SVG, or 'magick'/'convert' for PNG

case "$FILE_EXTENSION" in
    svg|SVG)
        FILE_TYPE="SVG"
        if ! command -v rsvg-convert &> /dev/null; then
            echo "librsvg (rsvg-convert) is not installed. Installing with Homebrew..."
            brew install librsvg
            if [ $? -ne 0 ]; then
                echo "Failed to install librsvg. Exiting."
                exit 1
            fi
            echo "librsvg installed successfully."
        fi
        TOOL_COMMAND="rsvg-convert"
        ;;
    png|PNG)
        FILE_TYPE="PNG"
        # ImageMagick is needed for PNG resizing and ICO generation.
        # Check for 'magick' first, then fallback to 'convert' for older installations.
        if command -v magick &> /dev/null; then
            TOOL_COMMAND="magick"
        elif command -v convert &> /dev/null; then
            TOOL_COMMAND="convert"
            echo "Warning: Using deprecated 'convert' command from ImageMagick. Consider upgrading ImageMagick or using 'magick'."
        else
            echo "ImageMagick ('magick' or 'convert') is not found. Installing ImageMagick with Homebrew..."
            brew install imagemagick
            if [ $? -ne 0 ]; then
                echo "Failed to install ImageMagick. Exiting."
                exit 1
            fi
            # After installation, determine if 'magick' or 'convert' is available
            if command -v magick &> /dev/null; then
                TOOL_COMMAND="magick"
            elif command -v convert &> /dev/null; then
                TOOL_COMMAND="convert"
            else
                echo "Error: ImageMagick installed but neither 'magick' nor 'convert' command found. Exiting."
                exit 1
            fi
            echo "ImageMagick installed successfully, using command: ${TOOL_COMMAND}."
        fi
        ;;
    *)
        echo "Error: Unsupported input file type '.${FILE_EXTENSION}'."
        echo "This script supports .svg and .png files."
        exit 1
        ;;
esac

# Check if the input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file '${INPUT_FILE}' not found."
    echo "Please ensure the INPUT_FILE variable points to your actual logo file."
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "Processing '${INPUT_FILE}' (${FILE_TYPE}) into '${OUTPUT_DIR}/'"

# Function to generate a standard square PNG
# Arguments:
#   $1: size in pixels (width and height)
#   $2: output filename
generate_png() {
    local size_px=$1
    local output_name=$2
    local output_path="${OUTPUT_DIR}/${output_name}"
    echo "  Generating ${output_name} (${size_px}x${size_px}px)"

    if [ "$FILE_TYPE" = "SVG" ]; then
        # For SVG, rsvg-convert generates PNG. We'll ensure RGBA after this.
        rsvg-convert -w "${size_px}" -h "${size_px}" "${INPUT_FILE}" -o "${output_path}"
    elif [ "$FILE_TYPE" = "PNG" ]; then
        # For PNG, use ImageMagick and explicitly add alpha channel during resize
        "${TOOL_COMMAND}" "${INPUT_FILE}" -resize "${size_px}x${size_px}" -alpha On "${output_path}"
    fi

    if [ $? -ne 0 ]; then
        echo "    Error generating ${output_name}. Please check the input file and tool installation."
    fi
}

# --- Generate various PNG sizes ---
echo "--- Generating PNGs ---"
generate_png 32 "32x32.png"
generate_png 128 "128x128.png"
generate_png 256 "128x128@2x.png" # Common convention for a 2x scaled version of 128x128

# Windows App Tile/Logo sizes
generate_png 30 "Square30x30Logo.png"
generate_png 44 "Square44x44Logo.png"
generate_png 71 "Square71x71Logo.png"
generate_png 89 "Square89x89Logo.png"
generate_png 107 "Square107x107Logo.png"
generate_png 142 "Square142x142Logo.png"
generate_png 150 "Square150x150Logo.png"
generate_png 284 "Square284x284Logo.png"
generate_png 310 "Square310x310Logo.png"

generate_png 50 "StoreLogo.png" # Placeholder size, adjust as per specific store requirements
generate_png 256 "icon.png"     # General-purpose icon, often a larger size

echo "--- PNG generation complete. ---"

# --- Post-process all generated PNGs to ensure RGBA (if they came from SVG or were RGB PNGs) ---
echo "--- Ensuring all generated PNGs are RGBA ---"
# We need to make sure ImageMagick is available for this step
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "ImageMagick ('magick' or 'convert') not found, cannot ensure RGBA for PNGs. Please install ImageMagick."
else
    # Determine the ImageMagick command to use for this section
    IMAGEMAGICK_CMD="magick"
    if ! command -v magick &> /dev/null; then
        IMAGEMAGICK_CMD="convert" # Fallback to 'convert' if 'magick' isn't available
    fi

    for png_file in "${OUTPUT_DIR}"/*.png; do
        if [ -f "$png_file" ]; then
            echo "  Forcing ${png_file} to RGBA..."
            # Always apply -alpha On. If it's already RGBA, it does nothing or minimal work.
            # Using a temporary file to prevent issues during conversion.
            "${IMAGEMAGICK_CMD}" "$png_file" -alpha On "$png_file.tmp"
            if [ $? -eq 0 ]; then
                mv "$png_file.tmp" "$png_file"
            else
                echo "    Warning: Failed to convert ${png_file} to RGBA. This icon might cause issues."
                rm -f "$png_file.tmp" # Clean up temp file on error
            fi
        fi
    done
fi
echo "--- RGBA conversion complete. ---"


# --- Generate ICO file for Windows ---
echo "--- Generating icon.ico ---"

# Common ICO sizes (must be powers of 2 for best compatibility, or standard sizes)
# ImageMagick can combine multiple PNGs into one ICO file.
ICO_SIZES=(16 24 32 48 64 128 256)
ICO_TEMP_PNGS=()

# Create temporary resized PNGs for ICO generation.
# These will be created fresh, ensuring they are RGBA here directly if PNG input,
# or processed by the global RGBA pass if SVG input.
for size in "${ICO_SIZES[@]}"; do
    temp_png="${OUTPUT_DIR}/temp_ico_${size}x${size}.png"
    echo "  Creating temporary ${size}x${size}px PNG for ICO..."
    if [ "$FILE_TYPE" = "SVG" ]; then
        rsvg-convert -w "${size}" -h "${size}" "${INPUT_FILE}" -o "${temp_png}"
    elif [ "$FILE_TYPE" = "PNG" ]; then
        "${TOOL_COMMAND}" "${INPUT_FILE}" -resize "${size}x${size}" -alpha On "${temp_png}"
    fi

    if [ -f "$temp_png" ]; then
        ICO_TEMP_PNGS+=("${temp_png}")
    else
        echo "    Warning: Could not create temp PNG for ICO size ${size}x${size}. It might be skipped."
    fi
done

if [ ${#ICO_TEMP_PNGS[@]} -gt 0 ]; then
    echo "  Combining PNGs into ${OUTPUT_DIR}/icon.ico using ${IMAGEMAGICK_CMD}..."
    # Use the dynamically determined IMAGEMAGICK_CMD (magick or convert)
    "${IMAGEMAGICK_CMD}" "${ICO_TEMP_PNGS[@]}" "${OUTPUT_DIR}/icon.ico"
    if [ $? -eq 0 ]; then
        echo "  icon.ico generated successfully."
    else
        echo "  Error generating icon.ico. ImageMagick might be having issues."
    fi
else
    echo "  No temporary PNGs were generated for ICO. Skipping icon.ico generation."
fi

# Clean up temporary ICO PNGs
if [ ${#ICO_TEMP_PNGS[@]} -gt 0 ]; then
    echo "  Cleaning up temporary ICO PNGs..."
    rm "${ICO_TEMP_PNGS[@]}"
fi

echo "--- ICO generation complete. ---"


# --- Generate ICNS file for macOS ---
echo "--- Generating icon.icns (macOS only) ---"

# Check if running on macOS for iconutil
if [[ "$OSTYPE" == "darwin"* ]]; then
    ICNS_PNG_DIR="${OUTPUT_DIR}/icon.iconset"
    mkdir -p "${ICNS_PNG_DIR}"

    echo "  Creating .iconset directory '${ICNS_PNG_DIR}'..."

    # Generate PNGs with specific macOS iconset naming conventions
    generate_icns_png() {
        local size_px=$1
        local output_name=$2
        local output_path="${ICNS_PNG_DIR}/${output_name}"
        echo "    Generating ${output_name} (${size_px}x${size_px}px)"
        if [ "$FILE_TYPE" = "SVG" ]; then
            rsvg-convert -w "${size_px}" -h "${size_px}" "${INPUT_FILE}" -o "${output_path}"
        elif [ "$FILE_TYPE" = "PNG" ]; then
            "${TOOL_COMMAND}" "${INPUT_FILE}" -resize "${size_px}x${size_px}" -alpha On "${output_path}"
        fi
        if [ $? -ne 0 ]; then
            echo "      Warning: Could not generate PNG for ICNS: ${output_name}"
            return 1 # Indicate failure
        fi
        return 0 # Indicate success
    }

    # Generate all required PNGs for the .iconset
    generate_icns_png 16 "icon_16x16.png"
    generate_icns_png 32 "icon_16x16@2x.png" # 2x for 16x16
    generate_icns_png 32 "icon_32x32.png"
    generate_icns_png 64 "icon_32x32@2x.png" # 2x for 32x32
    generate_icns_png 128 "icon_128x128.png"
    generate_icns_png 256 "icon_128x128@2x.png" # 2x for 128x128
    generate_icns_png 256 "icon_256x256.png"
    generate_icns_png 512 "icon_256x256@2x.png" # 2x for 256x256
    generate_icns_png 512 "icon_512x512.png"
    generate_icns_png 1024 "icon_512x512@2x.png" # 2x for 512x512 (this is the largest required)

    # Use iconutil to create the .icns file from the .iconset directory
    if command -v iconutil &> /dev/null; then
        echo "  Converting .iconset to icon.icns using iconutil..."
        iconutil -c icns "${ICNS_PNG_DIR}" -o "${OUTPUT_DIR}/icon.icns"
        if [ $? -eq 0 ]; then
            echo "  icon.icns generated successfully."
        else
            echo "  Error generating icon.icns using iconutil. Check the .iconset contents. All PNGs must have an alpha channel."
        fi
    else
        echo "  'iconutil' not found. It's usually available on macOS. Skipping .icns generation."
    fi

    # Clean up the .iconset directory
    echo "  Cleaning up temporary .iconset directory..."
    rm -rf "${ICNS_PNG_DIR}"

else
    echo "  Skipping icon.icns generation: 'iconutil' is a macOS-specific tool."
fi

echo "--- ICNS generation complete. ---"
echo "--- All icon generation processes finished. Check '${OUTPUT_DIR}' for all generated files. ---"