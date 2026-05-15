const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    MessageFlags,
    ModalBuilder,
    PermissionsBitField,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const PERMS = PermissionsBitField.Flags;
const SERVER_NAME = '𝐋𝐀 𝐕𝐄𝐋𝐎𝐎';
const DEFAULT_GUILD_ID = '1504515493950918756';
const STORE_PATH = process.env.LA_VELOO_STORE_PATH || path.join(__dirname, 'la-veloo-store.json');
const AUTO_SETUP = String(process.env.LA_VELOO_AUTO_SETUP || 'true').toLowerCase() !== 'false';
const ENABLE_COMMUNITY = String(process.env.LA_ENABLE_COMMUNITY || 'true').toLowerCase() !== 'false';
const COMMUNITY_RULES_CHANNEL_ID = process.env.LA_RULES_CHANNEL_ID || process.env.RULES_CHANNEL_ID || '1504521850930073691';
const COMMUNITY_UPDATES_CHANNEL_ID = process.env.LA_UPDATES_CHANNEL_ID || null;
const COMMUNITY_SAFETY_CHANNEL_ID = process.env.LA_SAFETY_CHANNEL_ID || null;
const LOG_MESSAGE_SNAPSHOT_EVERY = Number(process.env.LA_MESSAGE_SNAPSHOT_EVERY || 20);
const LIVE_MESSAGE_LOG = String(process.env.LA_LIVE_MESSAGE_LOG || 'false').toLowerCase() === 'true';
const PROFILE_POST_XP = Number(process.env.LA_PROFILE_POST_XP || 10);
const PROFILE_WEEKLY_WINNER_XP = Number(process.env.LA_PROFILE_WEEKLY_WINNER_XP || 75);
const PANEL_REFRESH_MINUTES = Number(process.env.LA_PANEL_REFRESH_MINUTES || 5);
const PANEL_REFRESH_INTERVAL_MS = PANEL_REFRESH_MINUTES > 0 ? PANEL_REFRESH_MINUTES * 60 * 1000 : 0;
const SILENT_MESSAGE_FLAGS = MessageFlags.SuppressNotifications;

const LANGUAGES = [
    { code: 'en', label: 'English', emoji: '🇬🇧' },
    { code: 'de', label: 'Deutsch', emoji: '🇩🇪' },
    { code: 'fr', label: 'Français', emoji: '🇫🇷' },
    { code: 'es', label: 'Español', emoji: '🇪🇸' },
    { code: 'it', label: 'Italiano', emoji: '🇮🇹' }
];
const DEFAULT_PANEL_LANGUAGE = 'en';

const XP_REWARDS = [
    { xp: 100, roleKey: 'activeMember' },
    { xp: 250, roleKey: 'trustedMember' },
    { xp: 500, roleKey: 'teamPlayer' },
    { xp: 900, roleKey: 'rankedPlayer' }
];

const RANK_TIERS = [
    { key: 'bronze', labels: ['bronze', 'bronce'] },
    { key: 'silver', labels: ['silver', 'silber', 'argent', 'plata', 'argento'] },
    { key: 'gold', labels: ['gold', 'or', 'oro'] },
    { key: 'diamond', labels: ['diamond', 'dia', 'diamant', 'diamante'] },
    { key: 'mythic', labels: ['mythic', 'mythisch', 'mythique', 'mitico', 'mítico'] },
    { key: 'legendary', labels: ['legendary', 'legendär', 'legendaer', 'légendaire', 'legendario'] },
    { key: 'master', labels: ['master', 'masters', 'meister', 'maestro'] },
    { key: 'pro', labels: ['pro'] }
];

const ROLE_NAMES = {
    owner: '𝘖𝘸𝘯𝘦𝘳',
    admin: '𝘈𝘥𝘮𝘪𝘯',
    manager: '𝘔𝘢𝘯𝘢𝘨𝘦𝘳',
    headModerator: '𝘏𝘦𝘢𝘥 𝘔𝘰𝘥𝘦𝘳𝘢𝘵𝘰𝘳',
    moderator: '𝘔𝘰𝘥𝘦𝘳𝘢𝘵𝘰𝘳',
    trialModerator: '𝘛𝘳𝘪𝘢𝘭 𝘔𝘰𝘥𝘦𝘳𝘢𝘵𝘰𝘳',
    tournamentManager: '𝘛𝘰𝘶𝘳𝘯𝘢𝘮𝘦𝘯𝘵 𝘔𝘢𝘯𝘢𝘨𝘦𝘳',
    tournamentStaff: '𝘛𝘰𝘶𝘳𝘯𝘢𝘮𝘦𝘯𝘵 𝘚𝘵𝘢𝘧𝘧',
    tournamentVerified: '𝘛𝘰𝘶𝘳𝘯𝘢𝘮𝘦𝘯𝘵 𝘝𝘦𝘳𝘪𝘧𝘪𝘦𝘥',
    tournamentWinner: '𝘛𝘰𝘶𝘳𝘯𝘢𝘮𝘦𝘯𝘵 𝘞𝘪𝘯𝘯𝘦𝘳',
    tournamentChampion: '𝘛𝘰𝘶𝘳𝘯𝘢𝘮𝘦𝘯𝘵 𝘊𝘩𝘢𝘮𝘱𝘪𝘰𝘯',
    partner: '𝘗𝘢𝘳𝘵𝘯𝘦𝘳',
    cooperation: '𝘊𝘰𝘰𝘱𝘦𝘳𝘢𝘵𝘪𝘰𝘯',
    creator: '𝘊𝘳𝘦𝘢𝘵𝘰𝘳',
    verifiedCreator: '𝘝𝘦𝘳𝘪𝘧𝘪𝘦𝘥 𝘊𝘳𝘦𝘢𝘵𝘰𝘳',
    clubMember: '𝘊𝘭𝘶𝘣 𝘔𝘦𝘮𝘣𝘦𝘳',
    og: '𝘖𝘎',
    activeMember: '𝘈𝘤𝘵𝘪𝘷𝘦 𝘔𝘦𝘮𝘣𝘦𝘳',
    trustedMember: '𝘛𝘳𝘶𝘴𝘵𝘦𝘥 𝘔𝘦𝘮𝘣𝘦𝘳',
    rankedPlayer: '𝘙𝘢𝘯𝘬𝘦𝘥 𝘗𝘭𝘢𝘺𝘦𝘳',
    teamPlayer: '𝘛𝘦𝘢𝘮 𝘗𝘭𝘢𝘺𝘦𝘳',
    lookingForMates: '𝘓𝘰𝘰𝘬𝘪𝘯𝘨 𝘍𝘰𝘳 𝘔𝘢𝘵𝘦𝘴',
    giveawayPing: '𝘎𝘪𝘷𝘦𝘢𝘸𝘢𝘺 𝘗𝘪𝘯𝘨',
    tournamentPing: '𝘛𝘰𝘶𝘳𝘯𝘢𝘮𝘦𝘯𝘵 𝘗𝘪𝘯𝘨',
    eventPing: '𝘌𝘷𝘦𝘯𝘵 𝘗𝘪𝘯𝘨',
    announcementPing: '𝘈𝘯𝘯𝘰𝘶𝘯𝘤𝘦𝘮𝘦𝘯𝘵 𝘗𝘪𝘯𝘨',
    verifiedMember: '𝘝𝘦𝘳𝘪𝘧𝘪𝘦𝘥 𝘔𝘦𝘮𝘣𝘦𝘳',
    member: '𝘔𝘦𝘮𝘣𝘦𝘳',
    muted: '𝘔𝘶𝘵𝘦𝘥',
    pc: '𝘗𝘊',
    mobile: '𝘔𝘰𝘣𝘪𝘭𝘦',
    ipad: '𝘪𝘗𝘢𝘥',
    mode3v3: '𝟥𝘷𝟥',
    solo: '𝘚𝘰𝘭𝘰',
    duo: '𝘋𝘶𝘰',
    casual: '𝘊𝘢𝘴𝘶𝘢𝘭'
};

const ROLE_DEFINITIONS = [
    { key: 'owner', color: 0x0f172a, hoist: true, permissions: [PERMS.Administrator] },
    { key: 'admin', color: 0xef4444, hoist: true, permissions: [PERMS.ManageGuild, PERMS.ManageRoles, PERMS.ManageMessages, PERMS.ModerateMembers] },
    { key: 'manager', color: 0xf97316, hoist: true, permissions: [PERMS.ManageGuild, PERMS.ManageRoles, PERMS.ManageMessages, PERMS.ModerateMembers] },
    { key: 'headModerator', color: 0x3b82f6, hoist: true, permissions: [PERMS.ManageMessages, PERMS.ModerateMembers] },
    { key: 'moderator', color: 0x8b5cf6, hoist: true, permissions: [PERMS.ManageMessages, PERMS.ModerateMembers] },
    { key: 'trialModerator', color: 0x60a5fa, hoist: true, permissions: [PERMS.ManageMessages] },
    { key: 'tournamentManager', color: 0xfacc15, hoist: true, permissions: [PERMS.ManageMessages, PERMS.ManageRoles] },
    { key: 'tournamentStaff', color: 0xeab308, hoist: true, permissions: [PERMS.ManageMessages] },
    { key: 'tournamentVerified', color: 0x22c55e },
    { key: 'tournamentWinner', color: 0xfbbf24, hoist: true },
    { key: 'tournamentChampion', color: 0xf59e0b, hoist: true },
    { key: 'partner', color: 0x14b8a6, hoist: true },
    { key: 'cooperation', color: 0x2dd4bf, hoist: true },
    { key: 'creator', color: 0xec4899, hoist: true },
    { key: 'verifiedCreator', color: 0xf472b6, hoist: true },
    { key: 'clubMember', color: 0x22c55e, hoist: true },
    { key: 'og', color: 0xf59e0b, hoist: true },
    { key: 'activeMember', color: 0x84cc16 },
    { key: 'trustedMember', color: 0x06b6d4 },
    { key: 'rankedPlayer', color: 0x38bdf8 },
    { key: 'teamPlayer', color: 0x34d399 },
    { key: 'lookingForMates', color: 0x94a3b8 },
    { key: 'giveawayPing', color: 0xfb7185, mentionable: true },
    { key: 'tournamentPing', color: 0xfacc15, mentionable: true },
    { key: 'eventPing', color: 0x22d3ee, mentionable: true },
    { key: 'announcementPing', color: 0xa78bfa, mentionable: true },
    { key: 'verifiedMember', color: 0x22c55e },
    { key: 'member', color: 0x9ca3af },
    { key: 'muted', color: 0x52525b },
    { key: 'pc', color: 0x64748b },
    { key: 'mobile', color: 0x16a34a },
    { key: 'ipad', color: 0x0ea5e9 },
    { key: 'mode3v3', color: 0xf97316 },
    { key: 'solo', color: 0xf43f5e },
    { key: 'duo', color: 0x8b5cf6 },
    { key: 'casual', color: 0x94a3b8 }
];

const SELF_ROLE_KEYS = ['pc', 'mobile', 'ipad', 'mode3v3', 'solo', 'duo', 'casual', 'rankedPlayer', 'teamPlayer', 'lookingForMates', 'giveawayPing', 'tournamentPing'];
const STAFF_ROLE_KEYS = ['owner', 'admin', 'manager', 'headModerator', 'moderator', 'trialModerator', 'tournamentManager', 'tournamentStaff'];

const CATEGORIES = [
    {
        key: 'important',
        name: '〢 𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓',
        private: 'locked',
        channels: [
            { key: 'rules', name: '📜・rules', topic: 'Rules and community guidelines for LA VELOO.' },
            { key: 'support', name: '💖・support', topic: 'Support panel and help requests.' },
            { key: 'getStarted', name: '🧭・get-started', topic: 'Choose roles and learn how to start.' },
            { key: 'clubVerify', name: '✅・verify-for-club', topic: 'Club member verification panel.' },
            { key: 'cooperations', name: '🤝・cooperations', topic: 'Accepted cooperations and partnership posts.' },
            { key: 'winners', name: '🏆・winners', topic: 'Tournament winners.' },
            { key: 'matchResults', name: '📊・match-results', topic: 'Tournament match results.' },
            { key: 'announcements', name: '📢・announcements', topic: 'Official announcements.' },
            { key: 'updates', name: '📦・updates', topic: 'Server, bot, and tournament updates.' },
            { key: 'botLog', name: '⚙️・bot-log', topic: 'Public level and bot logs.' },
            { key: 'entrance', name: '👋・entrance', topic: 'Join and leave log.' }
        ]
    },
    {
        key: 'community',
        name: '〢 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘',
        private: 'community',
        channels: [
            { key: 'mainHall', name: '💬・main-hall', topic: 'Main community chat.' },
            { key: 'profileRank', name: '🪪・profile-rank', topic: 'Profiles, ranks, trophies, and progress.' },
            { key: 'profileTool', name: '🧰・profile-tool', topic: 'Brawlify player profiles, fire likes, and weekly top profile.' },
            { key: 'creatorChat', name: '🎥・creator-chat', topic: 'Creator chat and creator applications.' },
            { key: 'suggestions', name: '💡・suggestions', topic: 'Community suggestion panel.', private: 'locked' },
            { key: 'mapDesigns', name: '🗺️・map-designs', topic: 'Share Brawl Stars map design screenshots.' },
            { key: 'clipsMedia', name: '📸・clips-media', topic: 'Clips, screenshots, and highlights.' },
            { key: 'memes', name: '🎭・memes', topic: 'Memes and fun posts.' }
        ]
    },
    {
        key: 'applications',
        name: '〢 𝐀𝐏𝐏𝐋𝐈𝐂𝐀𝐓𝐈𝐎𝐍𝐒',
        private: 'locked',
        channels: [
            { key: 'creatorApply', name: '🎥・creator-apply', topic: 'Creator application backup panel.' },
            { key: 'cooperationApply', name: '🤝・cooperation-apply', topic: 'Cooperation application backup panel.' }
        ]
    },
    {
        key: 'findMates',
        name: '〢 𝐅𝐈𝐍𝐃 𝐌𝐀𝐓𝐄𝐒',
        private: 'locked',
        channels: [
            { key: 'findMates', name: '🤝・find-mates', topic: 'Find teammates and casual mates.' },
            { key: 'findRankedMates', name: '🏆・find-ranked-mates', topic: 'Find ranked teammates.' },
            { key: 'teamSearch', name: '👥・team-search', topic: 'Search for a fixed team.' }
        ]
    },
    {
        key: 'freeBsStuff',
        name: '〢 𝐅𝐑𝐄𝐄 𝐁𝐒 𝐒𝐓𝐔𝐅𝐅',
        private: 'locked',
        channels: [
            { key: 'freeBsStuff', name: '🎁・free-bs-stuff', topic: 'Free Brawl Stars rewards and links.' },
            { key: 'eventAlerts', name: '🔔・event-alerts', topic: 'Event alerts.' },
            { key: 'giveaways', name: '🎟️・giveaways', topic: 'Giveaways.' },
            { key: 'officialRewards', name: '✅・official-rewards', topic: 'Official reward links only.' }
        ]
    },
    {
        key: 'tournament',
        name: '〢 𝐓𝐎𝐔𝐑𝐍𝐀𝐌𝐄𝐍𝐓',
        private: 'locked',
        channels: [
            { key: 'tournamentRegistration', name: '📝・tournament-registration', topic: 'Tournament registration panel.' },
            { key: 'tournamentGuide', name: '📘・tournament-guide', topic: 'Tournament guide.', private: 'tournament' },
            { key: 'tournamentRules', name: '⚖️・tournament-rules', topic: 'Tournament rules.', private: 'tournament' },
            { key: 'tournamentChat', name: '🏟️・tournament-chat', topic: 'Tournament chat.', private: 'tournament' },
            { key: 'tournamentBrackets', name: '📊・tournament-brackets', topic: 'Tournament brackets.', private: 'tournament' },
            { key: 'matchSubmit', name: '🧾・match-submit', topic: 'Submit match results.', private: 'tournament' },
            { key: 'matchDisputes', name: '🚨・match-disputes', topic: 'Match disputes.', private: 'tournament' }
        ]
    },
    {
        key: 'staff',
        name: '〢 𝐒𝐓𝐀𝐅𝐅',
        private: 'staff',
        channels: [
            { key: 'staffChat', name: '🛡️・staff-chat', topic: 'Private staff chat.' },
            { key: 'staffPanels', name: '📌・staff-panels', topic: 'Panels, reviews, and bot-created records.' },
            { key: 'botSetup', name: '🤖・bot-setup', topic: 'Bot setup and tests.' },
            { key: 'applicationsReview', name: '📋・applications-review', topic: 'Application reviews.' },
            { key: 'modLogs', name: '🧾・mod-logs', topic: 'Moderation and activity logs.' },
            { key: 'tournamentStaff', name: '🏆・tournament-staff', topic: 'Tournament staff coordination.' }
        ]
    },
    {
        key: 'tickets',
        name: '〢 𝐓𝐈𝐂𝐊𝐄𝐓𝐒',
        private: 'staff',
        channels: [
            { key: 'ticketInfo', name: '🎟️・ticket-info', topic: 'Ticket category index.' }
        ]
    },
    {
        key: 'voice',
        name: '〢 𝐕𝐎𝐈𝐂𝐄',
        channels: [
            { key: 'tournamentLobby', name: '🏆・Tournament Lobby', type: ChannelType.GuildVoice },
            { key: 'staffVc', name: '🛡️・Staff VC', type: ChannelType.GuildVoice, private: 'staff' },
            { key: 'afk', name: '💤・AFK', type: ChannelType.GuildVoice, private: 'voiceNoSpeak' },
            { key: 'music', name: '🎵・Music', type: ChannelType.GuildVoice },
            { key: 'streamWaiting', name: '⏳・Waiting Room', type: ChannelType.GuildVoice, private: 'voiceWaiting' },
            { key: 'stream', name: '📺・Stream', type: ChannelType.GuildVoice, private: 'stream' }
        ]
    }
];

const CHANNEL_NAMES = Object.fromEntries(CATEGORIES.flatMap(category => category.channels.map(channel => [channel.key, channel.name])));
const CHANNEL_IDS = {
    rules: '1504532922781143061',
    support: '1504532924475904171',
    getStarted: '1504532925377675265',
    cooperations: '1504532927025909902',
    clubVerify: '1504880528002646146',
    winners: '1504532928108171376',
    matchResults: '1504532930326696106',
    updates: '1504532934944886818',
    botLog: '1504532935959646261',
    entrance: '1504532936651968625',
    profileRank: '1504532939298443385',
    profileTool: '1504532939973726312',
    creatorChat: '1504532940736958607',
    suggestions: '1504880543588946153',
    mapDesigns: '1504880550723326095',
    creatorApply: '1504532944809627704',
    cooperationApply: '1504532946449600542',
    findMates: '1504532948395884666',
    findRankedMates: '1504532949595459759',
    teamSearch: '1504532951096885471',
    tournamentRegistration: '1504532960194593029',
    tournamentGuide: '1504532961289306322',
    tournamentRules: '1504532962526625942',
    staffPanels: '1504532973905641513',
    ticketInfo: '1504532983368126716'
};
const ROTATING_PANEL_KEYS = new Set([
    'la-cooperation-apply',
    'la-creator-chat',
    'la-creator-apply',
    'la-suggestions',
    'la-profile-rank',
    'la-profile-tool',
    'la-profile-current-top',
    'la-find-mates',
    'la-find-ranked-mates',
    'la-team-search',
    'la-tournament-registration',
    'la-tournament-guide',
    'la-tournament-rules'
]);

let clientRef = null;
const inviteCache = new Map();
const serverUpdateQueues = new Map();
const serverUpdateTimers = new Map();
const serverUpdateSuppressUntil = new Map();

