# G.A.I.M.

This is a NextJS starter for G.A.I.M. (Group Administrators Items Manager).

To get started, take a look at src/app/page.tsx.

## Running the Application Locally

Here are the steps to get the application running on your local machine.

### Prerequisites

*   **Node.js**: Ensure you have a recent version of Node.js installed (v18+ recommended).
*   **Package Manager**: `npm`, `yarn`, or `pnpm`. The instructions below use `npm`.
*   **Gemini API Key**: The AI features are powered by the Gemini API. You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Setup and Execution

1.  **Install Dependencies:**
    Open a terminal in the project's root directory and install the required packages:
    ```bash
    npm install
    ```

2.  **Configure Environment Variables:**
    Create a file named `.env` in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

3.  **Start the AI Service (Genkit):**
    In a terminal, start the Genkit development server. This runs the backend AI flows.
    ```bash
    npm run genkit:watch
    ```
    This will start the service and watch for any changes in the `src/ai/flows` directory. You can inspect your flows and tools in the Genkit Developer UI, typically available at [http://localhost:4000](http://localhost:4000).

4.  **Start the Web Application:**
    In a **second, separate terminal**, run the Next.js development server:
    ```bash
    npm run dev
    ```

5.  **View Your App:**
    Open your browser and navigate to [http://localhost:9002](http://localhost:9002) to use the application.
