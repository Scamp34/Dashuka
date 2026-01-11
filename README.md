# Photo Portfolio Site

A modern, static photo portfolio website built with Astro, Decap CMS, and GitHub Pages. Designed for easy content management through a web-based CMS interface accessible from mobile devices.

## Tech Stack

- **Astro 4.x** - Static site generator with excellent image optimization
- **Tailwind CSS** - Utility-first CSS framework for rapid development
- **Decap CMS 3.x** - Headless CMS for web-based content editing
- **GitHub Pages** - Free static hosting with automatic deployments
- **GitHub Actions** - CI/CD pipeline for building and deploying

## Features

- Dark theme design optimized for showcasing photographs
- Responsive masonry grid layout for albums and photos
- Mobile-friendly CMS interface accessible from iPhone
- Automatic image optimization (AVIF/WebP conversion)
- Lightbox for full-screen photo viewing with swipe gestures
- Category-based album organization
- GitHub OAuth authentication for secure CMS access

## Project Structure

```
portfolio-site/
├── src/
│   ├── pages/           # Astro page routes
│   │   ├── index.astro              # Homepage with album grid
│   │   ├── album/[id].astro         # Individual album page
│   │   ├── category/[id].astro      # Category page
│   │   └── admin.astro              # CMS entry point
│   ├── components/      # Reusable Astro components
│   │   ├── AlbumCard.astro          # Album card component
│   │   ├── PhotoGrid.astro          # Masonry photo grid
│   │   ├── Lightbox.astro           # Full-screen photo viewer
│   │   └── Navigation.astro         # Site navigation menu
│   ├── layouts/         # Base layouts
│   │   └── Layout.astro             # Main layout with dark theme
│   ├── content/         # Content managed by Decap CMS
│   │   ├── albums/                  # Album metadata (JSON)
│   │   └── categories/              # Category metadata (JSON)
│   └── assets/          # Static assets
│       └── images/                 # Photo storage
│           ├── albums/             # Album photos
│           └── categories/         # Category cover images
├── admin/              # Decap CMS configuration
│   ├── config.yml                 # CMS settings
│   └── index.html                 # CMS entry point (dev)
├── public/             # Static files copied to build
│   └── admin/                     # Production CMS files
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions deployment
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind CSS configuration
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm (comes with Node.js)
- Git
- GitHub account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/portfolio-site.git
   cd portfolio-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The site will be available at http://localhost:4321

4. **Open your browser**
   Navigate to http://localhost:4321 to see the site

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts the Astro development server with hot module replacement at http://localhost:4321

### Build for Production
```bash
npm run build
```
Builds the site and outputs static files to the `dist/` directory. This command:
- Runs Astro type checking
- Generates optimized HTML, CSS, and JavaScript
- Optimizes images and converts to modern formats (AVIF/WebP)
- Creates production-ready static files

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally at http://localhost:4321. Useful for testing before deployment.

### Type Check Only
```bash
npm run astro check
```
Runs Astro's type checker without building the site.

## Deployment

### Automatic Deployment (GitHub Actions)

The site is automatically deployed to GitHub Pages when you push to the `main` branch:

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

2. **Push to GitHub**
   ```bash
   git push origin main
   ```

3. **Wait for deployment**
   - Go to the "Actions" tab in your GitHub repository
   - Wait for the "Deploy to GitHub Pages" workflow to complete (green checkmark)
   - Your site will be live at: `https://YOUR-USERNAME.github.io/portfolio-site/`

### Manual Deployment Trigger

You can also trigger a deployment manually from GitHub:

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. Select "Deploy to GitHub Pages" workflow
4. Click "Run workflow" → "Run workflow"

## Configuration

### Astro Configuration (`astro.config.mjs`)

Key settings:
- **site**: Your GitHub Pages URL
- **base**: Repository name (e.g., `/portfolio-site`)
- **build.format**: Set to `directory` for clean URLs
- **image.service**: Sharp for image optimization

Update these values for your setup:
```javascript
site: 'https://YOUR-USERNAME.github.io',
base: '/portfolio-site',  // Match your repository name
```

### Decap CMS Configuration (`admin/config.yml`)

The CMS requires GitHub OAuth setup. See `DECAP_CMS_SETUP.md` for detailed instructions.

