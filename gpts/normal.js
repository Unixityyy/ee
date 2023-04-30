function chatInit(){
    require('dotenv/config');
    const { Client, IntentsBitField } = require('discord.js');
    const { Configuration, OpenAIApi } = require('openai');

    const client = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent
        ]
    });

    client.on('ready', () => {
        console.log("chatGPT logged in");
    });

    const configuration = new Configuration({
        apiKey: process.env.API_KEY
    });

    const openai = new OpenAIApi(configuration);

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        if (message.channel.id !== process.env.NORMAL_CHANNEL_ID1) return;
        if (message.content.startsWith('/')) return;
        
        console.log("Chat: "+message.content);
        
        let conversationLog = [{role: 'system', content: "You are a friendly and normal chatbot."}];

        await message.channel.sendTyping();
        
        let prevMessages = await message.channel.messages.fetch({ limit: 15 })
        prevMessages.reverse();

        prevMessages.forEach((msg) => {
            if (message.content.startsWith('/')) return;
            if (msg.author.id !== client.user.id && message.author.bot) return;
            if (msg.author.id !== message.author.id) return;

            conversationLog.push({
                role: 'user',
                content: msg.content
            });
        });

        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: conversationLog
        });

        message.reply(result.data.choices[0].message);
    });

    client.login(process.env.NORMAL_TOKEN);
}

module.exports = chatInit;