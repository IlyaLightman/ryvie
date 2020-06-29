const { Schema, model } = require('mongoose')

const schema = new Schema({
	title: {
		type: String,
		require: true
	},
	music: [
		{
			title: String,
			url: String
		}
	],
	owner: {
		type: String,
		require: true
	},
	// Публичный - доступ у всех участников сервера,
	// приватный - только у создателя
	// (администраторы могут удалить любой плейлист)
	isPublic: {
		type: Boolean,
		default: true
	}
})

module.exports = model('Playlist', schema)