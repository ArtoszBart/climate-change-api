const PORT = 7000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express();

// newspapers to be searched
const newspapers = [
	{
		name: 'theguardian',
		address: 'https://www.theguardian.com/environment/climate-crisis',
		base: ''
	},
	{
		name: 'thetimes',
		address: 'https://www.thetimes.co.uk/environment/climate-change',
		base: ''
	},
	{
		name: 'telegraph',
		address: 'https://www.telegraph.co.uk/climate-change',
		base: 'https://www.telegraph.co.uk'
	}
];
const articles = [];

newspapers.forEach(newspaper => {
	axios.get(newspaper.address)
		.then(response => {
			const html = response.data;
			const $ = cheerio.load(html);

			$('a:contains("climate")', html).each(function () { // any <a> that contain anything with "climate"
				const title = $(this).text(); 					// <a> text
				const url = $(this).attr('href');				// <a> href attribute
				articles.push({
					title,
					url: newspaper.base + url,
					source: newspaper.name
				});
			});
		});
});

// HOME ROUTE
app.get('/', (req, res) => {
	res.json('Welcome to my Climate Change News API')
});

// NEWS ROUTE
app.get('/news', (req, res) => {
	res.json(articles);
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));