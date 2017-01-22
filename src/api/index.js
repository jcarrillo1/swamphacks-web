import axios from 'axios';

export const giphySearch = (terms) => new Promise((resolve, reject) => {
	const query = `${terms[0]}+${terms[1]}+${terms[2]}+meme`;
	const searchUrl = `http://api.giphy.com/v1/gifs/search`
	axios.get(searchUrl, {
		params: {
			q: query,
			api_key: 'dc6zaTOxFJmzC',
		},
	})
		.then(response => response.data.data)
		.then(data => data.map(objs => objs.images.original.url))
		.then(urls => resolve(urls))
		.catch(err => reject(err));
});

export const spotifySearch = (terms) => new Promise((resolve, reject) => {
	const searchUrl = 'https://api.spotify.com/v1/search';
	axios.get(searchUrl, {
		params: {
			q: terms[0],
			type: 'track',
		}
	}).then(response => response.data.tracks)
		.then(tracks => {
			let trackUrl = '';
			const { items } = tracks;
			if (items && items.length > 0) {
				trackUrl = items[0].preview_url;
			}
			resolve(trackUrl);
		})
		.catch(err => reject(err));
})
