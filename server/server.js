// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const PORT        = 7000; // 9124;                 // Set a port number at the top so it's easy to change in the future

var cors = require('cors')
app.use(cors())

// Database
var db = require('./database/db-connector');

/*
    ROUTES
*/
app.get('/home', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        res.send("The server is running!");     // This function literally sends the string "The server is running!" to the computer
    });                                         // requesting the web site.


// ---------------------------------------------------------------------------------------------------------------------------------
// CRUD Routes for Adopters
// ---------------------------------------------------------------------------------------------------------------------------------
app.get('/', function(req, res)
    {
        // Define our queries
        const query1 = 'DROP TABLE IF EXISTS diagnostic;';
        const query2 = 'CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);';
        const query3 = 'INSERT INTO diagnostic (text) VALUES ("MySQL is working!")';
        const query4 = 'SELECT * FROM diagnostic;';

        // Execute every query in an asynchronous manner, we want each query to finish before the next one starts

        // DROP TABLE...
        db.pool.query(query1, function (err, results, fields){

            // CREATE TABLE...
            db.pool.query(query2, function(err, results, fields){

                // INSERT INTO...
                db.pool.query(query3, function(err, results, fields){

                    // SELECT *...
                    db.pool.query(query4, function(err, results, fields){

                        // Send the results to the browser
                        const base = "<h1>MySQL Results:</h1>";
                        res.send(base + JSON.stringify(results));
                    });
                });
            });
        });
    });
	
// READ all Adopters
app.get('/adopters', function(req, res)
    {
        // Define our queries
        const selectAllAdoptersQuery = 'SELECT * FROM Adopters;';

        // Execute every query in an asynchronous manner, we want each query to finish before the next one starts

        // SELECT * FROM Adopters
        db.pool.query(selectAllAdoptersQuery, function (err, results, fields){
			
            //DEBUG MESSAGE
			//console.log(`All rows from Adopter\n`);
			//console.log(results[0]);
			//console.log(results[0]['first_name']);

			res.send(JSON.stringify(results));

        });
    });
	
	
// CREATE new Adopter
app.post('/adopter', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    const data = req.body;

    //DEBUG MESSAGE
    // console.log(`req.body received for new adopter:\n ${JSON.stringify(data)}`);
    // console.log(`req.query received for new adopter:\n ${JSON.stringify(req.query)}`);
    // console.log(`first_name: ${data['first_name']}`);
    // console.log(`last_name: ${data['last_name']}`);
    // console.log(`address: ${data['address']}`);
    // console.log(`phone_number: ${data['phone_number']}`);
    // console.log(`email: ${data['email']}`);
    // console.log(`birth_date: ${data['birth_date']}`);

    // Capture NULL values
    // let homeworld = parseInt(data['input-homeworld']);
    // if (isNaN(homeworld))
    // {
    //     homeworld = 'NULL'
    // }

    // let age = parseInt(data['input-age']);
    // if (isNaN(age))
    // {
    //     age = 'NULL'
    // }

    // Create the query and run it on the database
    
    //query1 = `INSERT INTO bsg_people (fname, lname, homeworld, age) VALUES ('${data['input-fname']}', '${data['input-lname']}', ${homeworld}, ${age})`;
    const insertAdopterQuery = `INSERT INTO Adopters (first_name, last_name, address, phone_number, email, birth_date) VALUES ('${data['first_name']}', '${data['last_name']}', '${data['address']}', '${data['phone_number']}', '${data['email']}', '${data['birth_date']}')`;
    db.pool.query(insertAdopterQuery, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.sendStatus(201);
        }
    })
})

app.delete('/adopter', function(req, res){                                                                
    let data = req.body;
    //let personID = parseInt(data._id);
    //let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
    //let deleteBsg_People= `DELETE FROM bsg_people WHERE id = ?`;

    let adopter_id = parseInt(data.adopter_id);
    let deleteAdopterQuery = `DELETE FROM Adopters WHERE adopter_id = ${adopter_id}`;

    //DEBUG MESSAGE
    //console.log(`req.body received for delete adopter: ${JSON.stringify(data)}`);
    //console.log(`adopter_id received for delete adopter: ${adopter_id}`);
    //res.sendStatus(201);
  
          // Run the delete query
          db.pool.query(deleteAdopterQuery, function(error, rows, fields){
              if (error) {
  
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
            }
        )
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});