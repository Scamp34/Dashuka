# Decap CMS Quick Start Guide

## Files Created

```
portfolio-site/
├── admin/
│   ├── config.yml          # Decap CMS configuration (GitHub OAuth)
│   ├── config.example.yml  # Template with placeholders
│   └── index.html          # Admin entry point (reference)
├── public/
│   └── admin/
│       ├── config.yml      # Published CMS configuration
│       └── index.html      # Published admin entry point
├── src/
│   ├── pages/
│   │   └── admin.astro     # /admin route (Astro page)
│   └── assets/
│       └── images/
│           ├── albums/     # Album photos uploaded via CMS
│           └── categories/ # Category cover images
└── DECAP_CMS_SETUP.md      # Detailed setup instructions
```

## Quick Setup (5 Steps)

### 1. Create GitHub OAuth App

Go to: https://github.com/settings/developers

**Required Settings:**
- Application name: `Portfolio CMS`
- Homepage URL: `https://YOUR-USERNAME.github.io/portfolio-site`
- Callback URL: `https://YOUR-USERNAME.github.io/portfolio-site/admin/` ⚠️ trailing slash!

Copy **Client ID** and generate **Client Secret**.

### 2. Update Configuration Files

Edit `admin/config.yml` and `public/admin/config.yml`:

```yaml
backend:
  name: github
  branch: main
  repo: YOUR-USERNAME/portfolio-site    # ← Replace
  client_id: YOUR_GITHUB_CLIENT_ID      # ← Replace
```

### 3. Set Client Secret (Security)

**Option A - Environment Variable (Recommended):**

Create `.env` file in project root:
```bash
DECAP_CMS_CLIENT_SECRET=your_secret_here
```

**Option B - GitHub Pages Secret:**

Repository → Settings → Secrets → New repository secret
- Name: `DECAP_CMS_CLIENT_SECRET`
- Value: Your client secret

### 4. Deploy to GitHub

```bash
git add admin/ public/admin/ src/pages/admin.astro .env
git commit -m "Add Decap CMS configuration"
git push origin main
```

### 5. Access Admin Panel

Visit: `https://YOUR-USERNAME.github.io/portfolio-site/admin/`

Click "Login with GitHub" and authorize the app.

## Usage

### Create a Category

1. Click "Categories" → "New Category"
2. Enter title (e.g., "Dogs")
3. Add description
4. Upload cover image
5. Click "Save"

### Create an Album

1. Click "Albums" → "New Album"
2. Enter title (e.g., "Summer 2024")
3. Select category from dropdown
4. Add description
5. Set date
6. Upload cover image
7. Add photos (click "Add photo" for each image)
8. Click "Save"

### Upload Photos from iPhone

1. Open Safari on iPhone
2. Navigate to `/admin/` URL
3. Login with GitHub
4. Create/edit album
5. Tap "Choose image" → "Photo Library"
6. Select multiple photos
7. Save

## Verification Checklist

- [ ] GitHub OAuth App created
- [ ] Client ID added to config.yml
- [ ] Client secret set as environment variable
- [ ] Repository is public (or PAT configured for private)
- [ ] `src/assets/images/` directory exists
- [ ] `src/content/albums/` directory exists
- [ ] `src/content/categories/` directory exists
- [ ] Changes pushed to GitHub
- [ ] `/admin/` URL loads Decap CMS UI
- [ ] GitHub login works
- [ ] Can create test category
- [ ] Can create test album with photos

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Failed to configure" | Check `config.yml` is in `public/admin/` |
| "OAuth redirect_uri mismatch" | Ensure callback URL has trailing slash `/` |
| "Repository not found" | Verify `repo: username/repo-name` format |
| "Content folder not found" | Run `mkdir -p src/assets/images` |
| Images not showing | Check `public_folder: "/assets/images"` path |

## Next Steps

1. ✅ Complete this setup
2. Create sample categories and albums (Milestone 4)
3. Customize CMS fields as needed
4. Write user documentation for your daughter

## Security Notes

- **Never commit** `.env` file with secrets to public repos
- **Never share** client secret or personal access tokens
- **Use public repos** when possible (simpler OAuth flow)
- **Monitor commits** regularly for suspicious activity

## Resources

- 📖 [Full Setup Guide](./DECAP_CMS_SETUP.md) - Detailed instructions
- 📚 [Decap CMS Docs](https://decapcms.org/docs/)
- 🐙 [GitHub OAuth Guide](https://docs.github.com/en/developers/apps/building-oauth-apps)

---

**Created**: 2025-01-11
**Decap CMS**: 3.x
**Astro**: 4.x
