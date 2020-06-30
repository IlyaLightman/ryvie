const youtubeSearcher = require('../utils/youtubeSearcher')
const { create } = require('../player/playlist')

module.exports = {
	name: 'playlist',
	aliases: ['pl'],
	description: 'Работа с плейлистами',
	cooldown: 1,
	async execute(message, args) {
		const command = args.shift()

		const serverId = message.guild.id

		switch (command) {
			case 'create':
				// access = private/public
				const [access, create_title] = args
				const isPublic = access !== 'private'
				const owner = message.author.id

				const response = await create(create_title, isPublic, owner, serverId)

				message.channel.send(response)
				break
			case 'add':
				const [add_title, query] = args

				const { url, title } = youtubeSearcher(query)
				const song = { url, title }


				break
			default: break
		}
	}
}