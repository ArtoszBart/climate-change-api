const PORT = process.env.PORT || 7000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express();

// newspapers to be searched
const newspapers = [
	{
		name: 'cityam',
		address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
		base: ''
	},
	{
		name: 'thetimes',
		address: 'https://www.thetimes.co.uk/environment/climate-change',
		base: ''
	},
	{
		name: 'theguardian',
		address: 'https://www.theguardian.com/environment/climate-crisis',
		base: '',
	},
	{
		name: 'telegraph',
		address: 'https://www.telegraph.co.uk/climate-change',
		base: 'https://www.telegraph.co.uk',
	},
	{
		name: 'nyt',
		address: 'https://www.nytimes.com/international/section/climate',
		base: 'https://www.nytimes.com',
	},
	{
		name: 'latimes',
		address: 'https://www.latimes.com/environment',
		base: '',
	},
	{
		name: 'smh',
		address: 'https://www.smh.com.au/environment/climate-change',
		base: 'https://www.smh.com.au',
	},
	{
		name: 'un',
		address: 'https://www.un.org/climatechange',
		base: '',
	},
	{
		name: 'bbc',
		address: 'https://www.bbc.co.uk/news/science_and_environment',
		base: 'https://www.bbc.co.uk',
	},
	{
		name: 'es',
		address: 'https://www.standard.co.uk/topic/climate-change',
		base: 'https://www.standard.co.uk'
	},
	{
		name: 'sun',
		address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
		base: ''
	},
	{
		name: 'dm',
		address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
		base: ''
	},
	{
		name: 'nyp',
		address: 'https://nypost.com/tag/climate-change/',
		base: ''
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
				if (url != '#') {
					articles.push({
						title,
						url: (url.includes('https://twitter.com/') ? '' : newspaper.base) + url,
						source: newspaper.name
					});
				}
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
					url: newspaperBase + url,
					source: newspaperId
				});
			});
			res.json(newspaperArticles);
		}).catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));