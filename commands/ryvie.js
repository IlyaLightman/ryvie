module.exports = {
	name: 'ryvie',
	description: 'Ryvie Controlling Panel',
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

		switch (action) {
			case 'id':
				return id(message, messageServer)
			case 'role':
				if (args[1] === 'control') {
					return roleControl(
						message, messageServer, args[2]).then()
				} else if (args[1] === 'punishment') {
					return rolePunishment(
						message, messageServer, args[2]).then()
				}
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

// $ryvie id - возвращает айди для генерации кода управления для сайта
// $ryvie role control <название роли> - устанавливает роль управления ботом
// $ryvie role punishment <название роли> - роль наказания
// $ryvie classifier switch - включает/отключает классификатор токсичности
// $ryvie classifier set <0 0 0 0 0 0 0 / 1> - настройка классификтора
// $ryvie punishment <none / ban / role> - выбор наказания
// $ryvie ban <кол-во дней> <причина> - настройка бана