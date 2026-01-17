# AI Engineer Portfolio

A minimalistic, professional portfolio website built with React, TypeScript, and Tailwind CSS.

## Features

- ⚡ **Fast & Modern** — Built with Vite for instant HMR and optimized builds
- 🎨 **Clean Design** — Ultra-minimal aesthetic inspired by developer tools
- 🌙 **Dark Mode** — Beautiful dark theme by default
- 📱 **Responsive** — Mobile-first design that works everywhere
- ✨ **Smooth Animations** — Subtle micro-interactions and scroll animations
- 🔧 **Customizable** — Easy to personalize with your own content

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for building and development
- **Lucide React** for icons
- **Satoshi** font for typography

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory, ready for deployment.

## Customization

### Personal Information

Update the following files to add your own content:

- `src/components/Hero.tsx` — Name, title, and tagline
- `src/components/About.tsx` — Bio, skills, and technologies
- `src/components/Projects.tsx` — Your projects
- `src/components/Contact.tsx` — Social links and email

### Styling

- Colors and theme: `tailwind.config.js`
- Global styles: `src/index.css`
- Fonts: Update the Google Fonts links in `index.html`

## Deployment

This project is ready for deployment on:

- **Vercel**: `vercel deploy`
- **Netlify**: Connect your repo for automatic deploys
- **GitHub Pages**: Build and deploy the `dist` folder

## License

MIT License — feel free to use this for your own portfolio!
