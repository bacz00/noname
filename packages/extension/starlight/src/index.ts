import { lib, game, ui, get, ai, _status } from "noname";

export const type = "extension";

export default function (): importExtensionConfig {
	return {
		name: "starlight",
		editable: false,
		connect: true,
		content: function (config, pack) {
			const groups = {
				seisho: "圣翔",
				rinmeikan: "凛明馆",
				frontier: "芙罗提亚",
				seekfelt: "西格菲尔特",
				seiran: "青岚",
			};
			game.dynamicStyle.addObject({
				"div.starlight-group-icon": {
					display: "none",
				}, // 默认不显示图标
				"div.button.character.newstyle > div.identity > div > span.starlight-group-translation": {
					display: "none",
				}, // 当位于角色div中时，隐藏翻译
				"div.button.character.newstyle > div.identity > div:has(div.starlight-group-icon)": {
					width: "16px",
					height: "16px",
				}, // 当位于角色div中时，设置外层div尺寸
				"div.button.character.newstyle > div.identity > div > div.starlight-group-icon": {
					display: "inherit",
					width: "16px",
					height: "16px",
				}, // 当位于角色div中时，显示图标并设置尺寸
				...Object.fromEntries(
					Object.keys(groups).map(group => [
						`div.button.character.newstyle > div.identity > div > div.starlight-group-icon.starlight-${group}`,
						{ background: `url(extension/starlight/image/group/group_${group}.png) no-repeat center / contain` },
					])
				),
			});

			Object.entries(groups).forEach(([group, translation]) => {
				lib.group.add(group);
				lib.translate[group] =
					`<span class="starlight-group-translation">${translation}</span><div class="starlight-${group} starlight-group-icon"></div>`;
			});
			if (pack.character?.character) {
				for (const [name, character] of Object.entries(pack.character.character)) {
					const vol = Number(name.slice(-1));
					if (name.slice(0, 3) != "rs_" || isNaN(vol)) {
						continue;
					}
					if (Array.isArray(character)) {
						character[4]?.push(`ext:starlight/image/character/vol${vol}/${name.slice(3)}.png`);
					} else {
						character.img ??= `extension/starlight/image/character/vol${vol}/${name.slice(3)}.png`;
					} 
				}
			}
			if (pack.skill?.skill) {
				for (const skillId of Object.keys(pack.skill.skill)) {
					pack.skill.translate[`${skillId}_cost`] ??= pack.skill[skillId];
					pack.skill.translate[`${skillId}_cost_info`] ??= pack.skill[`${skillId}_info`];
				}
			}
		},
		precontent: function () {},
		config: {},
		help: {},
		package: {
			character: {
				connect: true,
				translate: {},
				characterTitle: {},
				character: {},
			},
			card: {
				card: {},
				translate: {},
				list: [],
			},
			skill: {
				translate: {},
				skill: {},
			},
			intro: "",
			author: "banana",
			diskURL: "",
			forumURL: "",
			version: "1.0",
		},
		files: { character: [], card: [], skill: [], audio: [] },
	};
}
