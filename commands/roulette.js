module.exports = {
	name: 'roulette',
	description: 'Рулетка с возможностью выиграть бан',
	aliases: ['chance'],
	guildOnly: true,
	usage: '[шанс бана (от 0 до 100)]',
	examples: ['10', '70%'],
	cooldown: 60,
	args: true,
	execute(message, args) {
		const chance = args[0]
		if (chance[-1] === '%') {
			chance.pop()
		}

		const final = Math.random() * 100
		console.log(message.author.username, chance, final)

		if (isNaN(+chance)) {
			message.channel.send('Неверные параметры')
			return
		}

		if (final > chance) {
			message.channel.send(`${message.author}, на этот раз тебе повезло...`)
		} else {
			message.channel.send(`${message.author}, :)`)
			setTimeout(() => {
				message.guild.member(message.author).ban({
					days: 1,
					reason: 'Проиграл даже в рулетку...'
				})
			}, 3500)
		}
	}
}