To install MongoDB, follow these steps, which you can adjust depending on your operating system:

1. **Download MongoDB**: Visit the MongoDB official website and download the MongoDB installer package for your operating system. MongoDB provides packages for Windows, Linux, and macOS.

[Download Mongo DB Community Edition here..](https://www.mongodb.com/try/download/community)

2. **Install MongoDB**:
   - **For Windows**:
     - Run the MongoDB installer (.msi file) you downloaded.
     - Follow the installation wizard. Choose “Complete” setup.
     - Select “Install MongoDB as a Service” for easier management.
     - Specify the data directory where MongoDB stores its data.
     - Specify the log directory where MongoDB stores its log files.
     - Proceed with the installation.
   - **For Linux**:
     - The specific commands depend on your distribution. For most distributions, MongoDB provides a repository you can add to your package manager. Here’s a general approach for systems using `apt` (like Ubuntu and Debian):
       - Import the public key used by the package management system: 
         ```
         wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
         ```
       - Create a list file for MongoDB:
         ```
         echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
         ```
       - Reload the local package database:
         ```
         sudo apt-get update
         ```
       - Install MongoDB packages:
         ```
         sudo apt-get install -y mongodb-org
         ```
   - **For macOS**:
     - You can use Homebrew to install MongoDB:
       - Open a terminal and run:
         ```
         brew tap mongodb/brew
         ```
       - Then, to install MongoDB, run:
         ```
         brew install mongodb-community
         ```

3. **Start MongoDB**:
   - **For Windows**:
     - Open the Command Prompt as an Administrator.
     - Start MongoDB as a service with:
       ```
       net start MongoDB
       ```
   - **For Linux**:
     - Start MongoDB with systemd (for most recent distributions):
       ```
       sudo systemctl start mongod
       ```
     - If you want MongoDB to start on boot, use:
       ```
       sudo systemctl enable mongod
       ```
   - **For macOS**:
     - To start MongoDB, run:
       ```
       brew services start mongodb-community
       ```

4. **Verify the Installation**:
   - You can verify that MongoDB is running by connecting to the MongoDB database server using the MongoDB shell and checking the connection status.
   - Open a terminal or Command Prompt and run:
     ```
     mongo
     ```
   - This command connects you to the MongoDB instance running on your localhost with the default port (27017).

The steps you need to take might vary slightly based on the MongoDB version and the specifics of your operating system. Always refer to the official MongoDB documentation for the most accurate and detailed installation steps for your setup.