function registerLaVelooSystem(client) {
    clientRef = client;

    client.once('ready', async () => {
        const guild = await resolveGuild(client).catch(() => null);
        if (!guild) {
            console.warn('[LA VELOO] Target guild not found. Set GUILD_ID=1504515493950918756 on Railway.');
            return;
        }

        await registerSlashCommands(guild);
        if (AUTO_SETUP) {
            await setupLaVeloo(guild, { postPanels: false, quiet: true }).catch(error => {
                console.error('[LA VELOO] Setup failed:', error.message);
            });
        }

        await refreshInviteCache(guild).catch(error => {
            console.warn('[LA VELOO] Invite cache failed:', error.message);
        });

        await announceWeeklyProfileWinnerIfNeeded(guild).catch(error => {
            console.error('[LA VELOO] Weekly profile winner check failed:', error.message);
        });

        setInterval(() => {
            announceWeeklyProfileWinnerIfNeeded(guild).catch(error => {
                console.error('[LA VELOO] Weekly profile winner check failed:', error.message);
            });
        }, 60 * 60 * 1000);

        if (PANEL_REFRESH_INTERVAL_MS) {
            setInterval(() => {
                refreshStaticCommunityPanels(guild).catch(error => {
                    console.error('[LA VELOO] Panel refresh failed:', error.message);
                });
            }, PANEL_REFRESH_INTERVAL_MS);
        }
    });

    client.on('interactionCreate', async interaction => {
        try {
            if (!isLaInteraction(interaction)) return;
            await handleLaInteraction(interaction);
        } catch (error) {
            console.error('[LA VELOO] Interaction failed:', error);
            await safeReply(interaction, {
                content: 'Something went wrong while handling this LA VELOO action.',
                ephemeral: true
            });
        }
    });

    client.on('messageCreate', async message => {
        if (!message.guild || message.author.bot || message.guild.id !== targetGuildId()) return;
        await handleProfileRankImageMessage(message).catch(error => {
            console.error('[LA VELOO] Profile rank image handling failed:', error.message);
        });
        await handleMapDesignMessage(message).catch(error => {
            console.error('[LA VELOO] Map design handling failed:', error.message);
        });
        await storeMessageLog(message).catch(error => {
            console.error('[LA VELOO] Message log failed:', error.message);
        });
    });

    client.on('guildMemberAdd', async member => {
        if (member.guild.id !== targetGuildId() || member.user.bot) return;
        await trackMemberInvite(member).catch(error => {
            console.warn('[LA VELOO] Invite tracking failed:', error.message);
        });
        await addRole(member, 'member').catch(() => null);
        await addOgRoleIfEligible(member).catch(() => null);
        await sendWelcomeDm(member).catch(() => null);
        const entrance = await getChannel(member.guild, 'entrance');
        await entrance?.send({
            embeds: [embed('Member Joined', `${member} joined LA VELOO.\nAccount: ${member.user.tag}\nGet started: ${channelMention(member.guild, 'getStarted')}`, 0x22c55e)]
        }).catch(() => null);
    });

    client.on('guildMemberRemove', async member => {
        if (member.guild.id !== targetGuildId() || member.user.bot) return;
        const entrance = await getChannel(member.guild, 'entrance');
        await entrance?.send({
            embeds: [embed('Member Left', `${member.user.tag} left LA VELOO.\nUser ID: ${member.user.id}`, 0xef4444)]
        }).catch(() => null);
    });

    client.on('inviteCreate', async invite => {
        if (invite.guild?.id !== targetGuildId()) return;
        await refreshInviteCache(invite.guild).catch(() => null);
    });

    client.on('inviteDelete', async invite => {
        if (invite.guild?.id !== targetGuildId()) return;
        await refreshInviteCache(invite.guild).catch(() => null);
    });

    client.on('channelCreate', channel => {
        if (!channel.guild || channel.guild.id !== targetGuildId()) return;
        queueServerUpdate(channel.guild, 'added', `Channel created: **#${channel.name}**`);
    });

    client.on('channelDelete', channel => {
        if (!channel.guild || channel.guild.id !== targetGuildId()) return;
        queueServerUpdate(channel.guild, 'removed', `Channel removed: **#${channel.name}**`);
    });

    client.on('channelUpdate', (oldChannel, newChannel) => {
        if (!newChannel.guild || newChannel.guild.id !== targetGuildId()) return;
        const changes = [];
        if (oldChannel.name !== newChannel.name) {
            changes.push(`Channel renamed: **#${oldChannel.name}** → **#${newChannel.name}**`);
        }
        if ('topic' in oldChannel && oldChannel.topic !== newChannel.topic) {
            changes.push(`Channel topic updated: **#${newChannel.name}**`);
        }
        if (oldChannel.parentId !== newChannel.parentId) {
            changes.push(`Channel category moved: **#${newChannel.name}**`);
        }
        for (const change of changes) {
            queueServerUpdate(newChannel.guild, 'improved', change);
        }
    });

    client.on('roleCreate', role => {
        if (role.guild.id !== targetGuildId()) return;
        queueServerUpdate(role.guild, 'added', `Role created: **${role.name}**`);
    });

    client.on('roleDelete', role => {
        if (role.guild.id !== targetGuildId()) return;
        queueServerUpdate(role.guild, 'removed', `Role removed: **${role.name}**`);
    });

    client.on('roleUpdate', (oldRole, newRole) => {
        if (newRole.guild.id !== targetGuildId()) return;
        if (oldRole.name !== newRole.name) {
            queueServerUpdate(newRole.guild, 'improved', `Role renamed: **${oldRole.name}** → **${newRole.name}**`);
            return;
        }
        if (oldRole.color !== newRole.color || oldRole.permissions.bitfield !== newRole.permissions.bitfield || oldRole.hoist !== newRole.hoist) {
            queueServerUpdate(newRole.guild, 'improved', `Role updated: **${newRole.name}**`);
        }
    });

    client.on('guildUpdate', (oldGuild, newGuild) => {
        if (newGuild.id !== targetGuildId()) return;
        if (oldGuild.name !== newGuild.name) {
            queueServerUpdate(newGuild, 'improved', `Server name updated: **${oldGuild.name}** → **${newGuild.name}**`);
        }
        if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
            queueServerUpdate(newGuild, 'improved', 'Server verification level updated.');
        }
    });
}

async function sendWelcomeDm(member) {
    const getStarted = channelMention(member.guild, 'getStarted');
    const rules = channelMention(member.guild, 'rules');
    const mainHall = channelMention(member.guild, 'mainHall');

    await member.send({
        embeds: [
            embed(
                'Get Started First',
                [
                    `Welcome to **${member.guild.name}**.`,
                    `Start here: ${getStarted}`,
                    'Choose your platform/playstyle roles, then read the rule ticket before posting.',
                    `After that you can chat in ${mainHall}.`
                ].join('\n'),
                0x3b82f6
            ),
            embed(
                'Rules Summary',
                [
                    `Full rules: ${rules}`,
                    'Be respectful, no spam, no scam links, no cheating, no fake tournament results, and no leaking private tickets.',
                    'Use support if you need help.'
                ].join('\n'),
                0xef4444
            )
        ]
    });
}

async function refreshInviteCache(guild) {
    const invites = await guild.invites.fetch();
    inviteCache.set(guild.id, new Map(invites.map(invite => [invite.code, {
        code: invite.code,
        uses: invite.uses || 0,
        inviterId: invite.inviterId || invite.inviter?.id || null,
        url: invite.url
    }])));
}

async function trackMemberInvite(member) {
    const guild = member.guild;
    const previous = inviteCache.get(guild.id) || new Map();
    const invites = await guild.invites.fetch();
    const current = new Map(invites.map(invite => [invite.code, {
        code: invite.code,
        uses: invite.uses || 0,
        inviterId: invite.inviterId || invite.inviter?.id || null,
        url: invite.url
    }]));

    let usedInvite = null;
    for (const invite of current.values()) {
        const oldUses = previous.get(invite.code)?.uses || 0;
        if (invite.uses > oldUses) {
            usedInvite = invite;
            break;
        }
    }

    inviteCache.set(guild.id, current);

    const store = readStore();
    store.inviteStats ||= {};

    if (usedInvite?.inviterId) {
        store.inviteStats[usedInvite.inviterId] ||= { joins: 0, codes: {}, history: [] };
        const record = store.inviteStats[usedInvite.inviterId];
        record.joins += 1;
        record.codes[usedInvite.code] = (record.codes[usedInvite.code] || 0) + 1;
        record.history.push({
            memberId: member.id,
            code: usedInvite.code,
            joinedAt: new Date().toISOString()
        });
        record.history = record.history.slice(-100);
        writeStore(store);
    }

    const botLog = await getChannel(guild, 'botLog');
    const inviterText = usedInvite?.inviterId ? `<@${usedInvite.inviterId}>` : 'Unknown invite';
    await botLog?.send({
        embeds: [embed('📨 Invite Tracker', `${member} joined with invite **${usedInvite?.code || 'unknown'}**.\nInviter: ${inviterText}`, 0x38bdf8).addFields([
            { name: 'Member', value: `${member.user.tag}`, inline: true },
            { name: 'Invite Uses', value: String(usedInvite?.uses || 'unknown'), inline: true },
            { name: 'Inviter Total', value: usedInvite?.inviterId ? String(store.inviteStats?.[usedInvite.inviterId]?.joins || 0) : 'unknown', inline: true }
        ])],
        allowedMentions: { parse: [] },
        flags: SILENT_MESSAGE_FLAGS
    }).catch(() => null);
}

async function handleProfileRankImageMessage(message) {
    const profileRank = await getChannel(message.guild, 'profileRank');
    if (!profileRank || message.channelId !== profileRank.id) return;
    if (!messageHasImage(message)) return;

    await message.react('🔥').catch(() => null);

    const store = readStore();
    store.profileRankPosts ||= {};
    store.profileRankPosts[message.id] = {
        id: message.id,
        userId: message.author.id,
        channelId: message.channelId,
        imageUrls: getMessageImageUrls(message),
        createdAt: new Date().toISOString()
    };
    writeStore(store);
}

async function handleMapDesignMessage(message) {
    const mapDesigns = await getChannel(message.guild, 'mapDesigns');
    if (!mapDesigns || message.channelId !== mapDesigns.id) return;
    if (!messageHasImage(message)) return;

    await message.react('👍').catch(() => null);
    await message.react('👎').catch(() => null);
    await message.react('🗑️').catch(() => null);

    const store = readStore();
    store.mapDesignPosts ||= {};
    const existing = store.mapDesignPosts[message.id];
    if (existing?.controlMessageId) return;

    const controlMessage = await message.reply({
        embeds: [embed('🗺️ Map Design Controls', 'React with 👍 / 👎 / 🗑️. Use the button only to signal mods; it does not ban anyone.', 0x22c55e)],
        components: [mapDesignControlRow(message.id, 0)],
        allowedMentions: { repliedUser: false, parse: [] },
        flags: SILENT_MESSAGE_FLAGS
    }).catch(() => null);

    store.mapDesignPosts[message.id] = {
        id: message.id,
        userId: message.author.id,
        channelId: message.channelId,
        controlMessageId: controlMessage?.id || null,
        imageUrls: getMessageImageUrls(message),
        banSignals: [],
        createdAt: new Date().toISOString()
    };
    writeStore(store);
}

async function handleMapBanSignal(interaction, messageId) {
    const store = readStore();
    store.mapDesignPosts ||= {};
    const post = store.mapDesignPosts[messageId];
    if (!post) return safeReply(interaction, { content: 'Map design post was not found.', ephemeral: true });

    post.banSignals ||= [];
    if (!post.banSignals.includes(interaction.user.id)) {
        post.banSignals.push(interaction.user.id);
    }
    store.mapDesignPosts[messageId] = post;
    writeStore(store);

    const channel = await interaction.guild.channels.fetch(post.channelId).catch(() => null);
    const messageUrl = channel ? discordMessageUrl(interaction.guild.id, channel.id, messageId) : 'Message unavailable';
    const modLog = await getChannel(interaction.guild, 'modLogs') || await getChannel(interaction.guild, 'staffPanels');

    await modLog?.send({
        embeds: [embed('🚩 Map Design Mod Signal', `${interaction.user} signaled a map design for mod review.\n[Open map design](${messageUrl})`, 0xef4444).addFields([
            { name: 'Posted By', value: `<@${post.userId}>`, inline: true },
            { name: 'Signals', value: String(post.banSignals.length), inline: true }
        ])],
        allowedMentions: { parse: [] }
    }).catch(() => null);

    await interaction.update({
        components: [mapDesignControlRow(messageId, post.banSignals.length)],
        embeds: interaction.message.embeds,
        allowedMentions: { parse: [] }
    }).catch(() => null);

    return safeReply(interaction, { content: 'Mods were signaled. No one was banned.', ephemeral: true });
}

function messageHasImage(message) {
    return getMessageImageUrls(message).length > 0;
}

function getMessageImageUrls(message) {
    const urls = [];
    for (const attachment of message.attachments.values()) {
        const isImage = attachment.contentType?.startsWith('image/')
            || /\.(png|jpe?g|gif|webp)$/i.test(attachment.name || attachment.url || '');
        if (isImage && attachment.url) urls.push(attachment.url);
    }

    for (const messageEmbed of message.embeds || []) {
        if (messageEmbed.image?.url) urls.push(messageEmbed.image.url);
        if (messageEmbed.thumbnail?.url) urls.push(messageEmbed.thumbnail.url);
    }

    return [...new Set(urls)].slice(0, 5);
}

function isLaInteraction(interaction) {
    if (interaction.isChatInputCommand?.()) {
        return ['setup-la-veloo', 'la-message-snapshot'].includes(interaction.commandName);
    }

    const customId = interaction.customId || '';
    return customId.startsWith('la_');
}

