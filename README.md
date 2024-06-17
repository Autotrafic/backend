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
mongoimport --uri <MONGO_URL> --db <DATABASE_NAME> --collection <COLLECTION_NAME> --drop --file <GENERATED_FILES_NAME> --jsonArray
`

Example:
`
mongoimport --uri "mongodb+srv://autotrafic:autotrafic@autotraficcluster.eqsc5uf.mongodb.net/" --db vehicles --collection cars --drop --file fuel-motorcycles.json --jsonArray
`