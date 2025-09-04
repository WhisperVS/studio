# G.A.I.M.

This is a NextJS application for G.A.I.M. (Group Administrators Items Manager). It uses a PostgreSQL database for storage and is containerized with Docker for easy deployment and development.

## Running the Application

Here are the steps to get the application running on your local machine or server.

### Prerequisites

*   **Docker**: Ensure Docker is installed and running on your machine. [Get Docker](https://www.docker.com/get-started)
*   **Docker Compose**: This is included with Docker Desktop for Windows and Mac. On Linux, you may need to install it separately.

### Setup and Execution

1.  **Create Environment File:**
    The application requires a `.env` file to configure the database connection for Prisma CLI to work from outside the container. This file is also used by Docker Compose to inject the environment variable into the application container.

    Create a file named `.env` in the project root and add the following line. This matches the credentials in `docker-compose.yml`.
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/gaim"
    ```

2.  **Start the Application and Database:**
    Use Docker Compose to build the application image and start both the Next.js app container and the PostgreSQL database container.
    ```bash
    docker-compose up --build
    ```
    - The `--build` flag tells Docker Compose to rebuild the application image if there are any changes in the code. You can omit it for subsequent runs.
    - This command will start both containers in your terminal. You will see logs from both the application and the database. The application will be available, but it will show errors until the database schema is initialized in the next step.

3.  **Initialize the Database Schema:**
    When the containers are running, open a **new, separate terminal window**. You need to apply the database schema to the PostgreSQL database. This is done by executing the Prisma command *inside* the running `app` container.

    Run the following command:
    ```bash
    docker-compose exec app npx prisma db push
    ```
    - `docker-compose exec app` tells Docker to run the following command inside the service named `app`.
    - `npx prisma db push` connects to the database and creates the necessary tables based on your `schema.prisma` file. You only need to do this once, or after you make changes to the schema.

4.  **View Your App:**
    Open your browser and navigate to **[http://localhost:9002](http://localhost:9002)** to use the application. The application should now be running without errors. All data will be saved to and loaded from your PostgreSQL database.

### Stopping the Application
To stop the containers, you can press `Ctrl + C` in the terminal where `docker-compose` is running, or run the following command from another terminal in the same directory:
```bash
docker-compose down
```
Using `docker-compose down -v` will also remove the database volume, deleting all your data. Use with caution!