async function handleLaInteraction(interaction) {
    if (interaction.isChatInputCommand?.()) {
        if (interaction.commandName === 'setup-la-veloo') {
            if (!interaction.memberPermissions?.has(PERMS.Administrator)) {
                return safeReply(interaction, { content: 'Only admins can run this setup.', ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });
            await setupLaVeloo(interaction.guild, { postPanels: true });
            return interaction.editReply('LA VELOO setup refreshed: channels, roles, permissions, panels, and review flows are ready.');
        }

        if (interaction.commandName === 'la-message-snapshot') {
            if (!interaction.memberPermissions?.has(PERMS.ManageMessages)) {
                return safeReply(interaction, { content: 'Only staff can refresh the message snapshot.', ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });
            await updateMessageSnapshotPanel(interaction.guild, true);
            return interaction.editReply('Staff message snapshot refreshed.');
        }
    }

    if (interaction.isStringSelectMenu?.()) {
        if (interaction.customId === 'la_roles_select') return handleSelfRoles(interaction);
        if (interaction.customId.startsWith('la_panel_lang_')) return handlePanelLanguageSelect(interaction);
    }

    if (interaction.isButton?.()) {
        const id = interaction.customId;

        if (id === 'la_support_open') return showSupportModal(interaction);
        if (id === 'la_creator_apply') return showCreatorModal(interaction);
        if (id === 'la_coop_apply') return showCooperationModal(interaction);
        if (id === 'la_tournament_apply') return showTournamentModal(interaction);
        if (id === 'la_club_verify') return showClubVerifyModal(interaction);
        if (id === 'la_suggestion_submit') return showSuggestionModal(interaction);
        if (id === 'la_findmates_post') return showMatePostModal(interaction, 'casual');
        if (id === 'la_findranked_post') return showMatePostModal(interaction, 'ranked');
        if (id === 'la_teamsearch_post') return showMatePostModal(interaction, 'team');
        if (id === 'la_profile_submit') return showBrawlifyProfileModal(interaction);
        if (id === 'la_ticket_accept') return handleTicketDecision(interaction, 'accepted');
        if (id === 'la_ticket_decline') return handleTicketDecision(interaction, 'declined');
        if (id === 'la_ticket_delete') return handleTicketDelete(interaction);

        if (id.startsWith('la_app_accept_')) return handleApplicationDecision(interaction, id.replace('la_app_accept_', ''), true);
        if (id.startsWith('la_app_decline_')) return handleApplicationDecision(interaction, id.replace('la_app_decline_', ''), false);
        if (id.startsWith('la_mate_connect_')) return showMateConnectModal(interaction, id.replace('la_mate_connect_', ''));
        if (id.startsWith('la_mate_accept_')) return handleMateDecision(interaction, id.replace('la_mate_accept_', ''), true);
        if (id.startsWith('la_mate_decline_')) return handleMateDecision(interaction, id.replace('la_mate_decline_', ''), false);
        if (id.startsWith('la_profile_like_')) return handleProfileLike(interaction, id.replace('la_profile_like_', ''));
        if (id.startsWith('la_suggest_up_')) return handleSuggestionVote(interaction, id.replace('la_suggest_up_', ''), 'up');
        if (id.startsWith('la_suggest_down_')) return handleSuggestionVote(interaction, id.replace('la_suggest_down_', ''), 'down');
        if (id.startsWith('la_suggest_trash_')) return handleSuggestionVote(interaction, id.replace('la_suggest_trash_', ''), 'trash');
        if (id.startsWith('la_map_ban_')) return handleMapBanSignal(interaction, id.replace('la_map_ban_', ''));
    }

    if (interaction.isModalSubmit?.()) {
        const id = interaction.customId;
        if (id === 'la_support_modal') return createSupportTicket(interaction);
        if (id === 'la_creator_modal') return createApplication(interaction, 'creator');
        if (id === 'la_coop_modal') return createApplication(interaction, 'cooperation');
        if (id === 'la_tournament_modal') return createApplication(interaction, 'tournament');
        if (id === 'la_club_modal') return createClubVerification(interaction);
        if (id === 'la_suggestion_modal') return createSuggestionPost(interaction);
        if (id === 'la_profile_modal') return createBrawlifyProfilePost(interaction);
        if (id.startsWith('la_mate_post_modal_')) return createMatePost(interaction, id.replace('la_mate_post_modal_', ''));
        if (id.startsWith('la_mate_connect_modal_')) return createMateRequest(interaction, id.replace('la_mate_connect_modal_', ''));
    }
}

async function setupLaVeloo(guild, options = {}) {
    suppressServerUpdateEvents(guild, 90_000);
    await guild.roles.fetch().catch(() => null);
    await guild.channels.fetch().catch(() => null);

    const roles = await ensureRoles(guild);
    const channels = await ensureChannels(guild, roles);
    await assignMemberRoleToCurrentMembers(guild, roles.member).catch(error => {
        console.warn('[LA VELOO] Existing member role sync failed:', error.message);
    });
    await assignOgRoleToFirstMembers(guild, roles.og).catch(error => {
        console.warn('[LA VELOO] OG role sync failed:', error.message);
    });

    const store = readStore();
    store.guildId = guild.id;
    store.lastSetupAt = new Date().toISOString();
    store.managedStructure = false;
    writeStore(store);

    if (options.postPanels !== false) {
        await postLaPanels(guild, channels);
    }

    if (!options.quiet) {
        await staffLog(guild, 'Setup refreshed', 'LA VELOO panels were refreshed using existing server channels. No roles or server structure were created.');
        await postSetupStatusUpdate(guild, {
            panelsRefreshed: options.postPanels !== false,
            quiet: Boolean(options.quiet)
        }).catch(error => {
            console.warn('[LA VELOO] Setup status update failed:', error.message);
        });
    }
    return { roles, channels };
}

function suppressServerUpdateEvents(guild, durationMs) {
    serverUpdateSuppressUntil.set(guild.id, Date.now() + durationMs);
}

function queueServerUpdate(guild, type, text) {
    if (!guild || guild.id !== targetGuildId()) return;
    if (Date.now() < (serverUpdateSuppressUntil.get(guild.id) || 0)) return;

    const queue = serverUpdateQueues.get(guild.id) || {
        guild,
        added: [],
        improved: [],
        removed: []
    };

    queue[type] ||= [];
    if (!queue[type].includes(text)) {
        queue[type].push(text);
    }
    serverUpdateQueues.set(guild.id, queue);

    if (serverUpdateTimers.has(guild.id)) {
        return;
    }

    const timer = setTimeout(() => {
        serverUpdateTimers.delete(guild.id);
        flushServerUpdateQueue(guild.id).catch(error => {
            console.warn('[LA VELOO] Server update flush failed:', error.message);
        });
    }, 45_000);

    serverUpdateTimers.set(guild.id, timer);
}

async function flushServerUpdateQueue(guildId) {
    const queue = serverUpdateQueues.get(guildId);
    if (!queue) return;
    serverUpdateQueues.delete(guildId);

    const total = queue.added.length + queue.improved.length + queue.removed.length;
    if (!total) return;

    await postServerStatusUpdate(queue.guild, {
        title: '🛠️ LA VELOO STATUS | SERVER UPDATE',
        added: queue.added,
        improved: queue.improved,
        removed: queue.removed,
        note: [
            'Server changes were detected and bundled automatically.',
            'LA VELOO archive // PROTOCOL UPDATED'
        ].join('\n')
    });
}

async function postSetupStatusUpdate(guild, meta = {}) {
    const store = readStore();
    const setupHash = [
        Object.keys(store.created?.roles || {}).length,
        Object.keys(store.created?.channels || {}).length,
        meta.panelsRefreshed ? 'panels' : 'no-panels'
    ].join(':');

    if (store.lastPublicSetupUpdateHash === setupHash && !meta.panelsRefreshed) {
        return;
    }

    store.lastPublicSetupUpdateHash = setupHash;
    store.lastPublicSetupUpdateAt = new Date().toISOString();
    writeStore(store);

    await postServerStatusUpdate(guild, {
        title: '🛠️ LA VELOO STATUS | SYSTEM UPDATE',
        added: [
            'Bot systems checked using the existing Discord channels.',
            'Club Verification, Suggestions, Map Designs, Team Search, and Tournament panels are included.'
        ],
        improved: [
            meta.panelsRefreshed
                ? 'Panels were refreshed manually with `/setup-la-veloo`.'
                : 'Startup refresh ran quietly without reposting public panels.',
            'No roles, channels, permissions, or server settings were created by setup.'
        ],
        removed: [
            'Automatic role/channel creation is disabled.'
        ],
        note: [
            'The LA VELOO bot was refreshed in existing-server mode. Members can use the latest panels, verification flows, and community systems.',
            'LA VELOO archive // PROTOCOL UPDATED'
        ].join('\n')
    });
}

async function postServerStatusUpdate(guild, update) {
    const channel = await getChannel(guild, 'updates');
    if (!channel || channel.type !== ChannelType.GuildText) return;

    const updateEmbed = embed(update.title, update.note || 'LA VELOO server update.', 0x38bdf8)
        .addFields([
            { name: '🟢 ADDED', value: formatUpdateLines(update.added, 'No new additions.'), inline: false },
            { name: '🟡 IMPROVED', value: formatUpdateLines(update.improved, 'No improvements listed.'), inline: false },
            { name: '🔴 REMOVED / CLEANED', value: formatUpdateLines(update.removed, 'Nothing removed.'), inline: false },
            { name: '⚡ SYSTEM-NOTIZ', value: cleanValue(update.note || 'LA VELOO archive // PROTOCOL UPDATED', 950), inline: false }
        ])
        .setTimestamp(new Date());

    await channel.send(panelSendPayload({ embeds: [updateEmbed] })).catch(() => null);
}

function formatUpdateLines(lines, fallback) {
    const cleanLines = (lines || [])
        .filter(Boolean)
        .map(line => `• ${cleanValue(line, 180)}`)
        .slice(0, 8);

    return cleanLines.length ? cleanLines.join('\n') : fallback;
}

async function refreshStaticCommunityPanels(guild) {
    await guild.channels.fetch().catch(() => null);
    const channels = await getKnownChannels(guild);
    await postLaPanels(guild, channels, { resend: true });
}

async function getKnownChannels(guild) {
    const keys = CATEGORIES.flatMap(category => category.channels.map(channel => channel.key));
    const entries = [];

    for (const key of keys) {
        entries.push([key, await getChannel(guild, key)]);
    }

    return Object.fromEntries(entries);
}

async function assignMemberRoleToCurrentMembers(guild, memberRole) {
    if (!memberRole) return;
    const members = await guild.members.fetch().catch(() => null);
    if (!members) return;

    for (const member of members.values()) {
        if (!member.user.bot && !member.roles.cache.has(memberRole.id)) {
            await member.roles.add(memberRole, 'LA VELOO member role sync').catch(() => null);
        }
    }
}

async function assignOgRoleToFirstMembers(guild, ogRole) {
    if (!ogRole) return;
    const members = await guild.members.fetch().catch(() => null);
    if (!members) return;

    const firstHundred = [...members.values()]
        .filter(member => !member.user.bot)
        .sort((a, b) => (a.joinedTimestamp || 0) - (b.joinedTimestamp || 0))
        .slice(0, 100);

    for (const member of firstHundred) {
        if (!member.roles.cache.has(ogRole.id)) {
            await member.roles.add(ogRole, 'LA VELOO first 100 OG role').catch(() => null);
        }
    }
}

async function addOgRoleIfEligible(member) {
    const ogRole = findRole(member.guild, 'og');
    if (!ogRole || member.roles.cache.has(ogRole.id)) return;

    const members = await member.guild.members.fetch().catch(() => null);
    if (!members) return;

    const humanMembers = [...members.values()].filter(candidate => !candidate.user.bot);
    if (humanMembers.length <= 100) {
        await member.roles.add(ogRole, 'LA VELOO first 100 OG role').catch(() => null);
    }
}

async function deleteDeprecatedChannels(guild) {
    return null;
}

async function ensureRoles(guild) {
    const roles = {};
    const store = readStore();
    store.created ||= { roles: {}, channels: {}, privateChannels: {} };
    store.created.roles ||= {};

    for (const definition of ROLE_DEFINITIONS) {
        const name = ROLE_NAMES[definition.key];
        const storedId = store.created.roles[definition.key];
        let role = storedId ? await guild.roles.fetch(storedId).catch(() => null) : null;

        if (!role) {
            role = guild.roles.cache.find(existing => existing.name === name) || null;
        }

        if (role) {
            store.created.roles[definition.key] = role.id;
            roles[definition.key] = role;
        } else {
            delete store.created.roles[definition.key];
        }
    }

    writeStore(store);
    return roles;
}

async function removeDuplicateRoles(guild, roleName, keeper) {
    const duplicates = guild.roles.cache
        .filter(role => role.name === roleName && role.id !== keeper.id)
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp);

    if (!duplicates.size) return;

    const members = await guild.members.fetch().catch(() => null);

    for (const duplicate of duplicates.values()) {
        if (members) {
            for (const member of members.values()) {
                if (member.roles.cache.has(duplicate.id) && !member.roles.cache.has(keeper.id)) {
                    await member.roles.add(keeper, 'LA VELOO role dedupe').catch(() => null);
                }
            }
        }

        if (duplicate.editable) {
            await duplicate.delete('LA VELOO duplicate role cleanup').catch(() => null);
        }
    }
}

async function ensureChannels(guild, roles) {
    const channels = {};
    const store = readStore();
    store.created ||= { roles: {}, channels: {}, privateChannels: {} };
    store.created.channels ||= {};

    for (const categoryDefinition of CATEGORIES) {
        for (const channelDefinition of categoryDefinition.channels) {
            const channel = await resolveExistingChannel(guild, channelDefinition.key);
            if (channel) {
                channels[channelDefinition.key] = channel;
                store.created.channels[channelDefinition.key] = channel.id;
            }
        }
    }

    writeStore(store);

    return channels;
}

async function ensureChannel(guild, options) {
    return resolveExistingChannel(guild, options.key || options.name);
}

async function resolveExistingChannel(guild, key) {
    const id = CHANNEL_IDS[key];
    if (id) {
        const byId = await guild.channels.fetch(id).catch(() => null);
        if (byId) return byId;
    }

    return guild.channels.cache.find(channel => channel.name === CHANNEL_NAMES[key]) || null;
}

function permissionOverwrites(guild, roles, privacy) {
    const channelManagementDeny = [PERMS.ManageChannels, PERMS.ManageRoles, PERMS.ManageWebhooks];

    const botOverwrite = clientRef?.user ? {
        id: clientRef.user.id,
        allow: [
            PERMS.ViewChannel,
            PERMS.SendMessages,
            PERMS.ReadMessageHistory,
            PERMS.ManageChannels,
            PERMS.ManageMessages,
            PERMS.Connect,
            PERMS.Speak,
            PERMS.MoveMembers
        ]
    } : null;

    const memberRole = roles.member || null;
    const ownerOverwrite = roles.owner ? {
        id: roles.owner.id,
        allow: [
            PERMS.ViewChannel,
            PERMS.SendMessages,
            PERMS.ReadMessageHistory,
            PERMS.ManageChannels,
            PERMS.ManageRoles,
            PERMS.ManageWebhooks,
            PERMS.ManageMessages,
            PERMS.Connect,
            PERMS.Speak,
            PERMS.MoveMembers
        ]
    } : null;
    const lockedTextDeny = [
        ...channelManagementDeny,
        PERMS.SendMessages,
        PERMS.SendMessagesInThreads,
        PERMS.CreatePublicThreads,
        PERMS.CreatePrivateThreads,
        PERMS.AttachFiles,
        PERMS.AddReactions
    ];

    const staff = STAFF_ROLE_KEYS
        .map(key => roles[key])
        .filter(Boolean)
        .filter(role => role.id !== roles.owner?.id)
        .map(role => ({
            id: role.id,
            allow: [PERMS.ViewChannel, PERMS.SendMessages, PERMS.ReadMessageHistory, PERMS.ManageMessages, PERMS.Connect, PERMS.Speak, PERMS.MoveMembers],
            deny: channelManagementDeny
        }));

    if (!privacy) {
        return [
            { id: guild.roles.everyone.id, allow: [PERMS.ViewChannel, PERMS.ReadMessageHistory], deny: channelManagementDeny },
            memberRole ? { id: memberRole.id, allow: [PERMS.ViewChannel, PERMS.ReadMessageHistory], deny: channelManagementDeny } : null,
            botOverwrite,
            ownerOverwrite
        ].filter(Boolean);
    }

    if (privacy === 'locked') {
        return [
            { id: guild.roles.everyone.id, allow: [PERMS.ViewChannel, PERMS.ReadMessageHistory], deny: lockedTextDeny },
            memberRole ? { id: memberRole.id, allow: [PERMS.ViewChannel, PERMS.ReadMessageHistory], deny: lockedTextDeny } : null,
            botOverwrite,
            ownerOverwrite,
            ...staff
        ].filter(Boolean);
    }

    if (privacy === 'community') {
        return [
            { id: guild.roles.everyone.id, allow: [PERMS.ViewChannel, PERMS.ReadMessageHistory], deny: lockedTextDeny },
            memberRole ? {
                id: memberRole.id,
                allow: [PERMS.ViewChannel, PERMS.SendMessages, PERMS.ReadMessageHistory, PERMS.AttachFiles, PERMS.AddReactions],
                deny: channelManagementDeny
            } : null,
            botOverwrite,
            ownerOverwrite,
            ...staff
        ].filter(Boolean);
    }

    if (privacy === 'voiceNoSpeak' || privacy === 'voiceWaiting') {
        return [
            { id: guild.roles.everyone.id, allow: [PERMS.ViewChannel, PERMS.Connect], deny: [...channelManagementDeny, PERMS.Speak, PERMS.Stream] },
            memberRole ? { id: memberRole.id, allow: [PERMS.ViewChannel, PERMS.Connect], deny: [...channelManagementDeny, PERMS.Speak, PERMS.Stream] } : null,
            botOverwrite,
            ownerOverwrite,
            ...staff
        ].filter(Boolean);
    }

    if (privacy === 'stream') {
        return [
            { id: guild.roles.everyone.id, allow: [PERMS.ViewChannel], deny: [...channelManagementDeny, PERMS.Connect, PERMS.Speak] },
            memberRole ? { id: memberRole.id, allow: [PERMS.ViewChannel], deny: [...channelManagementDeny, PERMS.Connect, PERMS.Speak] } : null,
            botOverwrite,
            ownerOverwrite,
            ...staff
        ].filter(Boolean);
    }

    if (privacy === 'staff') {
        return [
            { id: guild.roles.everyone.id, deny: [PERMS.ViewChannel, ...channelManagementDeny] },
            botOverwrite,
            ownerOverwrite,
            ...staff
        ].filter(Boolean);
    }

    if (privacy === 'tournament') {
        return [
            { id: guild.roles.everyone.id, deny: [PERMS.ViewChannel, ...channelManagementDeny] },
            botOverwrite,
            ownerOverwrite,
            {
                id: roles.tournamentVerified.id,
                allow: [PERMS.ViewChannel, PERMS.SendMessages, PERMS.ReadMessageHistory, PERMS.Connect, PERMS.Speak],
                deny: channelManagementDeny
            },
            ...staff
        ].filter(Boolean);
    }

    return [];
}

async function resolveCommunityChannel(guild, channelId, fallbackChannel) {
    if (channelId) {
        const channel = await guild.channels.fetch(channelId).catch(() => null);
        if (channel?.type === ChannelType.GuildText) {
            return channel;
        }
    }

    return fallbackChannel || null;
}

async function postLaPanels(guild, channels, options = {}) {
    const panelOptions = { resend: Boolean(options.resend) };

    await upsertPanel(channels.rules, 'la-rules', localizedPanelPayload('rules'), panelOptions);

    await upsertPanel(channels.getStarted, 'la-get-started', localizedPanelPayload('getStarted'), panelOptions);

    await upsertPanel(channels.support, 'la-support', localizedPanelPayload('support'), panelOptions);
    await upsertPanel(channels.clubVerify, 'la-club-verify', localizedPanelPayload('clubVerify'), panelOptions);

    await upsertPanel(channels.cooperations, 'la-cooperation-public', localizedPanelPayload('cooperation'), panelOptions);
    await upsertPanel(channels.cooperationApply, 'la-cooperation-apply', localizedPanelPayload('cooperation'), panelOptions);

    await upsertPanel(channels.creatorChat, 'la-creator-chat', localizedPanelPayload('creator'), panelOptions);
    await upsertPanel(channels.creatorApply, 'la-creator-apply', localizedPanelPayload('creator'), panelOptions);
    await upsertPanel(channels.suggestions, 'la-suggestions', localizedPanelPayload('suggestions'), panelOptions);
    await upsertPanel(channels.mapDesigns, 'la-map-designs', localizedPanelPayload('mapDesigns'), panelOptions);

    await upsertPanel(channels.profileRank, 'la-profile-rank', localizedPanelPayload('profileRank'), panelOptions);
    await upsertPanel(channels.profileTool, 'la-profile-tool', localizedPanelPayload('profileTool'), panelOptions);
    await updateCurrentProfileLeaderboardPanel(guild, panelOptions);

    await upsertPanel(channels.findMates, 'la-find-mates', localizedPanelPayload('findMates'), panelOptions);
    await upsertPanel(channels.findRankedMates, 'la-find-ranked-mates', localizedPanelPayload('findRankedMates'), panelOptions);
    await upsertPanel(channels.teamSearch, 'la-team-search', localizedPanelPayload('teamSearch'), panelOptions);

    await upsertPanel(channels.tournamentRegistration, 'la-tournament-registration', localizedPanelPayload('tournamentRegistration'), panelOptions);

    await upsertPanel(channels.tournamentGuide, 'la-tournament-guide', localizedPanelPayload('tournamentGuide'), panelOptions);
    await upsertPanel(channels.tournamentRules, 'la-tournament-rules', localizedPanelPayload('tournamentRules'), panelOptions);

    await upsertPanel(channels.staffPanels, 'la-staff-panels', localizedPanelPayload('staffPanels'));

    await upsertPanel(channels.ticketInfo, 'la-ticket-info', localizedPanelPayload('ticketInfo'), panelOptions);
    await updateMessageSnapshotPanel(guild, false);
}

function localizedPanelPayload(panelId, language = getPanelLanguage(panelId)) {
    const lang = normalizePanelLanguage(language);
    const copy = getPanelCopy(panelId, lang);
    const components = [];

    if (panelId === 'getStarted') {
        components.push(selfRoleRow(lang));
    }

    if (copy.button) {
        components.push(buttonRow(
            new ButtonBuilder()
                .setCustomId(copy.button.customId)
                .setLabel(copy.button.label)
                .setStyle(copy.button.style || ButtonStyle.Primary)
        ));
    }

    components.push(panelLanguageRow(panelId, lang));

    const panelEmbed = embed(copy.title, copy.description, copy.color || 0x111827);
    if (copy.fields?.length) {
        panelEmbed.addFields(copy.fields);
    }

    return {
        embeds: [panelEmbed],
        components
    };
}

function getPanelCopy(panelId, language) {
    const lang = normalizePanelLanguage(language);
    const copies = {
        en: {
            rules: {
                title: 'LA VELOO Rule Ticket',
                color: 0xef4444,
                description: 'Read these rules before using the server. This message is the official rule ticket and stays updated automatically.',
                fields: [
                    ['1. Respect', 'Be respectful to every member. No harassment, hate speech, threats, racism, sexism, bullying, or drama baiting.'],
                    ['2. No Spam', 'Do not spam messages, emojis, caps, pings, links, commands, repeated images, or unnecessary mentions.'],
                    ['3. Safe Links Only', 'No scam links, fake free-gem links, token links, suspicious downloads, fake reward pages, or phishing attempts.'],
                    ['4. Channel Topics', 'Use the correct channels: main chat in main-hall, mate search in Find Mates, tournament content in Tournament, and help in Support.'],
                    ['5. Brawl Stars Fair Play', 'No account selling, boosting, win trading, cheating, exploits, or anything against Brawl Stars fair-play rules.'],
                    ['6. Tournament Rules', 'Tournament staff decisions are final after review. Fake results, no-shows, toxic behavior, or cheating can remove your tournament access.'],
                    ['7. Tickets & Applications', 'Use tickets and application panels honestly. Fake information can lead to declined applications or moderation action.'],
                    ['8. Privacy', 'Do not leak private chats, personal information, screenshots from private tickets, or anyone else’s account details.'],
                    ['9. Staff Decisions', 'Listen to owners, admins, moderators, and tournament staff. If you disagree, open a support ticket calmly.'],
                    ['10. Discord Terms', 'Follow Discord Terms of Service and Community Guidelines at all times.']
                ]
            },
            getStarted: {
                title: 'Get Started Tutorial',
                description: [
                    'Welcome to LA VELOO. Follow this quick tutorial to use the server correctly.',
                    '',
                    '**1. Choose Your Roles**',
                    'Use the menu below to select your platform and playstyle: PC, Mobile, iPad, 3v3, Solo, Duo, Ranked, Team Player, and ping roles.',
                    '',
                    '**2. Read The Rules**',
                    'Go to the rules channel and read the LA VELOO Rule Ticket before posting.',
                    '',
                    '**3. Main Community**',
                    'Use main-hall for normal chat, clips-media for clips and screenshots, memes for memes, and profile-rank for ranks or trophy progress.',
                    '',
                    '**4. Brawlify Profile Tool**',
                    'In profile-tool, enter your player ID like `QQVVP9G0`. The bot posts your Brawlify profile, people can like it with 🔥, and the weekly top profile gets XP.',
                    '',
                    '**5. Find Mates**',
                    'Use find-mates or find-ranked-mates to create a player card. Other players can request to connect. If you accept, the bot creates a private text and voice channel.',
                    '',
                    '**6. Tournaments**',
                    'Use tournament-registration to apply. Staff reviews your answers. If accepted, you get Tournament Verified and unlock tournament guide, rules, chat, brackets, submit, and disputes.',
                    '',
                    '**7. Support**',
                    'Use support if you need help. The bot creates a private ticket with you, moderators, and owners.',
                    '',
                    '**8. Creator & Cooperation**',
                    'Creators can apply in creator-chat or creator-apply. Cooperations can apply in cooperations or cooperation-apply. Accepted cooperations are posted publicly.',
                    '',
                    '**9. Free BS Stuff**',
                    'Use free-bs-stuff and official-rewards only for safe, official Brawl Stars rewards and alerts.',
                    '',
                    '**10. Voice Channels**',
                    'Use Tournament Lobby for events, Music for music, Stream for streaming, and AFK when inactive.'
                ].join('\n')
            },
            support: {
                title: 'Support',
                description: 'Open a private support ticket for questions, bugs, tournament problems, or server help.',
                button: { customId: 'la_support_open', label: 'Create Ticket' }
            },
            clubVerify: {
                title: 'Club Verification',
                description: 'Create a club verification ticket. Staff checks your player name, rank, and profile proof. You receive a DM when accepted or declined.',
                button: { customId: 'la_club_verify', label: 'Verify For Club', style: ButtonStyle.Success }
            },
            cooperation: {
                title: 'Cooperations',
                description: 'Apply for a cooperation. Staff reviews it privately; accepted cooperations are published here automatically.',
                button: { customId: 'la_coop_apply', label: 'Apply For Cooperation' }
            },
            creator: {
                title: 'Creator Application',
                description: 'Apply as a creator and answer the creator questions. Accepted creators receive the creator role.',
                button: { customId: 'la_creator_apply', label: 'Apply As Creator' }
            },
            profileRank: {
                title: 'Profile Rank',
                color: 0x22c55e,
                description: 'Post a screenshot of your Brawl Stars profile here. The bot adds a fire reaction so the community can react to your progress.'
            },
            suggestions: {
                title: 'Suggestions',
                color: 0x38bdf8,
                description: 'Submit an improvement idea for the server. The bot posts it as a card with like, dislike, and trash votes.',
                button: { customId: 'la_suggestion_submit', label: 'Submit Suggestion' }
            },
            mapDesigns: {
                title: 'Map Designs',
                color: 0x22c55e,
                description: 'Post a map-design image here. The bot adds reactions and a mod-signal button for risky designs.'
            },
            profileTool: {
                title: 'Brawlify Profile Tool',
                color: 0xf97316,
                description: 'Enter your Brawl Stars player ID, for example `QQVVP9G0`.\n\nThe bot posts your Brawlify profile link, tries to show profile images from the page, and lets the community like it with 🔥.\nThe most liked profile of the week is shown here and receives level XP.',
                button: { customId: 'la_profile_submit', label: 'Submit Player ID' }
            },
            findMates: {
                title: 'Find Mates',
                description: 'Create a player card with trophies, rank, device, mode, and a profile image link.',
                button: { customId: 'la_findmates_post', label: 'Create Player Card' }
            },
            findRankedMates: {
                title: 'Find Ranked Mates',
                description: 'Create a ranked player card so people can apply to connect with you.',
                button: { customId: 'la_findranked_post', label: 'Create Player Card' }
            },
            teamSearch: {
                title: 'Team Search',
                description: 'Create a team-search card with trophies, rank, device, role, and what team you want to join.',
                button: { customId: 'la_teamsearch_post', label: 'Search Team' }
            },
            tournamentRegistration: {
                title: 'Tournament Registration',
                description: 'Register for tournaments here.\n\nYou will be asked if you follow @anxsog on TikTok, how many trophies you have, if you are in the club, your rank, and why you want to join.\nStaff reviews your registration. If accepted, you receive Tournament Verified and unlock the tournament channels.',
                button: { customId: 'la_tournament_apply', label: 'Register', style: ButtonStyle.Success }
            },
            tournamentGuide: {
                title: 'Tournament Guide',
                description: 'Staff can edit this guide later. This channel is visible only for Tournament Verified players.'
            },
            tournamentRules: {
                title: 'Tournament Rules',
                description: 'Staff can add final tournament rules here. This channel is visible only for Tournament Verified players.'
            },
            staffPanels: {
                title: 'Staff Panels',
                description: 'All bot-created reviews and panel records are routed here.\n\nReview flows:\n- Creator applications\n- Cooperation applications\n- Tournament registrations\n- Find Mates / Ranked / Team Search connect requests\n- Message activity snapshots'
            },
            ticketInfo: {
                title: 'Ticket Area',
                description: 'Tickets are created automatically in this category. Only staff, the bot, and the affected members can see them.'
            }
        },
        de: {
            rules: {
                title: 'LA VELOO Regel-Ticket',
                color: 0xef4444,
                description: 'Lies diese Regeln, bevor du den Server nutzt. Diese Nachricht ist das offizielle Regel-Ticket und wird automatisch aktuell gehalten.',
                fields: [
                    ['1. Respekt', 'Sei respektvoll zu allen Mitgliedern. Keine Beleidigungen, Drohungen, Hetze, Diskriminierung, Mobbing oder unnötiges Drama.'],
                    ['2. Kein Spam', 'Spam keine Nachrichten, Emojis, Caps, Pings, Links, Commands, Bilder oder unnötige Erwähnungen.'],
                    ['3. Nur sichere Links', 'Keine Scam-Links, Fake-Free-Gem-Links, Token-Links, verdächtige Downloads, Fake-Rewards oder Phishing.'],
                    ['4. Channel richtig nutzen', 'Nutze die richtigen Channels: main-hall für Chat, Find Mates für Mate-Suche, Tournament für Turniere und Support für Hilfe.'],
                    ['5. Brawl Stars Fair Play', 'Kein Account-Verkauf, Boosting, Wintrading, Cheating, Exploits oder Verstöße gegen Fair-Play-Regeln.'],
                    ['6. Turnierregeln', 'Entscheidungen vom Tournament Staff gelten nach Prüfung. Fake-Ergebnisse, No-Shows, Toxizität oder Cheating können Turnierzugriff entfernen.'],
                    ['7. Tickets & Bewerbungen', 'Nutze Tickets und Bewerbungen ehrlich. Fake-Infos können zu Ablehnung oder Moderation führen.'],
                    ['8. Privatsphäre', 'Keine privaten Chats, persönlichen Daten, Ticket-Screenshots oder fremden Accountdaten leaken.'],
                    ['9. Staff-Entscheidungen', 'Höre auf Owner, Admins, Mods und Tournament Staff. Bei Problemen ruhig ein Support-Ticket öffnen.'],
                    ['10. Discord Regeln', 'Halte dich immer an Discord Terms of Service und Community Guidelines.']
                ]
            },
            getStarted: {
                title: 'Get Started Tutorial',
                description: 'Willkommen bei LA VELOO. Folge diesem Tutorial, um den Server richtig zu nutzen.\n\n**1. Rollen auswählen**\nWähle unten Plattform und Playstyle: PC, Mobile, iPad, 3v3, Solo, Duo, Ranked, Team Player und Ping-Rollen.\n\n**2. Regeln lesen**\nLies im Rules-Channel das LA VELOO Regel-Ticket.\n\n**3. Community nutzen**\nmain-hall ist für normalen Chat, clips-media für Clips, memes für Memes und profile-rank für Rank/Trophäen-Fortschritt.\n\n**4. Brawlify Profile Tool**\nIn profile-tool gibst du deine Player-ID ein, z. B. `QQVVP9G0`. Der Bot postet dein Brawlify-Profil, andere liken mit 🔥, und das Wochen-Top bekommt XP.\n\n**5. Find Mates**\nIn find-mates oder find-ranked-mates erstellst du eine Player Card. Wenn jemand connecten will und du annimmst, erstellt der Bot private Text- und Voice-Channels.\n\n**6. Turniere**\nIn tournament-registration bewirbst du dich. Wenn Staff dich annimmt, bekommst du Tournament Verified und siehst Guide, Rules, Chat, Brackets, Submit und Disputes.\n\n**7. Support**\nBei Fragen erstellt support ein privates Ticket mit dir, Mods und Ownern.\n\n**8. Creator & Cooperation**\nCreator bewerben sich in creator-chat oder creator-apply. Cooperations in cooperations oder cooperation-apply. Angenommene Cooperations werden veröffentlicht.\n\n**9. Free BS Stuff**\nfree-bs-stuff und official-rewards sind nur für sichere, offizielle Brawl-Stars-Rewards.\n\n**10. Voice Channels**\nNutze Tournament Lobby für Events, Music für Musik, Stream fürs Streamen und AFK wenn du abwesend bist.'
            },
            support: {
                title: 'Support',
                description: 'Öffne ein privates Support-Ticket für Fragen, Bugs, Turnierprobleme oder Serverhilfe.',
                button: { customId: 'la_support_open', label: 'Ticket erstellen' }
            },
            clubVerify: {
                title: 'Club Verification',
                description: 'Erstelle ein Club-Verification Ticket. Staff prüft Profilnamen, Rank und Profilnachweis. Du bekommst eine DM bei Annahme oder Ablehnung.',
                button: { customId: 'la_club_verify', label: 'Für Club verifizieren', style: ButtonStyle.Success }
            },
            cooperation: {
                title: 'Cooperations',
                description: 'Bewirb dich für eine Cooperation. Staff prüft sie privat; angenommene Cooperations werden automatisch öffentlich gepostet.',
                button: { customId: 'la_coop_apply', label: 'Cooperation bewerben' }
            },
            creator: {
                title: 'Creator Bewerbung',
                description: 'Bewirb dich als Creator und beantworte die Creator-Fragen. Angenommene Creator bekommen die Creator-Rolle.',
                button: { customId: 'la_creator_apply', label: 'Als Creator bewerben' }
            },
            profileRank: {
                title: 'Profile Rank',
                color: 0x22c55e,
                description: 'Poste hier einen Screenshot von deinem Brawl-Stars-Profil. Der Bot setzt eine Fire-Reaction, damit die Community reagieren kann.'
            },
            suggestions: {
                title: 'Suggestions',
                color: 0x38bdf8,
                description: 'Sende einen Verbesserungsvorschlag für den Server. Der Bot postet ihn als Karte mit Like, Dislike und Müll-Votes.',
                button: { customId: 'la_suggestion_submit', label: 'Vorschlag senden' }
            },
            mapDesigns: {
                title: 'Map Designs',
                color: 0x22c55e,
                description: 'Poste hier ein Bild von deinem Map-Design. Der Bot fügt Reaktionen und einen Mod-Signal Button hinzu.'
            },
            profileTool: {
                title: 'Brawlify Profile Tool',
                color: 0xf97316,
                description: 'Gib deine Brawl-Stars-Spieler-ID ein, z. B. `QQVVP9G0`.\n\nDer Bot postet deinen Brawlify-Link, versucht Profilbilder von der Seite zu zeigen und lässt die Community mit 🔥 liken.\nDas meistgelikte Profil der Woche wird angezeigt und bekommt Level-XP.',
                button: { customId: 'la_profile_submit', label: 'Player-ID senden' }
            },
            findMates: {
                title: 'Find Mates',
                description: 'Erstelle eine Player Card mit Trophäen, Rank, Gerät, Modus und Profilbild-Link.',
                button: { customId: 'la_findmates_post', label: 'Player Card erstellen' }
            },
            findRankedMates: {
                title: 'Find Ranked Mates',
                description: 'Erstelle eine Ranked Player Card, damit andere sich zum Connecten bewerben können.',
                button: { customId: 'la_findranked_post', label: 'Player Card erstellen' }
            },
            teamSearch: {
                title: 'Team Search',
                description: 'Erstelle eine Team-Search Card mit Trophäen, Rank, Gerät, Rolle und deinem Wunsch-Team.',
                button: { customId: 'la_teamsearch_post', label: 'Team suchen' }
            },
            tournamentRegistration: {
                title: 'Turnier Registrierung',
                description: 'Registriere dich hier für Turniere.\n\nDu wirst gefragt, ob du @anxsog auf TikTok folgst, wie viele Trophäen du hast, ob du im Club bist, welchen Rank du hast und warum du mitmachen möchtest.\nStaff prüft deine Bewerbung. Bei Annahme bekommst du Tournament Verified und siehst die Turnier-Channels.',
                button: { customId: 'la_tournament_apply', label: 'Registrieren', style: ButtonStyle.Success }
            },
            tournamentGuide: {
                title: 'Turnier Guide',
                description: 'Staff kann den Guide später bearbeiten. Dieser Channel ist nur für Tournament Verified sichtbar.'
            },
            tournamentRules: {
                title: 'Turnier Regeln',
                description: 'Staff kann hier die finalen Turnierregeln eintragen. Dieser Channel ist nur für Tournament Verified sichtbar.'
            },
            staffPanels: {
                title: 'Staff Panels',
                description: 'Alle Bot-Reviews und Panel-Daten landen hier.\n\nReview-Flows:\n- Creator Bewerbungen\n- Cooperation Bewerbungen\n- Turnier Registrierungen\n- Find Mates / Ranked / Team Search Connect Requests\n- Message Activity Snapshots'
            },
            ticketInfo: {
                title: 'Ticket Bereich',
                description: 'Tickets werden automatisch in dieser Kategorie erstellt. Nur Staff, Bot und betroffene Mitglieder können sie sehen.'
            }
        },
        fr: {
            rules: {
                title: 'Ticket de Règles LA VELOO',
                color: 0xef4444,
                description: 'Lis ces règles avant d’utiliser le serveur. Ce message est le ticket officiel des règles et reste mis à jour automatiquement.',
                fields: [
                    ['1. Respect', 'Respecte tous les membres. Pas de harcèlement, menaces, haine, discrimination, intimidation ou drama inutile.'],
                    ['2. Pas de spam', 'Ne spamme pas les messages, emojis, majuscules, pings, liens, commandes, images ou mentions inutiles.'],
                    ['3. Liens sûrs seulement', 'Pas de scams, faux liens de gemmes, liens de tokens, téléchargements suspects, fausses récompenses ou phishing.'],
                    ['4. Bons salons', 'Utilise les bons salons : main-hall pour discuter, Find Mates pour chercher des mates, Tournament pour les tournois et Support pour l’aide.'],
                    ['5. Fair-play Brawl Stars', 'Pas de vente de compte, boosting, win trading, triche, exploits ou violation des règles fair-play.'],
                    ['6. Règles de tournoi', 'Les décisions du Tournament Staff sont finales après review. Faux résultats, no-shows, toxicité ou triche peuvent retirer l’accès tournoi.'],
                    ['7. Tickets & candidatures', 'Utilise les tickets et candidatures honnêtement. Les fausses infos peuvent mener à un refus ou une sanction.'],
                    ['8. Confidentialité', 'Ne leak pas les chats privés, données personnelles, screenshots de tickets ou infos de comptes.'],
                    ['9. Décisions staff', 'Écoute les owners, admins, mods et tournament staff. En cas de désaccord, ouvre calmement un ticket support.'],
                    ['10. Règles Discord', 'Respecte toujours les Terms of Service et Community Guidelines de Discord.']
                ]
            },
            getStarted: {
                title: 'Tutoriel de Départ',
                description: 'Bienvenue sur LA VELOO. Suis ce guide pour utiliser le serveur correctement.\n\n**1. Choisis tes rôles**\nUtilise le menu ci-dessous pour choisir ta plateforme et ton style : PC, Mobile, iPad, 3v3, Solo, Duo, Ranked, Team Player et pings.\n\n**2. Lis les règles**\nVa dans rules et lis le ticket de règles LA VELOO.\n\n**3. Communauté**\nmain-hall est pour discuter, clips-media pour les clips, memes pour les memes et profile-rank pour ton rank/trophées.\n\n**4. Brawlify Profile Tool**\nDans profile-tool, entre ton ID joueur comme `QQVVP9G0`. Le bot poste ton profil Brawlify, les membres peuvent liker avec 🔥, et le top de la semaine gagne de l’XP.\n\n**5. Find Mates**\nDans find-mates ou find-ranked-mates, crée une player card. Si quelqu’un veut se connecter et que tu acceptes, le bot crée un salon texte et vocal privé.\n\n**6. Tournois**\nDans tournament-registration, candidate. Si le staff accepte, tu reçois Tournament Verified et débloques les salons tournoi.\n\n**7. Support**\nUtilise support pour obtenir de l’aide via un ticket privé.\n\n**8. Creator & Cooperation**\nLes creators postulent dans creator-chat ou creator-apply. Les cooperations postulent dans cooperations ou cooperation-apply.\n\n**9. Free BS Stuff**\nfree-bs-stuff et official-rewards sont réservés aux récompenses officielles et sûres.\n\n**10. Voice Channels**\nUtilise Tournament Lobby pour les events, Music pour la musique, Stream pour streamer et AFK quand tu es absent.'
            },
            support: { title: 'Support', description: 'Ouvre un ticket privé pour les questions, bugs, problèmes de tournoi ou aide serveur.', button: { customId: 'la_support_open', label: 'Créer un ticket' } },
            cooperation: { title: 'Cooperations', description: 'Postule pour une cooperation. Le staff review en privé; les cooperations acceptées sont publiées automatiquement.', button: { customId: 'la_coop_apply', label: 'Postuler Cooperation' } },
            creator: { title: 'Candidature Creator', description: 'Postule comme creator et réponds aux questions. Les creators acceptés reçoivent le rôle creator.', button: { customId: 'la_creator_apply', label: 'Postuler Creator' } },
            profileTool: { title: 'Brawlify Profile Tool', color: 0xf97316, description: 'Entre ton ID Brawl Stars, par exemple `QQVVP9G0`.\n\nLe bot poste ton lien Brawlify, essaie d’afficher les images du profil et laisse la communauté liker avec 🔥.\nLe profil le plus liké de la semaine est affiché et reçoit de l’XP.', button: { customId: 'la_profile_submit', label: 'Envoyer ID joueur' } },
            findMates: { title: 'Find Mates', description: 'Crée une player card avec trophées, rank, appareil, mode et lien d’image de profil.', button: { customId: 'la_findmates_post', label: 'Créer Player Card' } },
            findRankedMates: { title: 'Find Ranked Mates', description: 'Crée une ranked player card pour que les autres puissent demander à se connecter.', button: { customId: 'la_findranked_post', label: 'Créer Player Card' } },
            tournamentRegistration: { title: 'Inscription Tournoi', description: 'Inscris-toi ici aux tournois.\n\nLe bot demande si tu suis @anxsog sur TikTok, tes trophées, ton club, ton rank et pourquoi tu veux participer.\nSi le staff accepte, tu reçois Tournament Verified.', button: { customId: 'la_tournament_apply', label: 'S’inscrire', style: ButtonStyle.Success } },
            tournamentGuide: { title: 'Guide Tournoi', description: 'Le staff pourra modifier ce guide plus tard. Ce salon est visible seulement avec Tournament Verified.' },
            tournamentRules: { title: 'Règles Tournoi', description: 'Le staff peut ajouter ici les règles finales du tournoi. Ce salon est visible seulement avec Tournament Verified.' },
            staffPanels: { title: 'Staff Panels', description: 'Tous les reviews et données du bot arrivent ici.\n\nFlows:\n- Candidatures creator\n- Candidatures cooperation\n- Inscriptions tournoi\n- Find-Mates connect requests\n- Message activity snapshots' },
            ticketInfo: { title: 'Zone Tickets', description: 'Les tickets sont créés automatiquement dans cette catégorie. Seuls le staff, le bot et les membres concernés peuvent les voir.' }
        },
        es: {
            rules: {
                title: 'Ticket de Reglas LA VELOO',
                color: 0xef4444,
                description: 'Lee estas reglas antes de usar el servidor. Este mensaje es el ticket oficial de reglas y se mantiene actualizado automáticamente.',
                fields: [
                    ['1. Respeto', 'Respeta a todos los miembros. Nada de acoso, amenazas, odio, discriminación, bullying o drama innecesario.'],
                    ['2. No spam', 'No hagas spam de mensajes, emojis, mayúsculas, pings, enlaces, comandos, imágenes o menciones.'],
                    ['3. Solo enlaces seguros', 'Nada de scams, links falsos de gemas, tokens, descargas sospechosas, recompensas falsas o phishing.'],
                    ['4. Usa bien los canales', 'Usa main-hall para chat, Find Mates para buscar equipo, Tournament para torneos y Support para ayuda.'],
                    ['5. Fair Play Brawl Stars', 'Nada de venta de cuentas, boosting, win trading, cheats, exploits o romper reglas de fair-play.'],
                    ['6. Reglas de torneo', 'Las decisiones del Tournament Staff son finales tras revisión. Resultados falsos, no-shows, toxicidad o cheats pueden quitar acceso.'],
                    ['7. Tickets y aplicaciones', 'Usa tickets y aplicaciones con información real. Datos falsos pueden causar rechazo o moderación.'],
                    ['8. Privacidad', 'No filtres chats privados, datos personales, screenshots de tickets o datos de cuentas.'],
                    ['9. Decisiones del staff', 'Escucha a owners, admins, mods y tournament staff. Si no estás de acuerdo, abre un ticket con calma.'],
                    ['10. Reglas de Discord', 'Sigue siempre los Terms of Service y Community Guidelines de Discord.']
                ]
            },
            getStarted: {
                title: 'Tutorial de Inicio',
                description: 'Bienvenido a LA VELOO. Sigue esta guía para usar el servidor correctamente.\n\n**1. Elige tus roles**\nUsa el menú de abajo para elegir plataforma y estilo: PC, Mobile, iPad, 3v3, Solo, Duo, Ranked, Team Player y pings.\n\n**2. Lee las reglas**\nVe al canal rules y lee el ticket de reglas LA VELOO.\n\n**3. Comunidad**\nmain-hall es para chat, clips-media para clips, memes para memes y profile-rank para rank/trofeos.\n\n**4. Brawlify Profile Tool**\nEn profile-tool escribe tu ID como `QQVVP9G0`. El bot publica tu perfil Brawlify, la comunidad da 🔥 y el top semanal gana XP.\n\n**5. Find Mates**\nEn find-mates o find-ranked-mates crea una player card. Si alguien quiere conectar y aceptas, el bot crea canal privado de texto y voz.\n\n**6. Torneos**\nEn tournament-registration te registras. Si el staff acepta, recibes Tournament Verified y desbloqueas canales de torneo.\n\n**7. Support**\nUsa support para recibir ayuda con un ticket privado.\n\n**8. Creator & Cooperation**\nCreators aplican en creator-chat o creator-apply. Cooperations en cooperations o cooperation-apply.\n\n**9. Free BS Stuff**\nfree-bs-stuff y official-rewards son solo para recompensas oficiales y seguras.\n\n**10. Voice Channels**\nUsa Tournament Lobby para eventos, Music para música, Stream para stream y AFK cuando estés ausente.'
            },
            support: { title: 'Support', description: 'Abre un ticket privado para preguntas, bugs, problemas de torneo o ayuda del servidor.', button: { customId: 'la_support_open', label: 'Crear ticket' } },
            cooperation: { title: 'Cooperations', description: 'Aplica para una cooperation. El staff revisa en privado; las aceptadas se publican automáticamente.', button: { customId: 'la_coop_apply', label: 'Aplicar Cooperation' } },
            creator: { title: 'Aplicación Creator', description: 'Aplica como creator y responde las preguntas. Los aceptados reciben el rol creator.', button: { customId: 'la_creator_apply', label: 'Aplicar Creator' } },
            profileTool: { title: 'Brawlify Profile Tool', color: 0xf97316, description: 'Escribe tu ID de Brawl Stars, por ejemplo `QQVVP9G0`.\n\nEl bot publica tu enlace Brawlify, intenta mostrar imágenes del perfil y deja que la comunidad dé 🔥.\nEl perfil con más likes de la semana se muestra y recibe XP.', button: { customId: 'la_profile_submit', label: 'Enviar ID' } },
            findMates: { title: 'Find Mates', description: 'Crea una player card con trofeos, rank, dispositivo, modo y link de imagen de perfil.', button: { customId: 'la_findmates_post', label: 'Crear Player Card' } },
            findRankedMates: { title: 'Find Ranked Mates', description: 'Crea una ranked player card para que otros puedan pedir conectar contigo.', button: { customId: 'la_findranked_post', label: 'Crear Player Card' } },
            tournamentRegistration: { title: 'Registro de Torneo', description: 'Regístrate aquí para torneos.\n\nEl bot pregunta si sigues a @anxsog en TikTok, tus trofeos, club, rank y por qué quieres participar.\nSi el staff acepta, recibes Tournament Verified.', button: { customId: 'la_tournament_apply', label: 'Registrarse', style: ButtonStyle.Success } },
            tournamentGuide: { title: 'Guía de Torneo', description: 'El staff puede editar esta guía después. Este canal solo es visible con Tournament Verified.' },
            tournamentRules: { title: 'Reglas de Torneo', description: 'El staff puede añadir aquí las reglas finales. Este canal solo es visible con Tournament Verified.' },
            staffPanels: { title: 'Staff Panels', description: 'Todos los reviews y datos del bot llegan aquí.\n\nFlows:\n- Aplicaciones creator\n- Aplicaciones cooperation\n- Registros de torneo\n- Find-Mates connect requests\n- Message activity snapshots' },
            ticketInfo: { title: 'Zona de Tickets', description: 'Los tickets se crean automáticamente en esta categoría. Solo staff, bot y miembros afectados pueden verlos.' }
        },
        it: {
            rules: {
                title: 'Ticket Regole LA VELOO',
                color: 0xef4444,
                description: 'Leggi queste regole prima di usare il server. Questo messaggio è il ticket ufficiale delle regole e resta aggiornato automaticamente.',
                fields: [
                    ['1. Rispetto', 'Rispetta tutti i membri. Niente molestie, minacce, odio, discriminazione, bullismo o drama inutile.'],
                    ['2. No spam', 'Non spammare messaggi, emoji, caps, ping, link, comandi, immagini o menzioni inutili.'],
                    ['3. Solo link sicuri', 'Niente scam, falsi link gemme, token, download sospetti, false reward o phishing.'],
                    ['4. Canali corretti', 'Usa main-hall per chat, Find Mates per cercare compagni, Tournament per tornei e Support per aiuto.'],
                    ['5. Fair Play Brawl Stars', 'Niente vendita account, boosting, win trading, cheat, exploit o violazioni del fair-play.'],
                    ['6. Regole torneo', 'Le decisioni del Tournament Staff sono finali dopo review. Risultati falsi, no-show, tossicità o cheat possono togliere accesso.'],
                    ['7. Ticket & candidature', 'Usa ticket e candidature in modo onesto. Info false possono portare a rifiuto o moderazione.'],
                    ['8. Privacy', 'Non leakare chat private, dati personali, screenshot di ticket o dati account.'],
                    ['9. Decisioni staff', 'Ascolta owner, admin, mod e tournament staff. Se non sei d’accordo, apri un ticket con calma.'],
                    ['10. Regole Discord', 'Segui sempre Terms of Service e Community Guidelines di Discord.']
                ]
            },
            getStarted: {
                title: 'Tutorial Iniziale',
                description: 'Benvenuto su LA VELOO. Segui questa guida per usare bene il server.\n\n**1. Scegli i ruoli**\nUsa il menu sotto per scegliere piattaforma e stile: PC, Mobile, iPad, 3v3, Solo, Duo, Ranked, Team Player e ping.\n\n**2. Leggi le regole**\nVai nel canale rules e leggi il ticket regole LA VELOO.\n\n**3. Community**\nmain-hall è per chat, clips-media per clip, memes per meme e profile-rank per rank/trofei.\n\n**4. Brawlify Profile Tool**\nIn profile-tool inserisci il tuo ID come `QQVVP9G0`. Il bot posta il profilo Brawlify, la community mette 🔥 e il top settimanale riceve XP.\n\n**5. Find Mates**\nIn find-mates o find-ranked-mates crea una player card. Se qualcuno vuole connettersi e accetti, il bot crea canale testo e voice privato.\n\n**6. Tornei**\nIn tournament-registration ti registri. Se lo staff accetta, ricevi Tournament Verified e sblocchi i canali torneo.\n\n**7. Support**\nUsa support per ricevere aiuto con un ticket privato.\n\n**8. Creator & Cooperation**\nI creator si candidano in creator-chat o creator-apply. Le cooperation in cooperations o cooperation-apply.\n\n**9. Free BS Stuff**\nfree-bs-stuff e official-rewards sono solo per reward ufficiali e sicure.\n\n**10. Voice Channels**\nUsa Tournament Lobby per eventi, Music per musica, Stream per stream e AFK quando sei assente.'
            },
            support: { title: 'Support', description: 'Apri un ticket privato per domande, bug, problemi torneo o aiuto server.', button: { customId: 'la_support_open', label: 'Crea ticket' } },
            cooperation: { title: 'Cooperations', description: 'Candidati per una cooperation. Lo staff review in privato; le cooperation accettate vengono pubblicate automaticamente.', button: { customId: 'la_coop_apply', label: 'Candidati Cooperation' } },
            creator: { title: 'Candidatura Creator', description: 'Candidati come creator e rispondi alle domande. I creator accettati ricevono il ruolo creator.', button: { customId: 'la_creator_apply', label: 'Candidati Creator' } },
            profileTool: { title: 'Brawlify Profile Tool', color: 0xf97316, description: 'Inserisci il tuo ID Brawl Stars, per esempio `QQVVP9G0`.\n\nIl bot posta il link Brawlify, prova a mostrare le immagini del profilo e lascia la community mettere 🔥.\nIl profilo più likato della settimana viene mostrato e riceve XP.', button: { customId: 'la_profile_submit', label: 'Invia Player ID' } },
            findMates: { title: 'Find Mates', description: 'Crea una player card con trofei, rank, device, modalità e link immagine profilo.', button: { customId: 'la_findmates_post', label: 'Crea Player Card' } },
            findRankedMates: { title: 'Find Ranked Mates', description: 'Crea una ranked player card così altri possono chiedere di connettersi.', button: { customId: 'la_findranked_post', label: 'Crea Player Card' } },
            tournamentRegistration: { title: 'Registrazione Torneo', description: 'Registrati qui ai tornei.\n\nIl bot chiede se segui @anxsog su TikTok, trofei, club, rank e perché vuoi partecipare.\nSe lo staff accetta, ricevi Tournament Verified.', button: { customId: 'la_tournament_apply', label: 'Registrati', style: ButtonStyle.Success } },
            tournamentGuide: { title: 'Guida Torneo', description: 'Lo staff può modificare questa guida più tardi. Questo canale è visibile solo con Tournament Verified.' },
            tournamentRules: { title: 'Regole Torneo', description: 'Lo staff può aggiungere qui le regole finali. Questo canale è visibile solo con Tournament Verified.' },
            staffPanels: { title: 'Staff Panels', description: 'Tutte le review e i dati del bot arrivano qui.\n\nFlows:\n- Candidature creator\n- Candidature cooperation\n- Registrazioni torneo\n- Find-Mates connect requests\n- Message activity snapshots' },
            ticketInfo: { title: 'Area Ticket', description: 'I ticket vengono creati automaticamente in questa categoria. Solo staff, bot e membri interessati possono vederli.' }
        }
    };

    const translated = copies[lang]?.[panelId] || translatePanelFallback(panelId, lang, copies.en[panelId]);
    return normalizeCopy(applyPanelStyle(panelId, lang, translated || copies.en[panelId]));
}

function applyPanelStyle(panelId, language, copy) {
    const lang = normalizePanelLanguage(language);
    const styles = {
        en: {
            rules: { title: '📜 LA VELOO Rule Ticket' },
            getStarted: { title: '🧭 Get Started Tutorial' },
            support: {
                title: '🎟️ Support Desk',
                description: 'Need help, found a bug, or have a tournament issue? Open a private ticket and staff will help.',
                button: { label: '🎟️ Create Ticket' }
            },
            clubVerify: {
                title: '✅ Club Verification',
                description: 'Open a club ticket with player name, rank, and profile proof. Staff accepts or declines it.',
                button: { label: '✅ Verify' }
            },
            cooperation: {
                title: '🤝 Cooperation Hub',
                description: 'Pitch your server, brand, event, or giveaway idea. Accepted collabs are posted here.',
                button: { label: '🤝 Apply' }
            },
            creator: {
                title: '🎥 Creator Apply',
                description: 'Apply as a creator. Tell us your platform, stats, content style, and why LA VELOO fits.',
                button: { label: '🎥 Apply' }
            },
            profileRank: {
                title: '🪪 Profile Rank',
                description: 'Post one profile screenshot. The bot adds 🔥 so everyone can react to your trophies, rank, and progress.'
            },
            suggestions: {
                title: '💡 Suggestions',
                description: 'Send one clean server idea. The bot posts it as a card with 👍, 👎, and 🗑️ votes.',
                button: { label: '💡 Suggest' }
            },
            mapDesigns: {
                title: '🗺️ Map Designs',
                description: 'Post a map screenshot. The bot adds reactions and a mod-signal button.'
            },
            profileTool: {
                title: '🧰 Brawlify Profile Tool',
                description: 'Drop your player ID like `QQVVP9G0`. The bot posts your Brawlify card, 🔥 likes, and weekly top profile.',
                button: { label: '🧰 Submit ID' }
            },
            findMates: {
                title: '🤝 Find Mates',
                description: 'Post your player card. The bot matches similar trophies and opens your private search channel.',
                button: { label: '🤝 Create Card' }
            },
            findRankedMates: {
                title: '🏆 Find Ranked Mates',
                description: 'Post your ranked card. The bot matches your 10k trophy group and ranked tier.',
                button: { label: '🏆 Create Ranked Card' }
            },
            teamSearch: {
                title: '👥 Team Search',
                description: 'Post your team-search card. The bot matches your trophy group and opens your private team channel.',
                button: { label: '👥 Search Team' }
            },
            tournamentRegistration: {
                title: '🏆 Tournament Sign-Up',
                description: 'Apply for the next tournament. Staff checks TikTok, trophies, club, rank, and motivation.',
                button: { label: '🏆 Register' }
            },
            tournamentGuide: {
                title: '📘 Tournament Guide',
                description: 'Tournament info, timing, format, and next steps for verified players.'
            },
            tournamentRules: {
                title: '⚖️ Tournament Rules',
                description: 'Official tournament rules. Read before playing.'
            },
            staffPanels: {
                title: '📌 Staff Control',
                description: 'Reviews, bot panels, applications, tournament checks, mate matches, and activity snapshots.'
            },
            ticketInfo: {
                title: '🎟️ Ticket Area',
                description: 'Private ticket channels appear here for support, reviews, and mate connections.'
            }
        },
        de: {
            rules: { title: '📜 LA VELOO Regel-Ticket' },
            getStarted: { title: '🧭 Get Started Tutorial' },
            support: {
                title: '🎟️ Support Desk',
                description: 'Brauchst du Hilfe, hast einen Bug oder ein Turnierproblem? Öffne ein privates Ticket.',
                button: { label: '🎟️ Ticket erstellen' }
            },
            clubVerify: {
                title: '✅ Club Verification',
                description: 'Öffne ein Club-Ticket mit Profilname, Rank und Profilnachweis. Staff nimmt es an oder lehnt es ab.',
                button: { label: '✅ Verifizieren' }
            },
            cooperation: {
                title: '🤝 Cooperation Hub',
                description: 'Stell deine Server-, Brand-, Event- oder Giveaway-Idee vor. Angenommene Collabs werden gepostet.',
                button: { label: '🤝 Bewerben' }
            },
            creator: {
                title: '🎥 Creator Bewerbung',
                description: 'Bewirb dich als Creator. Zeig Plattform, Stats, Content-Style und warum du passt.',
                button: { label: '🎥 Bewerben' }
            },
            profileRank: {
                title: '🪪 Profile Rank',
                description: 'Poste einen Profil-Screenshot. Der Bot setzt 🔥, damit alle auf Trophäen, Rank und Fortschritt reagieren können.'
            },
            suggestions: {
                title: '💡 Suggestions',
                description: 'Sende eine cleane Server-Idee. Der Bot postet sie als Karte mit 👍, 👎 und 🗑️ Votes.',
                button: { label: '💡 Vorschlagen' }
            },
            mapDesigns: {
                title: '🗺️ Map Designs',
                description: 'Poste ein Map-Bild. Der Bot fügt Reaktionen und einen Mod-Signal Button hinzu.'
            },
            profileTool: {
                title: '🧰 Brawlify Profile Tool',
                description: 'Gib deine ID wie `QQVVP9G0` ein. Der Bot postet deine Brawlify Card, 🔥 Likes und Wochen-Top.',
                button: { label: '🧰 ID senden' }
            },
            findMates: {
                title: '🤝 Find Mates',
                description: 'Poste deine Player Card. Der Bot matcht ähnliche Trophäen und öffnet deinen privaten Such-Channel.',
                button: { label: '🤝 Card erstellen' }
            },
            findRankedMates: {
                title: '🏆 Find Ranked Mates',
                description: 'Poste deine Ranked Card. Der Bot matcht 10k-Trophäen-Gruppe und Ranked-Tier.',
                button: { label: '🏆 Ranked Card erstellen' }
            },
            teamSearch: {
                title: '👥 Team Search',
                description: 'Poste deine Team-Search Card. Der Bot matcht passende Trophäen und öffnet deinen privaten Team-Channel.',
                button: { label: '👥 Team suchen' }
            },
            tournamentRegistration: {
                title: '🏆 Turnier Anmeldung',
                description: 'Bewirb dich fürs nächste Turnier. Staff prüft TikTok, Trophäen, Club, Rank und Motivation.',
                button: { label: '🏆 Registrieren' }
            },
            tournamentGuide: { title: '📘 Turnier Guide', description: 'Turnierinfos, Ablauf, Format und nächste Schritte für verifizierte Spieler.' },
            tournamentRules: { title: '⚖️ Turnier Regeln', description: 'Offizielle Turnierregeln. Vor dem Spielen lesen.' },
            staffPanels: { title: '📌 Staff Control', description: 'Reviews, Bot-Panels, Bewerbungen, Turnierchecks, Mate-Matches und Activity Snapshots.' },
            ticketInfo: { title: '🎟️ Ticket Bereich', description: 'Private Ticket-Channels erscheinen hier für Support, Reviews und Mate-Verbindungen.' }
        },
        fr: {
            rules: { title: '📜 Ticket de Règles LA VELOO' },
            getStarted: { title: '🧭 Tutoriel de Départ' },
            support: { title: '🎟️ Support Desk', description: 'Besoin d’aide, bug ou problème tournoi ? Ouvre un ticket privé.', button: { label: '🎟️ Créer un ticket' } },
            cooperation: { title: '🤝 Cooperation Hub', description: 'Propose ton serveur, marque, event ou giveaway. Les collabs acceptées sont publiées.', button: { label: '🤝 Postuler' } },
            creator: { title: '🎥 Creator Apply', description: 'Postule comme creator avec plateforme, stats, style de contenu et motivation.', button: { label: '🎥 Postuler' } },
            profileRank: { title: '🪪 Profile Rank', description: 'Poste un screenshot de profil. Le bot ajoute 🔥 pour que la communauté puisse réagir.' },
            profileTool: { title: '🧰 Brawlify Profile Tool', description: 'Entre ton ID comme `QQVVP9G0`. Le bot poste ta card Brawlify, les 🔥 likes et le top semaine.', button: { label: '🧰 Envoyer ID' } },
            findMates: { title: '🤝 Find Mates', description: 'Poste ta player card. Le bot match les trophées proches et ouvre ton salon privé.', button: { label: '🤝 Créer Card' } },
            findRankedMates: { title: '🏆 Find Ranked Mates', description: 'Poste ta ranked card. Le bot match le groupe 10k trophées et le tier ranked.', button: { label: '🏆 Créer Ranked Card' } },
            teamSearch: { title: '👥 Team Search', description: 'Poste ta team card. Le bot match les trophées proches et ouvre ton salon team privé.', button: { label: '👥 Chercher Team' } },
            tournamentRegistration: { title: '🏆 Inscription Tournoi', description: 'Candidate au prochain tournoi. Le staff vérifie TikTok, trophées, club, rank et motivation.', button: { label: '🏆 S’inscrire' } },
            tournamentGuide: { title: '📘 Guide Tournoi', description: 'Infos tournoi, horaires, format et prochaines étapes.' },
            tournamentRules: { title: '⚖️ Règles Tournoi', description: 'Règles officielles du tournoi. À lire avant de jouer.' },
            staffPanels: { title: '📌 Staff Control', description: 'Reviews, panels bot, candidatures, checks tournoi, mate matches et activity snapshots.' },
            ticketInfo: { title: '🎟️ Zone Tickets', description: 'Les salons privés de tickets apparaissent ici.' }
        },
        es: {
            rules: { title: '📜 Ticket de Reglas LA VELOO' },
            getStarted: { title: '🧭 Tutorial de Inicio' },
            support: { title: '🎟️ Support Desk', description: '¿Necesitas ayuda, hay un bug o problema de torneo? Abre un ticket privado.', button: { label: '🎟️ Crear ticket' } },
            cooperation: { title: '🤝 Cooperation Hub', description: 'Presenta tu servidor, marca, evento o giveaway. Las collabs aceptadas se publican.', button: { label: '🤝 Aplicar' } },
            creator: { title: '🎥 Creator Apply', description: 'Aplica como creator con plataforma, stats, estilo de contenido y motivo.', button: { label: '🎥 Aplicar' } },
            profileRank: { title: '🪪 Profile Rank', description: 'Publica una captura de tu perfil. El bot añade 🔥 para que la comunidad pueda reaccionar.' },
            profileTool: { title: '🧰 Brawlify Profile Tool', description: 'Pon tu ID como `QQVVP9G0`. El bot publica tu card Brawlify, 🔥 likes y top semanal.', button: { label: '🧰 Enviar ID' } },
            findMates: { title: '🤝 Find Mates', description: 'Publica tu player card. El bot empareja trofeos similares y abre tu canal privado.', button: { label: '🤝 Crear Card' } },
            findRankedMates: { title: '🏆 Find Ranked Mates', description: 'Publica tu ranked card. El bot empareja grupo 10k de trofeos y tier ranked.', button: { label: '🏆 Crear Ranked Card' } },
            teamSearch: { title: '👥 Team Search', description: 'Publica tu team card. El bot empareja trofeos similares y abre tu canal privado de team.', button: { label: '👥 Buscar Team' } },
            tournamentRegistration: { title: '🏆 Registro de Torneo', description: 'Aplica al próximo torneo. Staff revisa TikTok, trofeos, club, rank y motivación.', button: { label: '🏆 Registrarse' } },
            tournamentGuide: { title: '📘 Guía de Torneo', description: 'Info del torneo, horarios, formato y próximos pasos.' },
            tournamentRules: { title: '⚖️ Reglas de Torneo', description: 'Reglas oficiales del torneo. Lee antes de jugar.' },
            staffPanels: { title: '📌 Staff Control', description: 'Reviews, paneles bot, aplicaciones, checks torneo, mate matches y activity snapshots.' },
            ticketInfo: { title: '🎟️ Zona de Tickets', description: 'Los canales privados de tickets aparecen aquí.' }
        },
        it: {
            rules: { title: '📜 Ticket Regole LA VELOO' },
            getStarted: { title: '🧭 Tutorial Iniziale' },
            support: { title: '🎟️ Support Desk', description: 'Serve aiuto, hai un bug o problema torneo? Apri un ticket privato.', button: { label: '🎟️ Crea ticket' } },
            cooperation: { title: '🤝 Cooperation Hub', description: 'Presenta server, brand, event o giveaway. Le collab accettate vengono pubblicate.', button: { label: '🤝 Candidati' } },
            creator: { title: '🎥 Creator Apply', description: 'Candidati come creator con piattaforma, stats, stile contenuti e motivo.', button: { label: '🎥 Candidati' } },
            profileRank: { title: '🪪 Profile Rank', description: 'Pubblica uno screenshot del profilo. Il bot aggiunge 🔥 così la community può reagire.' },
            profileTool: { title: '🧰 Brawlify Profile Tool', description: 'Inserisci ID come `QQVVP9G0`. Il bot posta card Brawlify, 🔥 likes e top settimana.', button: { label: '🧰 Invia ID' } },
            findMates: { title: '🤝 Find Mates', description: 'Pubblica la player card. Il bot matcha trofei simili e apre il tuo canale privato.', button: { label: '🤝 Crea Card' } },
            findRankedMates: { title: '🏆 Find Ranked Mates', description: 'Pubblica la ranked card. Il bot matcha gruppo 10k trofei e tier ranked.', button: { label: '🏆 Crea Ranked Card' } },
            teamSearch: { title: '👥 Team Search', description: 'Pubblica la team card. Il bot matcha trofei simili e apre il tuo canale team privato.', button: { label: '👥 Cerca Team' } },
            tournamentRegistration: { title: '🏆 Registrazione Torneo', description: 'Candidati al prossimo torneo. Staff controlla TikTok, trofei, club, rank e motivazione.', button: { label: '🏆 Registrati' } },
            tournamentGuide: { title: '📘 Guida Torneo', description: 'Info torneo, orari, formato e prossimi step.' },
            tournamentRules: { title: '⚖️ Regole Torneo', description: 'Regole ufficiali del torneo. Leggi prima di giocare.' },
            staffPanels: { title: '📌 Staff Control', description: 'Review, panel bot, candidature, check torneo, mate matches e activity snapshots.' },
            ticketInfo: { title: '🎟️ Area Ticket', description: 'I canali privati ticket appaiono qui.' }
        }
    };

    const override = styles[lang]?.[panelId] || styles.en[panelId] || {};
    return {
        ...copy,
        ...override,
        button: copy.button || override.button
            ? {
                ...(copy.button || {}),
                ...(override.button || {})
            }
            : undefined
    };
}

function translatePanelFallback(panelId, language, englishCopy) {
    const languageName = LANGUAGES.find(item => item.code === language)?.label || language;
    if (!englishCopy) {
        return {
            title: 'LA VELOO Panel',
            description: `Translation for ${languageName} is not configured yet.`
        };
    }

    return {
        ...englishCopy,
        description: `${englishCopy.description}\n\n*${languageName} translation for this panel will be expanded later.*`
    };
}

function normalizeCopy(copy) {
    return {
        ...copy,
        fields: (copy.fields || []).map(field => Array.isArray(field)
            ? { name: field[0], value: field[1], inline: false }
            : field)
    };
}

function panelLanguageRow(panelId, currentLanguage) {
    return new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`la_panel_lang_${panelId}`)
            .setPlaceholder(languageLabel(currentLanguage))
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(
                LANGUAGES.map(language => ({
                    label: language.label,
                    value: language.code,
                    emoji: language.emoji,
                    default: language.code === currentLanguage
                }))
            )
    );
}

