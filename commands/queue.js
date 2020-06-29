const { showQueue } = require('../player/music')

module.exports = {
	name: 'queue',
	aliases: ['q'],
	description: 'Очередь заказанной музыки',
	cooldown: 1,
	async execute(message) {
		await showQueue(message)
	}
}