const config = require('config')

const prefix = config.get('PREFIX')

module.exports = {
	name: 'help',
	description: 'Список всех команд и информация о них',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, messageServer, args) {
		const data = []
		const { commands } = message.client

		if (!args.length) {
			data.push(`Это список всех команд Райви: `)
			data.push(commands.map(command => command.name).join(', '))
			data.push(
				`\nМожно использовать \`${prefix}help [command name]\`, чтобы получить информацию о какой-то из команд`
			)

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return
					message.reply(`Информация в личных сообщениях!`)
				})
				.catch(error => {
					console.error(`Не могу помочь ${message.author.tag}\n`, error)
					message.reply(`Кажется, я не могу вам помочь`)
				})
		}

		const name = args[0].toLowerCase()
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))

		if (!command) {
			return message.reply(`Некорректная комманда`)
		}

		data.push(`- Название: ${command.name}`)

		if (command.aliases) data.push(`- Другие названия: ${command.aliases.join(', ')}`)
		if (command.description) data.push(`- Описание: ${command.description}`)
		if (command.usage) data.push(`- Использование: ${prefix}${command.name} ${command.usage}`)

		data.push(`- Кулдаун: ${command.cooldown || 3} секунд(ы)`)

		message.channel.send(data, {split: true}).then(() => {})
	}
}