async function handlePanelLanguageSelect(interaction) {
    const panelId = interaction.customId.replace('la_panel_lang_', '');
    const language = normalizePanelLanguage(interaction.values?.[0]);

    return interaction.reply({
        ...localizedPanelPayload(panelId, language),
        ephemeral: true,
        allowedMentions: { parse: [] }
    });
}

function getPanelLanguage(panelId) {
    return DEFAULT_PANEL_LANGUAGE;
}

function normalizePanelLanguage(language) {
    return LANGUAGES.some(item => item.code === language) ? language : 'en';
}

function languageLabel(languageCode) {
    const language = LANGUAGES.find(item => item.code === languageCode) || LANGUAGES[0];
    return `${language.emoji} ${language.label}`;
}

function matePanelPayload(title, description, customId) {
    return {
        embeds: [embed(title, description)],
        components: [buttonRow(new ButtonBuilder().setCustomId(customId).setLabel('Create Player Card').setStyle(ButtonStyle.Primary))]
    };
}

function panelPayload(title, description) {
    return { embeds: [embed(title, description)] };
}

function buildRulesTicketPayload() {
    const rulesEmbed = embed(
        'LA VELOO Rule Ticket',
        'Read these rules before using the server. This message is the official rule ticket and stays updated automatically.',
        0xef4444
    ).addFields([
        {
            name: '1. Respect',
            value: 'Be respectful to every member. No harassment, hate speech, threats, racism, sexism, bullying, or drama baiting.',
            inline: false
        },
        {
            name: '2. No Spam',
            value: 'Do not spam messages, emojis, caps, pings, links, commands, repeated images, or unnecessary mentions.',
            inline: false
        },
        {
            name: '3. Safe Links Only',
            value: 'No scam links, fake free-gem links, token links, suspicious downloads, fake reward pages, or phishing attempts.',
            inline: false
        },
        {
            name: '4. Channel Topics',
            value: 'Use the correct channels: main chat in main-hall, mate search in Find Mates, tournament content in Tournament, and help in Support.',
            inline: false
        },
        {
            name: '5. Brawl Stars Fair Play',
            value: 'No account selling, boosting, win trading, cheating, exploits, or anything against Brawl Stars fair-play rules.',
            inline: false
        },
        {
            name: '6. Tournament Rules',
            value: 'Tournament staff decisions are final after review. Fake results, no-shows, toxic behavior, or cheating can remove your tournament access.',
            inline: false
        },
        {
            name: '7. Tickets & Applications',
            value: 'Use tickets and application panels honestly. Fake information can lead to declined applications or moderation action.',
            inline: false
        },
        {
            name: '8. Privacy',
            value: 'Do not leak private chats, personal information, screenshots from private tickets, or anyone else’s account details.',
            inline: false
        },
        {
            name: '9. Staff Decisions',
            value: 'Listen to owners, admins, moderators, and tournament staff. If you disagree, open a support ticket calmly.',
            inline: false
        },
        {
            name: '10. Discord Terms',
            value: 'Follow Discord Terms of Service and Community Guidelines at all times.',
            inline: false
        }
    ]);

    return { embeds: [rulesEmbed] };
}

