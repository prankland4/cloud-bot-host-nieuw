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

    if (command === `${prefix}hallo`){

        return message.reply("hallo")

    }


    if (command === `${prefix}help`){

        var embedHelp = new discord.MessageEmbed()
        .setColor("#3481ed")
        .setTitle("dit zijn alle comands van de bot")
        .setDescription(`**voor de bezoekers**
        ** ${prefix}hallo:** laat de bot hallo terug sturen
        ** ${prefix}help:** heeft alle comands aan
        ** voor de staff leden die mensen kunnen kicken**
        ** ${prefix}kick:** wil je iemand kicken om dat hij de regels bv. niet naleefd (zitten nog fouten in)`);

        return message.reply(embedHelp)

    }
 
    if (command === `${prefix}kick`) {
       
        var args = message.content.slice(prefix.length).split(/ +/);
 
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("sorry jij bent geen staff lid die dit cmd mag uitvoeren");
 
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("geen perms");
 
        if(!args[1]) return message.reply("sry je hebt geen gebruiker opgegeven pls doe dat!!!");
 
        if(!args[2]) return message.reply("sry je hebt geen redennen opgegeven pls doe dat!!!");
 
        var kickUser = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[1]));
 
        var reasen = args.slice(2).join(" ");
 
        if(!kickUser) return message.reply("gebruiker niet gevonden");
 
        var embedPromt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("gelieve binnen 30 seconden te reageren")
            .setDescription(`wil je ${kickUser} kicken?`);
 
        var embedKicked = new discord.MessageEmbed()
            .setColor("RED")
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription(`**gekickt: ** ${kickUser}(${kickUser.id})
            **gekickt door: ** ${message.author}
            **redennen: ** ${reasen}`);
 
        message.channel.send(embedPromt).then(async msg =>{
 
        message.channel.awaitMessages(m => m.author.id === message.author.id, {max: 1, time: 30000}).then(collected =>{
 
            if(collected.first().content.toLocaleLowerCase() == `ja`) {
 
                kickUser.kick(reason).catch(err => {
 
                    if(err) return message.reply("er is iets mis gelopen")
 
                });
 
            }else{
 
                message.reply("canceld");
 
            }
        });
 
        });
 
    }
 
});