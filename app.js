const Express = require('express')
const app = new Express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsondoc = require("swagger-jsdoc");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require('path');
const clog = require('clog');
const cors = require('cors')
const http = require('http');
require('dotenv').config()
const config = require('config')
const status = require('http-status');
const PORT = process.env.PORT

// คำสั่งเชื่อม MongoDB Atlas
var mongo_uri = process.env.MONGO;
mongoose.Promise = global.Promise;
mongoose.connect(mongo_uri, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true }).then(
    () => {
        clog.info("[success] task 2 : connected to the database ");
    },
    error => {
        clog.error("[failed] task 2 " + error);
        process.exit();
    }
);

const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));

var dir = path.join(__dirname, 'uploads');

app.use(Express.static(dir));

const options = config.get('swaggerConfig')

const specs = swaggerJsondoc(options);
const spec = path.join(__dirname, config.get('swaggerPath').swagger);
app.use('/specs', Express.static(spec));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

new OpenApiValidator({
    apiSpec: specs,
    validateResponses: true, // <-- to validate responses
    // unknownFormats: ['my-format'] // <-- to provide custom formats
}).install(app)
    .then(() => {
        app.use('/v1', require('./src/routers'));
        //  Create an Express error handler
        app.use((err, req, res, next) => {
            //  Customize errors
            clog.error(err.toString()); // dump error to console for debug
            res.status(status.BAD_REQUEST).json({
                code: status.BAD_REQUEST,
                message: err.message,
                errors: err.errors,
            });
        });

        http.createServer(app).listen(PORT, () => clog.info(`http://localhost:${PORT}/api-docs`));
    });
