# Ryvie Discord Bot

The best bot in the World

## Toxicity Classifier

Tensorflow based toxicity classifier right in the Discord bot. It checks all the messages, translates it through the Yandex.Translate to EN and validate with the bots settings for the guild in the server

![Discord](https://i.ibb.co/BBdSvX9/dis.png "Discord Bot")

## Commands

**Общие команды:**

- **$help** <*command*> - информация о комманде и её использовании
- **$vote** <*seconds*> <question> - простое голосование (да/нет)
- **$roulette** <*0 - 100*> - банит написавшего с определённым шансом (0 - 100)
- **$roll** <*interval X-Y / dices XdY*> - случайное число в интервале / кубики (например, 2d20)
- $<*math expression*> - считает несложное математическое выражение
- **$t** ($translate) <ru> <en> <message> - переводит сообщение с ru на en

**Музыкальные команды бота:**

- **$a** ($add) <*url / title*> - добавить музыку в очередь (поиск на YouTube)
- **$q** ($queue) - очередь прослушивания с номерами
- **$p** ($play) <*number*> - проиграть музыку под номером из очереди
- **$s** ($skip) - пропустить текущую музыку из очереди
- **$c** ($clear) - очистить очередь

**Команды бота по управлению плейлистами ($pl $playlist):**

- **$pl create** <private/public> <*title*> - создать новый плейлист
- **$pl add** <*pl title> <url / title> -* добавить музыку в плейлист
- **$pl show** <*pl title*> - музыка в плейлисте (список)
- **$pl play** <*pl title*> - добавить весь плейлист в очередь прослушивания
- **$pl a** <*pl title> <number*> - добавить музыку под номером из плейлиста в очередь
- **$pl rem** <*pl title> <number*> - удалить музыку под номером из плейлиста
- **$pl clear** <*pl title*> - очистить плейлист
- **$pl del** <*pl title*> - удалить плейлист
- **$pl list** - список всех плейлистов, доступных на текущем сервере
