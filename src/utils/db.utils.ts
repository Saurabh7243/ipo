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
import cron from "node-cron";

class DbUtil {
    private connectionInitialized: boolean = false;

    async getDefaultConnection() {
        if (!this.connectionInitialized) {
            await this.init();
        }
        return dataSource;
    }

    async init() {
        console.log("Creating connection to database...");
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }
        this.connectionInitialized = true;
        console.log("Database connection initialized");
    }
}

// Create an instance of DbUtil
// const dbUtil = new DbUtil();

// // Schedule a cron job to ensure the database connection is initialized
// cron.schedule('*/1 * * * *', async function() {
//     try {
//         await dbUtil.init(); // Initialize the database connection if not already done
//         console.log('Background database service is running');
//     } catch (error) {
//         console.error("Error initializing the database connection:", error);
//     }
// });

export default new DbUtil();

