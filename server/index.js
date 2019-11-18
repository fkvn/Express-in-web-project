const express = require('express');
const httpErrors = require('http-errors')
const path = require('path');
const SpeakerService = require('./services/SpeakerService')
const FeedbackService = require('./services/FeedbackService')
const bodyParser = require('body-parser')
const configs = require('./config')


const app = express();

/* Configuration */
// setting central configuration
const config = configs[app.get('env')];
const speakerService = new SpeakerService(config.data.speakers);
const feedbackService = new FeedbackService(config.data.feedback);

/* Setting up the view engine template */
app.set('view engine', 'pug');

// setting title to be available for the whole app
app.locals.title = config.sitename;

/* 
	if the product is running in development environment,
		we want the page source will display html nicely.
	
	We can change   app.locals.pretty to false 
		and check the page source in browser to see the differences
*/
if (app.get('env') === 'development') {
	app.locals.pretty = true;
}

/* Setting up the respository location for view engine*/
app.set('views', path.join(__dirname, './views'));

// in nodejs, default file for a folder is always index.js
const routes = require('./routes');

/* Middleware for static files */

// the path starts from the root folder of the application -> simply put 'client' folder
app.use(express.static('assests'))

/* Middleware for bodyParser -> receive data and store to req body */
app.use(bodyParser.urlencoded({extended: true}));

/* Middleware  for each request */

app.use((req, res, next) => {
	res.locals.rendertime = new Date();
	return next();
})

/* 
	app.get('/favicon.ico, (req, res, next) => {
		return res.sendStatus(204);
	}) 
*/


/* Middleware  for dynamic data to views engine*/
app.use(async (req,res,next) => {
	try {
		const names = await speakerService.getNames();
		res.locals.speakerNames = names;
		return next();
	} catch(err) {
		return next(err)
	}
})

/*  
	*   This looks like middleware, but it is used for the routing 
	*   This one works like a controller. 
	*   so, any URL start with '/' will be send to routes 
			and routes will take care of the rest
	*   For example: if url looks like this "localhost:3000/users"
		-> app.use will route this url to 'routes' due to '/'
		-> then 'routes' will check with its components (routing) to see if anyone handles '/users'
		-> In others word, 'routes' doesn't need to know the pre-url that given from app.
 */
app.use('/', routes( {
	speakerService,
	feedbackService
}));


/* Handle error */
// middleware
app.use((req, res, next) => {
	// first arg is err status, second one is err message
	return next(httpErrors(404, 'The page you are looking for was not found'));
})

// middleware handler with views template
app.use((err, req, res, next) => {
	// make the err message will be available for the view template
	res.locals.message = err.message;

	// err status
	res.locals.status = err.status ? err.status : 500;

	// if the product is in dev envir -> display error, otherwise display empty object
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status = res.locals.status;

	return res.render('error');
})

app.listen(3000)
module.export = app;