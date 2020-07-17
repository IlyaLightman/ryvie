const yandex = require('../utils/yandex')

module.exports = {
	name: 'translate',
	description: 'Список всех команд и информация о них',
	aliases: ['ts', 'tl'],
	usage: '[lang text]',
	cooldown: 5,
	async execute(message, args) {
		const lang = args.shift()
		const text = args.join(' ')

		// TODO: Валидация lang и text

		const translated = await yandex.translate(text, lang)

		message.channel.send(translated)
	}
}