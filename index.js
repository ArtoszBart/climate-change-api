const PORT = 7000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const articles = [];

// HOME ROUTE
app.get('/', (req, res) => {
	res.json('Welcome to my Climate Change News API')
});

// NEWS ROUTE
app.get('/news', (req, res) => {
	axios.get('https://www.theguardian.com/environment/climate-crisis')
		.then((response) => {
			const html = response.data;
			const $ = cheerio.load(html);

			$('a:contains("climate")', html).each(function () { 	// any <a> that contain anything with "climate"
				const title = $(this).text(); 					// <a> text
				const url = $(this).attr('href');				// <a> href attribute
				articles.push({
					title,
					url
				});
			});
			res.json(articles);
		}).catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));