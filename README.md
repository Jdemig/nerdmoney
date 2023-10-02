This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Getting Started

First, run the development server:

```bash
yarn dev
```


# CLI Tools

## npm run generate
### This command allows you to rebuild all pages under a specific siteId
### e.g
```bash
yarn run generate --siteId 11
```

## npm run clear
### This command allows you to delete all pages in the pages /themes/default/pages folder.
### e.g
```bash
yarn run clear --siteId 2
```

## Flags
### theme - allows you to pick the theme folder you are building
-- theme default
### projectID - allows you to pick the projectID that you are building for. For dev purposes you most likely want to create a project for yourself to build it in.
### this can be done by adding a project row to the project table in the database
-- projectId 2
### slug - allow you to pick which page you build - you might want to only build one page vs build all of them in the pages folder
--slug mint



# Project Structure

If you want to build theme pages and debug them and test them start by looking in the /themes/pages directory
Each one of those pages routes to /sites/{project.slug}/{page.slug}

Once you get into these pages you'll see a root parameter. This is what allows you to build page_modules. All these page modules are stored in the page_module table in the database

When rendered each page_module corresponds to a div, img, or anchor tag. A page_module can also correspond to a pre-built component, although it's recommended to avoid using
components if at all possible and instead try to build everything with page_modules.

