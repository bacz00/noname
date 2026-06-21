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
			lib.dynamicTranslate.rs_daiao = player =>
				"出牌阶段限两次，你可以对一名本回合未以此法指定过的角色造成一点伤害，然后其可以弃一张牌，回复一点体力。" +
				(player.hasSkill("rs_xingzui") && player.storage.rs_xingzui ? "（【星罪】：当前伤害值+1）" : "");
			lib.dynamicTranslate.rs_xingzui = player =>
				`转换技，锁定技，你不因实体牌的效果：<br><span${!player.storage.rs_xingzui ? ' class="bluetext"' : ""}>阳：回复的体力值+1</span>；<span${player.storage.rs_xingzui ? ' class="bluetext"' : ""}>阴：造成的伤害值+1</span>。`;
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
				translate: {
					starlight: "少女割据",
					rs_karen1: "爱城华恋",
				},
				characterTitle: {
					rs_karen1: "赤冠華彩",
				},
				character: {
					rs_karen1: new lib.element.Character({
						sex: "female",
						group: "seisho",
						hp: 4,
						skills:  ["rs_daiao", "rs_gexin", "rs_xingzui_unawaken_perm"],
					}),
				},
			},
			card: {
				card: {},
				translate: {},
				list: [],
			},
			skill: {
				translate: {
					rs_daiao: "怠傲",
					rs_daiao_info: "出牌阶段限两次，你可以对一名本回合未以此法指定过的角色造成一点伤害，然后其可以弃一张牌，回复一点体力。",
					rs_gexin: "革心",
					rs_gexin_info: "觉醒技，当你进入频死状态时，你大喊“私、再生产！”并减少一点体力上限，获得“星罪”并回复一点体力。",
					rs_xingzui_unawaken_perm: '<span style="opacity: 0.5">〖星罪〗</span>',
					rs_xingzui_unawaken_perm_info:
						'<span style="opacity: 0.5">转换技，锁定技，你不因实体牌的效果：<br>阳：回复的体力值+1；阴：造成的伤害值+1。</span>',
					rs_xingzui_unawaken_temp: '<span style="opacity: 0.5">〖星罪〗</span>',
					rs_xingzui_unawaken_temp_info:
						'<span style="opacity: 0.5">转换技，锁定技，你不因实体牌的效果：<br>阳：回复的体力值+1；阴：造成的伤害值+1。</span>',
					rs_xingzui: "星罪",
					rs_xingzui_info: "转换技，锁定技，你不因实体牌的效果：<br>阳：回复的体力值+1；阴：造成的伤害值+1。",
				},
				skill: {
					rs_daiao: {
						enable: "phaseUse",
						usable: 2,
						filterTarget: (_card, player, target) => !player.getStorage("rs_daiao_used").includes(target),
						content: async (event, _trigger, player) => {
							const target = event.target;

							player.addTempSkill("rs_daiao_used");
							player.markAuto("rs_daiao_used", target);
							await target.damage({ source: player });

							if (!target.hasCards("he")) {
								return;
							}
							const { bool: result } = await target.chooseToDiscard({
								position: "he",
								prompt: "是否弃一张牌，回复一点体力" +
									(target.hasSkill("rs_xingzui") && !target.storage.rs_xingzui
										? "（【星罪】：当前回复值+1）"
										: "")
							}).forResult()
							if (result) {
								await target.recover();
							}
						},
						subSkill: {
							used: {
								charlotte: true,
								onremove: true,
								mark: true,
								intro: {
									content: "已对$使用过",
								},
							},
						},
					},
					rs_gexin: {
						trigger: { player: "dying" },
						forced: true,
						juexingji: true,
						animationStr: "再生産",
						derivation: "rs_xingzui",
						content: async (event, _trigger, player) => {
							// 如果是ai，直接跳过交互
							if (_status.connectMode || player == game.me) {
								if (_status.connectMode && !game.online && player != game.me) {
									// 客机
									if (player.isOnline()) {
										await new Promise((resolve) =>
											player
												.send(
													(player) => {
														const eventId = get.id();
														ui.timer?.show();
														player.chooseControl({
															controls: ["アタシ、再生産"]
														}).set("id", eventId);
														game.resume();
														game.countDown(3, () => {
															lib.message.client.cancel(eventId);
															ui.timer?.hide();
														});
													},
													player
												)
												.wait(resolve)
										);
									}
								} else {
									// 主机
									const eventId = get.id();
									ui.timer?.show();
									game.countDown(3, () => {
										lib.message.client.cancel(eventId);
										ui.timer?.hide();
									});
									await player.chooseControl({
										controls: ["アタシ、再生産"]
									}).set("id", eventId);
								}
							}

							lib.skill[event.name].skillAnimation = true;
							player.trySkillAnimate(event.name, lib.skill[event.name].animationStr ?? "", player.checkShow(event.name));
							player.awakenSkill("rs_gexin");
							await player.loseMaxHp();
							player.removeSkill("rs_xingzui_unawaken_temp");
							player.addSkill("rs_xingzui");
							await player.recover();
						},
					},
					/**
					 * 在游戏外的武将右键菜单中，以半透明样式展示觉醒后获得的【星罪】
					 * @see rs_gexin 由于觉醒技中已设置derivation，武将双击菜单中会自动添加【星罪】，因此使用nopop防止重复显示
					 * @see rs_xingzui_unawaken_temp 但nopop会导致游戏内右键菜单中不显示本技能，还需要一个额外的临时技能
					 */
					rs_xingzui_unawaken_perm: {
						nobracket: true,
						nopop: true,
						init: player => player.addSkill("rs_xingzui_unawaken_temp"),
					},
					/**
					 * 在游戏内的武将右键菜单中，以半透明样式展示觉醒后获得的【星罪】
					 * @see rs_xingzui_unawaken_perm 在进入游戏后才获得此技能，防止显示在武将双击菜单中
					 */
					rs_xingzui_unawaken_temp: {
						nobracket: true,
					},
					rs_xingzui: {
						trigger: { player: "recoverBegin", source: "damageBegin" },
						locked: true,
						forced: true,
						zhuanhuanji: true,
						mark: true,
						marktext: "☯",
						intro: {
							content: storage =>
								!storage ? "阳：锁定技，你不因实体牌的效果回复体力的回复值+1" : "阴：锁定技，你不因实体牌的效果造成伤害的伤害值+1",
						},
						filter: (event, player) =>
							event.name == (player.storage.rs_xingzui ? "damage" : "recover") && (!event.card || !event.cards?.length),
						content: async (event, trigger, player) => {
							player.changeZhuanhuanji(event.name);
							trigger.num++;
						},
					},
				},
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
