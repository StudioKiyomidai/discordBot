//モジュールのインポート
const http = require("http");
const axios = require('axios');
const discord = require("discord.js");
let client;


const connectDiscord = () => {
    client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
    client.login(process.env.DISCORD_BOT_TOKEN);
    client.on("ready", () => console.log("bot is ready!"));

    //送信者がbot自身でないとき、GASへPOSTする関数を実行
    client.on("messageCreate", (message) => !message.author.bot ? sendGAS(message) : "");

    if (process.env.DISCORD_BOT_TOKEN == undefined) {
        console.log("please set ENV: DISCORD_BOT_TOKEN");
        process.exit(0);
    }
};


// GASにデータをPOSTする関数
const sendGAS = (message) => {
    const jsonData = {
        author: message.author,
        content: message.content,
        channel: message.channel,
    };
    const post = async () => {
        try {
            await axios({
                method: "post",
                url: process.env.GAS_URL,
                data: jsonData,
                responseType: "json",
            }).then((response) => {
                const msg = response.data;

                //送信方法を振り分け
                switch (msg.messagetype) {
                    case "nothing": //何もしない
                        break;

                    case "reply": //返信
                        message.reply(msg.content);
                        break;

                    case "send": //ただ送る
                    default:
                        message.channel.send(msg.content);
                        break;
                }
            });
        } catch (error) {
            message.reply("an error occurred: " + error);
        }
    };
    post();
};

//実行
connectDiscord();

//GASからのPOSTリクエストを受け取る用
http
    .createServer((request, response) => {
        console.log('post from gas')
        response.end("Discord bot is active now.");
    })
    .listen(3000);