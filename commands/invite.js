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
    .setName("invite")
    .setDescription("招待トークンを作成します")
    .addIntegerOption(option => 
      option.setName('expires')
        .setDescription('トークンの有効期限（分単位）')
        .setRequired(false)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;

    // すでにコマンドを実行している場合はエフェメラルで通知して終了
    if (usedUsers.has(userId)) {
      return await interaction.reply({ 
        content: "すでにコマンドを実行しました。", 
        ephemeral: true 
      });
    }

    usedUsers.add(userId);

    // deferReply で処理開始をDiscordに通知（エフェメラルなので実行者のみが見れる）
    await interaction.deferReply({ ephemeral: true });

    const expires = interaction.options.getInteger('expires');
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
      const jpRole = interaction.member.roles.cache.some(role => role.name === 'JP');
      const enRole = interaction.member.roles.cache.some(role => role.name === 'EN');
      let replyMsg;

      if (jpRole) {
        replyMsg = token.expiresAt === null
          ? `招待トークンは「${token.code}」です！ https://${MISSKEY_HOST} にアクセスして登録してください`
          : `招待トークンは「${token.code}」です！${token.expiresAt}まで https://${MISSKEY_HOST} にアクセスして登録してください`;
      } else if (enRole) {
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
};