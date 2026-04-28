export async function getAIReading(card, user) {
  const prompt = `用户生日:${user.birthday}, 性别:${user.gender}, 抽到牌:${card.name}, 含义:${card.desc}`;

  try {
    // 如果你未来接 OpenAI
    // const res = await fetch("https://api.openai.com/v1/chat/completions"...)

    return `✨ AI解读：
你抽到【${card.name}】
这代表你当前的心理状态正在经历变化。
建议：保持稳定节奏，不要急于判断结果。
（仅供参考）`;
  } catch (e) {
    return `（基础解读）
${card.name}：${card.desc}
建议：保持觉察与平衡。（仅供参考）`;
  }
}
