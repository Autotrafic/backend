# autotrafic-backend

Node.js API for managing Autotrafic vehicles data.

## Scripts

-   `npm run tsc`: Compiles TypeScript files.
-   `npm run tsc:dev`: Compiles TypeScript files in watch mode.
-   `npm start`: Starts the API server.
-   `npm start:dev`: Starts the API server in watch mode with nodemon.
-   `npm run build`: Runs the TypeScript compiler.

## Utils

### Upload JSON to database collection MongoDB
`
mongoimport --uri "mongodb+srv://autotrafic:theilie4@autotraficcluster.eqsc5uf.mongodb.net/" --db vehicles-db --collection cars-collection --drop --file fuel-motorcycles.json --jsonArray
`