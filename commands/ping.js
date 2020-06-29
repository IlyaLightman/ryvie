module.exports = {
	name: 'ping',
	description: 'Пинг!',
	cooldown: 10,
	execute(message) {
		message.channel.send('Pong')
	}
}