function buildGetStartedTutorialEmbed() {
    return embed(
        'Get Started Tutorial',
        [
            'Welcome to LA VELOO. Follow this quick tutorial to use the server correctly.',
            '',
            '**1. Choose Your Roles**',
            'Use the menu below to select your platform and playstyle: PC, Mobile, iPad, 3v3, Solo, Duo, Ranked, Team Player, and ping roles.',
            '',
            '**2. Read The Rules**',
            'Go to the rules channel and read the LA VELOO Rule Ticket before posting.',
            '',
            '**3. Main Community**',
            'Use main-hall for normal chat, clips-media for clips and screenshots, memes for memes, and profile-rank for ranks or trophy progress.',
            '',
            '**4. Brawlify Profile Tool**',
            'In profile-tool, enter your player ID like `QQVVP9G0`. The bot posts your Brawlify profile, people can like it with 🔥, and the weekly top profile gets XP.',
            '',
            '**5. Find Mates**',
            'Use find-mates or find-ranked-mates to create a player card. Other players can request to connect. If you accept, the bot creates a private text and voice channel.',
            '',
            '**6. Tournaments**',
            'Use tournament-registration to apply. Staff reviews your answers. If accepted, you get Tournament Verified and unlock tournament guide, rules, chat, brackets, submit, and disputes.',
            '',
            '**7. Support**',
            'Use support if you need help. The bot creates a private ticket with you, moderators, and owners.',
            '',
            '**8. Creator & Cooperation**',
            'Creators can apply in creator-chat or creator-apply. Cooperations can apply in cooperations or cooperation-apply. Accepted cooperations are posted publicly.',
            '',
            '**9. Free BS Stuff**',
            'Use free-bs-stuff and official-rewards only for safe, official Brawl Stars rewards and alerts.',
            '',
            '**10. Voice Channels**',
            'Use Tournament Lobby for events, Music for music, Stream for streaming, and AFK when inactive.'
        ].join('\n'),
        0x111827
    );
}

