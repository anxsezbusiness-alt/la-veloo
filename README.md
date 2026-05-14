# LA VELOO Discord Bot

Standalone Railway/GitHub bot for the LA VELOO Brawl Stars community server.

## Railway Variables

```env
TOKEN=your-discord-bot-token
GUILD_ID=1504515493950918756
LA_VELOO_AUTO_SETUP=true
LA_ENABLE_COMMUNITY=true
LA_RULES_CHANNEL_ID=1504521850930073691
LA_DEFAULT_PANEL_LANGUAGE=en
LA_PANEL_REFRESH_MINUTES=5
LA_MESSAGE_SNAPSHOT_EVERY=20
LA_LIVE_MESSAGE_LOG=false
LA_PROFILE_POST_XP=10
LA_PROFILE_WEEKLY_WINNER_XP=75
```

## Start

```bash
npm install
npm start
```

On startup the bot registers:

```text
/setup-la-veloo
/la-message-snapshot
```

Run `/setup-la-veloo` after inviting the bot to refresh all LA VELOO roles, channels, permissions, and panels.

## Features

- LA VELOO server setup
- Styled roles and categories
- Multilingual panels: English, Deutsch, Français, Español, Italiano
- Rule ticket and full get-started tutorial
- Support tickets with accept, decline, delete
- Creator and cooperation applications
- Tournament registration and Tournament Verified role
- Find Mates / Find Ranked Mates cards
- Team Search cards
- Private mate-search channels and automatic 10k trophy bucket matching
- Ranked matching for Bronze, Silver, Gold, Diamond, Mythic, Legendary, Master, Pro
- Member role on join, welcome DM, and private entrance join/leave log
- Community-only member posting permissions
- Stream waiting room and staff-only stream voice
- Static community panels are resent every 5 minutes without deleting user-created cards
- Brawlify profile tool with 🔥 likes and weekly winner XP
- Staff logs, bot logs, and message activity snapshot
