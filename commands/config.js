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
    .setDescription("Configuration commands / 설정 명령어 / 配置命令 / 設定コマンド")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator) // 管理者権限を持っているユーザーのみ実行可能
    .addSubcommand(subcommand =>
      subcommand
        .setName("invite")
        .setDescription("Create an invite token / 초대 토큰 생성 / 创建邀请令牌 / 招待トークンを作成します")
        .addIntegerOption(option => 
          option.setName('expires')
            .setDescription('Expiration time of the token in minutes / 토큰의 유효 기간 (분 단위) / 令牌的有效期（以分钟为单位） / トークンの有効期限（分単位）')
            .setRequired(false)
        )
        .addStringOption(option => 
          option.setName('force_locale')
            .setDescription('Force localization to use (JP/EN/KR/CN) / 사용할 로컬라이제이션 강제 지정 (JP/EN/KR/CN) / 强制使用的本地化 (JP/EN/KR/CN) / 強制的に使用するローカライズ (JP/EN/KR/CN)')
            .setRequired(false)
        )
        .addBooleanOption(option => 
          option.setName('use_role_id')
            .setDescription('Determine localization by role ID or role name (JP/EN/KR/CN) / 로컬라이제이션을 역할 ID로 판단할지 역할 이름으로 판단할지 (JP/EN/KR/CN) / 通过角色 ID 或角色名称确定本地化 (JP/EN/KR/CN) / ローカライズをロールIDで判断するかロールの名前 (JP/EN/KR/CN) で判断するか')
            .setRequired(false)
        )
        .addBooleanOption(option => 
          option.setName('allow_multiple')
            .setDescription('Allow multiple tokens / 여러 개의 토큰을 발행할 수 있는지 여부 / 是否允许多个令牌 / 複数のトークンを発行できるかどうか')
            .setRequired(false)
        )
        .addStringOption(option => 
          option.setName('allowed_roles')
            .setDescription('Comma-separated list of allowed roles / 허용된 역할의 쉼표로 구분된 목록 / 允许的角色的逗号分隔列表 / 許可されたロールのカンマ区切りリスト')
            .setRequired(false)
        )
        .addStringOption(option => 
          option.setName('moderator_role')
            .setDescription('Role name for moderators / 모더레이터 역할 이름 / 版主角色名称 / モデレーターのロール名')
            .setRequired(false)
        )
        .addStringOption(option => 
          option.setName('default_locale')
            .setDescription('Default localization to use (JP/EN/KR/CN) / 기본 로컬라이제이션 (JP/EN/KR/CN) / 默认本地化 (JP/EN/KR/CN) / デフォルトのローカライズ (JP/EN/KR/CN)')
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
      }
    } else {
      if (userRoles.some(role => role.name === 'JP')) {
        locale = 'JP';
      } else if (userRoles.some(role => role.name === 'KR')) {
        locale = 'KR';
      } else if (userRoles.some(role => role.name === 'CN')) {
        locale = 'CN';
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
