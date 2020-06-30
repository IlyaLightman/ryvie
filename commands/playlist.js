const youtubeSearcher = require('../utils/youtubeSearcher')
const { create, add } = require('../player/playlist')

module.exports = {
	name: 'playlist',
	aliases: ['pl'],
	description: 'Работа с плейлистами',
	cooldown: 1,
	async execute(message, args) {
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
			default: break
		}
	}
}