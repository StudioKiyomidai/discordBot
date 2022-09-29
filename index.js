const http = require("http");
const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js'); //discord.js からClientとIntentsを読み込む

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });  //clientインスタンスを作成する

// 起動時実行関数
client.once('ready', async () => {
    const data = [{
        name: "ping",
        description: "Replies with Pong!",
    }];
    await client.application.commands.set(data);
    console.log('起動完了'); //黒い画面(コンソール)に「起動完了」と表示させる
});

// ログイン
client.login(process.env.DISCORD_BOT_TOKEN);

// スラッシュコマンドの設定
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === 'ping') {
        try {
            await axios({
                method: "post",
                url: process.env.GAS_URL,
                responseType: "json",
            }).then((response) => {
                interaction.reply(response.data.content);
            });
        } catch (error) {
            interaction.reply('error shiteru na')
        }

    }
});

// GASからのリクエスト受付
http
    .createServer((request, response) => {
        console.log('post from gas')
        response.end("Discord bot is active now.");
    })
    .listen(3000);