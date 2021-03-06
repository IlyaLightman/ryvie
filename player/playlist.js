const { MessageEmbed } = require('discord.js')
const config = require('config')

// const Playlist = require('../models/Playlist')
const Server = require('../models/Server')

const musicPlayer = require('./music')

const isAdmin = async (userId, serverId) => {
	try {
		const server = await Server.findOne({ id: serverId })

		return server.admins.contains(userId)
	} catch (err) {
		console.log('Playlist/isAdmin', err)
		return false
	}
}

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
		console.log('Playlist/create', err)
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
		console.log('Playlist/add', err)
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
		console.log('Playlist/show', err)
		return `Произошла ошибка. Попробуйте позже :(`
	}
}

const play = async (title, serverId, message) => {
	try {
		const server = await Server.findOne({ id: serverId })

		const playlist = server.playlists.find(p => p.title === title)
		if (!playlist) return new MessageEmbed()
			.setTitle('Такого плейлиста нет!')
			.setColor(0xff0000)
			.setDescription(`Плейлист ${title} не найден на этом сервере`)

		for (const song of playlist.songs) {
			await musicPlayer.add(message, song.url)
		}

		// playlist.songs.forEach(song => {
		// 	musicPlayer.add(message, song.url)
		// })
	} catch (err) {
		console.log('Playlist/play', err)
		return `Произошла ошибка. Попробуйте позже :(`
	}
}

const a = async (title, songNumber, serverId, message) => {
	try {
		const server = await Server.findOne({ id: serverId })

		const playlist = server.playlists.find(p => p.title === title)
		if (!playlist) return new MessageEmbed()
			.setTitle('Такого плейлиста нет!')
			.setColor(0xff0000)
			.setDescription(`Плейлист ${title} не найден на этом сервере`)

		if (songNumber > playlist.songs.length) return new MessageEmbed()
			.setTitle('Нет такого!')
			.setColor(0xff0000)
			.setDescription(`В плейлисте ${title} меньше музыки :(`)

		const song = playlist.songs[songNumber - 1]

		await musicPlayer.add(message, song.url)
	} catch (err) {
		console.log('Playlist/a', err)
		return `Произошла ошибка. Попробуйте позже :(`
	}
}

const rem = async (title, songNumber, user, serverId) => {
	try {
		const server = await Server.findOne({ id: serverId })

		const playlist = server.playlists.find(p => p.title === title)
		if (!playlist) return new MessageEmbed()
			.setTitle('Такого плейлиста нет')
			.setColor(0xff0000)
			.setDescription(`Плейлист ${title} не найден на этом сервере :(`)

		if (!(playlist.isPublic || playlist.owner === user)) return new MessageEmbed()
			.setTitle('У вас нет прав на редактирование этого плейлиста')
			.setColor(0xff0000)
			.setDescription(`Вы не можете.... не можете :(`)

		if (songNumber > playlist.songs.length) return new MessageEmbed()
			.setTitle('Нет такого :(')
			.setColor(0xff0000)
			.setDescription(`В плейлисте ${title} меньше музыки`)

		playlist.songs.splice(songNumber - 1, 1)

		await server.save()

		return new MessageEmbed()
			.setTitle('Удалено!')
			.setColor(0x228b22)
			.setDescription(`Из плейлиста ${title}`)
	} catch (err) {
		console.log('Playlist/rem', err)
		return `Произошла ошибка. Попробуйте позже :(`
	}
}

const clear = async (title, user, serverId) => {
	try {
		const server = await Server.findOne({ id: serverId })

		const playlist = server.playlists.find(p => p.title === title)
		if (!playlist) return new MessageEmbed()
			.setTitle('Такого плейлиста нет!')
			.setColor(0xff0000)
			.setDescription(`Плейлист ${title} не найден на этом сервере :(`)

		if (!(playlist.isPublic || playlist.owner === user)) return new MessageEmbed()
			.setTitle('У вас нет прав на очистку этого плейлиста')
			.setColor(0xff0000)
			.setDescription(`Вы не можете.... не можете :(`)

		playlist.songs = []

		await server.save()

		return new MessageEmbed()
			.setTitle('Очищено :)')
			.setColor(0x228b22)
			.setDescription(`В плейлисте ${title} больше ничего нет`)
	} catch (err) {
		console.log('Playlist/clear', err)
		return `Произошла ошибка. Попробуйте позже :(`
	}

}

const del = async (title, user, serverId) => {
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
			.setDescription(`Плейлист ${title} не найден на этом сервере :(`)

		const isCurrentUserAdmin = await isAdmin(user, serverId)

		if (!(playlist.isPublic || playlist.owner === user || isCurrentUserAdmin)
		) return new MessageEmbed()
			.setTitle('У вас нет прав на удаление этого плейлиста')
			.setColor(0xff0000)
			.setDescription(`Вы не можете.... не можете!`)

		server.playlists.splice(currentPlaylistNumber, 1)

		await server.save()
	} catch (err) {
		console.log('Playlist/del', err)
		return `Произошла ошибка. Попробуйте позже :(`
	}
}

module.exports = {
	create, add, show, play, a, rem, clear, del
}