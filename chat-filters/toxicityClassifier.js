const toxicityModel = require('@tensorflow-models/toxicity')
const tf = require('@tensorflow/tfjs')
const tfNode = require('@tensorflow/tfjs-node')

const toxicityClassifier = (message, conditions) => {
	// const {
	// 	identity_attack,
	// 	insult,
	// 	obscene,
	// 	severe_toxicity,
	// 	sexual_explicit,
	// 	threat,
	// 	toxicity
	// } = conditions

	// The minimum prediction confidence.
	const threshold = 0.9

	// console.log(tf.version)

	toxicityModel.load(threshold).then(model => {
		const sentences = message.content.split(' ')

		model.classify(sentences).then(predictions => {
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

			let msg = ''

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