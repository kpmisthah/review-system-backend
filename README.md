# LogicLens Server

Backend for the LogicLens Mock Interview Review System.

## Architecture

This project follows the **Repository-Service-Controller** pattern with **Dependency Injection** for better maintainability and testability.

### Layers

1.  **Routes** (`src/routes`): Define API endpoints and map them to Controller methods.
2.  **Controllers** (`src/controllers`): Handle HTTP requests/responses, extract data from requests, and call Services.
3.  **Services** (`src/services`): Contain all business logic. They do NOT know about HTTP (req/res).
4.  **Repositories** (`src/repositories`): Handle all database interactions (Prisma).
5.  **Container** (`src/container.js`): Wires everything together using Dependency Injection.

## Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL (via Prisma ORM)
-   **Authentication**: JWT & Bcrypt
-   **Module System**: ES Modules (`import`/`export`)

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Set up environment variables in `.env`.
3.  Run migrations:
    ```bash
    npx prisma migrate dev
    ```
4.  Start development server:
    ```bash
    npm run dev
    ```