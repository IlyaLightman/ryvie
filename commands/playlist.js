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
				const [access, title] = args
				const isPublic = access !== 'private'
				const owner = message.author.id

				await create(title, isPublic, owner, serverId)
				console.log(args)
				break
		}
	}
}