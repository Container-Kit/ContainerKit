# Template System Documentation

## Overview

The Container Kit scripts use a sophisticated template system for generating dynamic documentation and configuration files. This system provides maintainable, consistent content generation across all release automation processes.

## Template Files

### Current Templates

- **`copy-build-files-to-release.template.md`** - Comprehensive release documentation template
    - Generates detailed README files for each release
    - Includes deployment instructions and troubleshooting guides
    - Provides complete workflow documentation

### Template Location

```
scripts/templates/
└── copy-build-files-to-release.template.md
```

## Template Variables

### Available Variables

All templates support the following dynamic variables:

| Variable              | Description               | Example Value                   |
| --------------------- | ------------------------- | ------------------------------- |
| `{{VERSION}}`         | Release version number    | `1.0.0`                         |
| `{{DOMAIN}}`          | Release domain URL        | `https://releases.mydomain.com` |
| `{{RELEASE_DATE}}`    | ISO date of release       | `2025-01-21`                    |
| `{{DMG_SIZE}}`        | Formatted DMG file size   | `45.2 MB`                       |
| `{{APP_BUNDLE_SIZE}}` | Formatted app bundle size | `42.1 MB`                       |
| `{{TOTAL_SIZE}}`      | Total release size        | `87.3 MB`                       |

### Variable Syntax

Templates use double brace syntax for variable replacement:

```markdown
# Container Kit Release v{{VERSION}}

- **Release Date**: {{RELEASE_DATE}}
- **Domain**: {{DOMAIN}}
- **DMG Size**: {{DMG_SIZE}}
```

## Template Processing System

### Implementation

The template system is implemented through the `processTemplate()` function in `shared.ts`:

```typescript
export function processTemplate(templatePath: string, replacements: Record<string, string>): string;
```

### Processing Flow

1. **Load Template**: Read template file from disk
2. **Variable Replacement**: Replace all `{{KEY}}` placeholders with actual values
3. **Content Generation**: Return processed content string
4. **File Output**: Write generated content to destination

### Error Handling

- **Template Not Found**: Graceful failure with helpful error messages
- **Invalid Variables**: Validation of replacement values
- **File Permissions**: Clear error reporting for write issues
- **Syntax Errors**: Detection of malformed template syntax

## Script Integration

### Usage in Scripts

```typescript
// Import the template processor
import { processTemplate } from './utils/shared.js';

// Define replacement values
const replacements = {
    VERSION: version,
    DOMAIN: domain,
    RELEASE_DATE: new Date().toISOString().split('T')[0],
    DMG_SIZE: formatBytes(dmgSize),
    APP_BUNDLE_SIZE: formatBytes(appBundleSize),
    TOTAL_SIZE: formatBytes(dmgSize + appBundleSize)
};

// Process template
const content = processTemplate(templatePath, replacements);

// Write to output file
fs.writeFileSync(outputPath, content);
```

### Scripts Using Templates

- **`copy-build-files-to-release.ts`** - Generates release README files
- **`build-and-copy-to-release.ts`** - Uses templates through copy script execution

## Template Content Structure

### Release Documentation Template

The main template generates comprehensive release documentation including:

#### Core Sections

- **Release Information** - Version, platform, dates, sizes
- **Directory Structure** - Complete file organization
- **Release Artifacts** - Detailed file descriptions with purposes
- **Update System Workflow** - Step-by-step updater process
- **Integration Configuration** - Tauri and web server setup
- **Security and Verification** - Signature validation and integrity checks

#### Advanced Sections

- **Deployment Instructions** - Complete deployment workflow
- **Troubleshooting Guide** - Common issues and solutions
- **Development and Testing** - Local testing and staging setup
- **Monitoring and Analytics** - Success metrics and logging

#### Reference Sections

- **Script Documentation Links** - Cross-references to detailed docs
- **External Resources** - Tauri and tool documentation
- **Support Information** - Getting help and reporting issues

## Benefits

### For Developers

- **Maintainable Content**: Update templates without touching code
- **Consistent Documentation**: Same structure across all releases
- **Separation of Concerns**: Content separate from logic
- **Easy Customization**: Modify output without script changes

### For Users

- **Always Current**: Documentation reflects actual release details
- **Comprehensive Guide**: Complete instructions for deployment and usage
- **Professional Quality**: Consistent, polished documentation
- **Context-Aware**: Information specific to each release version

### For Operations

- **Automated Documentation**: No manual documentation updates needed
- **Deployment Ready**: Generated docs include all necessary information
- **Troubleshooting Support**: Built-in problem resolution guides
- **Audit Trail**: Generated content includes creation timestamps

## Extending the Template System

### Adding New Variables

1. **Define Variable**: Add to replacements object in script
2. **Process Value**: Format value appropriately (e.g., `formatBytes()`)
3. **Update Template**: Add `{{NEW_VARIABLE}}` to template file
4. **Document Variable**: Add to this documentation

### Creating New Templates

1. **Create Template File**: Add to `scripts/templates/`
2. **Define Variables**: Establish replacement variable set
3. **Implement Processing**: Add template processing to relevant script
4. **Update Documentation**: Document new template and usage

### Template Best Practices

- **Clear Variable Names**: Use descriptive, UPPERCASE variable names
- **Comprehensive Content**: Include all necessary information for users
- **Error Handling**: Plan for missing or invalid variable values
- **Documentation**: Document all variables and their purposes
- **Testing**: Verify template output with various input values

## Future Enhancements

### Potential Improvements

1. **Template Validation**: Schema validation for template syntax
2. **Conditional Content**: If/else logic within templates
3. **Nested Templates**: Template composition and inheritance
4. **Internationalization**: Multi-language template support
5. **Custom Functions**: Built-in formatting and processing functions

### Extension Opportunities

1. **Multiple Output Formats**: Generate HTML, PDF, or other formats
2. **Integration Templates**: CI/CD configuration templates
3. **Deployment Templates**: Infrastructure-as-code templates
4. **Documentation Websites**: Static site generation from templates
