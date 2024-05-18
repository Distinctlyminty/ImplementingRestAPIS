# Integrating Application Insights with an Express.js Node.js REST API

## Prerequisites

- Node.js installed (v14.x or later recommended)
- An existing Node.js application with Express.js
- An Azure account and an Application Insights resource

## Step-by-Step Instructions

### 1. Install Application Insights SDK

First, you need to install the Application Insights SDK for Node.js. Open your terminal and navigate to your project directory, then run:

```bash
npm install applicationinsights
```

### 2. Set Up Application Insights

Next, you need to set up Application Insights in your application. In your main application file (e.g., `app.js` or `server.js`), require and configure Application Insights as early as possible. Replace `'YOUR_INSTRUMENTATION_KEY'` with your actual Application Insights Instrumentation Key.

```javascript
const appInsights = require('applicationinsights');
appInsights.setup('YOUR_INSTRUMENTATION_KEY')
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .start();
```

### 3. Configure Custom Properties (Optional)

You can enrich the telemetry data by adding custom properties. This can be helpful for debugging and tracking purposes.

```javascript
const appInsightsClient = appInsights.defaultClient;
appInsightsClient.commonProperties = {
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
};
```

### 4. Create Express Middleware for Custom Telemetry

You might want to log additional telemetry for each request. Here’s a middleware example that tracks the request method and URL:

```javascript
const express = require('express');
const app = express();

// Application Insights setup
const appInsights = require('applicationinsights');
appInsights.setup('YOUR_INSTRUMENTATION_KEY').start();
const appInsightsClient = appInsights.defaultClient;

// Custom middleware to log request data
app.use((req, res, next) => {
    const telemetry = {
        method: req.method,
        url: req.url,
        startTime: new Date().toISOString()
    };

    // Log the request
    appInsightsClient.trackEvent({ name: "incomingRequest", properties: telemetry });

    // Continue to next middleware or route handler
    next();
});

// Your existing routes and middleware
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    appInsightsClient.trackException({ exception: err });
    res.status(500).send('Internal Server Error');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

### 5. Verify Data in Azure Portal

After deploying your application and generating some traffic, you can verify that telemetry data is being sent to Application Insights. 

1. Go to the Azure Portal.
2. Navigate to your Application Insights resource.
3. Check the Metrics, Logs, and Performance sections to see the incoming telemetry.

### 6. Additional Configuration

Application Insights provides many configuration options. You can customize how telemetry is collected and reported by modifying the setup call in your main application file.

```javascript
appInsights.setup('YOUR_INSTRUMENTATION_KEY')
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(true) // Enable live metrics stream
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
    .start();
```