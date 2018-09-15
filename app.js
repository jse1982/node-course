const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

let app = express();

// set config
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// custom middleware

app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url} ${req.ip}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

app.use((req,res,next) =>
{
    res.render('maintenance.hbs');
})

app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (t) => t.toUpperCase());

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'This is the page title',
        title: 'Homepage losers',
        welcome: 'This is the welcome text, dynamic shiz too',
        currentYear: new Date().getFullYear()
    });
});

app.get('/bah', (req, res) => {
    let obj = { test: 'yeah', testing: 'whatever'};
    res.send(obj);
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title: 'Dynamic title goes here',
        currentYear: new Date().getFullYear()
    });
});

app.get('/bad', (req, res) => {
    res.send({
        error: 'Page failed to load because you are an idiot, idiot'
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
