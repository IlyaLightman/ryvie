const config = require('config')

const Playlist = require('../models/Playlist')
const Server = require('../models/Server')

const create = async (title, owner, serverId, isPublic) => {
	try {
		const server = await Server.findOne({ id: serverId })

		const oldPlaylist = server.playlists.find(p => p.title === title)
		if (oldPlaylist) return `Плейлист ${title} уже существует на этом сервере`

		const maxPlaylists = server.premium ?
			config.get('PREMIUM_MAX_PLAYLISTS') : config.get('MAX_PLAYLISTS')

		// const maxMusic = server.premium ?
		// 	config.get('PREMIUM_MAX_MUSIC_IN_PLAYLIST') : config.get('MAX_MUSIC_IN_PLAYLIST')

		if (server.playlists.length >= maxPlaylists) return `На сервере достигнут лимит плейлистов.
		 ${server.premium ? '' : ' Вы можете купить Premium подписку и увеличить количество плейлистов'}`

		const newPlaylist = new Playlist({
			title, owner, isPublic, music: []
		})

		server.playlists.push(newPlaylist)

		await server.save()

		return `Плейлист ${title} успешно создан`
	} catch (err) {
		console.log(err)
		return `При создании плейлиста произошла ошибка. Попробуйте позже :(`
	}
}

module.exports = {}