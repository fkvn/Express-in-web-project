const express = require('express');
const router = express.Router();


module.exports = (param) => {
	const {speakerService} = param;

	router.get('/', async (req, res, next) => {
		try {
			const promises = [];
			promises.push(speakerService.getList());
			promises.push(speakerService.getAllArtwork());
	
			const results = await Promise.all(promises);
	
			// because we already set the views template (pug) in index.js (server)
			// now we just need to give the pug file name as an input for render function.
			// we can omit the extension because we also set the view engine template as pug
			return res.render('speakers', {
				page: 'All Speakers',	
				speakersList: results[0],
				artwork: results[1],
			});
		} catch(err) {
			return next(err)
		}
	});

	// to process this get, url should looks like this "localhost:3000/speakers/:name"
	// check index.js in server folder to understand the request lifecycle.
	router.get('/:name', async (req, res, next) => {
			try {
				const speaker = await speakerService.getSpeakerbyShortname(req.params.name);
				return res.render('speakers/detail', {
					page: req.params.name,
					speaker: speaker,
					artwork: speaker.artwork
				});
			} catch (err) {
				return next(err)
			}
	});

	return router;
};

