const toxicityModel = require('@tensorflow-models/toxicity')
const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')
const chalk = require('chalk')

const yandex = require('../utils/yandex')

const Server = require('../models/Server')

console.log(chalk.yellow('TensorFlow version is'),
	tf.version.tfjs)

const toxicityClassifier = async message => {
	let toxicityLabels = []
	const toxicityClassifierSettings =
		(await Server.findOne({ id: message.guild.id }))
			.toxicityClassifierSettings

	Object.keys(toxicityClassifierSettings).forEach(condition => {
		if (toxicityClassifierSettings[condition]) {
			toxicityLabels.push(condition)
		}
	})

	console.log(toxicityLabels)

	const translated = await yandex.translate(
		message.content.split(' '), 'en')

	// The minimum prediction confidence.
	const threshold = 0.75

	toxicityModel.load(threshold, toxicityLabels).then(model => {
		model.classify(translated.split(' ')).then(predictions => {
			let msg = `${translated.toString()} \n`

			predictions.forEach(prediction => {
				const isMatch =
					prediction.results.find(
						result =>
							result.match === true)

				msg += `${prediction.label} - ${(!!isMatch)} \n`
			})

			message.channel.send(msg)
		})
	})
}

module.exports = toxicityClassifier