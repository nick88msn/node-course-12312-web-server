//1. Richiamiamo express
const express = require('express');
//15. Richiamiamo fs per scrivere il file di log
const fs = require('fs');
//9. Richiamiamo il view engine per il dynamic templating
const hbs = require('hbs');
//2. Creiamo un nuovo processo lanciando express
var app = express();
//10. aggiungiamo il percorso ai partials per riutilizzare porzioni di codice markup
hbs.registerPartials(__dirname + '/views/partials');
//11. registriamo un helper per la funzione data
hbs.registerHelper('currentYear', ()=>{
  return new Date().getFullYear()
});
hbs.registerHelper('screamIt',(text)=>{
    return text.toUpperCase();
});
//7. aggiungiamo middleware per indicare una cartella statica
app.use(express.static(__dirname + '/public'));
//12. Express Middleware (next indicherà quando termina questo middleware)
app.use((req, res, next)=>{
  //creiamo un logger nel nostro middleware appena registrato
  var now = new Date().toString();
  var log = `${now}: Method - ${req.method} : Page Requested: ${req.url}`;
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err){
      console.log('Unable to append to server.log');
    }
  });
  console.log(log);
  //se non inseriamo next() l'handler non riesce a chiudere la chiamata in get lasciano il sito in caricamento perpetuo
  next();
});
//16. Modalità Manutenzione (renderizza e resta sempre qui dentro non essendoci next)
// app.use((req, res, next) =>{
//   res.render('maintenance.hbs');
// });
//3. Un po' di routing base. Se arriva una richiesta alla root path indichiamo la risposta
app.get('/', (req, res) => {
    // res.send('<h1>Hello Express</h1>');
    // res.send({
    //   name: 'Nicola',
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
      // currentYear: new Date().getFullYear()        sostituito con hbs.helper()
    });
});
//5. andiamo su chrome localhost:3000 e ispezioniamo dev tools
//6. gestiamo il routing verson un'altra pagina
app.get('/about', (req,res)=>{
    // res.send('About Page');
    res.render('about.hbs', {
      pageTitle: 'About Page',
      // currentYear: new Date().getFullYear()
    });
});
app.get('/bad', (req, res)=>{
    res.send({
      errorMessage: 'Unable to fulfill the request'
    });
});
//4. Diciamo al server di ascoltare sulla porta 3000
app.listen(3000, ()=>{
  console.log('Server is up on port 3000');
});
