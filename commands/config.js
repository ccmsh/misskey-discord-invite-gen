require('dotenv').config();
const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const axios = require("axios");
const { loadLanguage, getAvailableLanguages } = require('../language/languageLoader');

const { MISSKEY_TOKEN, MISSKEY_HOST } = process.env;

// 環境変数のチェック
if (!MISSKEY_TOKEN || !MISSKEY_HOST) {
  console.error("MISSKEY_TOKEN または MISSKEY_HOST が設定されていません。");
  process.exit(1);
}

// コマンドを実行したユーザーを記録するセット
const usedUsers = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configuration commands / 設定コマンド")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator) // 管理者権限を持っているユーザーのみ実行可能
    .addSubcommand(subcommand =>
      subcommand
        .setName("invite")
        .setDescription("Create an invite token / 招待トークンを作成します")
        .addIntegerOption(option => 
          option.setName('expires')
            .setDescription('Expiration time of the token in minutes / トークンの有効期限（分単位）')
            .setRequired(false)
        )
        .addStringOption(option => 
          option.setName('force_locale')
            .setDescription('Force localization to use (JP/EN/KR/CN)')
            .setRequired(false)
        )
        .addBooleanOption(option => 
          option.setName('use_role_id')
            .setDescription('Determine localization by role ID or role name (JP/EN/KR/CN)')
            .setRequired(false)
        )
        .addBooleanOption(option => 
          option.setName('allow_multiple')
            .setDescription('Allow multiple tokens / 複数のトークンを発行できるかどうか')
            .setRequired(false)
        )
        .addStringOption(option => 
          option.setName('allowed_roles')
            .setDescription('Comma-separated list of allowed roles / 許可されたロールのカンマ区切りリスト')
            .setRequired(false)
        )
        .addStringOption(option => 
          option.setName('moderator_role')
            .setDescription('Role name for moderators / モデレーターのロール名')
            .setRequired(false)
        )
        .addStringOption(option => 
          option.setName('default_locale')
            .setDescription('Default localization to use (JP/EN/KR/CN)')
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    const moderatorRole = interaction.options.getString('moderator_role');
    const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
    const isModerator = moderatorRole && interaction.member.roles.cache.some(role => role.name === moderatorRole);

    const userRoles = interaction.member.roles.cache;
    let locale = interaction.options.getString('force_locale') || 'EN'; // Default to English

    if (interaction.options.getBoolean('use_role_id')) {
      if (userRoles.some(role => role.id === 'JP')) {
        locale = 'JP';
      } else if (userRoles.some(role => role.id === 'KR')) {
        locale = 'KR';
      } else if (userRoles.some(role => role.id === 'CN')) {
        locale = 'CN';
      } else {
        locale = 'EN';
      }
    } else {
      if (userRoles.some(role => role.name === 'JP')) {
        locale = 'JP';
      } else if (userRoles.some(role => role.name === 'KR')) {
        locale = 'KR';
      } else if (userRoles.some(role => role.name === 'CN')) {
        locale = 'CN';
      } else {
        locale = 'EN';
      }
    }

    const messages = loadLanguage(locale);

    if (!isAdmin && !isModerator) {
      return interaction.reply({ 
        content: messages.noPermission, 
        ephemeral: true 
      });
    }

    if (interaction.options.getSubcommand() === 'invite') {
      const settings = {
        expires: interaction.options.getInteger('expires'),
        forceLocale: interaction.options.getString('force_locale'),
        useRoleId: interaction.options.getBoolean('use_role_id'),
        allowMultiple: interaction.options.getBoolean('allow_multiple'),
        allowedRoles: interaction.options.getString('allowed_roles')?.split(',').map(role => role.trim()) || [],
        moderatorRole: interaction.options.getString('moderator_role'),
        defaultLocale: interaction.options.getString('default_locale') || 'EN'
      };

      // invite.jsの設定を更新
      const inviteCommand = require('./invite');
      inviteCommand.updateConfig(settings);

      await interaction.reply({ 
        content: messages.settingsUpdated, 
        ephemeral: true 
      });
    }
  },
};
