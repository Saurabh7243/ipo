// import { dataSource } from "../db";

// class DbUtil {
//     async getDefaultConnection() {
//         return dataSource
//     }

//     async init() {
//         console.log("Creating connection to database...");
//         await dataSource; // Wait for dataSource to be resolved
//         const db = await dataSource.initialize();
//         if (!db.isInitialized) {
//             console.log("Database is not initialized");
//         }
//     }
    
// }

// export default new DbUtil();

import { dataSource } from "../db";

class DbUtil {
    private connectionInitialized: boolean = false;

    // New property to hold the interval ID for keep-alive
    private keepAliveInterval: NodeJS.Timeout | null = null;

    async getDefaultConnection() {
        if (!this.connectionInitialized) {
            await this.init();
        }
        return dataSource;
    }

    // Initialize connection and start keep-alive checks
    async init() {
        console.log("Creating connection to database...");
        if (!dataSource.isInitialized) {
            try {
                await dataSource.initialize();
                this.connectionInitialized = true;
                console.log("Database connection initialized");

                // Start the keep-alive process after successful initialization
                this.startKeepAlive();
            } catch (error) {
                console.error("Error initializing database connection:", error);
                throw error;
            }
        }
    }

    // Method to start the keep-alive interval
    private startKeepAlive() {
        // Clear any existing interval if present
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
        }

        // Set an interval to run a simple query periodically to keep the connection alive
        this.keepAliveInterval = setInterval(async () => {
            try {
                if (dataSource.isInitialized) {
                    // Simple query to keep the connection alive
                    await dataSource.query("SELECT 1");
                    console.log("Keep-alive query executed");
                }
            } catch (error) {
                console.error("Keep-alive query failed, reinitializing connection:", error);
                await this.reinitializeConnection();
            }
        }, 30000); // Ping the database every 30 seconds
    }

    // Method to reinitialize the connection in case of failure
    private async reinitializeConnection() {
        this.connectionInitialized = false;
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
        await this.init();
    }

    // Clean up method to stop the keep-alive interval when the app shuts down
    stopKeepAlive() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
            console.log("Keep-alive stopped");
        }
    }
}

export default new DbUtil();

