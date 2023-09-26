let SERVER_NAME = 'product-api'
let PORT = 3000;
let HOST = '127.0.0.1';

let postCount = 0;
let getCount =0;

let errors = require('restify-errors');
let restify = require('restify')

  // Get a persistence engine for the products
  , productsSave = require('save')('products')
  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

   //Log request and response information
   server.use((req, res, next) => {
    console.log(`${req.method} ${req.url}: received request`);
    next();
  });

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log('********************')
  console.log('/products');
  console.log('/products/:id');
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all products in the system
server.get('/products', function (req, res, next) {
  console.log('GET /products params=>' + JSON.stringify(req.params));
  getCount++;
  console.log('GET:' + getCount, 'POST: ' + postCount)

// Find every entity within the given collection
productsSave.find({}, function (error, products) {

// Return all of the products in the system
res.send(products)
console.log(`${req.method} ${req.url}: sending response`);
    console.log('GET /products: all products retrieved')
  })
})

// Get a single product by their product id
server.get('/products/:id', function (req, res, next) {
    console.log('GET /products/:id params=>' + JSON.stringify(req.params));
    getCount++;
    console.log('GET:' + getCount, 'POST: ' + postCount)
  
    // Find a single product by their id within save
    productsSave.findOne({ _id: req.params.id }, function (error, product) {
  
      // If there are any errors, pass them to next in the correct format
      if (error) {
        return next(new Error(JSON.stringify(error.errors)))
      }
  
      console.log(`${req.method} ${req.url}: sending response`);
  
      if (product) {
        // Send the product if no issues
        res.send(product)
        console.log('GET /products/:id: retrieved a product')
      } else {
        // Send 404 header if the product doesn't exist
        res.send(404)
      }
    })
  })


