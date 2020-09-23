module.exports = {
	name: 'ryvie',
	description: 'Ryvie Controlling Panel',
	cooldown: 10,
	execute(message, messageServer, args) {
		const authorId = message.author.id
		const authorRoles = message.guild.member(message.author)._roles

		const controlSettings = messageServer.ryvieControlling

		const access =
			authorRoles.filter(x =>
				controlSettings.controlRoles.includes(x)).length > 0
			|| controlSettings.admins.includes(authorId)

		if (!access) return message.channel.send('*Access Denied*')

		// Basic Ryvie controlling

		const action = args[0]

		console.log(action)
	}
}