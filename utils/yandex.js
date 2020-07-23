const request = require('./request')
const config = require('config')

const YANDEX_OAUTH = config.get('YANDEX_OAUTH')
const YANDEX_FOLDER_ID = config.get('YANDEX_FOLDER_ID')

class yandex {
	constructor() {
		this.iamToken = null
	}

	async recreateIamToken() {
		const iamTokenResponse = await request(
			'https://iam.api.cloud.yandex.net/iam/v1/tokens',
			'POST', {
				'yandexPassportOauthToken': YANDEX_OAUTH
			})

		this.iamToken = iamTokenResponse.iamToken
		// return iamTokenResponse.iamToken
	}

	async translate(text, to) {
		const translatedText = await request(
			'https://translate.api.cloud.yandex.net/translate/v2/translate',
			'POST', {
				'folder_id': YANDEX_FOLDER_ID,
				'texts': text,
				'targetLanguageCode': to
			}, {
				'Content-Type': 'application/json',
    			'Authorization': `Bearer ${this.iamToken}`
			}
		)

		let translatedString = ''
		translatedText.translations.forEach(word =>
			translatedString += `${word.text} `)

		return translatedString
	}
}

module.exports = new yandex()