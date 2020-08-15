const toxicityModel = require('@tensorflow-models/toxicity')
const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')
const chalk = require('chalk')
const { MessageEmbed } = require('discord.js')

const yandex = require('../utils/yandex')

console.log(chalk.yellow('TensorFlow version is'),
	tf.version.tfjs)

const toxicityClassifier = async (message, messageServer) => {
	if (!messageServer.toxicityClassifier &&
		!messageServer.premium) return null

	let toxicityLabels = []
	Object.keys(messageServer.toxicityClassifierSettings).forEach(condition => {
		if (messageServer.toxicityClassifierSettings[condition]) {
			toxicityLabels.push(condition)
		}
	})
	toxicityLabels.shift()

	const translated = await yandex.translate(
		message.content.split(' '), 'en')

	// The minimum prediction confidence.
	const threshold = 0.75

	toxicityModel.load(threshold, toxicityLabels).then(model => {
		model.classify(translated.split(' ')).then(predictions => {
			// let msg = `${translated.toString()} \n`
			let msg = ''

			predictions.forEach(prediction => {
				const isMatch =
					prediction.results.find(
						result =>
							result.match === true)

				if (isMatch) msg += `${litLabels[prediction.label]} \n`
			})

			if (msg !== '') {
				msg += `\n**Автор:** ${message.author.username}`
				msg += `\n**Тег:** ${message.author.tag}`
				msg += `\n**Сообщение:** ${translated}`
				msg += `\n**Оригинал:** ${message.content}`

				message.channel.send(new MessageEmbed()
					.setTitle('Классификатор токсичности')
					.setColor(0xe879e1)
					.setDescription(msg)
				)

				switch (messageServer.punishmentSettings
					.toxicityClassifierPunishment) {
					case 'none':
						return null
					case 'ban':
						return message.guild.member(message.author).ban({
								reason: messageServer.punishmentSettings.banReason,
								days: messageServer.punishmentSettings.banDays
							})
					case 'role':
						const role = message.guild.roles.cache.find(
							role => role.name ===
								messageServer.punishmentSettings.punishmentRole)
						return role ? message.member.roles.add(role) : null
					default: return null
				}
			}
		})
	})
}

const litLabels = {
	identity_attack: 'Оскорбление личности',
	insult: 'Оскорбление',
	obscene: 'Непристойная лексика',
	severe_toxicity: 'Сильная токсичность',
	sexual_explicit: 'Сексуально откровенный',
	threat: 'Угроза',
	toxicity: 'Токсичность'
}

module.exports = toxicityClassifier