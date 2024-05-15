import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import morgan from "morgan";
import session from "express-session";
import env from "./util/validateEnv";
import createHttpError, {isHttpError} from "http-errors";
import MongoStore from "connect-mongo";
import {requiresAuth} from "./middleware/auth";


const app = express();

app.use(morgan("dev"));

// This basically set up express so that it accepts JSON bodies
app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGODB_URL
    }),
}));

app.use("/api/users", userRoutes);
app.use("/api/notes", requiresAuth, notesRoutes);

// we want to forward this endpoint to notedRoutes; this is a middle ware that catches any request
// that goes to this endpoint which then checks the notes routes endpoints we have set up ,
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});



// This is the Error handler
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;