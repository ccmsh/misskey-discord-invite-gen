# Misskey Discord.js Invite Generator

> [!CAUTION]
> This bot will not work unless the Misskey API has the "manage invite codes" permission.
> Only administrators can apply the "manage invite codes" permission to the API token.

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
Generates a Misskey invite token. The following options can be used:

- `expires`: Expiration time of the token in minutes
- `force_locale`: Force localization to use (JP/EN)
- `use_role_id`: Determine localization by role ID or role name (JP/EN)
- `allow_multiple`: Allow multiple tokens
- `allowed_roles`: Comma-separated list of allowed roles

### `/config invite` Command
Configures the invite token generation. The following options can be used:

- `expires`: Expiration time of the token in minutes
- `force_locale`: Force localization to use (JP/EN)
- `use_role_id`: Determine localization by role ID or role name (JP/EN)
- `allow_multiple`: Allow multiple tokens
- `allowed_roles`: Comma-separated list of allowed roles
- `moderator_role`: Role name for moderators

### Moderator Permissions
Moderators can perform the following actions:

- Use the `/config invite` command to change the invite token generation settings.
  - `expires`: Expiration time of the token in minutes
  - `force_locale`: Force localization to use (JP/EN)
  - `use_role_id`: Determine localization by role ID or role name (JP/EN)
  - `allow_multiple`: Allow multiple tokens
  - `allowed_roles`: Comma-separated list of allowed roles
  - `moderator_role`: Role name for moderators

## Notes
- Ensure that the environment variables are set correctly.
- Ensure that the Discord bot token is correct.
- The Misskey API token requires the "manage invite codes" permission. Only administrators can grant this permission.
