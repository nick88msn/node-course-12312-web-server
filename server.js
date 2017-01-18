//Requiring Modules
const express = require('express');
const fs = require('fs');
//view engine for dynamic templating
const hbs = require('hbs');
//dynamic port for heroku deployement
const port = process.env.PORT || 3000;
//Launching express
var app = express();
//Registering Partials Static Path
hbs.registerPartials(__dirname + '/views/partials');
//Registering Helpers
hbs.registerHelper('currentYear', ()=>{
  return new Date().getFullYear()
});
hbs.registerHelper('screamIt',(text)=>{
    return text.toUpperCase();
});
//Middleware Express
app.use(express.static(__dirname + '/public'));
app.use((req, res, next)=>{
  //Logging requests
  var now = new Date().toString();
  var log = `${now}: Method - ${req.method} : Page Requested: ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err){
      console.log('Unable to append to server.log');
    }
  });
  console.log(log);
  next();
});
//Maintanance Mode uncomment if needed
// app.use((req, res, next) =>{
//   res.render('maintenance.hbs');
// });
//Root Path Routing
app.get('/', (req, res) => {
//Res.Send example
    // res.send('<h1>Hello Express</h1>');
    // res.send({
    //   name: 'Nick',
    //   age: '22',
    //   categories: [
    //     'travel',
    //     'sport',
    //     'hiking'
    //   ]
    // });
res.render('home.hbs',{
      pageTitle: 'About Page',
      welcomeMessage: 'Welcome Home',
      // currentYear: new Date().getFullYear()        substituted with hbs.helper()
    });
});
//More Routing
app.get('/about', (req,res)=>{
    // res.send('About Page');                        substituted with hbs.partials
    res.render('about.hbs', {
      pageTitle: 'About Page',
      // currentYear: new Date().getFullYear()        substituted with hbs.helper()
    });
});
app.get('/bad', (req, res)=>{
    res.send({
      errorMessage: 'Unable to fulfill the request'
    });
});
//4. Diciamo al server di ascoltare sulla porta 3000
app.listen(port, ()=>{
  console.log('Server is up on port 3000');
});
