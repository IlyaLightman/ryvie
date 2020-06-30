const { MessageEmbed } = require('discord.js')
const ytdl = require('ytdl-core')

const queue = new Map()
let serverQueue = null

const setPlayer = message => {
	serverQueue = queue.get(message.guild.id)
}

const add = async (message, youtube) => {
	setPlayer(message)
	const voiceChannel = message.member.voice.channel

	const songInfo = await ytdl.getInfo(youtube)
	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
		length: songInfo.length_seconds
	}

	if (!serverQueue) {
		const queueContract = {
			textChannel: message.channel,
			voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		}

		queue.set(message.guild.id, queueContract)
		queueContract.songs.push(song)

		try {
			if (!queueContract.connection) {
				queueContract.connection = await voiceChannel.join()
			}
			playStream(message, queueContract.songs[0])
		} catch (err) {
			console.log(err)
			queue.delete(message.guild.id)
			return message.channel.send('Произошла ошибка (player/music/add)')
		}
	} else {
		serverQueue.songs.push(song)
		// console.log(serverQueue.songs)
		return message.channel.send(`**${song.title}** *добавлено в очередь!*`)
	}
}

const playStream = (message, song) => {
	const guild = message.guild
	const serverQueue = queue.get(guild.id)

	if (!song) {
		serverQueue.voiceChannel.leave()
		queue.delete(guild.id)
		return
	}

	const dispatcher = serverQueue.connection.play(ytdl(song.url), {
		quality: 'highestaudio'
	})
		.on('end', () => {
			// console.log('The end')
			serverQueue.songs.shift()
			playStream(message, serverQueue.songs[0])
		})
		.on('error', () => {
			console.error()
		})
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)

	const msg = `**${song.title}** *играет сейчас*`
	message.channel.send(msg)
}

const skip = message => {
	setPlayer(message)
	if (!message.member.voice.channel) return message.channel.send(
		'*Вы должны находиться в голосовом канале*')
	if (!serverQueue) return message.channel.send(
		'*Нечего скипать...*'
	)

	serverQueue.connection.dispatcher.emit('end')
}

const clear = message => {
	setPlayer(message)
	if (!message.member.voice.channel) return message.channel.send(
		'*Вы должны находиться в голосовом канале*')
	serverQueue.songs = []

	serverQueue.connection.dispatcher.emit('end')
}

const play = (message, number) => {
	setPlayer(message)

	if (!serverQueue.songs[number]) return message.channel.send(
		'*В очереди нет такой песни*')

	message.channel.send(
		`*Выбранная песня:* **${serverQueue.songs[number - 1].title}**`)

	const setSong = serverQueue.songs[number - 1]
	playStream(message, setSong)
}

const showQueue = message => {
	setPlayer(message)

	let msg = ''
	if (!serverQueue) { msg = 'Очередь пуста :(' } else {
		serverQueue.songs.forEach((song, index) => {
			msg += `\n**${index + 1})** [${normalizeSeconds(song.length)}]  *${song.title}*`
		})
	}

	const queueMessage = new MessageEmbed()
		// Set the title of the field
		.setTitle('Очередь прослушивания')
		// Set the color of the embed
		.setColor(!serverQueue ? 0xff0000 : 0x228b22)
		// Set the main content of the embed
		.setDescription(msg);
	// Send the embed to the same channel as the message
	message.channel.send(queueMessage);
}

const normalizeSeconds = seconds => {
	const min = Math.floor(seconds / 60)
	const sec = seconds - min * 60

	return `${min}:${sec}`
}

module.exports = {
	setPlayer, add, skip, clear, showQueue, play
}