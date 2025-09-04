# G.A.I.M.

This is a NextJS application for G.A.I.M. (Group Administrators Items Manager). It uses a PostgreSQL database for storage and is containerized with Docker for easy deployment and development.

## Running the Application

Here are the steps to get the application running on your local machine or server.

### Prerequisites

*   **Node.js**: Ensure you have a recent version of Node.js installed (v18+ recommended). This is needed for installing dependencies and running Prisma commands.
*   **npm**: The Node Package Manager, used for installing packages.
*   **Docker**: Ensure Docker is installed and running on your machine. [Get Docker](https://www.docker.com/get-started)
*   **Docker Compose**: This is included with Docker Desktop for Windows and Mac. On Linux, you may need to install it separately.

### Setup and Execution

1.  **Install Dependencies:**
    Open a terminal in the project's root directory and install the required `npm` packages. This is mainly for Prisma CLI to work correctly.
    ```bash
    npm install
    ```

2.  **Create Environment File:**
    The application uses an `.env` file to configure the database connection. The `docker-compose.yml` file is already set up to pass the correct `DATABASE_URL` to the application container, so you don't need to create this file for the app itself. However, it's good practice to have it for running local Prisma commands if needed.

    Create a file named `.env` and add the following line. This matches the credentials in `docker-compose.yml`.
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/gaim"
    ```

3.  **Start the Application and Database:**
    Use Docker Compose to build the application image and start both the Next.js app container and the PostgreSQL database container.
    ```bash
    docker-compose up --build
    ```
    - The `--build` flag tells Docker Compose to rebuild the application image if there are any changes in the code. You only need to use it the first time or after you've made changes.
    - This command will start both containers in your terminal. You will see logs from both the application and the database.

4.  **Initialize the Database Schema:**
    When the containers are running, open a **new, separate terminal window**. You need to apply the database schema to the PostgreSQL database. Prisma uses the `schema.prisma` file to create the `Asset` table.

    Run the following command:
    ```bash
    npx prisma db push
    ```
    This command connects to the database running inside the Docker container and creates the necessary tables. You only need to do this once.

5.  **View Your App:**
    Open your browser and navigate to **[http://localhost:9002](http://localhost:9002)** to use the application. All data will now be saved to and loaded from your PostgreSQL database.

### Stopping the Application
To stop the containers, you can press `Ctrl + C` in the terminal where `docker-compose` is running, or run the following command from another terminal in the same directory:
```bash
docker-compose down
```
Using `docker-compose down -v` will also remove the database volume, deleting all your data. Use with caution!
