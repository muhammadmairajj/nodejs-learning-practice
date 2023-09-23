const express = require("express");
const morgan = require('morgan');
const notesRouter = require("./routes/notes-routes");
const userRouter = require("./routes/user-routes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')


const app = express();

// Middleware
app.use(express.json({limit: "10kb"}));
app.use(morgan('dev'));
app.use(helmet());
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: "Too many requests from the IP, please try again in 15 minutes"
});
app.use("/api", apiLimiter);
app.use(sanitize());
app.use(xss())

app.use("/api/notes", notesRouter);
app.use("/api", userRouter);
app.use(express.static(`${__dirname}/public`));
// Use Helmet


app.all("*", (req, res) => {
    res.status(404).send("<h1>Page Not Found || 404</h1>");
})

module.exports = app;