function embed(title, description, color = 0x111827) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter({ text: SERVER_NAME })
        .setTimestamp();
}

function buttonRow(...buttons) {
    return new ActionRowBuilder().addComponents(buttons);
}

function selfRoleRow(language = 'en') {
    const roleCopy = {
        en: { placeholder: 'Choose your roles', description: 'Get the {role} role.' },
        de: { placeholder: 'Wähle deine Rollen', description: 'Gibt dir die Rolle {role}.' },
        fr: { placeholder: 'Choisis tes rôles', description: 'Ajoute le rôle {role}.' },
        es: { placeholder: 'Elige tus roles', description: 'Te da el rol {role}.' },
        it: { placeholder: 'Scegli i tuoi ruoli', description: 'Aggiunge il ruolo {role}.' }
    }[normalizePanelLanguage(language)];

    return new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('la_roles_select')
            .setPlaceholder(roleCopy.placeholder)
            .setMinValues(0)
            .setMaxValues(SELF_ROLE_KEYS.length)
            .addOptions(
                SELF_ROLE_KEYS.map(key => ({
                    label: plainRoleLabel(key),
                    value: key,
                    description: roleCopy.description.replace('{role}', plainRoleLabel(key))
                }))
            )
    );
}

async function upsertPanel(channel, panelKey, payload, options = {}) {
    if (!channel || channel.type !== ChannelType.GuildText) return null;

    const store = readStore();
    store.panels ||= {};
    const shouldResend = Boolean(options.resend && ROTATING_PANEL_KEYS.has(panelKey));

    let message = store.panels[panelKey]
        ? await channel.messages.fetch(store.panels[panelKey]).catch(() => null)
        : null;

    if (shouldResend && message) {
        await message.delete().catch(() => null);
        delete store.panels[panelKey];
        writeStore(store);
        message = null;
    }

    if (!message) {
        const messages = await channel.messages.fetch({ limit: 25 }).catch(() => null);
        message = messages?.find(candidate =>
            candidate.author.id === clientRef.user.id &&
            candidate.embeds.some(candidateEmbed => candidateEmbed.title === payload.embeds?.[0]?.data?.title)
        ) || null;
    }

    if (shouldResend && message) {
        await message.delete().catch(() => null);
        message = null;
    }

    if (message) {
        await message.edit(panelEditPayload(payload)).catch(() => null);
    } else {
        message = await channel.send(panelSendPayload(payload)).catch(() => null);
    }

    if (message) {
        store.panels[panelKey] = message.id;
        writeStore(store);
    }

    return message;
}

function panelSendPayload(payload) {
    return {
        ...payload,
        allowedMentions: { parse: [] },
        flags: SILENT_MESSAGE_FLAGS
    };
}

function panelEditPayload(payload) {
    return {
        ...payload,
        allowedMentions: { parse: [] }
    };
}

async function handleSelfRoles(interaction) {
    if (!interaction.inGuild()) return safeReply(interaction, { content: 'Use this inside the server.', ephemeral: true });
    const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
    if (!member) return safeReply(interaction, { content: 'Could not load your member profile.', ephemeral: true });

    await interaction.guild.roles.fetch().catch(() => null);
    const selected = new Set(interaction.values);
    const allRoles = SELF_ROLE_KEYS
        .map(key => ({ key, role: findRole(interaction.guild, key) }))
        .filter(item => item.role);

    const add = allRoles.filter(item => selected.has(item.key) && !member.roles.cache.has(item.role.id)).map(item => item.role.id);
    const remove = allRoles.filter(item => !selected.has(item.key) && member.roles.cache.has(item.role.id)).map(item => item.role.id);

    if (add.length) await member.roles.add(add, 'LA VELOO self roles').catch(() => null);
    if (remove.length) await member.roles.remove(remove, 'LA VELOO self roles').catch(() => null);

    return safeReply(interaction, {
        content: selected.size ? `Roles updated: ${[...selected].map(plainRoleLabel).join(', ')}` : 'Your selectable roles were removed.',
        ephemeral: true
    });
}

function showSupportModal(interaction) {
    return interaction.showModal(
        new ModalBuilder()
            .setCustomId('la_support_modal')
            .setTitle('Support Ticket')
            .addComponents(
                input('topic', 'What is your question?', 'Tournament, server, bot, report, bug...', TextInputStyle.Short, true),
                input('details', 'Describe your issue', 'Write all important details here.', TextInputStyle.Paragraph, true),
                input('urgency', 'Urgency', 'Low / normal / urgent', TextInputStyle.Short, false),
                input('proof', 'Link or screenshot note', 'Optional message link, image link, or note.', TextInputStyle.Short, false)
            )
    );
}

function showCreatorModal(interaction) {
    return interaction.showModal(
        new ModalBuilder()
            .setCustomId('la_creator_modal')
            .setTitle('Creator Application')
            .addComponents(
                input('handle', 'Creator name / handle', '@yourname', TextInputStyle.Short, true),
                input('link', 'Profile link', 'TikTok, YouTube, Twitch, Instagram...', TextInputStyle.Short, true),
                input('stats', 'Stats', 'Followers, average views, reach...', TextInputStyle.Paragraph, true),
                input('content', 'Content style', 'What content do you create?', TextInputStyle.Paragraph, true),
                input('why', 'Why LA VELOO?', 'Why should we accept you?', TextInputStyle.Paragraph, true)
            )
    );
}

function showCooperationModal(interaction) {
    return interaction.showModal(
        new ModalBuilder()
            .setCustomId('la_coop_modal')
            .setTitle('Cooperation Application')
            .addComponents(
                input('project', 'Project / Server / Brand', 'Name or link', TextInputStyle.Short, true),
                input('stats', 'Stats', 'Members, reach, target group...', TextInputStyle.Short, true),
                input('idea', 'Cooperation idea', 'What should we do together?', TextInputStyle.Paragraph, true),
                input('benefit', 'Benefit', 'Why is it good for both sides?', TextInputStyle.Paragraph, true),
                input('contact', 'Contact', 'Discord, email, or social link', TextInputStyle.Short, true)
            )
    );
}

function showTournamentModal(interaction) {
    return interaction.showModal(
        new ModalBuilder()
            .setCustomId('la_tournament_modal')
            .setTitle('Tournament Registration')
            .addComponents(
                input('tiktok', 'Do you follow @anxsog on TikTok?', 'Yes / no + your TikTok name', TextInputStyle.Short, true),
                input('trophies', 'How many trophies?', 'Example: 42000', TextInputStyle.Short, true),
                input('club', 'Are you in the club?', 'Yes / no + club name', TextInputStyle.Short, true),
                input('rank', 'Your rank', 'Ranked rank / highest rank', TextInputStyle.Short, true),
                input('why', 'Why do you want to join?', 'Tell staff why you should play.', TextInputStyle.Paragraph, true)
            )
    );
}

function showClubVerifyModal(interaction) {
    return interaction.showModal(
        new ModalBuilder()
            .setCustomId('la_club_modal')
            .setTitle('Club Verification')
            .addComponents(
                input('player', 'Profile name', 'Your Brawl Stars profile name', TextInputStyle.Short, true),
                input('rank', 'Rank', 'Your current/highest ranked rank', TextInputStyle.Short, true),
                input('profile', 'Profile proof', 'Screenshot link, Brawlify link, or write "I will upload in ticket"', TextInputStyle.Paragraph, true)
            )
    );
}

function showSuggestionModal(interaction) {
    return interaction.showModal(
        new ModalBuilder()
            .setCustomId('la_suggestion_modal')
            .setTitle('Server Suggestion')
            .addComponents(
                input('title', 'Short title', 'Example: Weekly ranked event', TextInputStyle.Short, true),
                input('idea', 'Your idea', 'What should be improved or added?', TextInputStyle.Paragraph, true),
                input('reason', 'Why is it useful?', 'Short reason for staff and members.', TextInputStyle.Paragraph, false)
            )
    );
}

function showMatePostModal(interaction, mode) {
    const isTeam = mode === 'team';
    return interaction.showModal(
        new ModalBuilder()
            .setCustomId(`la_mate_post_modal_${mode}`)
            .setTitle(mode === 'ranked' ? 'Find Ranked Mates' : isTeam ? 'Team Search' : 'Find Mates')
            .addComponents(
                input('player', 'Player name', 'Your Brawl Stars name', TextInputStyle.Short, true),
                input('trophies', 'Trophies', 'Example: 42000', TextInputStyle.Short, true),
                input('rank', 'Rank', 'Example: Masters / Legendary / Gold...', TextInputStyle.Short, true),
                input('device', 'Device', 'Mobile / iPad / PC', TextInputStyle.Short, true),
                input(
                    'goal',
                    isTeam ? 'What team are you looking for?' : 'What do you want to play?',
                    isTeam ? 'Example: 3v3 team, ranked team, active club/team. Optional image link.' : 'Example: push ranked, 3v3, duo, trophies. Optional image link.',
                    TextInputStyle.Paragraph,
                    true
                )
            )
    );
}

function showMateConnectModal(interaction, postId) {
    return interaction.showModal(
        new ModalBuilder()
            .setCustomId(`la_mate_connect_modal_${postId}`)
            .setTitle('Connect Request')
            .addComponents(
                input('player', 'Your player name', 'Your Brawl Stars name', TextInputStyle.Short, true),
                input('trophies', 'Your trophies', 'Example: 42000', TextInputStyle.Short, true),
                input('rank', 'Your rank', 'Example: Masters / Legendary / Gold...', TextInputStyle.Short, true),
                input('device', 'Your device', 'Mobile / iPad / PC', TextInputStyle.Short, true),
                input('message', 'Why do you want to connect?', 'Short message to the player.', TextInputStyle.Paragraph, true)
            )
    );
}

function showBrawlifyProfileModal(interaction) {
    return interaction.showModal(
        new ModalBuilder()
            .setCustomId('la_profile_modal')
            .setTitle('Brawlify Profile')
            .addComponents(
                input('playerId', 'Brawl Stars player ID', 'Example: QQVVP9G0', TextInputStyle.Short, true)
            )
    );
}

function input(customId, label, placeholder, style, required) {
    return new ActionRowBuilder().addComponents(
        new TextInputBuilder()
            .setCustomId(customId)
            .setLabel(label)
            .setPlaceholder(placeholder)
            .setStyle(style)
            .setRequired(required)
    );
}

async function createSupportTicket(interaction) {
    const fields = fieldsFrom(interaction, ['topic', 'details', 'urgency', 'proof']);
    const channel = await createPrivateTextChannel(interaction.guild, {
        name: `ticket-${cleanName(interaction.user.username)}`,
        userIds: [interaction.user.id],
        topic: ticketTopic({ type: 'support', userId: interaction.user.id, status: 'open' })
    });

    await channel.send({
        content: `${interaction.user}`,
        embeds: [embed('🎟️ Support Ticket', `${interaction.user} opened a private support ticket.\nStaff can accept, decline, or delete it.`).addFields(objectFields(fields))],
        components: [ticketControlRow()]
    });

    recordStoreObject('tickets', channel.id, {
        type: 'support',
        channelId: channel.id,
        userId: interaction.user.id,
        fields,
        status: 'open',
        createdAt: new Date().toISOString()
    });

    await staffLog(interaction.guild, 'Support ticket created', `${interaction.user} opened <#${channel.id}>.`, objectFields(fields));
    return safeReply(interaction, { content: `Your ticket was created: <#${channel.id}>`, ephemeral: true });
}

async function createApplication(interaction, type) {
    const fieldMap = {
        creator: ['handle', 'link', 'stats', 'content', 'why'],
        cooperation: ['project', 'stats', 'idea', 'benefit', 'contact'],
        tournament: ['tiktok', 'trophies', 'club', 'rank', 'why']
    };
    const labels = {
        creator: '🎥 Creator Application',
        cooperation: '🤝 Cooperation Application',
        tournament: '🏆 Tournament Registration'
    };

    const fields = fieldsFrom(interaction, fieldMap[type]);
    const id = shortId(type);
    const store = readStore();
    store.applications ||= {};
    store.applications[id] = {
        id,
        type,
        userId: interaction.user.id,
        username: interaction.user.tag,
        fields,
        status: 'open',
        createdAt: new Date().toISOString()
    };
    writeStore(store);

    const reviewChannel = await getChannel(interaction.guild, type === 'tournament' ? 'tournamentStaff' : 'applicationsReview');
    const staffPanel = reviewChannel || await getChannel(interaction.guild, 'staffPanels');

    await staffPanel?.send({
        embeds: [embed(labels[type], `${interaction.user} submitted this review.`, type === 'tournament' ? 0xfacc15 : 0x111827).addFields(objectFields(fields))],
        components: [applicationControlRow(id)]
    }).catch(() => null);

    await staffLog(interaction.guild, `${labels[type]} received`, `${interaction.user} submitted an application.`, objectFields(fields));
    return safeReply(interaction, {
        content: type === 'tournament'
            ? 'Your tournament registration was sent to staff. If accepted, you will receive Tournament Verified.'
            : 'Your application was sent to staff.',
        ephemeral: true
    });
}

async function createClubVerification(interaction) {
    const fields = fieldsFrom(interaction, ['player', 'rank', 'profile']);
    const id = shortId('club');
    const channel = await createPrivateTextChannel(interaction.guild, {
        name: `club-verify-${cleanName(interaction.user.username)}`,
        userIds: [interaction.user.id],
        topic: ticketTopic({ type: 'club-verification', userId: interaction.user.id, status: 'open' })
    });

    const store = readStore();
    store.applications ||= {};
    store.applications[id] = {
        id,
        type: 'club',
        userId: interaction.user.id,
        username: interaction.user.tag,
        ticketChannelId: channel.id,
        fields,
        status: 'open',
        createdAt: new Date().toISOString()
    };
    writeStore(store);

    await channel.send({
        content: `${interaction.user}`,
        embeds: [embed('✅ Club Verification Ticket', `${interaction.user} wants to verify for the club.\nUpload a profile screenshot here if you did not add a link.`, 0x22c55e).addFields(objectFields(fields))],
        components: [applicationControlRow(id)],
        allowedMentions: { users: [interaction.user.id], roles: [] }
    }).catch(() => null);

    const staffPanel = await getChannel(interaction.guild, 'applicationsReview') || await getChannel(interaction.guild, 'staffPanels');
    await staffPanel?.send({
        embeds: [embed('✅ Club Verification Review', `${interaction.user} submitted a club verification. Ticket: <#${channel.id}>`, 0x22c55e).addFields(objectFields(fields))],
        components: [applicationControlRow(id)],
        allowedMentions: { parse: [] }
    }).catch(() => null);

    await staffLog(interaction.guild, 'Club verification received', `${interaction.user} opened <#${channel.id}> for club verification.`, objectFields(fields));
    return safeReply(interaction, { content: `Your club verification ticket was created: <#${channel.id}>`, ephemeral: true });
}

async function createSuggestionPost(interaction) {
    const fields = fieldsFrom(interaction, ['title', 'idea', 'reason']);
    const id = shortId('sug');
    const channel = await getChannel(interaction.guild, 'suggestions') || interaction.channel;
    const suggestion = {
        id,
        userId: interaction.user.id,
        username: interaction.user.tag,
        fields,
        votes: { up: [], down: [], trash: [] },
        createdAt: new Date().toISOString()
    };

    const message = await channel.send(panelSendPayload({
        embeds: [buildSuggestionEmbed(suggestion)],
        components: [suggestionVoteRow(id, suggestion.votes)]
    })).catch(() => null);

    suggestion.channelId = channel.id;
    suggestion.messageId = message?.id || null;

    const store = readStore();
    store.suggestions ||= {};
    store.suggestions[id] = suggestion;
    writeStore(store);

    await staffLog(interaction.guild, 'Suggestion submitted', `${interaction.user} submitted a server suggestion.`, objectFields(fields));
    return safeReply(interaction, { content: `Your suggestion was posted in <#${channel.id}>.`, ephemeral: true });
}

async function handleSuggestionVote(interaction, suggestionId, type) {
    const store = readStore();
    const suggestion = store.suggestions?.[suggestionId];
    if (!suggestion) return safeReply(interaction, { content: 'Suggestion not found.', ephemeral: true });

    suggestion.votes ||= { up: [], down: [], trash: [] };
    suggestion.votes.up ||= [];
    suggestion.votes.down ||= [];
    suggestion.votes.trash ||= [];

    for (const key of ['up', 'down', 'trash']) {
        suggestion.votes[key] = suggestion.votes[key].filter(id => id !== interaction.user.id);
    }

    if (type === 'up') {
        suggestion.votes.up.push(interaction.user.id);
    } else if (type === 'down') {
        suggestion.votes.down.push(interaction.user.id);
    } else if (type === 'trash') {
        suggestion.votes.trash.push(interaction.user.id);
        await staffLog(interaction.guild, 'Suggestion trash vote', `${interaction.user} marked suggestion ${suggestion.id} with trash.`, [
            { name: 'Suggestion', value: suggestion.fields?.Title || suggestion.id, inline: false }
        ]);
    }

    store.suggestions[suggestionId] = suggestion;
    writeStore(store);

    return interaction.update({
        embeds: [buildSuggestionEmbed(suggestion)],
        components: [suggestionVoteRow(suggestion.id, suggestion.votes)],
        allowedMentions: { parse: [] }
    });
}

async function handleApplicationDecision(interaction, applicationId, accepted) {
    if (!await isStaffInteraction(interaction)) {
        return safeReply(interaction, { content: 'Only staff can review applications.', ephemeral: true });
    }

    const store = readStore();
    const application = store.applications?.[applicationId];
    if (!application) return safeReply(interaction, { content: 'Application not found.', ephemeral: true });

    application.status = accepted ? 'accepted' : 'declined';
    application.reviewedBy = interaction.user.id;
    application.reviewedAt = new Date().toISOString();
    writeStore(store);

    const member = await interaction.guild.members.fetch(application.userId).catch(() => null);
    if (accepted && member) {
        if (application.type === 'creator') await addRole(member, 'creator');
        if (application.type === 'cooperation') await addRole(member, 'cooperation');
        if (application.type === 'tournament') await addRole(member, 'tournamentVerified');
        if (application.type === 'club') await addRole(member, 'clubMember');
    }

    if (accepted && application.type === 'cooperation') {
        const channel = await getChannel(interaction.guild, 'cooperations');
        await channel?.send({
            embeds: [embed('🤝 Accepted Cooperation', `<@${application.userId}> has been accepted for cooperation.`, 0x14b8a6).addFields(objectFields(application.fields))]
        }).catch(() => null);
    }

    if (accepted && application.type === 'creator') {
        const channel = await getChannel(interaction.guild, 'creatorChat');
        await channel?.send({
            embeds: [embed('🎥 Accepted Creator', `<@${application.userId}> has been accepted as creator.`, 0xec4899).addFields(objectFields(application.fields))]
        }).catch(() => null);
    }

    if (accepted && application.type === 'tournament') {
        const channel = await getChannel(interaction.guild, 'tournamentRegistration');
        await channel?.send({
            embeds: [embed('✅ Tournament Verified', `<@${application.userId}> was accepted and received Tournament Verified.`, 0x22c55e)]
        }).catch(() => null);
    }

    if (accepted && application.type === 'club') {
        const channel = await getChannel(interaction.guild, 'clubVerify');
        await channel?.send(panelSendPayload({
            embeds: [embed('✅ Club Member Verified', `<@${application.userId}> was accepted and received Club Member.`, 0x22c55e)]
        })).catch(() => null);
    }

    await member?.send(accepted
        ? `Your LA VELOO ${application.type} application was accepted.`
        : `Your LA VELOO ${application.type} application was declined.`
    ).catch(() => null);

    await interaction.message.edit({
        components: [applicationControlRow(applicationId, true)],
        embeds: interaction.message.embeds
    }).catch(() => null);

    await staffLog(interaction.guild, `Application ${accepted ? 'accepted' : 'declined'}`, `${interaction.user} ${accepted ? 'accepted' : 'declined'} ${application.type} from <@${application.userId}>.`);
    return safeReply(interaction, { content: `Application ${accepted ? 'accepted' : 'declined'}.`, ephemeral: true });
}

