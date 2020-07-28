const Express = require('express')
const app = new Express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsondoc = require("swagger-jsdoc");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require('path');
const clog = require('clog');
const http = require('http');
require('dotenv').config()
const config = require('config')
const PORT = process.env.PORT

// คำสั่งเชื่อม MongoDB Atlas
var mongo_uri = "mongodb+srv://admin:9B70df4910@cluster0.8hmsb.mongodb.net/ShopAdmin?retryWrites=true&w=majority";
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


app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));




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
            console.error(err); // dump error to console for debug
            res.status(err.status || 500).json({
                message: err.message,
                errors: err.errors,
            });
        });

        http.createServer(app).listen(PORT, () => clog.info(`http://localhost:${PORT}/api-docs`));
    });





// app.listen(3000);
