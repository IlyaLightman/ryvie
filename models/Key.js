const { Schema, model } = require('mongoose')

const schema = new Schema({
	key: {
		type: String,
		require: true
	},
	// 'premium', 'restart', ....
	action: {
		type: String,
		require: true
	},
	duration: {
		type: Number,
		default: 0
	}
})

module.exports = model('Playlist', schema)