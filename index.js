const http = require("http");
const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js'); //discord.js からClientとIntentsを読み込む

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });  //clientインスタンスを作成する

// 起動時実行関数
client.once('ready', async () => {
    const data = [{
        name: "ping",
        description: "何か返すよ！",
        options: [
            {
                type: 3, // string
                name: "time",
                description: "21:00 のように24時間表記で入力",
                required: true,
            }
        ]
    }];
    await client.application.commands.set(data);
    console.log('起動完了'); //黒い画面(コンソール)に「起動完了」と表示させる
});

// ログイン
client.login(process.env.DISCORD_BOT_TOKEN);

const commands = {
    async ping(interaction) {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var timeLimit = interaction.options.get("time")
        var strTime = year + "/" + month + "/" + day + " " + timeLimit + ":00"

        var parsedTime = Date.parse(strTime);
        if (isNan(parsedTime)) {
            interaction.reply('henkan misutteru na');
            return;
        }

        const jsonData = {
            message: strTime
        }
        try {
            await axios({
                method: "post",
                url: process.env.GAS_URL,
                data: jsonData,
                responseType: "json",
            }).then((response) => {
                console.log("status: " + response.status);
                // GAS側でレスポンスボディのcontentにメッセージ入れているからcontent.valueでとる
                // ほかにも名前とかとれる
                // { name: 'input', type: 3, value: 'bgbgbg' }
                interaction.reply(response.data.content.value);
            });
        } catch (error) {
            console.log(error)
            interaction.reply('error shiteru na')
        }
        return;
    }
};


// スラッシュコマンドの設定
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    return commands[interaction.commandName](interaction);
});

// GASからのリクエスト受付
http
    .createServer((request, response) => {
        console.log('post from gas')
        response.end("Discord bot is active now.");
    })
    .listen(3000);