async function createBrawlifyProfilePost(interaction) {
    const tag = normalizeBrawlStarsTag(interaction.fields.getTextInputValue('playerId'));
    if (!tag) {
        return safeReply(interaction, {
            content: 'Please enter a valid Brawl Stars player ID like `QQVVP9G0`.',
            ephemeral: true
        });
    }

    await interaction.deferReply({ ephemeral: true });

    const profileUrl = `https://brawlify.com/player/${tag}`;
    const profileData = await fetchBrawlifyProfileData(tag);
    const submissionId = shortId('prof');
    const profileChannel = await getChannel(interaction.guild, 'profileTool') || interaction.channel;
    const weekKey = getWeekKey(new Date());

    const embeds = buildBrawlifyProfileEmbeds({
        tag,
        profileUrl,
        profileData,
        user: interaction.user
    });

    const message = await profileChannel.send({
        embeds,
        components: [profileLikeRow(submissionId, 0, profileUrl)]
    });

    const store = readStore();
    store.profileSubmissions ||= {};
    store.profileSubmissions[submissionId] = {
        id: submissionId,
        guildId: interaction.guild.id,
        userId: interaction.user.id,
        username: interaction.user.tag,
        tag,
        profileUrl,
        weekKey,
        channelId: profileChannel.id,
        messageId: message.id,
        imageUrls: profileData.imageUrls || [],
        title: profileData.title || tag,
        likes: [],
        createdAt: new Date().toISOString()
    };
    writeStore(store);

    await addLaXp(interaction.guild, interaction.user.id, PROFILE_POST_XP, `Brawlify profile submitted: ${tag}`);
    await updateCurrentProfileLeaderboardPanel(interaction.guild);
    await staffLog(interaction.guild, 'Brawlify profile submitted', `${interaction.user} submitted ${profileUrl}.`, [
        { name: 'Player ID', value: tag, inline: true },
        { name: 'Profile', value: profileUrl, inline: false }
    ]);

    return interaction.editReply(`Your Brawlify profile was posted in <#${profileChannel.id}>.`);
}

async function handleProfileLike(interaction, submissionId) {
    const store = readStore();
    const submission = store.profileSubmissions?.[submissionId];
    if (!submission) {
        return safeReply(interaction, { content: 'This profile post is no longer tracked.', ephemeral: true });
    }

    if (submission.userId === interaction.user.id) {
        return safeReply(interaction, { content: 'You cannot like your own profile post.', ephemeral: true });
    }

    submission.likes ||= [];
    const alreadyLiked = submission.likes.includes(interaction.user.id);
    if (alreadyLiked) {
        submission.likes = submission.likes.filter(userId => userId !== interaction.user.id);
    } else {
        submission.likes.push(interaction.user.id);
    }

    store.profileSubmissions[submissionId] = submission;
    writeStore(store);

    await interaction.message.edit({
        components: [profileLikeRow(submissionId, submission.likes.length)]
    }).catch(() => null);

    await updateCurrentProfileLeaderboardPanel(interaction.guild);
    return safeReply(interaction, {
        content: alreadyLiked ? 'Your 🔥 like was removed.' : 'You liked this profile with 🔥.',
        ephemeral: true
    });
}

async function createMatePost(interaction, mode) {
    const fields = fieldsFrom(interaction, ['player', 'trophies', 'rank', 'device', 'goal']);
    const id = shortId('mate');
    const channelKey = mode === 'ranked' ? 'findRankedMates' : mode === 'team' ? 'teamSearch' : 'findMates';
    const channel = await getChannel(interaction.guild, channelKey);
    const trophiesNumber = parseTrophies(fields.Trophies);
    const trophyBucket = getTrophyBucket(trophiesNumber);
    const rankTier = normalizeRankTier(fields.Rank);
    const profileImageUrl = extractFirstUrl(fields.Goal);
    const matching = {
        trophiesNumber,
        trophyBucket,
        trophyBucketLabel: trophyBucketLabel(trophyBucket),
        rankTier: rankTier?.key || null,
        rankLabel: rankTier?.label || cleanValue(fields.Rank, 80),
        rankIndex: rankTier?.index ?? null
    };

    const mateEmbed = buildMateCardEmbed({
        mode,
        userId: interaction.user.id,
        fields,
        matching,
        profileImageUrl
    });

    const message = await channel?.send({
        embeds: [mateEmbed],
        components: [buttonRow(new ButtonBuilder().setCustomId(`la_mate_connect_${id}`).setLabel('Connect').setStyle(ButtonStyle.Success))]
    }).catch(() => null);

    const searchChannel = await ensureMateSearchChannel(interaction.guild, interaction.user.id, interaction.user.username, mode);

    const store = readStore();
    store.matePosts ||= {};
    store.matePosts[id] = {
        id,
        mode,
        ownerId: interaction.user.id,
        channelId: channel?.id,
        messageId: message?.id || null,
        fields,
        matching,
        profileImageUrl,
        searchChannelId: searchChannel?.id || null,
        publicUrl: message ? discordMessageUrl(interaction.guild.id, channel.id, message.id) : null,
        active: true,
        createdAt: new Date().toISOString()
    };
    writeStore(store);

    await searchChannel?.send({
        embeds: [
            embed(
                mode === 'ranked' ? '🏆 Ranked Search Started' : mode === 'team' ? '👥 Team Search Started' : '🤝 Mate Search Started',
                [
                    `${interaction.user}, your private search channel is ready.`,
                    `Public post: ${message ? `[open in ${channel.name}](${discordMessageUrl(interaction.guild.id, channel.id, message.id)})` : 'not available'}`,
                    `Group: **${matching.trophyBucketLabel}**`,
                    `Rank: **${matching.rankLabel || 'not detected'}**`,
                    '',
                    'Matching cards appear here automatically.'
                ].join('\n'),
                mode === 'ranked' ? 0xfacc15 : mode === 'team' ? 0x22c55e : 0x3b82f6
            )
        ]
    }).catch(() => null);

    await addRole(interaction.member, mode === 'ranked' ? 'rankedPlayer' : mode === 'team' ? 'teamPlayer' : 'lookingForMates').catch(() => null);
    await sendMateMatches(interaction.guild, store.matePosts[id]).catch(error => {
        console.error('[LA VELOO] Mate matching failed:', error.message);
    });
    await staffLog(interaction.guild, 'Mate card created', `${interaction.user} created a ${mode} mate card.`, objectFields(fields));
    return safeReply(interaction, { content: `Your player card was posted in <#${channel.id}> and your private search channel is <#${searchChannel.id}>.`, ephemeral: true });
}

async function createMateRequest(interaction, postId) {
    const store = readStore();
    const post = store.matePosts?.[postId];
    if (!post) return safeReply(interaction, { content: 'This mate post does not exist anymore.', ephemeral: true });
    if (post.ownerId === interaction.user.id) return safeReply(interaction, { content: 'You cannot connect with your own mate card.', ephemeral: true });

    const fields = fieldsFrom(interaction, ['player', 'trophies', 'rank', 'device', 'message']);
    const requestId = shortId('req');
    store.mateRequests ||= {};
    store.mateRequests[requestId] = {
        id: requestId,
        postId,
        guildId: interaction.guild.id,
        targetId: post.ownerId,
        requesterId: interaction.user.id,
        fields,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    writeStore(store);

    const target = await clientRef.users.fetch(post.ownerId).catch(() => null);
    const dmPayload = {
        embeds: [embed('🤝 New Mate Request', `${interaction.user} wants to connect with your card.`, 0x3b82f6).addFields(objectFields(fields))],
        components: [buttonRow(
            new ButtonBuilder().setCustomId(`la_mate_accept_${requestId}`).setLabel('✅ Accept').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`la_mate_decline_${requestId}`).setLabel('❌ Decline').setStyle(ButtonStyle.Danger)
        )]
    };

    await target?.send(dmPayload).catch(async () => {
        const staffPanel = await getChannel(interaction.guild, 'staffPanels');
        await staffPanel?.send({
            embeds: [embed('⚠️ Mate Request Needs Review', `Could not DM <@${post.ownerId}>. Request from ${interaction.user}.`, 0xf97316).addFields(objectFields(fields))],
            components: dmPayload.components
        }).catch(() => null);
    });

    await staffLog(interaction.guild, 'Mate connect request', `${interaction.user} requested to connect with <@${post.ownerId}>.`, objectFields(fields));
    return safeReply(interaction, { content: 'Your request was sent. The other player can accept or decline it first.', ephemeral: true });
}

async function sendMateMatches(guild, newPost) {
    if (!newPost?.active) return;

    const matches = findCompatibleMatePosts(newPost).slice(0, 6);
    if (!matches.length) {
        const searchChannel = await ensureMateSearchChannel(guild, newPost.ownerId, 'player', newPost.mode);
        await searchChannel?.send({
            embeds: [embed('🔎 No Match Yet', `No saved card matched your group yet.\n\nTrophies: **${newPost.matching?.trophyBucketLabel || 'unknown'}**\nRank: **${newPost.matching?.rankLabel || 'not detected'}**`, 0x64748b)]
        }).catch(() => null);
        return;
    }

    for (const match of matches) {
        await sendMateMatchPanel(guild, newPost, match);
        await sendMateMatchPanel(guild, match, newPost);
        rememberMateMatch(newPost.id, match.id);
    }
}

