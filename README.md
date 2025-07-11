![Gif](Mediawiki_tools.gif)
# AI Toolkit for Wikimedians

## About This Project

This is an experimental, web-based suite of AI-powered tools designed to assist and accelerate the work of Wikimedia editors, developers, and contributors. The project serves as a live playground for prototyping and testing how generative AI can be responsibly applied to common tasks within the Wikimedia ecosystem, from content creation and maintenance to developer support.

The focus is on providing quick, intuitive, and powerful utilities that streamline workflows and enhance productivity.

## Key Features

The toolkit is organized into several domains, each targeting a different aspect of the Wikimedia contribution experience.

### Wikimedia Commons Tools

A set of utilities designed for photographers and media contributors:

*   **AI Caption Writer:** Generates high-quality, encyclopedic titles and descriptions for images.
*   **Category Suggester:** Analyzes an image and suggests relevant categories for proper organization.
*   **Image Validator:** Checks images for common issues like watermarks or low quality before upload.
*   **Depicts Suggester:** Identifies objects and concepts in an image and links them to Wikidata entities.

### Content & Editing Tools

Utilities to help with writing, expanding, and verifying Wikipedia articles:

*   **Citation Finder:** Finds reliable sources for a given statement and formats the citation.
*   **Article Stub Expander:** Provides a sourced roadmap with section suggestions for expanding short articles.
*   **Fact Checker:** Verifies factual claims within a block of text against online sources.
*   **Drafting Assistant:** Generates a structured starter article on any topic, complete with wikitext.
*   **Translation Enhancer:** Compares articles across different languages and translates missing content.

### Development & Security Tools

Aids for gadget, template, and script developers:

*   **API Query Generator:** Translates natural language descriptions into functional MediaWiki Action API URLs.
*   **MediaWiki Code Guardian:** Analyzes JavaScript and Lua snippets for security, performance, and best practices.
*   **Regex Debugger:** Translates complex regular expressions into a simple, natural language explanation.

## Tech Stack

This application is built with a modern, production-grade tech stack:

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **AI/Generative:** Google AI via Genkit
*   **UI:** React, ShadCN UI, Tailwind CSS
*   **Animation:** Framer Motion

This project is an exploration of what's possible when generative AI meets the collaborative spirit of the Wikimedia community. Feel free to try out the tools and see how they can fit into your workflow.
