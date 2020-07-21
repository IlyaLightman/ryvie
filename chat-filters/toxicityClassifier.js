const toxicityModel = require('@tensorflow-models/toxicity')
require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node')

const yandex = require('../utils/yandex')

const Server = require('../models/Server')

const toxicityClassifier = async message => {
	const {
		identity_attack,
		insult,
		obscene,
		severe_toxicity,
		sexual_explicit,
		threat,
		toxicity
	} = (await Server.findOne({ id: message.guild.id }))
		.toxicityClassifierSettings

	const translated = await yandex.translate(
		message.content.split(' '), 'en')

	// The minimum prediction confidence.
	const threshold = 0.8

	// console.log(tf.version)

	toxicityModel.load(threshold).then(model => {
		// const sentences = message.content.split(' ')

		model.classify(translated.split(' ')).then(predictions => {
			// console.log(predictions)
			/*
			prints:
			{
			  "label": "identity_attack",
			  "results": [{
				"probabilities": [0.9659664034843445, 0.03403361141681671],
				"match": false
			  }]
			},
			{
			  "label": "insult",
			  "results": [{
				"probabilities": [0.08124706149101257, 0.9187529683113098],
				"match": true
			  }]
			},
			...
			 */

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