const mongoose = require('mongoose')
const Discord = require('discord.js')
const config = require('config')
const chalk = require('chalk')
const fs = require('fs')

const DISCORD_TOKEN = config.get('DISCORD_TOKEN')
const prefix = config.get('PREFIX')
const hearts = config.get('HEARTS')

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => {
	return file.endsWith('.js')
})

commandFiles.forEach(file => {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
})

let commands = ''
client.commands.forEach(command => commands += `${command.name}, `)
console.log(chalk.magenta('Commands:', commands.slice(0, -2)))

const cooldowns = new Discord.Collection()

client.once('ready', () => {
	console.log(chalk.blue('Ryvie is ready!'))
})

client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
})

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
})

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return

	const heart = Math.floor(Math.random() * 6)
	message.react(hearts[heart]).then(() => {})

	const args = message.content.slice(prefix.length).split(/ +/)
	const commandName = args.shift().toLowerCase()

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

	if (!command) return

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply(`Can't execute that command inside DMs!`)
	}

	if (command.args && !args.length) {
		let reply = `Это так не работает`

		if (command.usage) {
			reply += `\nВызов должен быть таким: \`${prefix}${command.name} ${command.usage}\``
			if (command.examples) {
				reply += `\nНапример: \`${prefix}${command.name} ${command.examples[0]}\``
				command.examples.shift()
				command.examples.forEach(example => {
					reply += ` или \`${prefix}${command.name} ${example}\``
				})
			}
		}

		return message.channel.send(reply)
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection())
	}

	const now = Date.now()
	const timestamps = cooldowns.get(command.name)
	const cooldownAmount = (command.cooldown || 3) * 1000

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000
			return message.reply(
				`Подождите ещё ${timeLeft.toFixed(1)}
				 секунд перед использованием команды вновь`)
		}
	}

	timestamps.set(message.author.id, now)
	setTimeout(() => {
		timestamps.delete(message.author.id)
	}, cooldownAmount)

	try {
		command.execute(message, args)
	} catch (err) {
		console.error(err)
		message.reply(`Произошла ошибка`).then(console.log)
	}
})

const start = async () => {
	try {
		await mongoose.connect(config.get('MONGO_URI'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		})

		await client.login(DISCORD_TOKEN)
	} catch (err) {
		console.log(chalk.red('ERROR'), err)
	}
}

start().then(() => {
	console.log(chalk.redBright('Ryvie is here!'))
})