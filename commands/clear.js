const { clear } = require('../player/music')

module.exports = {
	name: 'clear',
	aliases: ['c'],
	description: 'Удаляет из очереди всё',
	cooldown: 1,
	async execute(message) {
		await clear(message)
	}
}