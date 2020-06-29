const { skip } = require('../player/music')

module.exports = {
	name: 'skip',
	aliases: ['s'],
	description: 'Пропускает песню в очереди',
	cooldown: 1,
	async execute(message) {
		await skip(message)
	}
}