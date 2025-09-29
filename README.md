# G.A.I.M.

This is a NextJS application for G.A.I.M. (Group Administrators Items Manager). It uses a PostgreSQL database for storage and is containerized with Docker for easy deployment and development.

## Features

- **Asset Management**: Track laptops, servers, systems, networks, printers, and miscellaneous equipment
- **User Assignment**: Assign assets to users with support for local and domain accounts
- **Category-based Organization**: Organize assets by product families with automatic manufacturer detection
- **Accessibility Compliant**: WCAG-compliant forms with proper labeling and keyboard navigation
- **Docker Ready**: Containerized for easy deployment with Docker Hub integration
- **Form Validation**: Comprehensive validation with Zod schemas and React Hook Form

## Tech Stack

- **Frontend**: Next.js 15.3.3, React 18.3.1, TypeScript 5.5.4
- **UI Components**: Radix UI with Tailwind CSS for styling
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Docker with multi-stage builds and Docker Hub integration
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- **Docker**: Ensure Docker is installed and running on your machine. [Get Docker](https://www.docker.com/get-started)
- **Docker Compose**: This is included with Docker Desktop for Windows and Mac. On Linux, you may need to install it separately.

### Local Development Setup

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/WhisperVS/studio.git
    cd studio
    ```

2.  **Create Environment File:**
    Copy the example environment file and customize it for your setup:

    ```bash
    cp .env.example .env
    ```

    Edit `.env` with your configuration:

    ```bash
    # Docker Hub Configuration
    DOCKER_USERNAME=your-dockerhub-username

    # App Version (automatically reads from package.json if not set)
    APP_VERSION=1.3

    # Database Configuration
    DATABASE_URL=postgresql://user:password@localhost:5432/gaim
    ```

3.  **Start the Application and Database:**
    Use Docker Compose to build and start both the Next.js app and PostgreSQL database:

    ```bash
    docker compose up --build
    ```

    - The `--build` flag rebuilds the application image with any code changes
    - This starts both containers and shows logs from both services
    - The application will be available after the database schema is initialized

4.  **Initialize the Database Schema:**
    In a **new terminal window**, apply the database schema to PostgreSQL:

    ```bash
    docker compose exec app npx prisma db push
    ```

    - This creates the necessary tables based on your `schema.prisma` file
    - Only needed once, or after schema changes

5.  **Access Your Application:**
    Open your browser and navigate to **[http://localhost:9002](http://localhost:9002)**

## Docker Hub Deployment

### Build and Push Images

1.  **Configure Environment:**
    Ensure your `.env` file has the correct Docker Hub username and version:

    ```bash
    DOCKER_USERNAME=your-dockerhub-username
    APP_VERSION=1.3
    ```

2.  **Login to Docker Hub:**

    ```bash
    docker login
    ```

3.  **Build Images:**

    ```bash
    docker compose build
    ```

4.  **Push to Docker Hub:**
    ```bash
    docker compose push
    ```

This will create and push images tagged as:

- `your-username/gaim:1.3` (version-specific)
- `your-username/gaim:latest` (latest version)

### Production Deployment

For production deployment, use the published Docker images:

```yaml
services:
  app:
    image: your-dockerhub-username/gaim:1.3
    environment:
      DATABASE_URL: your-production-database-url
    ports:
      - "9002:9002"
```

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   └── ...             # Feature-specific components
│   ├── lib/                # Utilities and configurations
│   │   ├── catalog/        # Manufacturer/model catalogs
│   │   └── ...
│   └── types/              # TypeScript type definitions
├── prisma/
│   └── schema.prisma       # Database schema
├── docker-compose.yml      # Local development setup
├── Dockerfile             # Production container build
└── .env.example           # Environment template
```

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checker

### Database Management

- **Apply schema changes**: `docker compose exec app npx prisma db push`
- **Generate Prisma client**: `docker compose exec app npx prisma generate`
- **View database**: `docker compose exec app npx prisma studio`

## Stopping the Application

To stop the containers:

```bash
docker compose down
```

**⚠️ Warning**: Using `docker compose down -v` will also remove the database volume, deleting all your data!
