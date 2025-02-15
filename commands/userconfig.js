const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const userConfigPath = path.join(__dirname, "../userConfig.json");

function loadUserConfig() {
  if (fs.existsSync(userConfigPath)) {
    return JSON.parse(fs.readFileSync(userConfigPath, "utf8"));
  } else {
    return {};
  }
}

function saveUserConfig(config) {
  fs.writeFileSync(userConfigPath, JSON.stringify(config, null, 2), "utf8");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userconfig")
    .setDescription("Configure your personal settings / 개인 설정 구성 / 配置个人设置 / 個人設定を構成する")
    .addSubcommand(subcommand =>
      subcommand
        .setName("setlanguage")
        .setDescription("Set your preferred language / 선호하는 언어 설정 / 设置首选语言 / 優先言語を設定する")
        .addStringOption(option =>
          option
            .setName("language")
            .setDescription("Language to set (JP/EN/KR/CN) / 설정할 언어 (JP/EN/KR/CN) / 要设置的语言 (JP/EN/KR/CN) / 設定する言語 (JP/EN/KR/CN)")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const language = interaction.options.getString("language");

    const userConfig = loadUserConfig();
    userConfig[userId] = { language };
    saveUserConfig(userConfig);

    await interaction.reply({ content: `Your language has been set to ${language}. / 언어가 ${language}(으)로 설정되었습니다. / 您的语言已设置为 ${language}。 / 言語が ${language} に設定されました。`, ephemeral: true });
  },
};
