# Misskey Discord.js Invite Generator

## Overview
This project is a bot that generates Misskey invite tokens using Discord.js. Users can generate invite tokens using the `/invite` command.

## Environment Variables
The following environment variables need to be set:

- `MISSKEY_TOKEN`: Misskey API token
- `MISSKEY_HOST`: Misskey host name
- `DISCORD_TOKEN`: Discord bot token

Set these variables in the `.env` file.

```
MISSKEY_TOKEN=your_misskey_token
MISSKEY_HOST=your_misskey_host
DISCORD_TOKEN=your_discord_token
```

## Installation
Install the dependencies.

```bash
npm install
```

## Usage
Start the bot.

```bash
node index.js
```

### `/invite` Command
Generates a Misskey invite token.

### `/config invite` Command
Configures the invite token generation.

- `expires`: Expiration time of the token in minutes
- `force_locale`: Force localization to use (JP/EN)
- `use_role_id`: Determine by role ID
- `allow_multiple`: Allow multiple tokens
- `allowed_roles`: Comma-separated list of allowed roles

## Notes
- Ensure that the environment variables are set correctly.
- Ensure that the Discord bot token is correct.
