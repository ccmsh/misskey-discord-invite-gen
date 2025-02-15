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

// 設定を保持するオブジェクト
const configSettings = {
  expires: null,
  forceLocale: null,
  useRoleId: false,
  allowMultiple: false,
  allowedRoles: [], // 許可するロール
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("招待トークンを作成します"),

  async execute(interaction) {
    const userId = interaction.user.id;
    const allowMultiple = configSettings.allowMultiple;

    // 許可されたロールを持っているか確認
    const hasAllowedRole = configSettings.allowedRoles.length === 0 || configSettings.allowedRoles.some(role => 
      configSettings.useRoleId 
        ? interaction.member.roles.cache.has(role) 
        : interaction.member.roles.cache.some(r => r.name === role)
    );

    if (!hasAllowedRole) {
      return await interaction.reply({ 
        content: "このコマンドを実行する権限がありません。", 
        ephemeral: true 
      });
    }

    // すでにコマンドを実行している場合はエフェメラルで通知して終了
    if (!allowMultiple && usedUsers.has(userId)) {
      return await interaction.reply({ 
        content: "すでにコマンドを実行しました。", 
        ephemeral: true 
      });
    }

    usedUsers.add(userId);

    // deferReply で処理開始をDiscordに通知（エフェメラルなので実行者のみが見れる）
    await interaction.deferReply({ ephemeral: true });

    const expires = configSettings.expires;
    const expiresAt = expires ? new Date(Date.now() + expires * 60000).toISOString() : null;
    const forceLocale = configSettings.forceLocale;
    const useRoleId = configSettings.useRoleId;

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
      let replyMsg;

      if (forceLocale === 'JP' || (!forceLocale && (useRoleId 
          ? interaction.member.roles.cache.some(role => role.id === 'JP')
          : interaction.member.roles.cache.some(role => role.name === 'JP')))) {
        replyMsg = token.expiresAt === null
          ? `招待トークンは「${token.code}」です！ https://${MISSKEY_HOST} にアクセスして登録してください`
          : `招待トークンは「${token.code}」です！${token.expiresAt}まで https://${MISSKEY_HOST} にアクセスして登録してください`;
      } else if (forceLocale === 'EN' || (!forceLocale && (useRoleId 
          ? interaction.member.roles.cache.some(role => role.id === 'EN')
          : interaction.member.roles.cache.some(role => role.name === 'EN')))) {
        replyMsg = token.expiresAt === null
          ? `The invite token is "${token.code}"! Please visit https://${MISSKEY_HOST} to register.`
          : `The invite token is "${token.code}"! Please visit https://${MISSKEY_HOST} to register by ${token.expiresAt}.`;
      } else {
        replyMsg = `招待トークンは「${token.code}」です！ https://${MISSKEY_HOST} にアクセスして登録してください`;
      }

      await interaction.editReply({ content: replyMsg, ephemeral: true });
    } catch (error) {
      await interaction.editReply({ content: "エラーです！", ephemeral: true });
      console.error("Error creating token:", error);
    }
  },

  // 設定を更新する関数
  updateConfig(settings) {
    Object.assign(configSettings, settings);
  },
};