const youtubeSearcher = require('../utils/youtubeSearcher')
const {
	create, add, show,
	play, a, rem,
	clear, del } = require('../player/playlist')

module.exports = {
	name: 'playlist',
	aliases: ['pl'],
	description: 'Работа с плейлистами',
	cooldown: 1,
	async execute(message, messageServer, args) {
		const command = args.shift()

		const serverId = message.guild.id
		const userId = message.author.id

		switch (command) {
			case 'create':
				// access = private/public
				const [access, create_title] = args
				const isPublic = access !== 'private'

				const create_response = await create(create_title, isPublic, userId, serverId)

				message.channel.send(create_response)
				break
			case 'add':
				const [add_title, ...query] = args

				const { url, title } = await youtubeSearcher(query)
				const song = { url, title }

				const add_response = await add(add_title, song, userId, serverId)

				message.channel.send(add_response)
				break
			case 'show':
				const [show_title] = args

				const show_response = await show(show_title, serverId)

				message.channel.send(show_response)
				break
			case 'play':
				const [play_title] = args

				await play(play_title, serverId, message)
				break
			case 'a':
				const [a_title, a_number] = args

				await a(a_title, a_number, serverId, message)
				break
			case 'rem':
				const [rem_title, rem_number] = args

				const rem_response =
					await rem(rem_title, rem_number, userId, serverId)

				message.channel.send(rem_response)
				break
			case 'clear':
				const [clear_title] = args

				const clear_response =
					await clear(clear_title, userId, serverId)

				message.channel.send(clear_response)
				break
			case 'del':
				const [del_title] = args

				const del_response =
					await del(del_title, userId, serverId)

				message.channel.send(del_response)
				break
			default: break
		}
	}
}