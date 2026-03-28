# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Quarto + R** data dashboard project that renders to a static website and publishes to GitHub Pages. It is not a Node.js project.

## Development Commands

### Rendering the Site

```bash
# Render the entire site
quarto render

# Render a single file
quarto render dashboard.qmd

# Preview with live reload
quarto preview
```

### R Environment (renv)

```bash
# Restore R packages from renv.lock (run after cloning or when lock file changes)
Rscript -e "renv::restore()"

# Install a new package and update renv.lock
Rscript -e "renv::install('package-name'); renv::snapshot()"
```

### CI/CD

The GitHub Actions workflow (`.github/workflows/publish.yml`) automatically:
- Renders the Quarto site and publishes to the `gh-pages` branch
- Triggers on push to `main`, daily at 9 AM UTC, or manual dispatch

## Architecture

- **`_quarto.yml`** — Main site config: theme (Cosmo + custom SCSS), navigation sidebar, site title
- **`custom.scss`** — Dark theme overrides (`#181818` background, `#ccc` text, `#75AADB` links)
- **`index.qmd`** — Home page
- **`dashboard.qmd`** — Main dashboard using Quarto's dashboard layout format (2-column: 35%/65%, with 3 rows in the right column)
- **`about.qmd`** — About page
- **`renv.lock`** — Locked R 4.5.0 + 87 packages; always update via `renv::snapshot()` after adding dependencies

## Key R Libraries in Use

- **Data**: tidyverse (dplyr, tidyr, readr, purrr), data.table, vroom
- **Visualization**: ggplot2, scales, viridisLite, ragg
- **External data**: googledrive, googlesheets4, httr, rvest
- **Database**: DBI, dbplyr

## Dashboard Layout Pattern

Quarto dashboard pages use column/row directives in `.qmd` files:

```markdown
## Column {width="35%"}
content...

## Column {width="65%"}
### Row {height="70%"}
content...
```

R code runs inline via knitr code chunks (```` ```{r} ````).
