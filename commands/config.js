require('dotenv').config();
const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const axios = require("axios");

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
            .setDescription('Force localization to use (JP/EN) / 強制的に使用するローカライズ (JP/EN)')
            .setRequired(false)
        )
        .addBooleanOption(option => 
          option.setName('use_role_id')
            .setDescription('Determine localization by role ID or role name (JP/EN) / ローカライズをロールIDで判断するかロールの名前 (JP/EN) で判断するか')
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
    ),

  async execute(interaction) {
    const moderatorRole = interaction.options.getString('moderator_role');
    const isAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
    const isModerator = moderatorRole && interaction.member.roles.cache.some(role => role.name === moderatorRole);

    if (!isAdmin && !isModerator) {
      return interaction.reply({ content: "このコマンドを実行する権限がありません。", ephemeral: true });
    }

    if (interaction.options.getSubcommand() === 'invite') {
      const settings = {
        expires: interaction.options.getInteger('expires'),
        forceLocale: interaction.options.getString('force_locale'),
        useRoleId: interaction.options.getBoolean('use_role_id'),
        allowMultiple: interaction.options.getBoolean('allow_multiple'),
        allowedRoles: interaction.options.getString('allowed_roles')?.split(',').map(role => role.trim()) || [],
        moderatorRole: interaction.options.getString('moderator_role'),
      };

      // invite.jsの設定を更新
      const inviteCommand = require('./invite');
      inviteCommand.updateConfig(settings);

      await interaction.reply({ content: "設定が更新されました。", ephemeral: true });
    }
  },
};
