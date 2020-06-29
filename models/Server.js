const { Schema, model } = require('mongoose')

const schema = new Schema({
	id: {
		type: Number,
		require: true
	},
	premium: {
		type: Boolean,
		default: false
	},
	toxicityClassifier: {
		type: Boolean,
		default: false
	},
	toxicityClassifierSettings: {
		identity_attack: true,
		insult: true,
		obscene: true,
		severe_toxicity: true,
		sexual_explicit: true,
		threat: true,
		toxicity: true
	},
	keyWordFilter: {
		type: Boolean,
		default: false
	},
	keyWordFilterWords: [
		{ type: String }
	]
})

module.exports = model('Server', schema)