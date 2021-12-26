const PORT = process.env.PORT || 7000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const newspaperSource = require('./helpers/newspaperSource.js');

const app = express();

// newspapers to be searched
const newspapers = newspaperSource.getNewspapers();
const articles = [];

newspapers.forEach(newspaper => {
	axios.get(newspaper.address)
		.then(response => {
			const html = response.data;
			const $ = cheerio.load(html);

			$('a:contains("climate")', html).each(function () { // any <a> that contain anything with "climate"
				const title = $(this).text(); 					// <a> text
				const url = $(this).attr('href');				// <a> href attribute
				if (url != '#') {
					articles.push({
						title,
						url: (url.includes('https://twitter.com/') ? '' : newspaper.base) + url,
						source: newspaper.name
					});
				}
			});
		}).catch(err => console.log(err));
});

// HOME ROUTE
app.get('/', (req, res) => {
	res.json('Welcome to my Climate Change News API');
});

// NEWS ROUTE
app.get('/news', (req, res) => {
	res.json(articles);
});

app.get('/news/:newspaperId', (req, res) => {
	const newspaperId = req.params.newspaperId;

	const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address;
	const newspaperBase = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].base;

	axios.get(newspaperAddress)
		.then(response => {
			const html = response.data;
			const $ = cheerio.load(html);
			const newspaperArticles = [];

			$('a:contains("climate")', html).each(function () {
				const title = $(this).text();
				const url = $(this).attr('href');
				newspaperArticles.push({
					title,
					url: (url.includes('https://twitter.com/') ? '' : newspaperBase) + url,
					source: newspaperId
				});
			});
			res.json(newspaperArticles);
		}).catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));