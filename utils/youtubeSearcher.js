const { validateURL } = require('ytdl-core')
const youtube = require('simple-youtube-api')
const config = require('config')

const YouTube = new youtube(config.get('YOUTUBE_TOKEN'))

const youtubeSearcher = async args => {
	let url = args[0]
	let title = ''
	if (!urlChecker(args[0])) {
		let request = ''
		args.forEach(arg => request += `${arg} `)

		await YouTube.searchVideos(request, 1)
			.then(results => {
				url = results[0].url
				title = results[0].title
			})
	}

	return { url, title }
}

const urlChecker = url => {
	return validateURL(url)
}

module.exports = youtubeSearcher