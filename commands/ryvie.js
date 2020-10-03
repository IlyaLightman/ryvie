module.exports = {
	name: 'ryvie',
	description: 'Ryvie Controlling Commands',
	cooldown: 10,
	execute(message, messageServer, args) {
		const authorId = message.author.id
		const authorRoles = message.guild.member(message.author)._roles

		const controlSettings = messageServer.ryvieControlling

		const access =
			message.guild.ownerID === authorId
			|| authorRoles.filter(x =>
			controlSettings.controlRoles.includes(x)).length > 0
			|| controlSettings.admins.includes(authorId)

		if (!access) return message.channel.send('*Access Denied*')

		// Basic Ryvie controlling

		const action = args[0]
		const subAction = args[1]
		args.shift()

		switch (action) {
			case 'id':
				return id(message, messageServer)
			case 'role':
				args.shift()
				const role = args.join(' ')
				if (subAction === 'control') {
					return roleControl(
						message, messageServer, role).then()
				} else if (subAction === 'punishment') {
					return rolePunishment(
						message, messageServer, role).then()
				}
				break
			case 'classifier':
				args.shift()
				if (subAction === 'switch') {
					return switchClassifier(message, messageServer).then()
				} else if (subAction === 'set') {
					// TODO: settings validation

					const settings = args // [0, 0, 0, 0, 0, 0, 0]
					return setClassifier(message, messageServer, settings).then()
				}
				break
			case 'punishment':
				if (['none', 'ban', 'role'].includes(args[1])) {
					return punishment(message, messageServer, args[1]).then()
				}
				break
			case 'ban':
				const days =
					(args[1] >= 0 && args[1] <= 365)
						? Math.floor(args[1]) : 365
				args.shift()
				const reason = args.join(' ')
				return ban(message, messageServer, days, reason).then()
		}

		console.log(action)
	}
}

function id(message, messageServer) {
	message.channel.send(messageServer.id)
}

async function roleControl(message, messageServer, role) {
	messageServer.ryvieControlling.controlRoles = [role]
	await messageServer.save()
	message.channel.send(`Роль ${role} теперь может управлять Райви`)
}

async function rolePunishment(message, messageServer, role) {
	messageServer.punishmentSettings.punishmentRole = role
	await messageServer.save()
	message.channel.send(`Роль ${role} теперь роль наказания Райви`)
}

async function switchClassifier(message, messageServer) {
	messageServer.toxicityClassifier = true
	await messageServer.save()
	message.channel.send(`Классификатор токсичности 
		${messageServer.toxicityClassifier ? 'включен' : 'отключен'}`)
}

async function setClassifier(message, messageServer, settings) {
	// settings is [boolean] * 7
	messageServer.toxicityClassifierSettings.map((set, index) => {
		return !!settings[index]
	})
	await messageServer.save()
	message.channel.send('Настройки классификатора были изменены')
}

async function punishment(message, messageServer, pnsh) {
	// if (pnsh !== 'role' && pnsh !== 'ban' && pnsh !== 'none') return

	messageServer.punishmentSettings.toxicityClassifierPunishment = pnsh
	await messageServer.save()
	message.channel.send('Способ наказания изменён')
}

async function ban(message, messageServer, days, reason) {
	messageServer.punishmentSettings.banDays = days
	messageServer.punishmentSettings.banReason = reason
	await messageServer.save()
	message.channel.send('Настройки бана изменены')
}

function errorMessage(message) {
	message.channel.send('Это так не работает')
}

// $ryvie id - возвращает айди для генерации кода управления для сайта
// $ryvie role control <название роли> - устанавливает роль управления ботом
// $ryvie role punishment <название роли> - роль наказания
// $ryvie classifier switch - включает/отключает классификатор токсичности
// $ryvie classifier set <0 0 0 0 0 0 0 / 1> - настройка классификтора
// $ryvie punishment <none / ban / role> - выбор наказания
// $ryvie ban <кол-во дней> <причина> - настройка бана

// $ryvie use key <key> - использовать ключ для чего-то