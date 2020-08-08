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
	admins: [
		{ type: String }
	],
	playlists: [
		{
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
		}
		// {
		// 	type: Schema.Types.Object,
		// 	ref: 'Playlist'
		// }
	],
	toxicityClassifier: {
		type: Boolean,
		default: false
	},
	toxicityClassifierSettings: {
		identity_attack:
			{ type: Boolean, default: true },
		insult:
			{ type: Boolean, default: true },
		obscene:
			{ type: Boolean, default: true },
		severe_toxicity:
			{ type: Boolean, default: true },
		sexual_explicit:
			{ type: Boolean, default: true },
		threat:
			{ type: Boolean, default: true },
		toxicity:
			{ type: Boolean, default: true }
	},
	punishmentSettings: {
		toxicityClassifierPunishment: {
			// none, ban, role
			type: String,
			default: 'none'
		},
		punishmentRole: {
			type: String,
			default: 'ryviePunishmentRole'
		},
		banReason: {
			type: String,
			default: 'Классификатор токсичности Ryvie'
		}
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