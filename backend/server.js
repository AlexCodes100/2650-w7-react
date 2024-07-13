import "dotenv/config.js";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { typeDefs, resolvers } from "./graphql/schema.js";
import indexRouter from "./routes/index.js";
import notesRouter from "./routes/notes.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure CORS
app.use(cors());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Use routers
app.use("/notes", notesRouter);

// Initialize Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' });

  app.use(function (req, res, next) {
    next(createError(404));
  });

  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500).json({
      message: err.message,
      error: req.app.get("env") === "development" ? err : {},
    });
  });

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
    console.log(`GraphQL endpoint at http://localhost:${port}${server.graphqlPath}`);
  });
});
