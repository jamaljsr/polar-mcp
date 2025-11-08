# Publishing a New Version to NPM

### Prerequisites

1. **npm Account**: Ensure you have an npm account with publish access to the `@lightningpolar` organization
2. **Authentication**: Log in to npm:
   ```bash
   npm login
   ```

### Manual Publishing Steps

1. **Ensure all changes are committed**:

   ```bash
   git status  # Should show clean working tree
   ```

2. **Build the package**:

   ```bash
   yarn install
   yarn build
   ```

3. **Test locally** (optional but recommended):

   ```bash
   # Link the package locally
   yarn link

   # Test it works
   polar-mcp --help  # Should run without errors

   # Unlink when done testing
   yarn unlink @lightningpolar/mcp
   ```

4. **Update the version**:

   ```bash
   # For patch releases (bug fixes): 1.0.0 -> 1.0.1
   npm version patch

   # For minor releases (new features): 1.0.0 -> 1.1.0
   npm version minor

   # For major releases (breaking changes): 1.0.0 -> 2.0.0
   npm version major
   ```

   This will:

   - Update `package.json` version
   - Create a git commit with the version
   - Create a git tag

5. **Publish to npm**:

   ```bash
   npm publish --access public
   ```

### Automated Publishing (GitHub Actions)

This package includes automated publishing via GitHub Actions. When you create a new release on GitHub:

1. **Create a GitHub Release**: Go to the [Releases](https://github.com/jamaljsr/polar-mcp/releases) page and create a new release
2. **Tag the Release**: Use a semantic version tag like `v1.0.1`
3. **Publish**: The workflow will automatically build and publish to NPM

### Testing the Published Package

After publishing, test the package:

```bash
# Test with npx (no install)
npx -y @lightningpolar/mcp

# Or install globally and test
yarn global add @lightningpolar/mcp
polar-mcp
```
