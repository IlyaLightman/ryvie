const yandex = require('../utils/yandex')
const { MessageEmbed } = require('discord.js')
const Server = require('../models/Server')

module.exports = {
	name: 'translate',
	description: 'Список всех команд и информация о них',
	aliases: ['ts', 'tl'],
	usage: '[lang text]',
	cooldown: 5,
	async execute(message, args) {
		const server = await Server.findOne({ id: message.guild.id })

		if (!server.premium) {
			return message.channel.send(new MessageEmbed()
				.setTitle('Это премиум функция :(')
				.setColor(0xff0000)
				.setDescription(
					`Чтобы поолучить доступ к переводчику, купите **Premium** подписку`))
		}

		const lang = args.shift()
		const text = args.join(' ')

		// TODO: Валидация lang и text

		const translated = await yandex.translate(text, lang)

		message.channel.send(translated)
	}
}