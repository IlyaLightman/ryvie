module.exports = {
	name: 'ping',
	description: 'Пинг!',
	cooldown: 10,
	execute(message) {
		message.channel.send('Pong')
		message.channel.send(message.guild.id)
	}
}