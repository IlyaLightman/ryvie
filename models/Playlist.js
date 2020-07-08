const { Schema, model } = require('mongoose')

const schema = new Schema({
	title: {
		type: String,
		require: true
	},
	songs: [
		{
			title: {
				type: String,
				require: true
			},
			url: {
				type: String,
				require: true
			}
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