function findCompatibleMatePosts(post) {
    const store = readStore();
    const posts = Object.values(store.matePosts || {});
    return posts
        .filter(candidate => candidate.id !== post.id)
        .filter(candidate => candidate.active !== false)
        .filter(candidate => candidate.ownerId !== post.ownerId)
        .filter(candidate => candidate.mode === post.mode)
        .filter(candidate => !hasMateMatch(post.id, candidate.id))
        .filter(candidate => isCompatibleMatePost(post, candidate))
        .sort((a, b) => {
            const trophyDiffA = Math.abs((a.matching?.trophiesNumber || 0) - (post.matching?.trophiesNumber || 0));
            const trophyDiffB = Math.abs((b.matching?.trophiesNumber || 0) - (post.matching?.trophiesNumber || 0));
            if (trophyDiffA !== trophyDiffB) return trophyDiffA - trophyDiffB;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
}

function isCompatibleMatePost(a, b) {
    if (a.matching?.trophyBucket !== b.matching?.trophyBucket) {
        return false;
    }

    if (a.mode !== 'ranked') {
        return true;
    }

    if (!a.matching?.rankTier || !b.matching?.rankTier) {
        return true;
    }

    return a.matching.rankTier === b.matching.rankTier;
}

async function sendMateMatchPanel(guild, recipientPost, suggestedPost) {
    const recipientUser = await clientRef.users.fetch(recipientPost.ownerId).catch(() => null);
    const channel = await ensureMateSearchChannel(guild, recipientPost.ownerId, recipientUser?.username || 'player', recipientPost.mode);
    if (!channel) return;

    const suggestedEmbed = buildMateCardEmbed({
        mode: suggestedPost.mode,
        userId: suggestedPost.ownerId,
        fields: suggestedPost.fields,
        matching: suggestedPost.matching,
        profileImageUrl: suggestedPost.profileImageUrl,
        titlePrefix: '✨ Matched Player'
    });

    suggestedEmbed.setDescription([
        `<@${suggestedPost.ownerId}> matches your search group.`,
        `Trophies: **${suggestedPost.matching?.trophyBucketLabel || 'unknown'}**`,
        `Rank: **${suggestedPost.matching?.rankLabel || 'not detected'}**`
    ].join('\n'));

    const components = [
        new ButtonBuilder()
            .setCustomId(`la_mate_connect_${suggestedPost.id}`)
            .setLabel('🤝 Connect')
            .setStyle(ButtonStyle.Success)
    ];

    if (suggestedPost.publicUrl) {
        components.push(
            new ButtonBuilder()
                .setLabel('🔎 Open Card')
                .setStyle(ButtonStyle.Link)
                .setURL(suggestedPost.publicUrl)
        );
    }

    await channel.send({
        embeds: [suggestedEmbed],
        components: [buttonRow(...components)]
    }).catch(() => null);
}

async function ensureMateSearchChannel(guild, userId, username, mode) {
    const store = readStore();
    store.mateSearchChannels ||= {};

    const storeKey = `${userId}:${mode || 'mate'}`;
    const existingId = store.mateSearchChannels[storeKey]?.channelId || store.mateSearchChannels[userId]?.channelId;
    if (existingId) {
        const existingChannel = await guild.channels.fetch(existingId).catch(() => null);
        if (existingChannel) {
            return existingChannel;
        }
    }

    const prefix = mode === 'team' ? 'team-search' : mode === 'ranked' ? 'ranked-search' : 'mate-search';
    const channel = await createPrivateTextChannel(guild, {
        name: `${prefix}-${cleanName(username)}`,
        userIds: [userId],
        topic: `LA_MATE_SEARCH user=${userId} mode=${mode}`
    });

    store.mateSearchChannels[storeKey] = {
        channelId: channel.id,
        userId,
        mode,
        createdAt: new Date().toISOString()
    };
    writeStore(store);
    return channel;
}

function rememberMateMatch(aId, bId) {
    const store = readStore();
    store.mateMatches ||= {};
    const key = mateMatchKey(aId, bId);
    store.mateMatches[key] ||= {
        postIds: [aId, bId],
        createdAt: new Date().toISOString()
    };
    writeStore(store);
}

function hasMateMatch(aId, bId) {
    const store = readStore();
    return Boolean(store.mateMatches?.[mateMatchKey(aId, bId)]);
}

function mateMatchKey(aId, bId) {
    return [aId, bId].sort().join(':');
}

async function handleMateDecision(interaction, requestId, accepted) {
    const store = readStore();
    const request = store.mateRequests?.[requestId];
    if (!request) return safeReply(interaction, { content: 'Request not found.', ephemeral: true });
    const actorIsTarget = interaction.user.id === request.targetId;
    const actorIsStaff = interaction.guild ? await isStaffInteraction(interaction) : false;
    if (!actorIsTarget && !actorIsStaff) {
        return safeReply(interaction, { content: 'Only the requested player can decide this.', ephemeral: true });
    }

    const guild = await clientRef.guilds.fetch(request.guildId).catch(() => null);
    if (!guild) return safeReply(interaction, { content: 'Server not found.', ephemeral: true });
    await guild.channels.fetch().catch(() => null);

    request.status = accepted ? 'accepted' : 'declined';
    request.decidedAt = new Date().toISOString();
    writeStore(store);

    const requester = await clientRef.users.fetch(request.requesterId).catch(() => null);
    const target = await clientRef.users.fetch(request.targetId).catch(() => null);

    if (!accepted) {
        await requester?.send('Your LA VELOO mate request was declined.').catch(() => null);
        await interaction.message?.delete?.().catch(() => null);
        await staffLog(guild, 'Mate request declined', `<@${request.targetId}> declined a request from <@${request.requesterId}>.`);
        return safeReply(interaction, { content: 'Request declined. The requester was notified.', ephemeral: true });
    }

    const textChannel = await createPrivateTextChannel(guild, {
        name: `mates-${cleanName(requester?.username || 'player')}-${cleanName(target?.username || 'player')}`.slice(0, 90),
        userIds: [request.requesterId, request.targetId],
        topic: `LA_MATE_REQUEST id=${request.id} requester=${request.requesterId} target=${request.targetId}`
    });
    const voiceChannel = await createPrivateVoiceChannel(guild, {
        name: `Mates ${cleanName(requester?.username || 'Player')} + ${cleanName(target?.username || 'Player')}`.slice(0, 90),
        userIds: [request.requesterId, request.targetId]
    });

    request.textChannelId = textChannel.id;
    request.voiceChannelId = voiceChannel.id;
    writeStore(store);

    await textChannel.send({
        embeds: [embed('Mate Connect Accepted', `This private channel was created for <@${request.requesterId}> and <@${request.targetId}>.\nVoice: <#${voiceChannel.id}>`, 0x22c55e)]
    }).catch(() => null);

    await requester?.send(`Your mate request was accepted. Private channel: <#${textChannel.id}>`).catch(() => null);
    await interaction.message?.delete?.().catch(() => null);
    await staffLog(guild, 'Mate request accepted', `Private mate channels created for <@${request.requesterId}> and <@${request.targetId}>.`, [
        { name: 'Text', value: `<#${textChannel.id}>`, inline: true },
        { name: 'Voice', value: `<#${voiceChannel.id}>`, inline: true }
    ]);
    return safeReply(interaction, { content: 'Request accepted. Private text and voice channels were created.', ephemeral: true });
}

async function createPrivateTextChannel(guild, options) {
    const category = await getPrivateChannelParent(guild);
    const overwrites = await privateOverwrites(guild, options.userIds || []);

    const channel = await guild.channels.create({
        name: options.name,
        type: ChannelType.GuildText,
        parent: category?.id,
        topic: options.topic,
        permissionOverwrites: overwrites,
        reason: 'LA VELOO private channel'
    });

    rememberCreated('privateChannels', channel.id, {
        id: channel.id,
        type: 'text',
        name: channel.name,
        users: options.userIds || [],
        createdAt: new Date().toISOString()
    });

    return channel;
}

async function createPrivateVoiceChannel(guild, options) {
    const category = await getPrivateChannelParent(guild);
    const overwrites = await privateOverwrites(guild, options.userIds || []);

    const channel = await guild.channels.create({
        name: options.name,
        type: ChannelType.GuildVoice,
        parent: category?.id,
        permissionOverwrites: overwrites,
        reason: 'LA VELOO mate voice'
    });

    rememberCreated('privateChannels', channel.id, {
        id: channel.id,
        type: 'voice',
        name: channel.name,
        users: options.userIds || [],
        createdAt: new Date().toISOString()
    });

    return channel;
}

async function getPrivateChannelParent(guild) {
    const ticketCategory = await getChannel(guild, 'tickets');
    if (ticketCategory?.type === ChannelType.GuildCategory) return ticketCategory;

    const ticketInfo = await getChannel(guild, 'ticketInfo');
    if (ticketInfo?.parentId) {
        return guild.channels.cache.get(ticketInfo.parentId)
            || await guild.channels.fetch(ticketInfo.parentId).catch(() => null);
    }

    return null;
}

async function privateOverwrites(guild, userIds) {
    await guild.roles.fetch().catch(() => null);
    const roles = STAFF_ROLE_KEYS.map(key => findRole(guild, key)).filter(Boolean);
    const ownerRole = findRole(guild, 'owner');
    const channelManagementDeny = [PERMS.ManageChannels, PERMS.ManageRoles, PERMS.ManageWebhooks];
    const overwrites = [
        { id: guild.roles.everyone.id, deny: [PERMS.ViewChannel, ...channelManagementDeny] },
        { id: clientRef.user.id, allow: [PERMS.ViewChannel, PERMS.SendMessages, PERMS.ReadMessageHistory, PERMS.ManageChannels, PERMS.ManageMessages, PERMS.Connect, PERMS.Speak] },
        ...userIds.map(id => ({ id, allow: [PERMS.ViewChannel, PERMS.SendMessages, PERMS.ReadMessageHistory, PERMS.AttachFiles, PERMS.Connect, PERMS.Speak] })),
        ownerRole ? { id: ownerRole.id, allow: [PERMS.ViewChannel, PERMS.SendMessages, PERMS.ReadMessageHistory, PERMS.ManageChannels, PERMS.ManageRoles, PERMS.ManageWebhooks, PERMS.ManageMessages, PERMS.Connect, PERMS.Speak, PERMS.MoveMembers] } : null,
        ...roles
            .filter(role => role.id !== ownerRole?.id)
            .map(role => ({ id: role.id, allow: [PERMS.ViewChannel, PERMS.SendMessages, PERMS.ReadMessageHistory, PERMS.ManageMessages, PERMS.Connect, PERMS.Speak], deny: channelManagementDeny }))
    ];
    return overwrites.filter(Boolean);
}

async function handleTicketDecision(interaction, status) {
    if (!await isStaffInteraction(interaction)) return safeReply(interaction, { content: 'Only staff can manage tickets.', ephemeral: true });
    if (!interaction.channel || interaction.channel.type !== ChannelType.GuildText) return safeReply(interaction, { content: 'Use this inside a ticket channel.', ephemeral: true });

    const store = readStore();
    const ticket = store.tickets?.[interaction.channel.id];
    if (ticket) {
        ticket.status = status;
        ticket.reviewedBy = interaction.user.id;
        ticket.reviewedAt = new Date().toISOString();
        writeStore(store);
    }

    await interaction.channel.setTopic(ticketTopic({ type: ticket?.type || 'support', userId: ticket?.userId || 'unknown', status })).catch(() => null);
    await interaction.message.edit({ components: [ticketControlRow(status !== 'open')] }).catch(() => null);
    await interaction.channel.send({ embeds: [embed(`Ticket ${status}`, `${interaction.user} marked this ticket as ${status}.`)] }).catch(() => null);

    const user = ticket?.userId ? await clientRef.users.fetch(ticket.userId).catch(() => null) : null;
    await user?.send(`Your LA VELOO ticket was ${status}.`).catch(() => null);
    await staffLog(interaction.guild, `Ticket ${status}`, `${interaction.user} marked <#${interaction.channel.id}> as ${status}.`);
    return safeReply(interaction, { content: `Ticket ${status}.`, ephemeral: true });
}

async function handleTicketDelete(interaction) {
    if (!await isStaffInteraction(interaction)) return safeReply(interaction, { content: 'Only staff can delete tickets.', ephemeral: true });
    const channel = interaction.channel;
    await safeReply(interaction, { content: 'Deleting ticket in 3 seconds...', ephemeral: true });

    const store = readStore();
    if (store.tickets?.[channel.id]) {
        store.tickets[channel.id].status = 'deleted';
        store.tickets[channel.id].deletedBy = interaction.user.id;
        store.tickets[channel.id].deletedAt = new Date().toISOString();
        writeStore(store);
    }

    await staffLog(interaction.guild, 'Ticket deleted', `${interaction.user} deleted ticket ${channel.name}.`);
    setTimeout(() => channel.delete('LA VELOO ticket closed').catch(() => null), 3000);
}

function ticketControlRow(disabled = false) {
    return buttonRow(
        new ButtonBuilder().setCustomId('la_ticket_accept').setLabel('✅ Accept').setStyle(ButtonStyle.Success).setDisabled(disabled),
        new ButtonBuilder().setCustomId('la_ticket_decline').setLabel('❌ Decline').setStyle(ButtonStyle.Secondary).setDisabled(disabled),
        new ButtonBuilder().setCustomId('la_ticket_delete').setLabel('🗑️ Delete').setStyle(ButtonStyle.Danger)
    );
}

function applicationControlRow(id, disabled = false) {
    return buttonRow(
        new ButtonBuilder().setCustomId(`la_app_accept_${id}`).setLabel('✅ Accept').setStyle(ButtonStyle.Success).setDisabled(disabled),
        new ButtonBuilder().setCustomId(`la_app_decline_${id}`).setLabel('❌ Decline').setStyle(ButtonStyle.Danger).setDisabled(disabled)
    );
}

function suggestionVoteRow(id, votes = {}) {
    return buttonRow(
        new ButtonBuilder()
            .setCustomId(`la_suggest_up_${id}`)
            .setLabel(`👍 ${votes.up?.length || 0}`)
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`la_suggest_down_${id}`)
            .setLabel(`👎 ${votes.down?.length || 0}`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`la_suggest_trash_${id}`)
            .setLabel(`🗑️ ${votes.trash?.length || 0}`)
            .setStyle(ButtonStyle.Danger)
    );
}

function mapDesignControlRow(messageId, signals = 0) {
    return buttonRow(
        new ButtonBuilder()
            .setCustomId(`la_map_ban_${messageId}`)
            .setLabel(`🚩 Ban Signal ${signals}`)
            .setStyle(ButtonStyle.Danger)
    );
}

function profileLikeRow(id, likeCount, profileUrl = null) {
    return buttonRow(
        new ButtonBuilder()
            .setCustomId(`la_profile_like_${id}`)
            .setLabel(`🔥 ${likeCount}`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setLabel('Open Brawlify')
            .setStyle(ButtonStyle.Link)
            .setURL(profileUrl || getProfileUrlFromSubmissionId(id))
    );
}

function getProfileUrlFromSubmissionId(id) {
    const store = readStore();
    return store.profileSubmissions?.[id]?.profileUrl || 'https://brawlify.com/stats';
}

function buildSuggestionEmbed(suggestion) {
    const fields = suggestion.fields || {};
    const title = cleanValue(fields.Title || 'Server Suggestion', 120);
    const idea = cleanValue(fields.Idea || 'No idea text provided.', 1200);
    const reason = cleanValue(fields.Reason || 'Not provided.', 600);
    const votes = suggestion.votes || {};

    return embed(`💡 ${title}`, idea, 0x38bdf8)
        .addFields([
            { name: '👤 Suggested By', value: `<@${suggestion.userId}>`, inline: true },
            { name: '👍 Likes', value: String(votes.up?.length || 0), inline: true },
            { name: '👎 Dislikes', value: String(votes.down?.length || 0), inline: true },
            { name: '🗑️ Trash Votes', value: String(votes.trash?.length || 0), inline: true },
            { name: 'Reason', value: reason, inline: false },
            { name: 'Suggestion-ID', value: suggestion.id, inline: true }
        ]);
}

function buildMateCardEmbed({ mode, userId, fields, matching, profileImageUrl, titlePrefix = null }) {
    const title = titlePrefix || (mode === 'ranked' ? '🏆 Ranked Mate Card' : mode === 'team' ? '👥 Team Search Card' : '🤝 Mate Card');
    const description = mode === 'team' ? `<@${userId}> is looking for a team.` : `<@${userId}> is looking for mates.`;
    const color = mode === 'ranked' ? 0xfacc15 : mode === 'team' ? 0x22c55e : 0x3b82f6;
    const cardEmbed = embed(title, description, color)
        .addFields([
            ...objectFields(fields),
            { name: '🏅 Trophies', value: matching?.trophyBucketLabel || 'unknown', inline: true },
            { name: '🎖️ Rank', value: matching?.rankLabel || 'not detected', inline: true }
        ]);

    if (profileImageUrl) {
        cardEmbed.setImage(profileImageUrl);
    }

    return cardEmbed;
}

function parseTrophies(value) {
    const number = Number(String(value || '').replace(/[^\d]/g, ''));
    return Number.isFinite(number) && number >= 0 ? number : 0;
}

function getTrophyBucket(trophies) {
    const normalized = Math.max(0, Number(trophies || 0));
    return Math.floor(normalized / 10000) * 10000;
}

function trophyBucketLabel(bucket) {
    const start = Math.max(0, Number(bucket || 0));
    const end = start + 9999;
    if (start === 0) {
        return '0-9,999';
    }
    return `${formatNumber(start)}-${formatNumber(end)}`;
}

function normalizeRankTier(value) {
    const normalized = String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    for (let index = 0; index < RANK_TIERS.length; index += 1) {
        const tier = RANK_TIERS[index];
        if (tier.labels.some(label => normalized.includes(label.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
            return {
                key: tier.key,
                index,
                label: prettyRankTier(tier.key)
            };
        }
    }

    return null;
}

function prettyRankTier(key) {
    return {
        bronze: 'Bronze',
        silver: 'Silver / Silber',
        gold: 'Gold',
        diamond: 'Diamond / Dia',
        mythic: 'Mythic / Mythisch',
        legendary: 'Legendary / Legendär',
        master: 'Master / Meister',
        pro: 'Pro'
    }[key] || key;
}

function extractFirstUrl(value) {
    return String(value || '').match(/https?:\/\/\S+/i)?.[0] || null;
}

function discordMessageUrl(guildId, channelId, messageId) {
    return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(Number(value || 0));
}

function buildBrawlifyProfileEmbeds({ tag, profileUrl, profileData, user }) {
    const title = profileData.title || `🧰 Brawlify Profile ${tag}`;
    const imageUrls = profileData.imageUrls || [];
    const mainEmbed = embed(title, `${user} shared a Brawlify profile.\n[Open profile](${profileUrl})`, 0xf97316)
        .addFields([
            { name: '🆔 Player ID', value: `#${tag}`, inline: true },
            { name: '🔥 Likes', value: '0', inline: true }
        ]);

    if (imageUrls[0]) {
        mainEmbed.setImage(imageUrls[0]);
    }

    const extraEmbeds = imageUrls.slice(1, 4).map((imageUrl, index) =>
        new EmbedBuilder()
            .setTitle(`Profile Image ${index + 2}`)
            .setURL(profileUrl)
            .setImage(imageUrl)
            .setColor(0xf97316)
    );

    return [mainEmbed, ...extraEmbeds];
}

async function fetchBrawlifyProfileData(tag) {
    const profileUrl = `https://brawlify.com/player/${tag}`;
    const fallback = { title: `🧰 Brawlify Profile ${tag}`, imageUrls: [] };

    try {
        if (typeof fetch !== 'function') return fallback;

        const response = await fetch(profileUrl, {
            headers: {
                'user-agent': 'LA VELOO Discord Bot (+https://discord.com)',
                accept: 'text/html,application/xhtml+xml'
            }
        });

        if (!response.ok) return fallback;

        const html = await response.text();
        const title = extractHtmlTitle(html) || fallback.title;
        const imageUrls = extractBrawlifyImages(html, profileUrl);
        return { title, imageUrls };
    } catch {
        return fallback;
    }
}

function extractHtmlTitle(html) {
    const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)?.[1];
    const title = ogTitle || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    return decodeHtml(title || '').replace(/\s+\|\s+Brawlify.*$/i, '').trim();
}

function extractBrawlifyImages(html, baseUrl) {
    const urls = [];
    const metaPatterns = [
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/ig,
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/ig,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/ig,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/ig
    ];

    for (const pattern of metaPatterns) {
        for (const match of html.matchAll(pattern)) {
            urls.push(match[1]);
        }
    }

    for (const match of html.matchAll(/<img[^>]+(?:src|data-src)=["']([^"']+)["'][^>]*>/ig)) {
        const tag = match[0].toLowerCase();
        if (tag.includes('player') || tag.includes('profile') || tag.includes('icon') || tag.includes('avatar')) {
            urls.push(match[1]);
        }
    }

    return [...new Set(urls
        .map(url => absolutizeUrl(decodeHtml(url), baseUrl))
        .filter(url => /^https?:\/\//i.test(url))
        .filter(url => !url.includes('data:image')))]
        .slice(0, 4);
}

function absolutizeUrl(url, baseUrl) {
    try {
        return new URL(url, baseUrl).toString();
    } catch {
        return '';
    }
}

function normalizeBrawlStarsTag(value) {
    const tag = String(value || '')
        .trim()
        .replace(/^#/, '')
        .replace(/\s+/g, '')
        .toUpperCase();

    return /^[A-Z0-9]{3,16}$/.test(tag) ? tag : null;
}

async function storeMessageLog(message) {
    const store = readStore();
    store.messages ||= [];
    store.messageCount ||= 0;
    store.messageCount += 1;
    store.messages.push({
        id: message.id,
        channelId: message.channelId,
        channelName: message.channel?.name || null,
        authorId: message.author.id,
        authorTag: message.author.tag,
        content: String(message.content || '').slice(0, 1500),
        attachments: [...message.attachments.values()].map(attachment => attachment.url),
        createdAt: new Date().toISOString()
    });

    if (store.messages.length > 5000) {
        store.messages = store.messages.slice(-5000);
    }
    writeStore(store);

    if (LIVE_MESSAGE_LOG) {
        const botLog = await getChannel(message.guild, 'botLog');
        await botLog?.send({ embeds: [embed('Message Log', `#${message.channel?.name || message.channelId} | ${message.author.tag}\n${String(message.content || '[attachment]').slice(0, 1500)}`)] }).catch(() => null);
    }

    if (LOG_MESSAGE_SNAPSHOT_EVERY > 0 && store.messageCount % LOG_MESSAGE_SNAPSHOT_EVERY === 0) {
        await updateMessageSnapshotPanel(message.guild, false);
    }
}

async function updateMessageSnapshotPanel(guild, force) {
    const staffPanels = await getChannel(guild, 'staffPanels');
    if (!staffPanels) return;

    const store = readStore();
    const recent = (store.messages || []).slice(-8).reverse();
    const description = recent.length
        ? recent.map(entry => `**#${entry.channelName || entry.channelId}** ${entry.authorTag}: ${entry.content || '[attachment]'}`.slice(0, 250)).join('\n')
        : 'No messages stored yet.';

    if (!force && !recent.length) return;

    await upsertPanel(staffPanels, 'la-message-snapshot', {
        embeds: [embed('📊 Message Snapshot', description).addFields([
            { name: 'Stored messages', value: String((store.messages || []).length), inline: true },
            { name: 'Live message mirror', value: LIVE_MESSAGE_LOG ? 'enabled' : 'disabled', inline: true }
        ])]
    });
}

async function updateCurrentProfileLeaderboardPanel(guild, options = {}) {
    const channel = await getChannel(guild, 'profileTool');
    if (!channel) return;

    const weekKey = getWeekKey(new Date());
    const top = getTopProfileSubmission(weekKey);

    const payload = top
        ? {
            embeds: [buildProfileWinnerEmbed('🔥 Current Weekly Top', top, `Week ${weekKey}`, false)]
        }
        : {
            embeds: [embed('🔥 Current Weekly Top', 'No Brawlify profiles have been submitted this week yet.', 0xf97316)]
        };

    await upsertPanel(channel, 'la-profile-current-top', payload, options);
}

async function announceWeeklyProfileWinnerIfNeeded(guild) {
    const previousWeek = getPreviousWeekKey(new Date());
    const store = readStore();
    store.profileWeeklyAnnouncements ||= {};

    if (store.profileWeeklyAnnouncements[previousWeek]) {
        return;
    }

    const top = getTopProfileSubmission(previousWeek);
    store.profileWeeklyAnnouncements[previousWeek] = {
        announcedAt: new Date().toISOString(),
        winnerId: top?.id || null
    };
    writeStore(store);

    if (!top) {
        return;
    }

    const channel = await getChannel(guild, 'profileTool');
    await channel?.send({
        embeds: [buildProfileWinnerEmbed('🏅 Weekly Most Liked Profile', top, `Winner for week ${previousWeek}`, true)]
    }).catch(() => null);

    await addLaXp(guild, top.userId, PROFILE_WEEKLY_WINNER_XP, `Weekly most liked Brawlify profile (${previousWeek})`);
    await staffLog(guild, 'Weekly profile winner', `<@${top.userId}> won the weekly Brawlify profile likes with ${top.likes?.length || 0} 🔥.`, [
        { name: 'Player ID', value: top.tag, inline: true },
        { name: 'Profile', value: top.profileUrl, inline: false },
        { name: 'XP Awarded', value: String(PROFILE_WEEKLY_WINNER_XP), inline: true }
    ]);
}

function buildProfileWinnerEmbed(title, submission, subtitle, isFinalWinner) {
    const winnerEmbed = embed(title, [
        subtitle,
        '',
        `Player: <@${submission.userId}>`,
        `Likes: **${submission.likes?.length || 0} 🔥**`,
        `[Open Brawlify](${submission.profileUrl})`
    ].join('\n'), isFinalWinner ? 0xf59e0b : 0xf97316)
        .addFields([
            { name: '🆔 Player ID', value: `#${submission.tag}`, inline: true },
            { name: '📅 Week', value: submission.weekKey, inline: true }
        ]);

    if (submission.imageUrls?.[0]) {
        winnerEmbed.setImage(submission.imageUrls[0]);
    }

    return winnerEmbed;
}

function getTopProfileSubmission(weekKey) {
    const store = readStore();
    const candidates = Object.values(store.profileSubmissions || {})
        .filter(submission => submission.weekKey === weekKey)
        .sort((a, b) => {
            const likeDiff = (b.likes?.length || 0) - (a.likes?.length || 0);
            if (likeDiff !== 0) return likeDiff;
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

    return candidates[0] || null;
}

async function addLaXp(guild, userId, amount, reason) {
    if (!amount || amount <= 0) return;

    const store = readStore();
    store.xp ||= {};
    const record = store.xp[userId] || { xp: 0, history: [], rewardedRoles: [] };
    const before = Number(record.xp || 0);
    record.xp = before + amount;
    record.history ||= [];
    record.rewardedRoles ||= [];
    record.history.push({
        amount,
        reason,
        createdAt: new Date().toISOString()
    });
    record.history = record.history.slice(-100);
    store.xp[userId] = record;
    writeStore(store);

    const member = await guild.members.fetch(userId).catch(() => null);
    const newlyAwardedRoles = [];
    for (const reward of XP_REWARDS) {
        if (before < reward.xp && record.xp >= reward.xp) {
            await addRole(member, reward.roleKey).catch(() => null);
            if (!record.rewardedRoles.includes(reward.roleKey)) {
                record.rewardedRoles.push(reward.roleKey);
                newlyAwardedRoles.push(plainRoleLabel(reward.roleKey));
            }
        }
    }
    writeStore(store);

    const botLog = await getChannel(guild, 'botLog') || await getChannel(guild, 'staffPanels');
    await botLog?.send({
        embeds: [embed('Level XP Added', `<@${userId}> received **${amount} XP**.\nReason: ${reason}`, 0x22c55e).addFields([
            { name: 'Total XP', value: String(record.xp), inline: true },
            { name: 'New Roles', value: newlyAwardedRoles.length ? newlyAwardedRoles.join(', ') : 'None', inline: true }
        ])]
    }).catch(() => null);
}

function getWeekKey(date) {
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const day = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
    return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function getPreviousWeekKey(date) {
    const previous = new Date(date.getTime());
    previous.setUTCDate(previous.getUTCDate() - 7);
    return getWeekKey(previous);
}

async function staffLog(guild, title, description, fields = []) {
    const channel = await getChannel(guild, 'staffPanels') || await getChannel(guild, 'botLog');
    if (!channel) return;
    await channel.send({ embeds: [embed(title, description).addFields(fields.slice(0, 20))] }).catch(() => null);
}

async function registerSlashCommands(guild) {
    const commands = [
        new SlashCommandBuilder()
            .setName('setup-la-veloo')
            .setDescription('Create or refresh the LA VELOO server foundation.')
            .setDefaultMemberPermissions(PERMS.Administrator),
        new SlashCommandBuilder()
            .setName('la-message-snapshot')
            .setDescription('Refresh the LA VELOO staff message snapshot.')
            .setDefaultMemberPermissions(PERMS.ManageMessages)
    ];

    const existingCommands = await guild.commands.fetch().catch(() => null);
    for (const command of commands) {
        const data = command.toJSON();
        const existing = existingCommands?.find(item => item.name === data.name);
        if (existing) {
            await existing.edit(data).catch(error => {
                console.warn(`[LA VELOO] Slash command edit failed for ${data.name}:`, error.message);
            });
        } else {
            await guild.commands.create(data).catch(error => {
                console.warn(`[LA VELOO] Slash command create failed for ${data.name}:`, error.message);
            });
        }
    }
}

async function resolveGuild(client) {
    const guildId = targetGuildId();
    return client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId).catch(() => null);
}

function targetGuildId() {
    return process.env.GUILD_ID || process.env.DISCORD_GUILD_ID || process.env.SERVER_ID || DEFAULT_GUILD_ID;
}

async function getChannel(guild, key) {
    const store = readStore();
    const channelId = CHANNEL_IDS[key] || store.created?.channels?.[key] || null;
    if (channelId) {
        const channel = await guild.channels.fetch(channelId).catch(() => null);
        if (channel) return channel;
    }
    return guild.channels.cache.find(channel => channel.name === CHANNEL_NAMES[key]) || null;
}

function findRole(guild, key) {
    return guild.roles.cache.find(role => role.name === ROLE_NAMES[key]) || null;
}

function channelMention(guild, key) {
    const store = readStore();
    const channelId = CHANNEL_IDS[key] || store.created?.channels?.[key];
    const channel = channelId ? guild.channels.cache.get(channelId) : guild.channels.cache.find(item => item.name === CHANNEL_NAMES[key]);
    return channel ? `<#${channel.id}>` : `#${CHANNEL_NAMES[key] || key}`;
}

async function addRole(member, key) {
    if (!member) return;
    const role = findRole(member.guild, key);
    if (role && !member.roles.cache.has(role.id)) {
        await member.roles.add(role, 'LA VELOO automation').catch(() => null);
    }
}

async function isStaffInteraction(interaction) {
    if (!interaction.inGuild?.()) return false;
    if (interaction.memberPermissions?.has(PERMS.Administrator) || interaction.memberPermissions?.has(PERMS.ManageMessages)) return true;
    const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
    if (!member) return false;
    return STAFF_ROLE_KEYS.some(key => {
        const role = findRole(interaction.guild, key);
        return role && member.roles.cache.has(role.id);
    });
}

function fieldsFrom(interaction, keys) {
    return Object.fromEntries(keys.map(key => [labelFromKey(key), cleanValue(interaction.fields.getTextInputValue(key) || '')]));
}

function objectFields(values) {
    return Object.entries(values || {})
        .filter(([, value]) => String(value || '').trim())
        .slice(0, 20)
        .map(([name, value]) => ({ name, value: cleanValue(value, 950), inline: false }));
}

function labelFromKey(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, char => char.toUpperCase());
}

function cleanValue(value, max = 1000) {
    const text = String(value || '').trim();
    return text.length > max ? `${text.slice(0, max - 3)}...` : text || 'Not provided';
}

function decodeHtml(value) {
    return String(value || '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x2F;/g, '/');
}

function cleanName(value) {
    return String(value || 'user')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/_+/g, '-')
        .slice(0, 24) || 'user';
}

function ticketTopic(meta) {
    return `LA_TICKET type=${meta.type} user=${meta.userId} status=${meta.status} created=${Date.now()}`.slice(0, 1024);
}

function shortId(prefix) {
    return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`.slice(0, 32);
}

function plainRoleLabel(key) {
    const map = {
        pc: 'PC',
        mobile: 'Mobile',
        ipad: 'iPad',
        mode3v3: '3v3',
        solo: 'Solo',
        duo: 'Duo',
        casual: 'Casual',
        rankedPlayer: 'Ranked Player',
        teamPlayer: 'Team Player',
        clubMember: 'Club Member',
        og: 'OG',
        lookingForMates: 'Looking For Mates',
        giveawayPing: 'Giveaway Ping',
        tournamentPing: 'Tournament Ping'
    };
    return map[key] || ROLE_NAMES[key] || key;
}

function readStore() {
    if (!fs.existsSync(STORE_PATH)) {
        return createEmptyStore();
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
        parsed.created ||= { roles: {}, channels: {}, privateChannels: {} };
        parsed.created.roles ||= {};
        parsed.created.channels ||= {};
        parsed.created.privateChannels ||= {};
        parsed.panels ||= {};
        parsed.applications ||= {};
        parsed.matePosts ||= {};
        parsed.mateRequests ||= {};
        parsed.mateSearchChannels ||= {};
        parsed.mateMatches ||= {};
        parsed.tickets ||= {};
        parsed.messages ||= [];
        parsed.inviteStats ||= {};
        parsed.suggestions ||= {};
        parsed.profileRankPosts ||= {};
        parsed.mapDesignPosts ||= {};
        parsed.profileSubmissions ||= {};
        parsed.profileWeeklyAnnouncements ||= {};
        parsed.panelLanguages ||= {};
        parsed.xp ||= {};
        return parsed;
    } catch {
        return createEmptyStore();
    }
}

function createEmptyStore() {
    return {
        created: { roles: {}, channels: {}, privateChannels: {} },
        panels: {},
        applications: {},
        matePosts: {},
        mateRequests: {},
        mateSearchChannels: {},
        mateMatches: {},
        tickets: {},
        messages: [],
        inviteStats: {},
        suggestions: {},
        profileRankPosts: {},
        mapDesignPosts: {},
        profileSubmissions: {},
        profileWeeklyAnnouncements: {},
        panelLanguages: {},
        xp: {}
    };
}

function writeStore(store) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function rememberCreated(type, key, value) {
    const store = readStore();
    store.created ||= { roles: {}, channels: {}, privateChannels: {} };
    store.created[type] ||= {};
    store.created[type][key] = value;
    writeStore(store);
}

function recordStoreObject(type, key, value) {
    const store = readStore();
    store[type] ||= {};
    store[type][key] = value;
    writeStore(store);
}

async function safeReply(interaction, payload) {
    const replyPayload = interaction.guild ? payload : { ...payload, ephemeral: undefined };
    if (interaction.replied || interaction.deferred) {
        return interaction.followUp(replyPayload).catch(() => null);
    }
    return interaction.reply(replyPayload).catch(() => null);
}

module.exports = {
    registerLaVelooSystem
};
