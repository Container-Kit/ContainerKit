# Contributing to Container Kit

We welcome contributions to Container Kit! This guide will help you get started with contributing to our modern desktop application for Apple container management.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **macOS 26.0+** with Apple Silicon (M1/M2/M3/M4)
- **Xcode Command Line Tools**: `xcode-select --install`
- **Apple Container**: `brew install --cask container`
- **Node.js 18+** and **pnpm**: `npm install -g pnpm`
- **Git** for version control

### Development Setup

1. **Fork and Clone**

    ```bash
    git clone https://github.com/etherCorps/ContainerKit.git
    cd ContainerKit
    ```

2. **Install Dependencies**

    ```bash
    pnpm install
    ```

3. **Environment Setup**

    ```bash
    # Copy environment template (if exists)
    cp .env.example .env

    # Configure signing keys for development (optional)
    # Add your signing keys to .env file
    ```

4. **Verify Setup**

    ```bash
    # Start development server
    pnpm dev
    ```

## 🔧 Recommended IDE Setup

**[Zed](https://zed.dev/)** - Fast, collaborative code editor built for performance

### Extensions

- **Svelte** - Syntax highlighting and IntelliSense for Svelte components
- **Rust** - Full Rust language support with rust-analyzer
- **TypeScript** - Enhanced TypeScript development experience
- **Tailwind CSS** - IntelliSense for Tailwind CSS classes

### Configuration

Add to your Zed `.zed/settings.json`: [Zed project settings](./.zed/settings.json)

### Alternative IDEs

- **VS Code** + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## 🏗️ Development Workflow

### Branch Strategy

- **`main`** - Stable release branch
- **`develop`** - Integration branch for new features
- **`feature/feature-name`** - Feature development
- **`fix/issue-description`** - Bug fixes
- **`docs/documentation-update`** - Documentation improvements

### Standard Workflow

1. **Create Feature Branch**

    ```bash
    git checkout -b feature/your-feature-name
    ```

2. **Make Changes**

    - Follow our [Code Standards](#code-standards)
    - Write tests for new functionality
    - Update documentation as needed

3. **Test Your Changes**

    ```bash
    # Run type checking
    pnpm check

    # Format code
    pnpm format

    # Lint code
    pnpm lint

    # Test build
    pnpm build:tauri
    ```

4. **Commit Changes**

    ```bash
    git add .
    git commit -m "feat: add your feature description"
    ```

5. **Push and Create PR**
    ```bash
    git push origin feature/your-feature-name
    ```
    Then create a Pull Request on GitHub.

## 📏 Code Standards

### TypeScript

- **Strict typing required** - No `any` types without justification
- **Types over interfaces** - Use Types for object shapes
- **Explicit return types** - For all public functions

```typescript
// ✅ Good
interface UserConfig {
    theme: 'light' | 'dark';
    autoUpdate: boolean;
}

export function updateConfig(config: UserConfig): Promise<void> {
    // implementation
}

// ❌ Avoid
function updateConfig(config: any) {
    // implementation
}
```

### Svelte Components

- **Component-scoped styles** - Use `<style>` blocks in components
- **TypeScript in script blocks** - Always use `<script lang="ts">`
- **Props with types** - Explicitly type all props
- **Reactive statements** - Use `$derived` for derived values

```svelte
<!-- ✅ Good -->
<script lang="ts">
    interface Props {
        title: string;
        isActive?: boolean;
    }

    let { title, isActive = false }: Props = $props();
</script>

<h1 class={{isActive ? 'active' : 'inactive'}}>{title}</h1>

<style>
    .active {
        color: var(--primary);
    }
    .inactive {
        color: var(--muted);
    }
</style>
```

### Rust (Tauri Backend)

- **Follow Rust conventions** - Use `cargo fmt` and `cargo clippy`
- **Error handling** - Proper error types with context
- **Documentation** - Doc comments for public APIs
- **Testing** - Unit tests for complex logic (I'll write them one day for sure.)

```rust
// ✅ Good
use tauri::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ContainerInfo {
    pub id: String,
    pub name: String,
    pub status: ContainerStatus,
}

/// Retrieves container information by ID
#[tauri::command]
pub async fn get_container_info(id: String) -> Result<ContainerInfo> {
    // Implementation with proper error handling
    container_service::get_info(&id)
        .await
        .map_err(|e| format!("Failed to get container info: {}", e))
}
```

### Database Schema (Drizzle)

- **Descriptive table names** - Clear, singular nouns
- **Consistent field naming** - camelCase for TypeScript compatibility
- **Proper relationships** - Use foreign keys appropriately
- **Migration versioning** - Sequential, descriptive migration names

```typescript
// ✅ Good
export const container = sqliteTable('container', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    status: text('status').$type<ContainerStatus>().notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});
```

## 🧪 Testing Guidelines

### Frontend Testing

- **Component tests** - Test component behavior and rendering (Storybook with tauri need to look for it).
- **Integration tests** - Test user workflows
- **Type tests** - Ensure TypeScript types are correct

### Backend Testing

- **Unit tests** - Test individual functions and modules
- **Integration tests** - Test Tauri commands end-to-end
- **Database tests** - Test schema and queries

[//]: #
[//]: # '### Running Tests'
[//]: #
[//]: # '```bash'
[//]: # '# Frontend tests'
[//]: # 'pnpm test'
[//]: # '```'

## 📝 Documentation Standards

### Code Documentation

- **TypeScript** - JSDoc comments for public APIs
- **Svelte** - Component prop documentation
- **Rust** - Doc comments (`///`) for public functions

### README and Guides

- **Clear headings** - Use consistent markdown structure
- **Code examples** - Include working examples
- **Step-by-step guides** - Break down complex processes
- **Links and references** - Cross-reference related documentation

## 🚀 Build and Release Process

### Development Builds

```bash
# Frontend development
pnpm dev

# Full development build
pnpm build

# Tauri development build
pnpm build:tauri
```

### Release Process

```bash
# Update version in src-tauri/tauri.conf.json
# Then run complete release workflow
pnpm release
```

See [scripts/docs/README.md](./scripts/docs/README.md) for detailed script documentation.

## 🏗️ Architecture and Tech Stack

### Frontend Stack

- **Svelte 5** - Latest reactivity system with runes
- **SvelteKit** - Full-stack framework with SSG
- **TailwindCSS 4.x** - Latest engine with custom themes
- **TypeScript** - Strict typing throughout
- **Motion** - Smooth animations and transitions

### Backend Stack

- **Tauri 2.x** - Rust-based desktop framework
- **Rust** - Systems programming for performance
- **LibSQL** - SQLite-compatible database
- **Drizzle ORM** - Type-safe database operations

### Build & Automation

- **TypeScript Scripts** - Comprehensive build and automation scripts
- **pnpm** - Fast, disk space efficient package manager
- **Vite** - Fast build tool and development server

### Project Structure

```
ContainerKit/
├── src/                          # Svelte frontend
│   ├── lib/
│   │   ├── components/          # UI components (atomic design)
│   │   │   ├── ui/              # Base UI components
│   │   │   ├── features/        # Feature-specific components
│   │   │   └── layout/          # Layout components
│   │   ├── db/                  # Database schema and types
│   │   │   ├── schema.ts        # Drizzle schema definitions
│   │   │   └── types.ts         # TypeScript type definitions
│   │   ├── services/            # Apple container APIs
│   │   │   ├── container.ts     # Container management
│   │   │   └── system.ts        # System integration
│   │   ├── stores/              # Svelte stores
│   │   │   ├── app.ts           # Application state
│   │   │   └── theme.ts         # Theme management
│   │   └── utils/               # Utility functions
│   ├── routes/                  # SvelteKit routes
│   │   ├── (app)/               # Main application routes
│   │   └── api/                 # API endpoints
│   ├── themes/                  # Custom CSS themes
│   └── app.html                 # HTML template
├── src-tauri/                   # Rust/Tauri backend
│   ├── src/                     # Rust source code
│   │   ├── commands/            # Tauri commands
│   │   ├── services/            # Business logic
│   │   └── main.rs              # Application entry point
│   ├── migrations/              # SQL migration files
│   ├── tauri.conf.json         # Tauri configuration
│   └── Cargo.toml              # Rust dependencies
├── scripts/                     # TypeScript build and automation scripts
│   ├── docs/                    # Script documentation
│   ├── templates/               # Template files
│   └── utils/                   # Shared utilities
├── static/                      # Static assets
└── tests/                       # Test files
```

### Development Architecture

#### Frontend Architecture

- **Component-Based Design** - Atomic design principles with reusable components
- **Type-Safe State Management** - Svelte stores with TypeScript
- **Server-Side Generation** - SvelteKit for optimal performance
- **Responsive Design** - Mobile-first approach with TailwindCSS

#### Backend Architecture

- **Command Pattern** - Tauri commands for frontend-backend communication
- **Service Layer** - Business logic separated from UI concerns
- **Database Layer** - Type-safe ORM with Drizzle
- **Security First** - Rust's memory safety and Tauri's security model

#### Build System

- **Modular Scripts** - Separate concerns for build, copy, and release
- **TypeScript Automation** - Type-safe build scripts and utilities
- **Hot Reload** - Fast development iteration with Vite
- **Code Signing** - Automated signing for macOS distribution

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** - Check if the bug is already reported
2. **Try latest version** - Ensure you're using the most recent build
3. **Minimal reproduction** - Create the smallest possible reproduction case

### Bug Report Template

```markdown
## Bug Description

A clear description of what the bug is.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Environment

- macOS Version:
- App Version:
- Architecture: (Apple Silicon/Intel)

## Additional Context

Any other context, screenshots, or logs.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description

A clear description of the feature you'd like to see.

## Problem Statement

What problem does this feature solve?

## Proposed Solution

How would you like this feature to work?

## Alternative Solutions

Any alternative solutions you've considered.

## Additional Context

Any other context, mockups, or examples.
```

## 🔍 Areas for Contribution

### 🐛 Bug Fixes

- **UI inconsistencies** - Visual bugs and layout issues
- **Performance issues** - Memory leaks, slow operations
- **Compatibility problems** - Issues with different macOS versions
- **Edge cases** - Handling of unusual input or states

### ✨ New Features

- **Container management** - New container operations and workflows
- **UI improvements** - Better user experience and accessibility
- **Integration features** - API integrations and external tool support
- **Performance optimizations** - Faster operations and better resource usage

### 📚 Documentation

- **API documentation** - Document Tauri commands and TypeScript APIs
- **User guides** - Step-by-step tutorials and how-to guides
- **Developer guides** - Architecture documentation and contribution guides
- **Code examples** - Real-world usage examples and best practices

### 🎨 UI/UX Improvements

- **Accessibility** - Better keyboard navigation, screen reader support
- **Design consistency** - Follow Apple Human Interface Guidelines
- **Dark mode** - Improvements to dark theme implementation
- **Responsive design** - Better support for different screen sizes

### 🔧 Developer Experience

- **Build scripts** - Improve TypeScript automation scripts
- **Development tools** - Better debugging and development workflows
- **Testing infrastructure** - Automated testing and CI/CD improvements
- **Documentation** - Better inline documentation and examples

### 🧪 Testing

- **Unit tests** - Component and function testing
- **Integration tests** - End-to-end user workflow testing
- **Performance tests** - Benchmarking and performance regression testing
- **Accessibility tests** - Automated accessibility compliance testing

## 🏷️ Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring without feature changes
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### Examples

```bash
feat: add container status monitoring
fix: resolve memory leak in container list
docs: update API documentation for container commands
style: format TypeScript files with prettier
refactor: extract container service logic
test: add unit tests for container operations
chore: update build scripts for release automation
```

## 🔒 Security

### Reporting Security Issues

**DO NOT** create public GitHub issues for security vulnerabilities.

Instead, email security issues to: [shivam@ethercorps.io](mailto:shivam@ethercorps.io)

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes

We'll respond within 48 hours and work with you to resolve the issue.

### Security Best Practices

- **Input validation** - Sanitize all user inputs
- **Secure storage** - Encrypt sensitive data
- **Authentication** - Proper session management
- **Dependencies** - Keep dependencies updated

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Tests added/updated for changes
- [ ] Documentation updated if needed
- [ ] No merge conflicts with main branch

### PR Description Template

```markdown
## Summary

Brief description of changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

Describe the tests that you ran to verify your changes:

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots to help explain your changes.

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## 🎉 Recognition

Contributors will be recognized in:

- **README.md** - Contributors section
- **Release notes** - Acknowledgment in release announcements
- **GitHub** - Contributor badge and statistics

## 📞 Getting Help

- **GitHub Discussions** - [Project Discussions](https://github.com/etherCorps/ContainerKit/discussions)

[//]: # '- **Discord** - [Development Chat](https://discord.gg/containerkit) (if available)'

- **Email** - [shivam@ethercorps.io](mailto:shivam@ethercorps.io)

## 📚 Additional Resources

- **Tauri Documentation** - [https://tauri.app/](https://tauri.app/)
- **Svelte 5 Documentation** - [https://svelte.dev/](https://svelte.dev/)
- **Rust Book** - [https://doc.rust-lang.org/book/](https://doc.rust-lang.org/book/)
- **TypeScript Handbook** - [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)

---

Thank you for contributing to Container Kit! Your contributions help make Apple container management better for everyone. 🚀
