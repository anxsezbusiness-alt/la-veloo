# LA VELOO Discord Bot

Standalone Railway/GitHub bot for the LA VELOO Brawl Stars community server.

This version runs in existing-server mode: it uses fixed channel IDs and does not create or edit base roles, channels, categories, permissions, or server settings.

## Railway Variables

```env
TOKEN=your-discord-bot-token
GUILD_ID=1504515493950918756
LA_VELOO_AUTO_SETUP=true
LA_ENABLE_COMMUNITY=true
LA_RULES_CHANNEL_ID=1504521850930073691
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
- Existing-server mode with fixed LA VELOO channel IDs
- Styled roles and categories
- Public panels stay English by default; language menu shows a private translated copy only for the selecting member
- Rule ticket and full get-started tutorial
- Support tickets with accept, decline, delete
- Creator and cooperation applications
- Tournament registration and Tournament Verified role
- Find Mates / Find Ranked Mates cards
- Team Search cards
- Private mate-search channels and automatic 10k trophy bucket matching
- Ranked matching for Bronze, Silver, Gold, Diamond, Mythic, Legendary, Master, Pro
- Member role on join, welcome DM, and entrance join/leave log
- OG role for the first 100 non-bot members
- Community-only member posting permissions
- Stream waiting room and staff-only stream voice
- Static writable-channel panels are resent silently every 5 minutes without deleting user-created cards
- Bot startup refreshes roles/channels quietly without reposting panels
- Server changes are bundled automatically into styled status posts in updates
- Rules, support, get-started, cooperations, and ticket-info panels stay in place instead of being resent
- Profile-rank screenshot panel with automatic fire reaction
- Invite tracker logs joins and invite stats in bot-log
- Club member verification with private ticket and staff accept/decline review
- Community suggestions panel with like, dislike, and trash votes
- Map designs channel with image reactions and a mod-signal button
- Stored role IDs and duplicate-role cleanup on setup
- Owner-only channel management permissions
- Brawlify profile tool with 🔥 likes and weekly winner XP
- Staff logs, bot logs, and message activity snapshot
