const { Client, GatewayIntentBits } = require('discord.js'); //discord.js からClientとIntentsを読み込む

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });  //clientインスタンスを作成する

client.once('ready', async () => { //ここにボットが起動した際のコードを書く(一度のみ実行)
    const data = [{
        name: "ping",
        description: "Replies with Pong!",
    }];
    await client.application.commands.set(data);
    console.log('起動完了'); //黒い画面(コンソール)に「起動完了」と表示させる
});
client.login(process.env.DISCORD_BOT_TOKEN);

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong！');
    }
});