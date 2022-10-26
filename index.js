const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
// const sequelize = require('./db');
const UserModel = require('./models');

const token = '5742477796:AAEPuZBxroVV1pI-16NjIqZdYXr2yTed9ps'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = async () => {

    // try {
    //     await sequelize.authenticate()
    //     await sequelize.sync()
    // } catch (e) {
    //     console.log('Подключение к бд сломалось', e)
    // }

    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        { command: '/auth', description: 'Зарегистрироваться' },
        // { command: '/singIn', description: 'Войти' },
        {command: '/game', description: 'Игра угадай цифру'},
    ])

    bot.onText(/\/startss/, async(msg) => {
        let listenerReply;
      
        let contentMessage = await bot.sendMessage(msg.chat.id, "Type your name: ", {
            "reply_markup": {
                "force_reply": true
            }
        });
        listenerReply = (async (replyHandler) => {
            bot.removeReplyListener(listenerReply);
            //вот здесь нужно записать в бд
            await bot.sendMessage(replyHandler.chat.id, `Ohh your name is ${replyHandler.text}`, {"reply_markup": {"force_reply": false}})
      
        });
        bot.onReplyToMessage(contentMessage.chat.id, contentMessage.message_id, listenerReply);
      });
      

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                // await UserModel.create({chatId})
                return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот автора ютуб канала ULBI TV`);
            }
            if (text === '/info') {
                // const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}, в игре у тебя правильных ответов ${/* user.right */'dsf'}, неправильных ${/* user.wrong */'sdxcv'}`);
            }
            if(text === '/auth') {
                return bot.sendMessage(chatId, 'Введите ключ для работы с API статистики x64', {
                    'reply_markup': {
                        'force_reply': true
                    }
                })
                // return 
                // await bot.
            }
            if (text === '/game') {
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)');
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!)');
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        // const user = await UserModel.findOne({chatId})
        if (data == chats[chatId]) {
            // user.right += 1;
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            // user.wrong += 1;
            await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
        // await user.save();
    })
}

start()
