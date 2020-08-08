const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'vote',
	description: 'Создаёт голосование с двумя вариантами ответа',
	cooldown: 5,
	// $vote 60 Заказывать пиццу?
	async execute(message, messageServer, args) {
		let request = ''
		const seconds = args.shift() * 1000
		args.forEach(arg => request += `${arg} `)

		if (request === '') return;
		const msg = await message.channel.send(`${request}`)

		await msg.react('👍')
		await msg.react('👎')

		// console.log(msg.reactions.cache.get('👍').users.cache.forEach(user => console.log(user)))
		setTimeout(() => {
			const yesArray = []
			const nooArray = []
			msg.reactions.cache.get('👍').users.cache
				.forEach(user => {
					if (!user.bot) {
						yesArray.push(user.username)
					}
				})
			msg.reactions.cache.get('👎').users.cache
				.forEach(user => {
					if (!user.bot) {
						nooArray.push(user.username)
					}
				})

			// let response = `*** Голосование: ${request} ***`
			// response += `\n(${yesArray.length}) *Проголосвали за*: ${yesArray.toString()}`
			// response += `\n(${nooArray.length}) *Проголосвали против*: ${nooArray.toString()}`

			const response = new MessageEmbed()
				.setTitle(`Голосование ${request}`)
				.setColor(0xd07ae6)
				.setDescription(`
				(${yesArray.length}) *Проголосовали за*: ${yesArray.toString()} \n
				(${nooArray.length}) *Проголосовали против*: ${nooArray.toString()}`)

			message.channel.send(response)
		}, seconds)
	}
}