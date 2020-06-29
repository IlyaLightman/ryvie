const { play } = require('../player/music')

module.exports = {
	name: 'play',
	aliases: ['p'],
	description: 'Пропускает музыку в очереди',
	cooldown: 1,
	async execute(message, args) {
		await play(message, args[0])
	}
}