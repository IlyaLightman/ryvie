const { MessageEmbed } = require('discord.js')
const config = require('config')

// const Playlist = require('../models/Playlist')
const Server = require('../models/Server')

const create = async (title, isPublic, owner, serverId) => {
	try {
		const server = await Server.findOne({ id: serverId })

		const oldPlaylist = server.playlists.find(p => p.title === title)
		if (oldPlaylist) return new MessageEmbed()
			.setTitle('Плейлист уже существует')
			.setColor(0xff0000)
			.setDescription(`Плейлист *${title}* уже существует на этом сервере`)

		const maxPlaylists = server.premium ?
			config.get('PREMIUM_MAX_PLAYLISTS') : config.get('MAX_PLAYLISTS')

		if (server.playlists.length >= maxPlaylists) return new MessageEmbed()
			.setTitle('На сервере достигнут лимит плейлистов')
			.setColor(0xff0000)
			.setDescription(server.premium ?
				':(' : 'Вы можете купить **Premium** подписку и увеличить количество плейлистов')

		// const newPlaylist = new Playlist({
		// 	title, owner, isPublic, songs: []
		// })

		const newPlaylist = {
			title, owner, isPublic, songs: []
		}

		server.playlists.push(newPlaylist)

		await server.save()

		return new MessageEmbed()
			.setTitle('Плейлист успешно создан')
			.setColor(0x3deb3d)
			.setDescription(`${isPublic ? 'Публичный' : 'Приватный'} плейлист *${title}* успешно создан`)
	} catch (err) {
		console.log(err)
		return `При создании плейлиста произошла ошибка. Попробуйте позже :(`
	}
}

const add = async (title, song, user, serverId) => {
	try {
		const server = await Server.findOne({ id: serverId })

		let currentPlaylistNumber = 0
		const playlist = server.playlists.find((p, index) => {
			currentPlaylistNumber = index
			return p.title === title
		})

		if (!playlist) return new MessageEmbed()
			.setTitle('Такого плейлиста нет!')
			.setColor(0xff0000)
			.setDescription(`Плейлист ${title} не найден на этом сервере`)

		if (!(playlist.isPublic || playlist.owner === user)) return new MessageEmbed()
			.setTitle('У вас нет прав на редактирование этого плейлиста')
			.setColor(0xff0000)
			.setDescription(`Вы не можете добавлять в этот плейлист музыку :(`)

		const maxMusic = server.premium ?
			config.get('PREMIUM_MAX_MUSIC_IN_PLAYLIST') : config.get('MAX_MUSIC_IN_PLAYLIST')

		if (maxMusic <= playlist.songs.length) return new MessageEmbed()
			.setTitle('В плейлисте достигнут лимит музыки')
			.setColor(0xff0000)
			.setDescription(server.premium ?
				':(' : ' Вы можете купить **Premium** подписку и увеличить количество музыки')

		playlist.songs.push(song)

		await server.save()

		return new MessageEmbed()
			.setColor(0x3deb3d)
			.setDescription(`*${song.title}* успешно добавлено в плейлист **${playlist.title}**`)
	} catch (err) {
		console.log(err)
		return `При добавлении произошла ошибка. Попробуйте позже :(`
	}
}

const show = async (title, serverId) => {
	try {
		const server = await Server.findOne({ id: serverId })

		const playlist = server.playlists.find(p => p.title === title)
		if (!playlist) return new MessageEmbed()
			.setTitle('Такого плейлиста нет!')
			.setColor(0xff0000)
			.setDescription(`Плейлист ${title} не найден на этом сервере`)

		let message = ''
		playlist.songs.forEach((song, index) => {
			message += `${index + 1}) *${song.title}* \n`
		})
		return new MessageEmbed()
			.setTitle(`Плейлист ${playlist.title}`)
			.setColor(0x228b22)
			.setDescription(message)
	} catch (err) {
		console.log(err)
		return `Произошла ошибка. Попробуйте позже :(`
	}
}

module.exports = {
	create, add, show
}