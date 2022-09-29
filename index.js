const { Client, Intents } = require('discord.js'); //discord.js からClientとIntentsを読み込む

const client = new Client({ intents: [GatewayIntentBits.GUILDS, GatewayIntentBits.GUILD_MEMBERS, GatewayIntentBits.GUILD_MESSAGES] });  //clientインスタンスを作成する

client.once('ready', () => { //ここにボットが起動した際のコードを書く(一度のみ実行)
    console.log('起動完了'); //黒い画面(コンソール)に「起動完了」と表示させる
});
client.login(process.env.DISCORD_BOT_TOKEN);