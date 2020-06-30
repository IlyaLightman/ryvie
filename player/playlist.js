const config = require('config')

const Playlist = require('../models/Playlist')
const Server = require('../models/Server')

const create = async (title, isPublic, owner, serverId) => {
	try {
		const server = await Server.findOne({ id: serverId })

		const oldPlaylist = server.playlists.find(p => p.title === title)
		if (oldPlaylist) return `Плейлист *${title}* уже существует на этом сервере`

		const maxPlaylists = server.premium ?
			config.get('PREMIUM_MAX_PLAYLISTS') : config.get('MAX_PLAYLISTS')

		if (server.playlists.length >= maxPlaylists) return `На сервере достигнут лимит плейлистов.
		 ${server.premium ? '' : ' Вы можете купить **Premium** подписку и увеличить количество плейлистов'}`

		const newPlaylist = new Playlist({
			title, owner, isPublic, music: []
		})

		server.playlists.push(newPlaylist)

		await server.save()

		return `${isPublic ? 'Публичный' : 'Приватный'} плейлист *${title}* успешно создан`
	} catch (err) {
		console.log(err)
		return `При создании плейлиста произошла ошибка. Попробуйте позже :(`
	}
}

const add = async (title, song, user, serverId) => {
	try {
		const server = await Server.findOne({ id: serverId })

		const playlist = server.playlists.find(p => p.title === title)
		if (!playlist) return `Плейлист ${title} не найден на этом сервере`

		if (!(playlist.isPublic || playlist.owner === user)) return `У вас нет прав на редактирование этого плейлиста`

		const maxMusic = server.premium ?
			config.get('PREMIUM_MAX_MUSIC_IN_PLAYLIST') : config.get('MAX_MUSIC_IN_PLAYLIST')

		if (maxMusic >= playlist.songs.length) return `В плейлисте достигнут лимит музыки.
		${server.premium ? '' : ' Вы можете купить **Premium** подписку и увеличить количество музыки'}`

		playlist.songs.push(song)

		await server.save()

		return `${song.title} успешно добавлено в плейлист ${playlist.title}`
	} catch (err) {

	}
}

module.exports = {
	create, add
}