Required settings:
- **backend.repo**: Your GitHub repository (username/repo-name)
- **backend.branch**: Git branch (usually `main`)
- **backend.client_id**: From your GitHub OAuth App

## Content Management

### Accessing the CMS

1. **Development**: http://localhost:4321/admin
2. **Production**: `https://YOUR-USERNAME.github.io/portfolio-site/admin`

### Creating Content

1. Login with your GitHub account
2. Create categories first (e.g., "Dogs", "Nature", "People")
3. Create albums and assign them to categories
4. Upload photos from your device
5. Save changes - they'll be committed to your GitHub repository

### Content Structure

**Categories** define the main sections of your site:
- Each category has a title, description, and cover image
- Example: "Dogs", "Nature", "People"

**Albums** contain your photos:
- Each album belongs to one category
- Has a title, date, description, cover image, and photo collection
- Photos are stored in `public/images/albums/`

**Content Files** (JSON format):
- Categories: `src/content/categories/{id}.json`
- Albums: `src/content/albums/{id}.json`

## Image Optimization

Astro automatically optimizes images during build:

- **Format conversion**: Converts to AVIF and WebP (modern formats)
- **Responsive sizes**: Generates multiple sizes for different screen sizes
- **Lazy loading**: Images load as you scroll
- **Compression**: Optimized file sizes without quality loss

Best practices:
- Upload high-quality original images (JPG/PNG)
- Recommended size: 2000-3000px on the longest side
- Astro will handle optimization automatically

## Troubleshooting

### Development server won't start

**Issue**: Port 4321 already in use

**Solution**:
```bash
# Kill process on port 4321 (macOS/Linux)
lsof -ti:4321 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Build fails

**Issue**: Type checking errors

**Solution**:
```bash
# Check for errors
npm run astro check

# Build without type checking (temporary fix)
astro build --no-check
```

### Images not displaying

**Issue**: Broken image links

**Solution**:
1. Check image paths in content JSON files
2. Ensure images exist in `public/images/`
3. Verify paths start with `/images/`
4. Check `public_folder` setting in `admin/config.yml` (should be `/images`)

See `admin/README.md` for detailed CMS path configuration troubleshooting.

### CMS login fails

**Issue**: OAuth authentication error

**Solution**:
1. Verify GitHub OAuth App callback URL: `https://YOUR-USERNAME.github.io/portfolio-site/admin/`
2. Check that client_id is correct in `admin/config.yml`
3. Ensure repository is public (or configure personal access token for private repos)
4. Clear browser cache and cookies

See `DECAP_CMS_SETUP.md` for detailed CMS troubleshooting.

## Performance Optimization

### GitHub Actions Build Time

Current build time: ~2-3 minutes

To reduce build time:
- Keep image sizes reasonable (under 5MB per photo)
- Use GitHub Actions caching (already configured)
- Avoid unnecessary dependencies

### Image Storage

GitHub has a 1GB soft limit on repository size. To stay within limits:
- Optimize images before uploading (use ImageOptim, TinyPNG, etc.)
- Consider GitHub LFS for large files in the future
- Monitor repository size: `git count-objects -vH`

## Security

- **Never commit secrets**: Use environment variables for sensitive data
- **OAuth authentication**: Secure GitHub OAuth for CMS access
- **Public repository**: Recommended for simpler OAuth flow
- **Review commits**: Check CMS-generated commits regularly

## Additional Documentation

- `DECAP_CMS_SETUP.md` - Complete Decap CMS setup guide
- `ADMIN_QUICKSTART.md` - Quick reference for CMS usage
- `DECAP_CMS_WORKFLOW.md` - Detailed content management workflow
- `INSTRUCTIONS.md` - User guide for managing content from iPhone (Russian)

## Support

For issues or questions:

1. Check existing documentation in the repository
2. Review Astro documentation: https://docs.astro.build
3. Review Decap CMS documentation: https://decapcms.org
4. Check GitHub Issues for the repository

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Design inspired by [Peter Beavis Work Portfolio](https://www.peterbeavis.com/work/)
- Built with [Astro](https://astro.build)
- Content management with [Decap CMS](https://decapcms.org)
- Hosted on [GitHub Pages](https://pages.github.com)
