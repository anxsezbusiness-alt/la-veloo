const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { registerLaVelooSystem } = require('./la-veloo-system');

loadEnvFile();

const TOKEN = process.env.TOKEN || process.env.DISCORD_TOKEN || process.env.BOT_TOKEN;
const PORT = Number(process.env.PORT || process.env.BOT_HTTP_PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Channel]
});

registerLaVelooSystem(client);

client.once('ready', () => {
    console.log(`${client.user.tag} is online for LA VELOO.`);
});

startHealthServer();

if (!TOKEN) {
    console.error('Missing TOKEN, DISCORD_TOKEN, or BOT_TOKEN.');
    process.exit(1);
}

client.login(TOKEN);

function startHealthServer() {
    const server = http.createServer((request, response) => {
        if (request.url === '/health') {
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify({ ok: true, service: 'la-veloo-discord-bot' }));
            return;
        }

        response.writeHead(200, { 'content-type': 'text/plain' });
        response.end('LA VELOO bot is running.');
    });

    server.listen(PORT, () => {
        console.log(`Health server listening on port ${PORT}.`);
    });
}

function loadEnvFile() {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) return;

    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const separator = trimmed.indexOf('=');
        if (separator === -1) continue;

        const key = trimmed.slice(0, separator).trim();
        let value = trimmed.slice(separator + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
}
