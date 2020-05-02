const discord = require("discord.js");
const botConfig = require("./botconfig.json");
 
const client = new discord.Client();
client.login(process.env.token);
 
client.on("ready", async () => {
 
    console.log(`${client.user.username} is online.`);
 
    client.user.setActivity("*help", { type: "PLAYING" });
 
});
 
 
client.on("message", async message => {
 
    if(message.author.bot) return;
 
    if(message.channel.type === "dm") return;
 
    var prefix = botConfig.prefix;
 
    var messageArray = message.content.split(" ");
 
    var command = messageArray[0];

    if (command === `${prefix}hello`){

        return message.reply("hello")

    }

    if (command === `${prefix}invite`){

        return message.reply("here is the invite link off the bot: https://discordapp.com/oauth2/authorize?client_id=704013464712118372&scope=bot")

    }

    if (command === `${prefix}help`){

        var embedHelp = new discord.MessageEmbed()
        .setColor("#3481ed")
        .setTitle("these are the comands of the bot")
        .setDescription(`**for the visitors**
        ** ${prefix}hello:** have the bot send hello back
        ** ${prefix}invite:** show the invite link
        ** ${prefix}help:** has all the comands on
        **for the staff members who can kick people**
        ** ${prefix}kick:** do you want to kick someone because he does not comply with the rules, for example (are still errors)`);

         return message.reply(embedHelp)

    }
 
    if (command === `${prefix}kick`) {
       
        var args = message.content.slice(prefix.length).split(/ +/);
 
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("sorry you are not a staff member who is allowed to run this cmd");
 
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("geen perms");
 
        if(!args[1]) return message.reply("sry you have no user specified pls do that !!!");
 
        if(!args[2]) return message.reply("sry you have no reasons given pls do that !!!");
 
        var kickUser = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[1]));
 
        var reasen = args.slice(2).join(" ");
 
        if(!kickUser) return message.reply("user not found");
 
        var embedPromt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("please respond within 30 seconds")
            .setDescription(`wil you that ${kickUser} kicket off the server?`);
 
        var embedKicked = new discord.MessageEmbed()
            .setColor("RED")
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription(`**kicked: ** ${kickUser}(${kickUser.id})
            **kicked by: ** ${message.author}
            **reasons: ** ${reasen}`);
 
        message.channel.send(embedPromt).then(async msg =>{
 
        message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1, time: 30000}).then(collected =>{
 
            if(collected.first().content.toLocaleLowerCase() == `yes`) {
 
                kickUser.kick(reason).catch(err => {
 
                    if(err) return message.reply("something went wrong")
 
                });
 
            }else{
 
                message.reply("canceled");
 
            }
        });
 
        });
 
    }
 
});