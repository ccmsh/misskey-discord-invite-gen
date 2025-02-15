require('dotenv').config();
const { SlashCommandBuilder } = require("discord.js");
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
            .setDescription('Determine by role ID / ロールIDで判断するかどうか')
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
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'invite') {
      const settings = {
        expires: interaction.options.getInteger('expires'),
        forceLocale: interaction.options.getString('force_locale'),
        useRoleId: interaction.options.getBoolean('use_role_id'),
        allowMultiple: interaction.options.getBoolean('allow_multiple'),
        allowedRoles: interaction.options.getString('allowed_roles')?.split(',').map(role => role.trim()) || [],
      };

      // invite.jsの設定を更新
      const inviteCommand = require('./invite');
      inviteCommand.updateConfig(settings);

      await interaction.reply({ content: "設定が更新されました。", ephemeral: true });
    }
  },
};
