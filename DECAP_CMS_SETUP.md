# Decap CMS Setup Guide - GitHub OAuth Configuration

This guide explains how to configure GitHub OAuth for Decap CMS to enable content management for your portfolio site.

## Overview

Decap CMS requires GitHub OAuth authentication to:
- Allow secure login without sharing passwords
- Enable content editing through GitHub API
- Create commits directly from the CMS interface
- Support multi-user workflows (if needed)

## Step 1: Create GitHub OAuth App

### 1.1 Navigate to GitHub Developer Settings

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" in the left sidebar
3. Click "New OAuth App" button

### 1.2 Configure OAuth App

Fill in the following information:

**Application name:**
```
Portfolio CMS - [Your Username]
```

**Homepage URL:**
```
https://[YOUR-USERNAME].github.io/portfolio-site
```
Replace `[YOUR-USERNAME]` with your actual GitHub username.

**Application description:**
```
Decap CMS for managing portfolio content
```

**Authorization callback URL:**
```
https://[YOUR-USERNAME].github.io/portfolio-site/admin/
```
IMPORTANT: The trailing slash `/` is required!

### 1.3 Register the Application

1. Click "Register application"
2. Copy the **Client ID** (you'll need this later)
3. Click "Generate a new client secret"
4. Copy the **Client Secret** immediately (it won't be shown again!)

## Step 2: Configure Decap CMS

### 2.1 Update `admin/config.yml` and `public/admin/config.yml`

Edit both configuration files and add your GitHub credentials:

```yaml
backend:
  name: github
  branch: main
  repo: YOUR-USERNAME/portfolio-site  # Replace with your repo
  base_url: https://github.com
  auth_endpoint: oauth
  client_id: YOUR_CLIENT_ID          # From GitHub OAuth App
  # NOTE: Client secret should be set via environment variable for security
```

### 2.2 Security: Setting Client Secret

**For Local Development:**

Create a `.env` file in your project root:

```bash
DECAP_CMS_CLIENT_SECRET=your_client_secret_here
```

**For GitHub Pages Deployment:**

1. Go to your GitHub repository settings
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click "New repository secret"
4. Name: `DECAP_CMS_CLIENT_SECRET`
5. Value: Paste your client secret
6. Click "Add secret"

Then update `public/admin/config.yml`:

```yaml
backend:
  name: github
  branch: main
  repo: YOUR-USERNAME/portfolio-site
  base_url: https://github.com
  auth_endpoint: oauth
  client_id: YOUR_CLIENT_ID
```

The client secret will be injected at build time via environment variables.

## Step 3: Repository Permissions

### 3.1 Make Repository Public (Recommended)

Decap CMS OAuth works best with public repositories:

1. Go to your repository Settings
2. Scroll to "Danger Zone"
3. Click "Change repository visibility"
4. Select "Public"
5. Confirm the change

### 3.2 Alternative: Private Repository with Personal Access Token

If you must keep the repository private:

1. Generate a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Select scopes: `repo` (full repository access)
   - Generate and copy the token

2. Update `admin/config.yml`:

```yaml
backend:
  name: github
  branch: main
  repo: YOUR-USERNAME/portfolio-site
  token: YOUR_PERSONAL_ACCESS_TOKEN  # NOT recommended for public repos
```

⚠️ **WARNING**: Never commit personal access tokens to public repositories!

## Step 4: Test the Setup

### 4.1 Build and Deploy

1. Commit your changes:
```bash
git add admin/ public/admin/ src/pages/admin.astro
git commit -m "Add Decap CMS configuration"
git push origin main
```

2. Wait for GitHub Actions to complete (check the "Actions" tab)

3. Visit: `https://[YOUR-USERNAME].github.io/portfolio-site/admin/`

### 4.2 First Login

1. Click "Login with GitHub"
2. Authorize the OAuth App (you'll see your app name)
3. Grant repository permissions
4. You should see the Decap CMS dashboard

### 4.3 Create Test Content

1. Click "Categories" → "New Category"
2. Create a test category (e.g., "Dogs")
3. Upload a cover image
4. Save and check GitHub for the new commit
5. Create a test album in the "Albums" collection

## Troubleshooting

### Issue: "Failed to configure"

**Cause**: Missing or incorrect `config.yml`

**Solution**:
- Ensure `config.yml` is in `public/admin/`
- Check YAML syntax (no tabs, proper indentation)
- Verify all required fields are present

### Issue: "OAuth Error: redirect_uri mismatch"

**Cause**: Callback URL doesn't match GitHub OAuth App settings

**Solution**:
- Check that callback URL in GitHub OAuth App exactly matches: `https://[username].github.io/portfolio-site/admin/`
- Ensure trailing slash `/` is present
- Verify `base` in `astro.config.mjs` matches your URL structure

### Issue: "Repository not found"

**Cause**: Incorrect repository name or insufficient permissions

**Solution**:
- Verify `repo: username/repo-name` format in config
- For private repos, ensure personal access token has `repo` scope
- Check that OAuth App has been authorized for the repository

### Issue: "Content folder not found"

**Cause**: Media folder doesn't exist in repository

**Solution**:
```bash
mkdir -p src/assets/images
git add src/assets/images
git commit -m "Add assets directory"
git push
```

### Issue: Images not displaying on site

**Cause**: Public folder path mismatch

**Solution**:
- Verify `public_folder: "/assets/images"` in config
- Check that images are in `src/assets/images/`
- Ensure images are committed to repository
- Run `npm run build` and check generated paths

## Security Best Practices

1. **Never commit secrets**: Use environment variables for sensitive data
2. **Limit OAuth App scope**: Only request necessary permissions
3. **Use public repos**: Simpler OAuth flow, no personal tokens needed
4. **Rotate credentials**: Periodically regenerate client secrets
5. **Monitor commits**: Review CMS-generated commits for suspicious activity

## Mobile Usage (iPhone)

Decap CMS works on mobile browsers:

1. Open Safari on iPhone
2. Navigate to `https://[username].github.io/portfolio-site/admin/`
3. Login with GitHub OAuth
4. Use the CMS interface to:
   - Create new albums
   - Upload photos from camera roll
   - Edit descriptions
   - Organize categories

**Tips for iPhone:**
- Use landscape orientation for better editing experience
- Upload multiple photos at once using the file picker
- Save frequently to avoid losing work
- Check GitHub repository to verify changes

## Next Steps

After completing this setup:

1. **Milestone 4**: Create sample content (categories, albums, photos)
2. **Milestone 5**: Write documentation for your daughter
3. **Customization**: Add custom fields to collections as needed

## Additional Resources

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [GitHub OAuth Apps Guide](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Astro Static Builds](https://docs.astro.build/en/guides/deploy/github-pages/)
- [PhotoSwipe Integration](https://photoswipe.com/) (for Milestone 2)

## Support

If you encounter issues:

1. Check browser console for error messages
2. Verify GitHub OAuth App configuration
3. Review `config.yml` syntax
4. Check GitHub Actions build logs
5. Ensure all files are committed and pushed

---

**Last Updated**: 2025-01-11
**Decap CMS Version**: 3.x
**Astro Version**: 4.x
