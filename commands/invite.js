require('dotenv').config();
const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { loadLanguage } = require('../language/languageLoader');
const fs = require("fs");
const path = require("path");

const { MISSKEY_TOKEN, MISSKEY_HOST } = process.env;

// 環境変数のチェック
if (!MISSKEY_TOKEN || !MISSKEY_HOST) {
  console.error("MISSKEY_TOKEN または MISSKEY_HOST が設定されていません。");
  process.exit(1);
}

// コマンドを実行したユーザーを記録するセット
const usedUsers = new Set();

// 設定を保持するオブジェクト
const configSettings = {
  expires: null,
  forceLocale: null,
  useRoleId: false,
  allowMultiple: false,
  allowedRoles: [], // 許可するロール
  moderatorRole: null, // モデレーターのロール
  defaultLocale: 'EN', // デフォルト言語
};

const userConfigPath = path.join(__dirname, "../userConfig.json");

function loadUserConfig() {
  if (fs.existsSync(userConfigPath)) {
    return JSON.parse(fs.readFileSync(userConfigPath, "utf8"));
  } else {
    return {};
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("招待トークンを作成します / 초대 토큰을 생성합니다 / 生成邀请令牌"),

  async execute(interaction) {
    const userId = interaction.user.id;
    const allowMultiple = configSettings.allowMultiple;

    const userRoles = interaction.member.roles.cache;
    let locale = configSettings.defaultLocale || 'EN'; // Default to English

    const userConfig = loadUserConfig();
    if (userConfig[userId] && userConfig[userId].language) {
      locale = userConfig[userId].language;
    } else if (interaction.options.getString('force_locale')) {
      locale = interaction.options.getString('force_locale');
    } else if (userRoles.some(role => role.name === 'JP')) {
      locale = 'JP';
    } else if (userRoles.some(role => role.name === 'KR')) {
      locale = 'KR';
    } else if (userRoles.some(role => role.name === 'CN')) {
      locale = 'CN';
    }

    const { messages, settings } = loadLanguage(locale);

    // 許可されたロールを持っているか確認
    const hasAllowedRole = configSettings.allowedRoles.length === 0 || configSettings.allowedRoles.some(role => 
      configSettings.useRoleId 
        ? interaction.member.roles.cache.has(role) 
        : interaction.member.roles.cache.some(r => r.name === role)
    );

    if (!hasAllowedRole) {
      return await interaction.reply({ 
        content: messages.noPermission, 
        ephemeral: true 
      });
    }

    // すでにコマンドを実行している場合はエフェメラルで通知して終了
    if (!allowMultiple && usedUsers.has(userId)) {
      return await interaction.reply({ 
        content: messages.alreadyExecuted, 
        ephemeral: true 
      });
    }

    usedUsers.add(userId);

    // deferReply で処理開始をDiscordに通知（エフェメラルなので実行者のみが見れる）
    await interaction.deferReply({ ephemeral: true });

    const expires = configSettings.expires;
    const expiresAt = expires ? new Date(Date.now() + expires * 60000).toISOString() : null;

    try {
      const resp = await axios.post(
        `https://${MISSKEY_HOST}/api/admin/invite/create`,
        { expiresAt },
        {
          headers: {
            "Authorization": `Bearer ${MISSKEY_TOKEN}`,
          },
        }
      );

      if (resp.status !== 200) {
        throw new Error(`token create err. statuscode: ${resp.status}. payload: ${JSON.stringify(resp.data)}`);
      }

      const token = resp.data[0];
      let replyMsg = messages.inviteToken;

      replyMsg = replyMsg.replace('{token}', token.code).replace('{host}', MISSKEY_HOST).replace('{expiresAt}', token.expiresAt || '');

      await interaction.editReply({ content: replyMsg, ephemeral: true });
    } catch (error) {
      await interaction.editReply({ content: messages.error, ephemeral: true });
      console.error("Error creating token:", error);
    }
  },

  // 設定を更新する関数
  updateConfig(settings) {
    Object.assign(configSettings, settings);
  },
};