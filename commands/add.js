const { add } = require('../player/music')
const youtubeSearcher = require('../utils/youtubeSearcher')

module.exports = {
	name: 'add',
	aliases: ['a'],
	description: 'Добавляет музыку в очередь прослушивания',
	cooldown: 1,
	async execute(message, messageServer, args) {
		const url = (await youtubeSearcher(args)).url

		await add(message, url)
	}
}