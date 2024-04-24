##Running the API using Docker.

### Prerequisites
Before you begin, make sure you have the following installed:
- **Docker**: Download and install Docker from [Docker's official website](https://www.docker.com/products/docker-desktop).
- **Docker Compose**: Usually included with Docker Desktop for Windows and Mac. For Linux, you will need to install it separately following the [official instructions](https://docs.docker.com/compose/install/).

### Step 1: Install Node Dependencies
Open the solution in VS Code (or you're prefered editor)
Open the terminal and make sure you're in the src folder
Run npm install
```bash
npm install
```

### Step 2: Building the Docker Image
From the terminal, go the the root of the project.  This is where the docker file is.
```bash
docker build -t course-service .
```

### Step 3: Running the Application
Now you can launch the application using docker compose
```bash
docker-compose up
```

### Step 4: Accessing the Application
To access the API open a browser and go to:
[http://localhost:3000/swagger](http://localhost:3000/swagger) 


### Step 5: Stopping the Application
To stop the application just use
```bash
docker-compose down
```

### Troubleshooting
If you run into problems then check for the following
- Port conflicts: Ensure no other services are running on the same ports.
- Environment variables: Double-check that all necessary environment variables are correctly set.
- Docker daemon: Verify that the Docker daemon is running.

If all alse fails, install MongoDB locally and run the app using:
```bash
npm run start
```


