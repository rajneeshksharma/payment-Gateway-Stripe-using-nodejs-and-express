
// replace with your stripe public and secret keys
const keyPublishable = 'Key Here ';
const keySecret = 'Key HERE ';

// import and create express object
const app = require("express")();
// import and create stripe object
const stripe = require("stripe")(keySecret);
// import pug templating engine 
const pug = require('pug');
// Node's path module, provides utilities for working with file and directory paths
const path = require('path');

const bodyParser = require('body-parser');
// support json encoded bodies
app.use(bodyParser.json()); 
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); 

// set view files directory as views
app.set('views',path.join(__dirname,'views'));
// set view engine as pug
app.set('view engine', 'pug')

// GET http://localhost:3000/
app.get("/", ((req, res) => {
    res.render("index",{keyPublishable: keyPublishable}); // render the view file : views/index.pug
}));

// POST http://localhost:3000/charge
app.post("/charge", function(req, res) {

    let amount = 5*100; // 500 cents means $5 

    // create a customer 
    stripe.customers.create({
        email: req.body.stripeEmail, // customer email, which user need to enter while making payment
        source: req.body.stripeToken // token for the given card 
    })
    .then(customer =>
        stripe.charges.create({ // charge the customer
        amount,
        description: "Sample Charge",
            currency: "usd",
            customer: customer.id
        }))
    .then(charge => res.render("charge")); // render the charge view: views/charge.pug

});

// app listening on port 3000
app.listen(3000, () => {
    console.log(`App is running at: http://localhost:3000/`);
});
