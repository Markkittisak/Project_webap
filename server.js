const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./dbConnection');
const router = require('./routers/router');
const dashboardRouter = require('./routers/dashboardRouter');
const employeeRouter = require('./routers/employeeRouter');
const sequelize = require('./database/connection');

const app = express();
const PORT = 4000;


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); 

app.use(session({
    secret: 'superdog',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.user = {
            typeOfAccount: 'Guest',
            name: 'Guest User',
            email: null,
            phone: null,
        };
    }
    next();
});

// Routes
app.use('/', router);
app.use('/dashboard', dashboardRouter);
app.use('/dashboard_employee', employeeRouter);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is in use. Using a random available port.`);
        app.listen(0, () => {
            console.log(`Server is running on a random port`);
        });
    }
});



