const express = require('express');
const router = express.Router();

const speakersRoute = require('./speakers')
const feedbackRoute = require('./feedback')

module.exports = (param) => {
	const {speakerService} = param;
	const {feedbackService} = param;

	router.get('/', async (req, res, next) => {
		try {
			const promises = [];
			promises.push(speakerService.getListShort());
			promises.push(speakerService.getAllArtwork());
	
			const results = await Promise.all(promises);
	
			// because we already set the views template (pug) in index.js (server)
			// now we just need to give the pug file name as an input for render function.
			// we can omit the extension because we also set the view engine template as pug
			return res.render('index', {
					page: 'Home',
					speakersList: results[0],
					artwork: results[1],
			});
		} catch(err) {
			return next(err)
		}
	});

	router.use('/speakers', speakersRoute( {
		speakerService
	}));
	router.use('/feedback', feedbackRoute({
		feedbackService
	}));

	return router;
};

