import skill from "@/library/skill";
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
				const fullTranslation = `<span class="starlight-group-translation">${translation}</span><div class="starlight-${group} starlight-group-icon"></div>`;
				game.addGroup(group, fullTranslation, fullTranslation, { image: `extension/starlight/image/group/group_${group}.png` })

				lib.translate[`rs_${group}`] = translation;
			});
			[...Object.keys(groups), "seekfelt_middle"].forEach(group =>
				game.dynamicStyle.addObject({
					// 保留不同血量不同颜色的修改空间，所以暂时就不简化了
					[`div[data-subgroup="${group}"] > .hp:not(.text):not(.actcount):not(.treasure)[data-condition="high"] > div:not(.lost):not(.shield)`]: {
						background: `url(extension/starlight/image/hp/${group}.png)`,
						"box-shadow": "none",
						border: "none",
						"background-size": "100% 100%",
						transform: "scale(1.9)",
						"-webkit-filter": "none",
						"border-radius": "0px",
					},
					[`div[data-subgroup="${group}"] > .hp:not(.text):not(.actcount):not(.treasure)[data-condition="mid"] > div:not(.lost):not(.shield)`]: {
						background: `url(extension/starlight/image/hp/${group}.png)`,
						"box-shadow": "none",
						border: "none",
						"background-size": "100% 100%",
						transform: "scale(1.9)",
						"-webkit-filter": "none",
						"border-radius": "0px",
					},
					[`div[data-subgroup="${group}"] > .hp:not(.text):not(.actcount):not(.treasure)[data-condition="low"] > div:not(.lost):not(.shield)`]: {
						background: `url(extension/starlight/image/hp/${group}.png)`,
						"box-shadow": "none",
						border: "none",
						"background-size": "100% 100%",
						transform: "scale(1.9)",
						"-webkit-filter": "none",
						"border-radius": "0px",
					},
					[`div[data-subgroup="${group}"] > .hp:not(.text):not(.actcount):not(.treasure) > .lost`]: {
						background: `url(extension/starlight/image/hp/${group}.png)`,
						"box-shadow": "none",
						border: "none",
						"background-size": "100% 100%",
						transform: "scale(1.9)",
						"border-radius": "0px",
					},
				})
			);
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
						character[4]?.push(`ext:starlight/image/character/vol${vol}/${name.slice(3)}.jpg`);
					} else {
						character.img ??= `extension/starlight/image/character/vol${vol}/${name.slice(3)}.jpg`;
					} 
				}
			}
			if (pack.skill?.skill) {
				for (const skillId of Object.keys(pack.skill.skill)) {
					pack.skill.translate[`${skillId}_cost`] ??= pack.skill[skillId];
					pack.skill.translate[`${skillId}_cost_info`] ??= pack.skill[`${skillId}_info`];
				}
			}

			lib.translate.cixiong = lib.translate.cixiong_skill = "党争双股剑";
			lib.translate.cixiong_info = lib.translate.cixiong_skill_info = "当你使用【杀】指定与你为CP的一个目标后，你可以令其选择一项：1.弃置一张手牌；2.令你摸一张牌。";
			lib.skill.cixiong_skill._cpSet = new Set([
				"rs_hikari|rs_karen",
				"rs_karen|rs_mahiru",
				"rs_junna|rs_karen",
				"rs_kaoruko|rs_karen",
				"rs_aruru|rs_karen",
				"rs_hikari|rs_mahiru",
				"rs_mahiru|rs_suzu",
				"rs_claudine|rs_maya",
				"rs_kaoruko|rs_maya",
				"rs_koharu|rs_maya",
				"rs_claudine|rs_futaba",
				"rs_claudine|rs_fumi",
				"rs_claudine|rs_shiori",
				"rs_claudine|rs_tsukasa",
				"rs_claudine|rs_koharu",
				"rs_banana|rs_junna",
				"rs_banana|rs_yuyuko",
				"rs_banana|rs_hisame",
				"rs_futaba|rs_kaoruko",
				"rs_kaoruko|rs_tamao",
				"rs_rui|rs_tamao",
				"rs_tamao|rs_yuyuko",
				"rs_ichie|rs_tamao",
				"rs_fumi|rs_tamao",
				"rs_rui|rs_yuyuko",
				"rs_fumi|rs_ichie",
				"rs_ichie|rs_minku",
				"rs_akira|rs_fumi",
				"rs_fumi|rs_yachiyo",
				"rs_fumi|rs_shiori",
				"rs_akira|rs_michiru",
				"rs_akira|rs_shiori",
				"rs_akira|rs_hisame",
				"rs_akira|rs_kuina",
				"rs_michiru|rs_minku",
				"rs_meifan|rs_yachiyo",
				"rs_shiori|rs_yachiyo",
				"rs_tsukasa|rs_yachiyo",
				"rs_aruru|rs_misora",
				"rs_aruru|rs_shizuha",
				"rs_aruru|rs_lalafin",
				"rs_aruru|rs_tsukasa",
				"rs_lalafin|rs_shizuha",
				"rs_shizuha|rs_tsukasa",
				"rs_hisame|rs_koharu",
				"rs_koharu|rs_suzu",
				"rs_hisame|rs_suzu",
				"rs_ryoko|rs_stella",
				"rs_shiro|rs_stella"
			]);
			lib.skill.cixiong_skill._isCp = function(player1, player2) {
				const name1 = (typeof player1 == 'string' ? player1 : player1?.name as string | undefined)?.slice(0, -1) ?? "";
				const name2 = (typeof player2 == 'string' ? player2 : player2?.name as string | undefined)?.slice(0, -1) ?? "";
				const cpSet = this._cpSet as Set<string>;
				return cpSet.has(name1 < name2 ? `${name1}|${name2}` : `${name2}|${name1}`);
			};
			lib.skill.cixiong_skill.filter = function(event, player) {
				return event.card.name == "sha" && this._isCp(player, event.target);
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
					rs_hikari1: "神乐光",
					rs_mahiru1: "露崎真昼",
					rs_claudine1: "西条克洛迪娜",
					rs_maya1: "天堂真矢",
					rs_junna1: "星见纯那",
					rs_banana1: "大场奈奈",
					rs_futaba1: "石动双叶",
					rs_kaoruko1: "花柳香子",
					rs_tamao1: "巴珠绪",
					rs_ichie1: "音无一爱",
					rs_fumi1: "梦大路文",
					rs_rui1: "秋风垒",
					rs_yuyuko1: "田中悠悠子",
					rs_aruru1: "大月阿露露",
					rs_misora1: "叶美空",
					rs_lalafin1: "野野宫拉拉芬",
					rs_tsukasa1: "惠比寿司",
					rs_shizuha1: "胡蝶静羽",
					rs_akira1: "雪代晶",
					rs_michiru1: "凤满",
					rs_meifan1: "柳美帆",
					rs_shiori1: "梦大路栞",
					rs_yachiyo1: "鹤姬八千代",
					rs_stella1: "高千穗史黛拉",
					rs_shiro1: "大贺美诗吕",
					rs_ryoko1: "小鸠良子",
					rs_minku1: "海边明久",
					rs_kuina1: "森保玖伊奈",
					rs_suzu1: "南风凉",
					rs_koharu1: "柳小春",
					rs_hisame1: "穗波冰雨",
				},
				characterSort: {
					starlight: {
						rs_seisho: ["rs_karen1", "rs_hikari1", "rs_mahiru1", "rs_claudine1", "rs_maya1", "rs_junna1", "rs_banana1", "rs_futaba1", "rs_kaoruko1"],
						rs_rinmeikan: ["rs_tamao1", "rs_ichie1", "rs_fumi1", "rs_rui1", "rs_yuyuko1"],
						rs_frontier: ["rs_aruru1", "rs_misora1", "rs_lalafin1", "rs_tsukasa1", "rs_shizuha1"],
						rs_seekfelt: ["rs_akira1", "rs_michiru1", "rs_meifan1", "rs_shiori1", "rs_yachiyo1", "rs_stella1", "rs_shiro1", "rs_ryoko1", "rs_minku1", "rs_kuina1"],
						rs_seiran: ["rs_suzu1", "rs_koharu1", "rs_hisame1"],
					},
				},
				characterTitle: {
					rs_karen1: "赤冠华彩",
					rs_hikari1: "苍星神韵",
					rs_mahiru1: "恋心知否",
					rs_claudine1: "耀月堂堂",
					rs_maya1: "星煌璨璨",
					rs_junna1: "蹈海无边",
					rs_banana1: "轮舞终息",
					rs_futaba1: "万叶逐风",
					rs_kaoruko1: "千华嫣止",
					rs_tamao1: "馆废凛如",
					rs_ichie1: "音舞缭乱",
					rs_fumi1: "昔瑶翌梦",
					rs_rui1: "决刃出鞘",
					rs_yuyuko1: "日梦夜思",
					rs_aruru1: "孤芳扬风",
					rs_misora1: "双影翔空",
					rs_lalafin1: "贲勇见参",
					rs_tsukasa1: "茕影逢君",
					rs_shizuha1: "蝶梦垠疆",
					rs_akira1: "白金无瑕",
					rs_michiru1: "苍玉贤佐",
					rs_meifan1: "红玉烈阳",
					rs_shiori1: "青翡追思",
					rs_yachiyo1: "珍珠谜梦",
					rs_stella1: "稚志未消",
					rs_shiro1: "诗旅未尽",
					rs_ryoko1: "伯仲未分",
					rs_minku1: "星梦未央",
					rs_kuina1: "雄图未竟",
					rs_suzu1: "苍岚扶摇",
					rs_koharu1: "朱岚骤起",
					rs_hisame1: "金岚微拂",
				},
				characterIntro: {
					rs_karen1: "觉醒后将获得直伤能力。适时压低体力以快速觉醒获得最强形态，小心溢出伤害。",
					rs_hikari1: "人数越多作用越明显，可逃逸至伦敦以躲避征伐。把握好翻面时机以不妨碍行动。",
					rs_mahiru1: "如太阳般照耀大家的少女。无分敌友的创造收益，可以辅助或妨害手牌数较多的角色。",
					rs_claudine1: "大开大合的进攻型角色。可以倾其所有发起进攻，也可透支未来获得即时收益。",
					rs_maya1: "可以增幅队友的进攻，也可以妨害敌人对队友的进攻。攻击距离很关键。",
					rs_junna1: "可以精确狙击敌人或调控手牌，能为特定队友带来收益。",
					rs_banana1: "游戏开始时需做出抉择：继续轮回，成为强攻型角色。或变为控场类角色。",
					rs_futaba1: "以命搏命的角色。可以用多张牌转化【杀】。和【贯石斧】非常契合。",
					rs_kaoruko1: "能赋予队友和对手不同的技能，通过调整弃牌的花色数拥有充足的手牌空间。",
					rs_tamao1: "在复活队友前收益较低、可以传递关键牌；在复活队友之后收益较高，但会丧失辅助能力。",
					rs_ichie1: "脆弱的团队发动机。让队友在回合外触发“获得仅一张牌”的条件以获得额外行动力吧。",
					rs_fumi1: "可以与同样有重铸牌能力的角色交互；技能的时机须灵活抉择。",
					rs_rui1: "保镖型角色，可以保护队友抵挡进攻，回合内输出和收益不可兼得。状态越好保护力越强。",
					rs_yuyuko1: "【乐不思蜀】为其额外行动的契机；结束阶段可以再动或抢关键装备并解乐。",
					rs_aruru1: "拥有无限可能性。可以多刀或赋予关键角色以关键阶段来左右局势。",
					rs_misora1: "能拆迁对手或辅助队友出牌，能援助被跳过阶段的角色，能成为队伍中兵乐的克星。",
					rs_lalafin1: "拥有不计代价的进攻方式，可以从危机中化险为夷。",
					rs_tsukasa1: "对兵乐有抗性；交给关键角色以关键阶段以削弱对手或增幅队友。对相邻角色兼具保护和妨害。",
					rs_shizuha1: "可以胜任抗压的位置。拥有较强的防御力，回合内可以牺牲一些收益多指目标。",
					rs_akira1: "不停重铸以精进自己的手牌结构；在手牌量充足的情况下发挥优秀。拥有限次数的卖血技。",
					rs_michiru1: "可以支援使用牌目标数递增的角色，需要比自己血量上限高的队友获得卖血收益。",
					rs_meifan1: "拥有出色的用牌能力和仰赖命中的摸牌能力，如果有队友支援会更加强势。",
					rs_shiori1: "可以在队友间传牌或令对手以多换一，不同的发动顺序可以收回更多带有强化的牌。",
					rs_yachiyo1: "脆弱的剧本家。拥有只对属性但对群的卖血技，摸牌和用牌能力出色，但需要以血量为代价。",
					rs_stella1: "可以灵活的令敌方或友方重铸牌以使用锦囊牌；对属性伤害尤其有抗性。",
					rs_shiro1: "在特定的情况下可以造成直伤或回复体力，可以将合适的项分配给符合条件的其他角色。",
					rs_ryoko1: "可以依据阶段的固有动作达成末争的条件；回合外亦可以通过队友的配合或卖血达成末争。",
					rs_minku1: "可以选择移动关键牌以掌控局势，或获得更高的收益与控制牌堆。",
					rs_kuina1: "将手牌控制在特定的数目可以持续获得收益，有一定多刀能力。",
					rs_koharu1: "可以定点决斗或破坏关键牌，利用不同失去手牌的方式创造收益。",
					rs_suzu1: "拥有具有目标限制的多刀能力，可以刻意规避此多刀，转而创造牌差。金岚微拂-穗波冰雨：通过不断保持技能数与手牌数之和触发收益，丢弃不同的技能可以双结算五谷或单目标牌。",
					rs_hisame1: "通过不断保持技能数与手牌数之和触发收益，丢弃不同的技能可以双结算五谷或单目标牌。",
				},
				character: {
					rs_karen1: new lib.element.Character({
						sex: "female",
						group: "seisho",
						hp: 4,
						skills:  ["rs_daiao", "rs_gexin", "rs_xingzui_unawaken_perm"],
						isZhugong: true,
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_hikari1: new lib.element.Character({
						sex: "female",
						group: "seisho",
						hp: 3,
						skills: ["rs_fuhai", "rs_xingshu"],
						isZhugong: true,
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_mahiru1: new lib.element.Character({
						sex: "female",
						group: "seisho",
						hp: 3,
						skills: ["rs_xuyang", "rs_yuxing"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_claudine1: new lib.element.Character({
						sex: "female",
						group: "seisho",
						hp: 4,
						skills: ["rs_jiaohuo", "rs_juexing"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_maya1: new lib.element.Character({
						sex: "female",
						group: "seisho",
						hp: 4,
						skills: ["rs_kuiao", "rs_huangxing"],
						isZhugong: true,
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_junna1: new lib.element.Character({
						sex: "female",
						group: "seisho",
						hp: 3,
						skills: ["rs_shujian", "rs_xiexing"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_banana1: new lib.element.Character({
						sex: "female",
						group: "seisho",
						hp: 3,
						skills: ["rs_kuangyan", "rs_zhongmu", "rs_zhuxing"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_futaba1: new lib.element.Character({
						sex: "female",
						group: "seisho",
						hp: 4,
						skills: ["rs_juedao", "rs_lixing"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_kaoruko1: new lib.element.Character({
						sex: "female",
						group: "seisho",
						hp: 3,
						skills: ["rs_wanxi", "rs_zhanhua", "rs_fengxing"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_tamao1: new lib.element.Character({
						sex: "female",
						group: "rinmeikan",
						hp: 4,
						skills: ["rs_dieyong", "rs_linyun", "rs_ranying"],
						isZhugong: true,
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_ichie1: new lib.element.Character({
						sex: "female",
						group: "rinmeikan",
						hp: 3,
						skills: ["rs_exi", "rs_xiaying"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_fumi1: new lib.element.Character({
						sex: "female",
						group: "rinmeikan",
						hp: 4,
						skills: ["rs_huangni", "rs_wangying"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_rui1: new lib.element.Character({
						sex: "female",
						group: "rinmeikan",
						hp: 4,
						skills: ["rs_canqiao", "rs_jueying"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_yuyuko1: new lib.element.Character({
						sex: "female",
						group: "rinmeikan",
						hp: 3,
						skills: ["rs_youmian", "rs_yeying"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_aruru1: new lib.element.Character({
						sex: "female",
						group: "frontier",
						hp: 3,
						skills: ["rs_yueyue", "rs_pojing"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_misora1: new lib.element.Character({
						sex: "female",
						group: "frontier",
						hp: 4,
						skills: ["rs_shixin", "rs_xiejing"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_lalafin1: new lib.element.Character({
						sex: "female",
						group: "frontier",
						hp: 3,
						skills: ["rs_jiancan", "rs_ruijing"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_tsukasa1: new lib.element.Character({
						sex: "female",
						group: "frontier",
						hp: 4,
						skills: ["rs_yueyong", "rs_roujing"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_shizuha1: new lib.element.Character({
						sex: "female",
						group: "frontier",
						hp: 4,
						skills: ["rs_yuxin", "rs_lianwu", "rs_zhenjing"],
						isZhugong: true,
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_akira1: new lib.element.Character({
						sex: "female",
						group: "seekfelt",
						hp: 4,
						skills: ["rs_kanwei", "rs_hunwang"],
						isZhugong: true,
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_michiru1: new lib.element.Character({
						sex: "female",
						group: "seekfelt",
						hp: 3,
						skills: ["rs_mingjian", "rs_jiebi", "rs_zuowang"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_meifan1: new lib.element.Character({
						sex: "female",
						group: "seekfelt",
						hp: 4,
						skills: ["rs_balan", "rs_zhuwang"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_shiori1: new lib.element.Character({
						sex: "female",
						group: "seekfelt",
						hp: 3,
						skills: ["rs_zhihuang", "rs_ruowang"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_yachiyo1: new lib.element.Character({
						sex: "female",
						group: "seekfelt",
						hp: 3,
						skills: ["rs_anji", "rs_yinwang"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_stella1: new lib.element.Character({
						sex: "female",
						group: "seekfelt",
						hp: 3,
						skills: ["rs_zhongchong", "rs_weigen"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_shiro1: new lib.element.Character({
						sex: "female",
						group: "seekfelt",
						hp: 3,
						skills: ["rs_zhongshu", "rs_weilang"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_ryoko1: new lib.element.Character({
						sex: "female",
						group: "seekfelt",
						hp: 3,
						skills: ["rs_mozheng", "rs_weijiu"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_minku1: new lib.element.Character({
						sex: "female",
						group: "seekfelt",
						hp: 3,
						skills: ["rs_xiayi", "rs_weidiao"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_kuina1: new lib.element.Character({
						sex: "female",
						group: "seekfelt",
						hp: 3,
						skills: ["rs_fuyang", "rs_weizhi"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_suzu1: new lib.element.Character({
						sex: "female",
						group: "seiran",
						hp: 4,
						skills: ["rs_qingxie", "rs_cuilan"],
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_koharu1: new lib.element.Character({
						sex: "female",
						group: "seiran",
						hp: 4,
						skills: ["rs_qingyan", "rs_chilan"],
						isZhugong: true,
						dieAudios: ["ext:starlight/audio/die:true"],
					}),
					rs_hisame1: new lib.element.Character({
						sex: "female",
						group: "seiran",
						hp: 3,
						skills: ["rs_qingji", "rs_jinlan"],
						dieAudios: ["ext:starlight/audio/die:true"],
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
					rs_fuhai: "赴海",
					rs_fuhai_info: "锁定技，若你的武将牌背面朝上，你与其他角色的距离互相视为无限；当你受到伤害时，你将武将牌翻至正面朝上。",
					rs_xingshu: "星赎",
					rs_xingshu_info: "你可以将你弃置的牌置于武将牌上(你至多拥有三张“星赎”牌)，一名角色的结束阶段，你可以：1.移去一张“星赎”牌并可以使用之；2.重铸两张“星赎”牌；3.将牌堆顶三张牌置于武将牌上并翻面。",
					rs_xuyang: "煦阳",
					rs_xuyang_info: "锁定技，准备阶段，你令所有角色摸一张牌并选择是否交给你一张牌，若选是的角色较少，你与这些角色摸一张牌。",
					rs_yuxing: "愈星",
					rs_yuxing_info: "出牌阶段开始时，你可以令一名角色将手牌数调整至手牌上限，若其失去了牌，你令其摸等量张牌或视为对其使用一张【桃】。",
					rs_jiaohuo: "骄火",
					rs_jiaohuo_info: "每回合限一次，你可以将一个区域的所有牌当火【杀】或【决斗】使用，然后目标角色也可以对其使用者如此做。",
					rs_juexing: "攫星",
					rs_juexing_info: "每轮限一次，你可以将一张与转化后的牌类型不同的牌当【酒】或【兵粮寸断】对自己使用，并将手牌数调整至与此牌名字数相同。",
					rs_kuiao: "魁傲",
					rs_kuiao_info: "每回合限一次，一名角色使用【杀】或【决斗】指定你攻击范围内的唯一角色为目标后，你可以令其与你或目标角色拼点，其可以弃一张牌拒绝此拼点。赢的角色摸两张牌或令此牌多结算一次。",
					rs_huangxing: "煌星",
					rs_huangxing_info: "你的字母牌视为K；你赢得拼点后可获得对方的拼点牌。",
					rs_shujian: "书箭",
					rs_shujian_info: "出牌阶段限一次，你可以将至多两张牌当【无中生有】对等量角色使用，此牌对其他角色生效时，可改为结算【万箭齐发】。",
					rs_xiexing: "撷星",
					rs_xiexing_info: "每回合限一次，当前回合角色于摸牌阶段外恰好摸两张牌后，你可以令其摸一张牌，然后你重铸一张牌。",
					rs_kuangyan: "狂宴",
					rs_kuangyan_info: "锁定技，准备阶段，你失去一点体力，然后视为使用X张【杀】(X为你武将牌上失去的技能数)。",
					rs_zhongmu: "终幕",
					rs_zhongmu_info: "锁定技，当你失去体力时，你改为：1.失去一个技能；2.摸两张牌令此技能本回合失效。",
					rs_zhuxing: "逐星",
					rs_zhuxing_info: "出牌阶段限X次，你可以失去一点体力并移动场上一张牌；当你失去此技能时，你增加一点体力上限并回复一点体力(X为你武将牌上失去的技能数)。",
					rs_juedao: "决道",
					rs_juedao_info: "出牌阶段限一次，你可以摸两张牌并展示手牌，将其中所有【杀】或非基本牌当有次数限制的【杀】使用；若此牌被抵消，结束阶段你发动一次摸牌数-1的“决道”。",
					rs_lixing: "离星",
					rs_lixing_info: "锁定技，当你同时失去多张牌后，你本阶段下一次造成与受到造成的伤害皆+1。",
					rs_wanxi: "顽戏",
					rs_wanxi_info: "锁定技，出牌阶段，你每个非锁定技首次发动后弃一张牌。",
					rs_zhanhua: "绽花",
					rs_zhanhua_info: "出牌阶段限一次，你可以摸四张牌并展示之，然后弃置其中不同花色或类型的牌各一张。",
					rs_fengxing: "逢星",
					rs_fengxing_info: "锁定技，你出牌阶段弃置的牌本回合置于武将牌上，结束阶段你获得其中每种花色的牌各一张，然后令攻击范围内的一名角色获得你的一个其他技能直到其回合结束。",
					rs_dieyong: "蝶踊",
					rs_dieyong_info: "出牌阶段各限一次，你可以将任意张红色/黑色牌置于牌堆顶，视为对等量角色使用一张【五谷丰登】/【决斗】。",
					rs_linyun: "凛陨",
					rs_linyun_info: "限定技，当与你同势力的角色进入濒死状态时，你可以令你本局游戏的♥和◆牌均视为♠，令其回复一点体力。",
					rs_linyunEffect: "凛陨",
					rs_linyunEffect_info: "你本局游戏的♥和◆牌均视为♠。",
					rs_ranying: "染樱",
					rs_ranying_info: "出牌阶段限四次，你可以摸一张牌并展示所有手牌，你将手牌弃至仅剩X种花色(X为此技能未耗尽的次数)。",
					rs_exi: "恶戏",
					rs_exi_info: "每回合每名角色限一次，你仅获得过一张牌的阶段结束时，你可以摸三张牌并将三张牌扣置在一名角色前，令其亮出两张。若这些牌颜色相同，其使用其中一张；否则其获得暗置牌并受到你的一点火焰伤害。",
					rs_xiaying: "黠樱",
					rs_xiaying_info: "摸牌阶段你可少摸任意张牌，并于结束阶段摸等量牌。",
					rs_huangni: "皇逆",
					rs_huangni_info: "每阶段限一次，当一名角色不因牌的效果重铸牌时，你可以令其本次重铸摸牌的数量+1或-1。",
					rs_wangying: "王樱",
					rs_wangying_info: "每轮仅限两个时机，出牌阶段限一次/结束阶段/当你受到一点伤害后，你可以与一名角色依次重铸一张牌。",
					rs_canqiao: "灿鞘",
					rs_canqiao_info: "每回合限一次，你可以执行一项，视为使用或打出一张伤害-1的【杀】或【闪】：1.受到一点雷电伤害；2.令当前回合角色摸两张牌；3.重铸三种类型的牌；4.展示四张不同花色的手牌。",
					rs_jueying: "决樱",
					rs_jueying_info: "每回合限一次，你可以代替你攻击范围内的角色响应牌。",
					rs_youmian: "游眠",
					rs_youmian_info: "出牌阶段限一次，你可以令一名角色选择是否将一张非锦囊牌当【乐不思蜀】对自己使用，并将手牌摸至四张。",
					rs_yeying: "夜樱",
					rs_yeying_info: "结束阶段开始前，你可以获得并使用场上一张牌，将此阶段改为另一个阶段；若你的牌数因此变多，此阶段不能获得与使用牌。",
					rs_yueyue: "跃月",
					rs_yueyue_info: "你的阶段开始时，你可以使用一张牌，然后若此牌的牌名字数不为X，此技能本轮失效；否则你可以摸一张牌并跳过此阶段。",
					rs_pojing: "破境",
					rs_pojing_info: "每轮限一次，回合结束时，你可以令一名角色执行一个只有你本回合发动过“跃月”的所有阶段的回合。",
					rs_shixin: "识心",
					rs_shixin_info: "摸牌阶段开始时，你可以弃置一名角色一张牌，并令另一名角色重铸一张牌，然后这些角色可以使用因此失去的非装备牌；若你未以此法弃牌，你跳过此阶段。",
					rs_xiejing: "谐境",
					rs_xiejing_info: "一个跳过了阶段的回合结束时，你可以令当前回合角色选择一个阶段执行，此阶段所有角色的所有技能失效。",
					rs_jiancan: "见参",
					rs_jiancan_info: "你可以将一张牌按以下规则使用，另一项规则于此牌生效间也对你生效：1.锦囊牌视为【决斗】；2.【杀】视为【酒】。",
					rs_ruijing: "锐境",
					rs_ruijing_info: "每回合限一次，你可以跳过一项，并将手牌调整至三张：1.你的一个阶段；2.你本次濒死结算中对【桃】的询问。", // 描述需要优化
					rs_yueyong: "跃踊",
					rs_yueyong_info: "准备阶段，你可以跳过本回合未执行的前/后至多两个阶段并摸/弃等量张牌，然后令一名角色在此回合结束后执行一个只有这些阶段的回合。",
					rs_roujing: "柔境",
					rs_roujing_info: "每回合限一次，与你相邻的角色成为【杀】的目标后，你可以令其失去/回复一点体力，此牌对其无效/不可被响应。",
					rs_yuxin: "御心",
					rs_yuxin_info: "锁定技，你响应牌或发动非锁定技前须摸一张牌，并失去一个锁定技直到回合结束。",
					rs_lianwu: "镰舞",
					rs_lianwu_info: "锁定技，你使用无色【杀】时，此牌目标数与攻击范围+1。",
					rs_zhenjing: "臻境",
					rs_zhenjing_info: "每回合限X次，你可以将X张手牌当基本牌使用或打出(X为你拥有的锁定技数，每回合仅能因此回复一次体力)。",
					rs_kanwei: "瞰威",
					rs_kanwei_info: "出牌阶段各限一次，你可以重铸2/3/4张不同颜色/类型/花色的牌，令你本回合使用的下一张【杀】或普通锦囊牌可以指定等量目标。",
					rs_hunwang: "浑王",
					rs_hunwang_info: "每回合各限一次，当你不因此执行一项后，你可以执行另一项：1.重铸两张手牌；2.摸一张牌；3.受到一点伤害。",
					rs_mingjian: "明谏",
					rs_mingjian_info: "一名角色使用目标数大于1且为本回合唯一最多的牌时，你可以亮出牌堆顶三张牌，令其与你依次获得其中一张。",
					rs_jiebi: "诫弼",
					rs_jiebi_info: "出牌阶段限一次，你可以令一名角色重铸两张牌，并令其将以此法获得或失去的牌当【铁索连环】使用。",
					rs_zuowang: "佐王",
					rs_zuowang_info: "当你受到一点伤害后，你可以对一名体力上限大于你的角色发动一次“明谏”。",
					rs_balan: "霸岚",
					rs_balan_info: "当你受到或造成伤害时，你可以执行一项：1.弃两张牌令此伤害+1；2.摸两张牌，此技能本回合失效。",
					rs_zhuwang: "逐王",
					rs_zhuwang_info: "出牌阶段开始时，你可以令你本阶段使用【杀】的：1.目标数+1；2.额定使用次数+1；若你选择了：一项：此项再+1；两项：你受到无来源的一点火焰伤害。",
					rs_zhihuang: "稚皇",
					rs_zhihuang_info: "出牌阶段各限一次，或当你受到伤害后，你可以将手牌重铸一张或重铸至一张(须展示此牌)，令此牌本回合无距离或次数限制。",
					rs_ruowang: "若王",
					rs_ruowang_info: "当你因技能重铸牌时，你可以令一名角色交给你X张牌，然后交给其X张被重铸的牌(X为你本回合重铸牌的次数)。",
					rs_anji: "闇记",
					rs_anji_info: "每回合限一次，出牌阶段，或当与你距离为1以内的角色执行一项后，你可以执行未被执行的所有项：1.摸两张牌；2.将一张牌置于牌堆底；3.受到一点属性伤害。",
					rs_yinwang: "隐王",
					rs_yinwang_info: "结束阶段，你可以执行一项“闇记”并亮出牌堆底X张牌(X为此项序号数)，你使用其中任意张。",
					rs_zhongchong: "众宠",
					rs_zhongchong_info: "出牌阶段限一次，你可以令任意角色依次重铸一张牌；若这些牌的颜色相同，你视为使用一张无法回复体力的普通锦囊牌，此牌对本次未重铸牌的角色失效。",
					rs_weigen: "危艮",
					rs_weigen_info: "当你不因此技能执行一项时，你可以执行剩余任意项：1.横置或重置一张武将牌；2.摸一张牌；3.受到一点伤害。",
					rs_zhongshu: "衷戍",
					rs_zhongshu_info: "出牌阶段每项限执行一次，你可以执行剩余所有项，或令一名其他角色执行第X项（其须无法执行第X-1项）：1.将手牌摸至三张；2.回复一点体力；3.受到你的一点雷电伤害。",
					rs_weilang: "危狼",
					rs_weilang_info: "每回合各限一次，当你造成/受到伤害时，你可以令一名角色横置或重置。",
					rs_mozheng: "末争",
					// rs_mozheng_info: "你失去过手牌的回合结束时，你可亮出并使用牌堆底的牌；你获得过手牌的技能结束时，你可观看牌堆顶三张牌并以任意顺序置于牌堆顶或牌堆底。",
					rs_mozheng_info: "你失去过手牌的阶段结束时，你可亮出并使用牌堆底的牌；你获得过手牌的阶段结束时，你可观看牌堆顶三张牌并以任意顺序置于牌堆顶或牌堆底。",
					rs_weijiu: "危鸠",
					rs_weijiu_info: "弃牌阶段，或当你受到伤害时，你可以令你本回合失去至多两个技能并摸等量张牌，然后弃你拥有的技能数张牌。",
					rs_xiayi: "黠艺",
					rs_xiayi_info: "你于回合内将多张牌同时置入弃牌堆时，你可获得其中一张，并将本回合因此获得的两张牌与牌堆一端三张牌交换。",
					rs_weidiao: "危貂",
					rs_weidiao_info: "出牌阶段，或当你受到伤害时，你可以令一名角色重铸至多两张牌，然后你可以移动场上一张装备牌；本回合因此重铸与移动的牌共不小于三张时，此技能本回合失效。",
					rs_fuyang: "俯仰",
					rs_fuyang_info: "出牌阶段，或当你受到伤害时，你可以将手牌摸至一张或弃至两张；若皆无法发动，你可以摸两张牌，令此技能本回合失效。",
					rs_weizhi: "危雉",
					rs_weizhi_info: "你可以将三张牌当无次数限制的雷【杀】；或将两张牌当无距离限制的火【杀】使用或打出。",
					rs_qingxie: "青谐",
					rs_qingxie_info: "出牌阶段限一次，你可以将任意张牌与一名角色的至多两张手牌交换，你因此以少换多后，本局游戏仅能以多换少。",
					rs_cuilan: "翠岚",
					rs_cuilan_info: "你交给过其他角色牌的阶段结束时，你可以视为对一名与你距离最远的角色使用一张有距离限制的【杀】；若不能，你先移动场上一张牌；若仍不能，你可以拼点。",
					rs_qingyan: "青炎",
					rs_qingyan_info: "出牌阶段限一次，你可以和一名其他角色拼点，并选择赢的角色一张牌，令其将此牌当【决斗】对没赢的角色使用。",
					rs_chilan: "赤岚",
					rs_chilan_info: "以你为目标或使用者的【决斗】结算中，当你的手牌数不等于X时，你可以将手牌调整至X张。(X为你本回合失去手牌的方式数，且至多为4)",
					rs_qingji: "青姬",
					rs_qingji_info: "出牌阶段，你可以执行能令你手牌与技能数之和等于4的一项：1.摸两张牌，然后你本回合失去一个技能；2.将任意张牌当【五谷丰登】对至多等量其他角色使用。",
					rs_jinlan: "金岚",
					rs_jinlan_info: "当前回合角色使用目标数等于其生效技能数的牌时，你可以令此牌多结算一次，然后你本回合失去此技能。",
				},
				skill: {
					rs_daiao: {
						audio: "ext:starlight/audio/skill:true",
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
						audio: "ext:starlight/audio/skill:true",
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
						charlotte: true,
						nobracket: true,
						nopop: true,
						init: player => player.addSkill("rs_xingzui_unawaken_temp"),
					},
					/**
					 * 在游戏内的武将右键菜单中，以半透明样式展示觉醒后获得的【星罪】
					 * @see rs_xingzui_unawaken_perm 在进入游戏后才获得此技能，防止显示在武将双击菜单中
					 */
					rs_xingzui_unawaken_temp: {
						charlotte: true,
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
							const extPath = lib.assetURL + "extension/starlight/audio/";
							if (player.storage.rs_xingzui) {
								new Audio(extPath + "xingzui_yin.mp3").play();
							} else {
								new Audio(extPath + "xingzui_yang.mp3").play();
							}
							player.changeZhuanhuanji(event.name);
							trigger.num++;
						},
					},
					rs_fuhai: {
						audio: "ext:starlight/audio/skill:true",
						mod: {
							globalFrom(from, to) {
								if (from.isTurnedOver()) return Infinity;
							},
							globalTo(from, to) {
								if (to.isTurnedOver()) return Infinity;
							},
						},
						trigger: {
							player: "damageBegin",
						},
						filter(event, player) {
							return player.isTurnedOver();
						},
						forced: true,
						async content(event, trigger, player) {
							await player.turnOver(false);
						},
					},
					rs_xingshu: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "loseAfter",
						},
						filter(event, player) {
							if (event.type != "discard") return false;
							return event.cards2.someInD("od");
						},
						async cost(event, trigger, player) {
							const cards = trigger.cards2.filterInD("od");
							const expansion = player.getExpansions("rs_xingshu");
							const max = Math.min(cards.length, 3 - expansion.length);
							if (max <= 0) {
								event.result = { bool: false };
								return;
							}
							const result = await player
								.chooseButton([`###星赎###是否将弃置的牌置于武将牌上？（至多拥有三张"星赎"牌）`, cards], [1, max])
								.set("ai", button => {
									const card = button.link;
									const player = get.player();
									return player.getUseValue(card, true) + get.value(card);
								})
								.forResult();
							event.result = {
								bool: result.bool,
								cards: result.links,
							};
						},
						async content(event, trigger, player) {
							const cards = event.cards;
							const next = player.addToExpansion(cards, "gain2");
							next.gaintag.add("rs_xingshu");
							await next;
						},
						intro: {
							markcount: "expansion",
							content: "expansion",
						},
						group: "rs_xingshu_use",
						subSkill: {
							use: {
								audio: "ext:starlight/audio/skill:true",
								trigger: {
									global: "phaseJieshuBegin",
								},
								async cost(event, trigger, player) {
									const expansion = player.getExpansions("rs_xingshu");
									const baseKeys = ["选项一", "选项二", "选项三"];
									const baseTexts = ['移去一张"星赎"牌并可以使用之', '重铸两张"星赎"牌', "将牌堆顶三张牌置于武将牌上并翻面"];
									let keys = [...baseKeys];
									let list = [...baseTexts];

									if (expansion.length < 1) {
										keys.remove("选项一");
									}
									if (expansion.length < 2) {
										keys.remove("选项二");
									}
									if (expansion.length != 0) {
										keys.remove("选项三");
									}

									[0, 1, 2].forEach(i => {
										const key = baseKeys[i];
										if (!keys.includes(key)) {
											list[i] = `<span style="opacity:0.5">${list[i]}</span>`;
										}
									});

									if (keys.length === 0) {
										event.result = { bool: false };
										return;
									}

									const result = await player
										.chooseControl(keys, "cancel2")
										.set("prompt", "星赎：请选择一项")
										.set("choiceList", list)
										.set("ai", () => {
											const { controls, player } = get.event();
											const expansion = player.getExpansions("rs_xingshu");
											if (controls.includes("选项一")) {
												const usableCards = expansion.filter(card => player.hasUseTarget(card, true, false));
												if (usableCards.length > 0) return "选项一";
											}
											if (controls.includes("选项三")) {
												return "选项三";
											}
											return controls[0];
										})
										.forResult();

									event.result = {
										bool: result.control != "cancel2",
										cost_data: result.control,
									};
								},
								async content(event, trigger, player) {
									const choice = event.cost_data;
									const expansion = player.getExpansions("rs_xingshu");

									if (choice == "选项一") {
										const result = await player
											.chooseButton(['星赎：选择一张"星赎"牌', expansion], true)
											.set("ai", button => {
												const card = button.link;
												const player = get.player();
												return player.getUseValue(card, true) + 0.1;
											})
											.forResult();
										if (result.bool) {
											const card = result.links[0];
											await player.loseToDiscardpile(card);
											if (player.hasUseTarget(card, true, false)) {
												await player.chooseUseTarget(card, true, false);
											}
										}
									} else if (choice == "选项二") {
										const result = await player
											.chooseButton(['星赎：选择两张"星赎"牌重铸', expansion], 2, true)
											.set("ai", button => {
												return 100 - get.buttonValue(button);
											})
											.forResult();
										if (result.bool && result.links.length == 2) {
											await player.recast(result.links);
										}
									} else if (choice == "选项三") {
										const cards = get.cards(3);
										await game.cardsGotoOrdering(cards);
										const next = player.addToExpansion(cards, "gain2");
										next.gaintag.add("rs_xingshu");
										await next;
										await player.turnOver();
									}
								},
							},
						},
					},
					rs_xuyang: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "phaseZhunbeiBegin",
						},
						forced: true,
						logTarget() {
							return game.players;
						},
						async content(event, trigger, player) {
							const targets = game.filterPlayer(target => target.isIn());
							for (const target of targets) {
								await target.draw();
							}

							const giveList = [];
							for (const target of targets) {
								if (!target.isIn() || !target.countCards("she") || target == player) continue;
								const result = await target
									.chooseCard("she", `###煦阳###是否交给${get.translation(player)}一张牌？`)
									.set("ai", card => {
										const goon = get.event().goon;
										return goon ? 6 - get.value(card) : 0;
									})
									.set("goon", get.attitude(target, player) > 0)
									.forResult();
								if (result.bool) {
									await target.give(result.cards, player, false);
									giveList.push(target);
								}
							}
							if (giveList.length < targets.length / 2) {
								game.log(player, "与", giveList, "摸一张牌");
								await game.asyncDraw([player, ...giveList], 1);
							}
						},
					},
					rs_yuxing: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "phaseUseBegin",
						},
						filter(event, player) {
							return game.hasPlayer(p => p.countCards("h") != p.getHandcardLimit());
						},
						async cost(event, trigger, player) {
							event.result = await player
								.chooseTarget("###愈星###是否令一名角色将手牌数调整至手牌上限？")
								.set("ai", target => {
									return get.attitude(player, target) > 0 ? Math.abs(target.getHandcardLimit() - target.countCards("h")) : 0;
								})
								.forResult();
						},
						async content(event, trigger, player) {
							const target = event.targets[0];
							const handnum = target.countCards("h");
							const limit = target.getHandcardLimit();
							const delta = Math.abs(handnum - limit);
							if (handnum == limit) {
								return;
							}
							let lostNum = 0;
							if (handnum > limit) {
								const result = await target
									.chooseToDiscard("he", delta, `###愈星###请弃置${delta}张牌！`, true)
									.set("ai", card => {
										return 6 - get.value(card);
									})
									.forResult();
								lostNum = result.cards?.length || delta;
							} else {
								await target.draw(delta);
							}
							if (lostNum > 0) {
								const result = target.isHealthy()
									? {
											control: "摸牌",
										}
									: await player
											.chooseControl(["摸牌", "使用桃"])
											.set("prompt", `###愈星###请对${get.translation(target)}执行一项！`)
											.set("ai", () => {
												return get.event().top;
											})
											.set("top", lostNum > 1 ? "摸牌" : target.isDamaged() ? "使用桃" : "摸牌")
											.forResult();

								if (result.control == "摸牌") {
									await target.draw(lostNum);
								} else {
									await player.useCard({ name: "tao" }, target, false);
								}
							}
						},
					},
					rs_jiaohuo: {
						audio: "ext:starlight/audio/skill:true",
						enable: "chooseToUse",
						manualConfirm: true,
						usable: 1,
						filter(event, player) {
							const canUseSha = event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event);
							const canUseJuedou = event.filterCard(get.autoViewAs({ name: "juedou" }, "unsure"), player, event);
							if (!canUseSha && !canUseJuedou) return false;
							return player.countCards("hej") > 0;
						},
						async content(event, trigger, player) {
							let nowPlayers = [player];
							let nowPlayers2 = [];
							let oldPlayers = [];
							const maps = {
								手牌区: "h",
								装备区: "e",
								判定区: "j",
							};
							let rangeRestriction = true;

							while (nowPlayers.length > 0) {
								for (const nowPlayer of nowPlayers) {
									const areas = [];
									if (nowPlayer.countCards("h") > 0) areas.push("手牌区");
									if (nowPlayer.countCards("e") > 0) areas.push("装备区");
									if (nowPlayer.countCards("j") > 0) areas.push("判定区");
									if (areas.length == 0) return;
									const result = await nowPlayer
										.chooseButton(
											[
												"骄火：你可以将一个区域的所有牌当火【杀】或【决斗】使用",
												[
													[
														...areas.map(area => {
															return [area, area];
														}),
														["sha", "杀"],
														["juedou", "决斗"],
													],
													"textbutton",
												],
											],
											2
										)
										.set("filterOk", () => {
											const links = ui.selected.buttons.map(btn => btn.link);
											const bool1 = links.filter(link => link != "sha" && link != "juedou").length == 1;
											const bool2 = links.filter(link => link == "sha" || link == "juedou").length == 1;
											if (rangeRestriction && links.includes("sha")) {
												if (player.isPhaseUsing() && player.getCardUsable({ name: "sha" }) == 0) {
													return false;
												}
											}

											return bool1 && bool2;
										})
										.set("filterButton", button => {
											console.log(button,button.link)
											const link = button.link;
											if (link == "sha" && rangeRestriction && player.isPhaseUsing() && player.getCardUsable({ name: "sha" }) == 0) {
												return false;
											}

											if (link == "sha" && !player.hasUseTarget({ name: "sha" }, rangeRestriction, false)) {
												return false;
											}
											const links = ui.selected.buttons.map(btn => btn.link);
											if (links.includes(link)) return false;
											if (links.includes("sha") || links.includes("juedou")) {
												return !["sha", "juedou"].includes(link);
											}
											if (links.length && !links.includes("sha") && !links.includes("juedou")) {
												return ["sha", "juedou"].includes(link);
											}
											return true;
										})
										.set("ai", button => {
											if (ui.selected.buttons.length == 0) {
												const player = get.player();
												if (["sha", "juedou"].includes(button.link)) {
													return 0;
												}
												if (button.link == "手牌区") {
													return 3 - player.countCards("h");
												}
												if (button.link == "判定区") {
													return 9;
												}
												return 8;
											} else {
												return button.link == "sha" && player.hasUseTarget({ name: "sha" }, true, false) ? 0.5 : 0;
											}
										})
										.forResult();
									if (result.bool) {
										const cardName = result.links.find(link => link == "sha" || link == "juedou");
										const nature = cardName == "sha" ? "fire" : undefined;
										const card = { name: cardName, nature: nature };
										const cards = nowPlayer.getCards(maps[result.links.find(link => link != "sha" && link != "juedou")]);
										const next = oldPlayers.length ? await nowPlayer.chooseUseTarget(card, oldPlayers, cards, true, false, rangeRestriction ? undefined : "nodistance").forResult() : await nowPlayer.chooseUseTarget(card, cards, true, false, rangeRestriction ? undefined : "nodistance").forResult();
										if (next.bool) {
											nowPlayers2.push(...next.targets);
											oldPlayers = [nowPlayer];
										}
									}
								}
								rangeRestriction = false;
								if (nowPlayers2.length > 0) {
									nowPlayers = nowPlayers2.slice();
									nowPlayers2 = [];
								} else {
									nowPlayers = [];
								}
							}
						},
						ai: {
							order: 1,
							result: {
								player(player) {
									if (player.countCards("e") > 0 || player.countCards("j") > 0) {
										return 2;
									}
									return [0, 1].randomGet();
								},
							},
						},
					},
					rs_juexing: {
						audio: false,
						enable: ["chooseToUse"],
						filter(event, player) {
							return (event.filterCard(get.autoViewAs({ name: "jiu" }, "unsure"), player, event) && player.countCards("she", c => get.type(c) != "basic")) || (event.filterCard(get.autoViewAs({ name: "bingliang" }, "unsure"), player, event) && player.countCards("she", c => get.type2(c) != "trick") && !player.hasJudge("bingliang"));
						},
						hiddenCard(player, name) {
							if (!player.countCards("he")) return false;
							return name == "jiu" || name == "bingliang";
						},
						chooseButton: {
							dialog(event, player) {
								const list = [];
								if (event.filterCard(get.autoViewAs({ name: "jiu" }, "unsure"), player, event) && player.countCards("she", c => get.type(c) != "basic")) {
									list.push(["basic", "", "jiu"]);
								}
								if (event.filterCard(get.autoViewAs({ name: "bingliang" }, "unsure"), player, event) && player.countCards("she", c => get.type2(c) != "trick") && !player.hasJudge("bingliang")) {
									list.push(["trick", "", "bingliang"]);
								}
								return ui.create.dialog("攫星", [list, "vcard"]);
							},
							filter(button, player) {
								if (button.link[2] == "jiu") {
									return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
								}
								return !player.hasJudge("bingliang");
							},
							check(button) {
								return button.link[2] == "bingliang" ? 2 : 1;
							},
							backup(links) {
								const cardName = links[0][2];
								return {
									filterCard(card, player) {
										const type1 = get.type2(card);
										const type2 = get.type2(cardName);
										return type1 != type2;
									},
									check(card) {
										return get.translation(get.name(card, get.player())).length;
									},
									position: "she",
									selectTarget: -1,
									filterTarget(card, player, target) {
										return target == player;
									},
									ai: {
										order: 99,
										result: {
											player(player) {
												if (_status.event.dying) return get.attitude(player, _status.event.dying);
												return 6;
											},
										},
									},
									viewAs: { name: cardName },
									async precontent(event, trigger, player) {
										const extPath = lib.assetURL + "extension/starlight/audio/";
										 new Audio(extPath + "juexing.mp3").play();
										player.tempBanSkill("rs_juexing", "roundStart");
										const card = event.result.card;
										if (!card) return;
										const cardName = card.name;
										const nameLength = get.translation(cardName).length;

										const me = player;
										player.when("useCardAfter").step(async function () {
											const handNum = player.countCards("h");
											if (handNum < nameLength) {
												await me.draw(nameLength - handNum);
											} else if (handNum > nameLength) {
												await me.chooseToDiscard("h", handNum - nameLength, true);
											}
										});
									},
								};
							},
							prompt(links) {
								const cardName = links[0][2];
								return `将一张与${get.translation(cardName)}类型不同的牌当${get.translation(cardName)}使用`;
							},
						},
						ai: {
							order() {
								return get.order({ name: "sha" }) + 0.1;
							},
							result: {
								player(player) {
									if (_status.event.dying) return get.attitude(player, _status.event.dying);
									return 6;
								},
							},
						},
					},
					rs_kuiao: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							global: "useCardToPlayered",
						},
						usable: 1,
						filter(event, player) {
							if (event.card.name != "sha" && event.card.name != "juedou") return false;
							if (!event.targets || event.targets.length != 1) return false;
							const target = event.targets[0];
							return player.inRange(target) && (event.player.canCompare(player) || event.player.canCompare(target));
						},
						async cost(event, trigger, player) {
							const source = trigger.player;
							const controls = ["选项一", "选项二"];
							const list = [`令${get.translation(source)}与你拼点`, `令${get.translation(source)}与${get.translation(trigger.targets[0])}拼点`];
							if (!source.canCompare(player)) {
								controls.remove("选项一");
								list[0] = `<span style="opacity:0.5">${list[0]}</span>`;
							}
							if (!source.canCompare(trigger.targets[0])) {
								controls.remove("选项二");
								list[1] = `<span style="opacity:0.5">${list[1]}</span>`;
							}
							const att = get.attitude(player, trigger.targets[0]);
							let goon = "选项一";
							if (att < 0 && controls.includes("选项二")) {
								goon = "选项二";
							} else if (player.countCards("h") < 2) {
								goon = "cancel2";
							} else if (att > 0 && controls.includes("选项一")) {
								goon = "选项一";
							} else {
								goon = "cancel2";
							}

							const result = await player
								.chooseControl(controls, "cancel2")
								.set("choiceList", list)
								.set("prompt", "魁傲：请选择一项！")
								.set("ai", () => {
									return get.event().goon;
								})
								.set("goon", goon)
								.forResult();
							event.result = {
								bool: result.control != "cancel2",
								cost_data: result.control,
							};
						},
						async content(event, trigger, player) {
							const control = event.cost_data;
							let str = "###魁傲###是否弃置一张牌，" + (control == "选项一" ? `拒绝和${get.translation(player)}拼点` : `拒绝和${get.translation(trigger.player)}与${get.translation(trigger.targets[0])}拼点？`);
							const result =
								trigger.player == player
									? { bool: false }
									: await trigger.player
											.chooseToDiscard(str, "she")
											.set("ai", () => 0)
											.forResult();
							if (result.bool) {
								return;
							}
							const next = await trigger.player.chooseToCompare(control == "选项一" ? player : trigger.targets[0]).forResult();
							if (next.tie || !next.winner) {
								return;
							}
							const winner = next.winner;
							const next2 = await winner
								.chooseControl(["摸两张牌", "令此牌多结算一次"])
								.set("prompt", "###魁傲###请选择一项！")
								.set("goon", get.attitude(winner, trigger.targets[0]) > 0 ? "摸两张牌" : "令此牌多结算一次")
								.set("ai", () => {
									return get.event().goon;
								})
								.forResult();
							if (next2.control == "摸两张牌") {
								await winner.draw(2);
							} else {
								trigger.getParent().effectCount++;
							}
						},
					},
					rs_huangxing: {
                        audio: "ext:starlight/audio/skill:true",
						mod: {
							cardnumber(card, player) {
								const num = card.number;
								if (num == 1 || num == 11 || num == 12 || num == 13) {
									return 13;
								}
							},
						},
						trigger: {
							global: ["chooseToCompareAfter", "compareMultipleAfter"],
						},
						getCards(event, player) {
							if (event.compareMultiple) {
								return [];
							}
							if (event.compareMeanwhile) {
								const index = [...event.targets, event.player].indexOf(player),
									winner = event.winner || event.result.winner;
								if (index < 0) {
									return [];
								}
								return event.cards
									.filter((card, i) => {
										return i !== index;
									})
									.filterInD("od");
							}
							if (player != event.player && player != event.target) {
								return [];
							}
							const bool = player == event.player;
							return [event[bool ? "card2" : "card1"]].filterInD("od");
						},
						filter(event, player) {
							if (event.result?.winner != player) return false;
							const cards = get.info("rs_huangxing").getCards(event, player);
							return cards.length;
						},
						frequent: true,
						async content(event, trigger, player) {
							const targetCards = get.info("rs_huangxing").getCards(trigger, player);
							if (targetCards.length > 0) {
								await player.gain(targetCards, "gain2");
							}
						},
					},
					rs_shujian: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						usable: 1,
						filterCard: true,
						selectCard: [1, 2],
						position: "she",
						filter(event, player) {
							return player.countCards("she") > 0;
						},
						filterTarget: true,
						selectTarget() {
							return ui.selected.cards.length;
						},
						complexCard: true,
						check(card) {
							return 7 - get.value(card);
						},
						multitarget: true,
						multiline: true,
						async content(event, trigger, player) {
							const targets = event.targets;
							const cards = event.cards;

							const result = await player
								.chooseTarget((card, player, target) => get.event().canSelect.includes(target), [1, Infinity], `###书箭###请选择要结算为【万箭齐发】的角色！`)
								.set(
									"canSelect",
									targets.filter(p => p != player)
								)
								.set("ai", target => {
									const player = get.player();
									return -get.attitude(player, target);
								})
								.forResult();
							let wanjianTargets = result?.targets || [];
							let wuzhongTargets = targets.filter(p => !wanjianTargets.includes(p));
							if (wuzhongTargets.length) {
								await player.useCard({ name: "wuzhong" }, cards, wuzhongTargets);
							}
							if (wanjianTargets.length) {
								await player.useCard({ name: "wanjian" }, cards, wanjianTargets);
							}
						},
						ai: {
							order: 9,
							result: {
								player: 2,
								target(player, target) {
									const att = get.attitude(player, target);
									if (att >= 0) return 2;
									return -1.5;
								},
							},
						},
					},
					rs_xiexing: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							global: "gainAfter",
						},
						usable: 1,
						filter(event, player) {
							if (event.player != _status.currentPhase || event.cards?.length != 2 || event.getParent(2).name == "phaseDraw") return false;
							return event.cards.length == 2;
						},
						check(event, player) {
							return get.attitude(player, event.player) > 0;
						},
						async content(event, trigger, player) {
							await trigger.player.draw();
							if (player.countCards("she") > 0) {
								const result = await player
									.chooseCard(true, "she", 1, "###撷星###请重铸一张牌!")
									.set("ai", card => {
										return 6 - get.value(card);
									})
									.forResult();
								if (result.bool) {
									await player.recast(result.cards);
								}
							}
						},
					},
					rs_kuangyan: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "phaseBegin",
						},
						forced: true,
						getLostSkills(player) {
							return [player.name1, player.name2]
								.filter(Boolean)
								.map(name => lib.character[name].skills)
								.flat()
								.filter(skill => !player.hasSkill(skill));
						},
						async content(event, trigger, player) {
							await player.loseHp();
							const skills = lib.skill.rs_kuangyan.getLostSkills(player);
							const num = skills.length;
							if (num <= 0) return;
							for (let i = 0; i < num; i++) {
								if (!player.hasUseTarget({ name: "sha" }, true, false)) break;
								await player.chooseUseTarget({ name: "sha" }, true, false, `###狂宴###视为使用一张【杀】(剩余${get.cnNumber(num - i - 1)}张)`);
							}
						},
					},
					rs_zhongmu: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "loseHpBegin",
						},
						forced: true,
						async content(event, trigger, player) {
							trigger.cancel();
							const skills = player.getSkills(null, false, false).filter(skill => {
								const info = get.info(skill);
								return !info.charlotte;
							});

							const result = await player
								.chooseControl(skills, "cancel2")
								.set("prompt", "###终幕###选择失去一个技能，或者取消并摸两张牌令此技能本回合失效！")
								.set("ai", () => {
									const controls = get.event().controls;
									if (controls.includes("rs_zhuxing")) return "rs_zhuxing";
									return "cancel2";
								})
								.forResult();

							if (result.control == "cancel2") {
								await player.draw(2);
								player.tempBanSkill(event.name);
							} else {
								player.removeSkill(result.control);
							}
						},
					},
					rs_zhuxing: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						usable() {
							const player = get.player();
							if (!player) return;
							return lib.skill.rs_zhuxing.getLostSkills(player).length;
						},
						getLostSkills(player) {
							const skills = player.getSkills(null, false, false);
							const cardOriginalSkills = [player.name1, player.name2]
								.filter(Boolean)
								.map(name => lib.character[name].skills)
								.flat();
							return cardOriginalSkills.filter(skill => !skills.includes(skill));
						},
						filter(event, player) {
							return player.canMoveCard();
						},
						async content(event, trigger, player) {
							await player.loseHp();
							if (player.canMoveCard()) {
								await player.moveCard(true);
							}
						},
						onremove(player) {
							const next = game.createEvent("rs_zhuxing_onremove");
							next.player = player;
							next.setContent(async function (event, trigger, player) {
								await player.gainMaxHp();
								await player.recover();
							});
						},
						ai: {
							order: 8,
							result: {
								player(player) {
									if (player.hp > 2 && player.canMoveCard(true)) {
										return 1;
									}
									return 0;
								},
							},
						},
					},
					rs_juedao: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						usable: 1,
						async content(event, trigger, player) {
							const drawNum = event.drawNum || 2;
							await player.draw(drawNum);
							await player.showHandcards();
							if (player.getCardUsable({ name: "sha" }) == 0 && player.isPhaseUsing()) return;
							const controls = ["选项一", "选项二"];
							if (!player.countCards("h", "sha")) {
								controls.remove("选项一");
							}
							if (!player.countCards("h", card => get.type(card) != "basic")) {
								controls.remove("选项二");
							}
							if (!controls.length) return;
							const result =
								controls.length == 1
									? { control: controls[0] }
									: await player
											.chooseControl(controls)
											.set("prompt", "决道：请选择一项！")
											.set("choiceList", ["将所有的【杀】当作有次数限制的【杀】使用", "将所有非基本牌当作有次数限制的【杀】使用"])
											.set("ai", () => {
												const shaNum = player.countCards("h", "sha");
												const nonBasicNum = player.countCards("h", card => get.type(card) != "basic");
												return shaNum > nonBasicNum ? "选项二" : "选项一";
											})
											.forResult();
							if (result.control == "选项一") {
								player.isPhaseUsing()
									? await player.chooseUseTarget(
											{ name: "sha" },
											player.getCards("h", card => card.name == "sha"),
											true
										)
									: await player.chooseUseTarget(
											{ name: "sha" },
											player.getCards("h", card => card.name == "sha"),
											true,
											false
										);
							} else {
								player.isPhaseUsing()
									? await player.chooseUseTarget(
											{ name: "sha" },
											player.getCards("h", card => get.type(card) != "basic"),
											true
										)
									: await player.chooseUseTarget(
											{ name: "sha" },
											player.getCards("h", card => get.type(card) != "basic"),
											true,
											false
										);
							}
						},
						group: "rs_juedao_check",
						ai: {
							order: 3,
							result: {
								player(player) {
									const cards = player.getCards("h", card => {
										return card.name == "sha" || get.type(card) != "basic";
									});
									if (cards.length + 2 >= 3) return 2;
									return 1;
								},
							},
						},
						subSkill: {
							check: {
								trigger: {
									player: ["shaMiss"],
								},
								filter(event, player, name) {
									const parent = event.getParent(3);
									if (parent && parent.name == "rs_juedao" && !parent.isEndPhase) {
										return true;
									}
									return false;
								},
								silent: true,
								charlotte: true,
								async content(event, trigger, player) {
									player.storage.rs_juedao_pending = (player.storage.rs_juedao_pending || 0) + 1;
									player.addTempSkill("rs_juedao_end");
								},
							},
							end: {
								trigger: {
									player: "phaseEnd",
								},
								forced: true,
								charlotte: true,
								filter(event, player) {
									return player.storage.rs_juedao_pending > 0;
								},
								async content(event, trigger, player) {
									const times = player.storage.rs_juedao_pending;
									delete player.storage.rs_juedao_pending;

									for (let i = 0; i < times; i++) {
										const skill = "rs_juedao";
										player.logSkill(skill);
										const next = game.createEvent(skill);
										next.player = player;
										next.drawNum = 1;
										next.isEndPhase = true;
										next.setContent(get.info(skill).content);
										await next;
									}
								},
							},
						},
					},
					rs_lixing: {
						audio: false,
						trigger: {
							player: "loseAfter",
						},
						forced: true,
						locked: true,
						filter(event, player) {
							return event.cards?.length > 1;
						},
						async content(event, trigger, player) {
							player.addTempSkill("rs_lixing_effect", "phaseAnyAfter");
							player.addMark("rs_lixing_effect", 1, false);
						},
						subSkill: {
							effect: {
								audio: "ext:starlight/audio/skill:true",
								trigger: {
									source: "damageBegin",
									player: "damageBegin",
								},
								forced: true,
								charlotte: true,
								onremove: true,
								intro: {
									content: "下一次造成与受到的伤害皆+#",
								},
								async content(event, trigger, player) {
									trigger.num++;
									player.removeSkill("rs_lixing_effect");
								},
								ai: {
									damageBonus: true,
								},
							},
						},
					},
					rs_wanxi: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: ["useSkillAfter", "logSkillAfter", "logSkill"],
						},
						filter(event, player) {
							if (["global", "equip"].includes(event.type)) {
								return false;
							}
							let skill = get.sourceSkillFor(event);
							if (!skill) {
								return false;
							}
							let info = get.info(skill);
							if (!info || info.charlotte || info.forced || info.locked) {
								return false;
							}
							return player.countCards("he") > 0 && !player.getStorage("rs_wanxi_used").includes(skill);
						},
						forced: true,
						async content(event, trigger, player) {
							let skill = get.sourceSkillFor(trigger);
							player.markAuto("rs_wanxi_used", skill);
							player.addTempSkill("rs_wanxi_used");
							await player.chooseToDiscard("he", 1, "###顽戏###请弃置一张牌！", true);
						},
						subSkill: {
							used: {
								onremove: true,
								charlotte: true,
							},
						},
					},
					rs_zhanhua: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						usable: 1,
						async content(event, trigger, player) {
							const { cards } = await player.draw(4).forResult();
							if (!cards || cards.length == 0) return;
							await player.showCards(cards, "绽花");
							const result = await player
								.chooseControl(["选项一", "选项二"])
								.set("prompt", "绽花：请选择一项！")
								.set("choiceList", ["弃置不同花色的牌各一张", "弃置不同类型的牌各一张"])
								.set("ai", () => {
									return get.event().top;
								})
								.set("top", [...new Set(cards.map(i => get.type2(i)))].length > 2 ? "选项一" : "选项二")
								.forResult();
							const control = result.control;
							const filter =
								control == "选项一"
									? card => {
											if (!get.event().cards2.includes(card)) return false;
											return ui.selected.cards.every(c => get.suit(c) != get.suit(card));
										}
									: card => {
											if (!get.event().cards2.includes(card)) return false;
											return ui.selected.cards.every(c => get.type2(c) != get.type2(card));
										};
							const filterOk =
								control == "选项一"
									? () => {
											const cards = get.event().cards2;
											return ui.selected.cards.length == [...new Set(cards.map(c => get.suit(c)))].length;
										}
									: () => {
											const cards = get.event().cards2;
											return ui.selected.cards.length == [...new Set(cards.map(c => get.type2(c)))].length;
										};

							await player
								.chooseToDiscard(filter, 1, [1, Infinity], true)
								.set("complexCard", true)
								.set("cards2", cards)
								.set("filterOk", filterOk)
								.set("ai", card => {
									return 100 - get.value(card);
								})
								.set("prompt", `###绽花###请选择弃置的牌（${control == "选项一" ? "不同花色" : "不同类型"}）`);
						},
						ai: {
							order: 10,
							result: {
								player: 2,
							},
						},
					},
					rs_fengxing: {
						trigger: {
							player: ["loseAfter"],
						},
						forced: true,
						locked: true,
						filter(event, player, name) {
							if (name == "loseAfter") {
								if (event.type != "discard") return false;
								return event.cards.someInD("od") && player.isPhaseUsing();
							}
							return false;
						},
						async content(event, trigger, player) {
							const cards = trigger.cards.filterInD("od");
							if (cards.length > 0) {
								const next = player.addToExpansion(cards, "gain2");
								next.gaintag.add("rs_fengxing_end");
								await next;
							}
						},
						group: ["rs_fengxing_end"],
						subSkill: {
							end: {
								audio: "ext:starlight/audio/skill:true",
								intro: {
									markcount: "expansion",
									content: "expansion",
								},
								trigger: {
									player: "phaseEnd",
								},
								forced: true,
								filter(event, player) {
									return player.getExpansions("rs_fengxing_end").length > 0;
								},
								async content(event, trigger, player) {
									const cards = player.getExpansions("rs_fengxing_end");
									const result1 = await player
										.chooseCardButton(cards, "逢星：请选择要获得的牌", [1, Infinity], true)
										.set("filterButton", button => {
											return ui.selected.buttons.map(btn => btn.link).every(card => get.suit(card) != get.suit(button.link));
										})
										.set("cards2", cards)
										.set("filterOk", () => {
											const cards = get.event().cards2;
											return ui.selected.buttons.length == [...new Set(cards.map(c => get.suit(c)))].length;
										})
										.set("ai", button => {
											const card = button.link;
											const player = get.player();
											return player.getUseValue(card, true) + get.value(card);
										})
										.forResult();
									if (result1.bool) {
										await player.gain(result1.links, "gain2");
									}
									const cardsR = player.getExpansions("rs_fengxing_end");
									if (cardsR.length > 0) {
										await player.loseToDiscardpile(cardsR);
									}

									const targets = game.filterPlayer(target => {
										return target != player && player.inRange(target);
									});
									if (targets.length == 0) return;
									const skills = player.getSkills(null, false, false).filter(skill => {
										if (skill == "rs_fengxing") return false;
										const info = get.info(skill);
										return info && !info.charlotte;
									});
									if (skills.length == 0) return;
									const result = await player
										.chooseButtonTarget({
											createDialog: ["逢星：令攻击范围内的一名角色获得你的一个其他技能", [skills.map(skill => [skill, get.translation(skill)]), "textbutton"]],
											filterTarget(card, player, target) {
												return player != target && player.inRange(target);
											},
											complexSelect: true,
											filterButton(button) {
												return true;
											},
											forced: true,
											ai1(button) {
												return Math.random();
											},
											ai2(target) {
												const { player } = get.event();
												return get.attitude(player, target);
											},
										})
										.forResult();
									if (result.bool) {
										result.targets[0].addTempSkill(result.links[0], { player: "phaseEnd" });
									}
								},
							},
						},
					},
					rs_dieyong: {
						enable: "phaseUse",
						usable: 2,
						selectCard: [1, Infinity],
						complexCard: true,
						filterCard(card) {
							const player = get.player();
							const color = get.color(card, player);
							if (player.getStorage("rs_dieyong_used").includes(color)) return false;
							if (ui.selected.cards.length) {
								return color == get.color(ui.selected.cards[0], player);
							}
							return color == "red" || color == "black";
						},
						filterTarget(card, player, target) {
							if (!ui.selected.cards.length) return false;
							const color = get.color(ui.selected.cards[0], player);
							if (color == "red") {
								return player.canUse({ name: "wugu" }, target, true);
							}
							return player.canUse({ name: "juedou" }, target, true);
						},
						selectTarget() {
							return [1, ui.selected.cards.length];
						},
						check(card) {
							const player = get.player();
							const color = get.color(card, player);
							const friendsNum = game.filterPlayer(p => get.attitude(player, p) > 0).length;
							if (color == "black") {
								if (player.getUseValue({ name: "juedou" }) < 2) {
									return 0;
								}
								if (!ui.selected.cards.length) {
									return 7 - get.value(card);
								}
								return 0;
							}
							if (ui.selected.cards.length + 1 > friendsNum) {
								return 0;
							}
							return 7 - get.value(card);
						},
						position: "she",
						discard: false,
						delay: false,
						loseTo: "cardPile",
						insert: true,
						multiline: true,
						multitarget: true,
						async content(event, trigger, player) {
							const cards = event.cards;
							player.markAuto("rs_dieyong_used", get.color(cards[0], player));
							player.addTempSkill("rs_dieyong_used");
							const color = get.color(cards[0], player);
							const name = color == "red" ? "wugu" : "juedou";
							const extPath = lib.assetURL + "extension/starlight/audio/";
							if (color == "red") {
								new Audio(extPath + "dieyong_wugu.mp3").play();
							} else {
								new Audio(extPath + "dieyong_juedou.mp3").play();
							}
							await player.useCard({ name }, event.targets);
						},
						ai: {
							order: 13,
							result: {
								target(player, target) {
									if (!ui.selected.cards.length) return 0;
									const color = get.color(ui.selected.cards[0], player);
									return color == "red" ? 5 : get.effect(target, { name: "juedou" }, player, target);
								},
							},
						},
						subSkill: {
							used: {
								charlotte: true,
								intro: {
									content: "本回合已选择过颜色：$",
								},
								onremove: true,
							},
						},
					},
					rs_linyun: {
						audio: "ext:starlight/audio/skill:true",
						limited: true,
						trigger: {
							global: "dyingBegin",
						},
						check(event, player) {
							return get.attitude(player, event.player) > 0;
						},
						filter(event, player) {
							return event.player.group == player.group;
						},
						skillAnimation: true,
						async content(event, trigger, player) {
							player.awakenSkill(event.name);
							player.addSkill("rs_linyunEffect");
							await trigger.player.recover();
						},
					},
					rs_linyunEffect: {
						mod: {
							suit(card) {
								if (card.suit == "heart" || card.suit == "diamond") {
									return "spade";
								}
							},
						},
					},
					rs_ranying: {
						audio: "ext:starlight/audio:2",
						enable: "phaseUse",
						usable: 4,
						ai: {
							order: 10,
							result: {
								player(player) {
									if (player.getHistory("useSkill", evt => evt.skill == "rs_ranying").length >= 3) {
										return 0;
									}
									if (player.countCards("h", c => player.hasUseTarget(c, true, true) && player.getUseValue(c) > 0) > 0) {
										return 0;
									}
									return 2;
								},
							},
						},
						async content(event, trigger, player) {
							await player.draw();
							await player.showHandcards();
							const remain = 4 - player.getHistory("useSkill", evt => evt.skill == "rs_ranying").length;
							if ([...new Set(player.getCards("h").map(c => get.suit(c, player)))].length <= remain) return;
							const result = await player
								.chooseCard("h", [1, Infinity], `###染樱###请弃置手牌至仅剩${remain}种花色！`, true)
								.set("ai", card => {
									const { player, goNum } = get.event();
									const cards = player.getCards("h");
									const suitMap = cards.reduce((map, card) => {
										const suit = get.suit(card, player);
										if (!map[suit]) map[suit] = [];
										map[suit].push(card);
										return map;
									}, {});
									const needRemove = Object.keys(suitMap).length - goNum;
									const suits = Object.keys(suitMap)
										.sort((a, b) => suitMap[a].length - suitMap[b].length)
										.slice(0, needRemove);
									const cards2 = suits.reduce((list, suit) => list.concat(suitMap[suit]), []);
									return cards2.includes(card) ? 10 : 0;
								})
								.set("filterOk", () => {
									const { player, goNum } = get.event();
									const cards = player.getCards("h", c => !ui.selected.cards.includes(c));
									return [...new Set(cards.map(c => get.suit(c, player)))].length == goNum;
								})
								.set("goNum", remain)
								.forResult();
							await player.discard(result.cards);
						},
						manualConfirm: true,
					},
					rs_exi: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							global: ["phaseAnyEnd"],
						},
						filter(event, player) {
							let count = 0;
							game.getGlobalHistory("everything", evt => {
								if (evt.getParent(event.name) !== event || evt.name != "gain" || evt.player != player) {
									return;
								}
								count += evt.cards.length;
							});
							return count == 1;
						},
						async cost(event, trigger, player) {
							event.result = await player
								.chooseTarget("###恶戏###是否摸三张牌并将三张牌扣置在一名角色前", (card, player, target) => {
									return !player.getStorage("rs_exi_used").includes(target);
								})
								.set("ai", target => {
									const player = get.player();
									return get.attitude(player, target) + 1;
								})
								.forResult();
						},
						async content(event, trigger, player) {
							const target = event.targets[0];
							player.markAuto("rs_exi_used", [target]);
							player.addTempSkill("rs_exi_used");
							await player.draw(3).forResult();
							const stage1 = await player
								.chooseCard("she", 3, `###恶戏###请将三张牌扣置在${get.translation(target)}前！`, true)
								.set("ai", card => {
									const cards = ui.selected.cards;
									if (!cards.length) return 7 - get.value(card);
									return get.color(card) == get.color(cards[0]) ? 8.5 - get.value(card) : 7 - get.value(card);
								})
								.set("complexCard", true)
								.forResult();
							const cards = stage1.cards;
							const removed = [];
							const dialog = ["恶戏：请选择亮出两张牌"];
							if (player != target) {
								dialog.push([cards, "blank"]);
							} else {
								dialog.push([cards]);
							}
							const next = await target
								.chooseButton(dialog, Math.min(2, cards.length), true, `恶戏：请亮出两张牌！`)
								.set("isM", target == player)
								.set("ai", button => {
									const isM = _status.event.isM;
									if (!isM) return Math.random();
									const map = {};
									cards.forEach(card => {
										const color = get.color(card);
										map[color] ??= [];
										map[color].push(card);
									});
									const sameColor = Object.values(map).find(list => list.length >= 2);
									if (!sameColor) return Math.random();
									return sameColor.includes(button.link) ? 10 : 0;
								})
								.forResult();
							const showCards = next.links;
							const hiddenCards = cards.slice().removeArray(showCards);
							let damage = false;
							if (showCards.length) {
								await player.showCards(showCards, `${get.translation(target)}亮出的牌`);
							}
							if (showCards.length >= 2 && get.color(showCards[0]) == get.color(showCards[1])) {
								if (showCards.some(card => target.hasUseTarget(card, true, false))) {
									const use = await target
										.chooseButton(true, [ "恶戏：请选择使用其中一张牌", showCards])
										.set("filterButton", button => {
											return get.player().hasUseTarget(button.link, true, false);
										})
										.set("ai", button => get.player().getUseValue(button.link))
										.forResult();
									if (use.bool) {
										await target.chooseUseTarget(use.links[0], true, false);
										removed.push(use.links[0]);
										showCards.remove(use.links[0]);
									}
								} else {
									damage = true;
								}
							} else {
								damage = true;
							}
							if (damage) {
								if (hiddenCards.length) {
									await target.gain(hiddenCards, player, "giveAuto");
									removed.push(...hiddenCards);
								}
								await target.damage("fire", player);
							}
							if (cards.length > removed.length) {
								await player.loseToDiscardpile(cards.filter(card => !removed.includes(card)));
							}
						},
						subSkill: {
							used: {
								charlotte: true,
								onremove: true,
								intro: {
									content: "本回合已选择过：$",
								},
							},
						},
					},
					rs_xiaying: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "phaseDrawBegin2",
						},
						filter(event, player) {
							return event.num > 0;
						},
						async cost(event, trigger, player) {
							const result = await player
								.chooseNumbers("黠樱", [{ prompt: "请选择少摸的牌数", min: 1, max: trigger.num }])
								.set("processAI", () => {
									const trigger = get.event().getTrigger();
									if (trigger.num <= 1) return false;
									return [trigger.num - 1];
								})
								.forResult();
							event.result = {
								bool: result.bool,
								cost_data: result.numbers?.[0],
							};
						},
						async content(event, trigger, player) {
							const num = event.cost_data;
							trigger.num -= num;
							player.addMark("rs_xiaying_draw", num, false);
							player.addTempSkill("rs_xiaying_draw", { player: "phaseAfter" });
						},
						subSkill: {
							draw: {
								intro: {
									content: "结束阶段摸#张牌",
								},
								trigger: {
									player: "phaseJieshuBegin",
								},
								forced: true,
								onremove: true,
								filter(event, player) {
									return player.countMark("rs_xiaying_draw") > 0;
								},
								async content(event, trigger, player) {
									const num = player.countMark("rs_xiaying_draw");
									await player.draw(num);
								},
							},
						},
					},
					rs_huangni: {
						audio: "ext:starlight/audio/skill:true",
						group: ["rs_huangni_reset"],
						subSkill: {
							reset: {
								trigger: {
									global: "phaseChange",
								},
								charlotte: true,
								silent: true,
								async content(event, trigger, player) {
									player.storage.rs_huangni_used = false;
								},
							},
						},
						trigger: {
							global: "drawBegin",
						},
						filter(event, player) {
							if (player.storage.rs_huangni_used || event.parent.name != "recast") return false;
							return !event.getParent(2).name.endsWith("_recast") && !event.getParent(2).name.endsWith("_recasting");
						},
						async cost(event, trigger, player) {
							const result = await player
								.chooseControl(["加一", "减一", "cancel2"])
								.set("prompt", `###皇逆###是否令${get.translation(trigger.player)}本次重铸摸牌的数量+1或-1？`)
								.set("goon", get.attitude(player, trigger.player) > 0 ? "加一" : "减一")
								.set("ai", () => {
									return _status.event.goon;
								})
								.forResult();
							event.result = {
								bool: result.control != "cancel2",
								cost_data: result.control,
								targets: [trigger.player],
							};
						},
						async content(event, trigger, player) {
							const control = event.cost_data;
							if (control == "加一") {
								trigger.num++;
							} else {
								trigger.num--;
								if (trigger.num == 0) {
									trigger.cancel();
								}
							}
							player.storage.rs_huangni_used = true;
						},
					},
					rs_wangying: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						usable: 1,
						filterTarget(card, player, target) {
							return target.countCards("he") > 0;
						},
						filter(event, player, name) {
							const currentName = !name ? "chooseToUse" : name;

							const storage = player.getStorage("rs_wangying_used");

							if (storage.length >= 2 && !storage.includes(currentName)) return false;

							return true;
						},
						trigger: {
							player: ["phaseJieshuBegin", "damageAfter"],
						},
						async cost(event, trigger, player) {
							event.result = await player
								.chooseTarget(`###王樱###是否与一名角色依次重铸一张牌？`, (card, player, target) => {
									return target.countCards("he") > 0;
								})
								.set("ai", target => {
									return 100 + get.attitude(get.player(), target);
								})
								.forResult();
						},
						async content(event, trigger, player) {
							const name = !trigger ? "chooseToUse" : event.triggername;
							const target = event.targets?.[0] ? event.targets[0] : event.target;
							player.markAuto("rs_wangying_used", name);
							player.addTempSkill("rs_wangying_used", "roundStart");
							for (const pl of [player, target]) {
								const result = await pl
									.chooseCard("he", `###王樱###请重铸一张牌！`, true)
									.set("ai", card => 100 - get.value(card))
									.forResult();
								if (result.bool) {
									await pl.recast(result.cards);
								}
							}
						},
						subSkill: {
							used: {
								charlotte: true,
								intro: {
									content(s, player) {
										let str = "本回合触发过时机：";
										let strl = [];
										if (s.includes("chooseToUse")) strl.push("出牌阶段");
										if (s.includes("phaseJieshuBegin")) strl.push("结束阶段");
										if (s.includes("damageAfter")) strl.push("受到一点伤害后");
										str += strl.join("、");
										return str;
									},
								},
								onremove: true,
							},
						},
						ai: {
							order: 9,
							result: {
								player: 5,
							},
						},
					},
					rs_canqiao: {
						audio: false, 
						hiddenCard(player, name) {
							return (name == "sha" || name == "shan") && !player.getHistory("useSkill", evt => evt.skill == "rs_canqiao").length;
						},
						enable: ["chooseToUse", "chooseToRespond"],
						filter(event, player) {
							for (const name of ["sha", "shan"]) {
								if (event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) return true;
								// if (name == "sha") {
								// 	for (const j of lib.inpile_nature) {
								// 		if (event.filterCard(get.autoViewAs({ name: name, nature: j }, "unsure"), player, event)) return true;
								// 	}
								// }
							}
							return false;
						},
						usable: 1,
						chooseButton: {
							dialog(event, player) {
								const list = [];
								for (const name of ["sha", "shan"]) {
									if (event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) list.push(["basic", "", name]);
								}
								return ui.create.dialog("灿鞘", [list, "vcard"]);
							},
							filter(button, player) {
								return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
							},
							check(button) {
								if (_status.event.getParent().type != "phase") return 1;
								const player = _status.event.player;
								return player.getUseValue({ name: button.link[2], nature: button.link[3] });
							},
							backup(links) {
								return {
									filterCard: false,
									selectCard: 0,
									viewAs: { name: links[0][2], nature: links[0][3] },
									async precontent(event, _, player) {
										const extPath = lib.assetURL + "extension/starlight/audio/";
										new Audio(extPath + "canqiao.mp3").play();
										const name = event.result.card.name;
										const controls = ["选项一", "选项二", "选项三", "选项四"];
										const list = ["受到一点雷电伤害", "令当前回合角色摸两张牌", "重铸三种类型的牌", "展示四张不同花色的手牌"];
										const types = [...new Set(player.getCards("she").map(c => get.type2(c)))].length;
										const suits = [...new Set(player.getCards("hs").map(c => get.suit(c)))].length;
										if (types < 3) {
											controls.remove("选项三");
											list[2] = `<span style="opacity:0.5">${list[2]}</span>`;
										}
										if (suits < 4) {
											controls.remove("选项四");
											list[3] = `<span style="opacity:0.5">${list[3]}</span>`;
										}
										const result = await player
											.chooseControl(controls)
											.set("prompt", `灿鞘：请选择一项！`)
											.set("choiceList", list)
											.set(
												"goon",
												(() => {
													if (get.attitude(player, _status.currentPhase) > 0) return "选项二";
													if (controls.includes("选项四")) return "选项四";
													if (controls.includes("选项三")) return "选项三";
													return "选项一";
												})()
											)
											.set("ai", () => {
												return _status.event.goon;
											})
											.forResult();
										if (result.control == "选项一") {
											await player.damage("thunder", "nosource");
										} else if (result.control == "选项二") {
											await _status.currentPhase.draw(2);
										} else if (result.control == "选项三") {
											const next = await player
												.chooseCard("she", [3, Infinity], "###灿鞘###请重铸三种类型的牌！", true)
												.set("ai", card => {
													return 100 - get.value(card);
												})
												.set("complexCard", true)
												.set("filterOk", () => {
													return [...new Set(ui.selected.cards.map(c => get.type2(c)))].length == 3;
												})
												.forResult();
											next.bool && (await player.recast(next.cards));
										} else {
											const next = await player
												.chooseCard("hs", 4, "###灿鞘###请展示四张不同花色的手牌！", true)
												.set("ai", card => {
													const top = get.event().top || [];
													return top.includes(card) ? 10 : 0;
												})
												.set(
													"top",
													(() => {
														const cards = player.getCards("hs");
														const suitMap = {};
														cards.forEach(card => {
															const suit = get.suit(card);
															if (!suitMap[suit] || get.value(card) < get.value(suitMap[suit])) {
																suitMap[suit] = card;
															}
														});
														return Object.values(suitMap);
													})()
												)
												.set("complexCard", true)
												.set("filterOk", () => {
													return [...new Set(ui.selected.cards.map(c => get.suit(c)))].length == 4;
												})
												.forResult();
											next.bool && (await player.showCards(next.cards));
										}
									},
								};
							},
							prompt(links, player) {
								return "视为使用或打出" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
							},
						},
						ai: {
							order() {
								const player = get.player();
								return player.isPhaseUsing() ? get.order({ name: "sha" }) + 0.1 : 15;
							},
							result: {
								player: 5,
							},
							respondSha: true,
							respondShan: true,
							skillTagFilter(player, tag) {
								return !player.getHistory("useSkill", evt => evt.skill == "rs_canqiao").length;
							},
						},
						group: ["rs_canqiao_use"],
						subSkill: {
							use: {
								trigger: {
									source: "damageBegin",
								},
								filter(event, player) {
									return event.parent.skill == "rs_canqiao_backup" && event.num > 0;
								},
								charlotte: true,
								direct: true,
								async content(event, trigger, player) {
									trigger.num--;
								},
							},
						},
					},
					rs_jueying: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							global: ["chooseToRespondBegin", "chooseToUseBegin"],
						},
						usable: 1,
						filter(event, player) {
							if (event.getParent("jiadao")) return false;
							if (event.responded || !event.respondTo || !event.respondTo?.[0] || !event.respondTo?.[1]) return false;
							if (event.player == player || !player.inRange(event.player)) return false;
							if (typeof event.filterCard != "function") return false;
							if (player.hasCard(card => event.filterCard(card, player, event) && lib.filter.cardRespondable(card, player, event), "hs")) return true;
							const checkEnable = (enable, event, evtName) => {
								if (typeof enable == "function") return enable(event);
								if (Array.isArray(enable)) return enable.some(i => checkEnable(i, event, evtName));
								if (typeof enable == "string") return enable == evtName;
								return false;
							};
							const cards = [];
							for (const name of lib.inpile) {
								cards.push({ name });
								if (name == "sha") {
									for (const nature of lib.inpile_nature) cards.push({ name, nature });
								}
							}
							const skills = player.getSkills("invisible").concat(lib.skill.global);
							game.expandSkills(skills);
							return skills.some(skill => {
								const info = get.info(skill);
								if (!info || !checkEnable(info.enable, event, "chooseToRespond")) return false;
								if (info.usable !== undefined) {
									let num = info.usable;
									if (typeof num == "function") num = num(skill, player);
									if (typeof num == "number" && get.skillCount(skill, player) >= num) return false;
								}
								if (info.round && info.round - (game.roundNumber - player.storage[skill + "_roundcount"]) > 0) return false;
								if (player.storage[`temp_ban_${skill}`]) return false;
								if (info.viewAs && get.is.object(info.viewAs)) {
									const card = get.autoViewAs(info.viewAs, "unsure");
									if (info.viewAsFilter && info.viewAsFilter(player) === false) return false;
									if (!event.filterCard(card, player, event)) return false;
									return !info.filter || (typeof info.filter == "function" && info.filter(event, player, event.triggername));
								}
								if (typeof info.hiddenCard == "function") {
									if (!cards.some(card => info.hiddenCard(player, card.name) && event.filterCard(get.autoViewAs(card, "unsure"), player, event))) return false;
									return !info.filter || (typeof info.filter == "function" && info.filter(event, player, event.triggername));
								}
								return false;
							});
						},
						async cost(event, trigger, player) {
							const target = trigger.player;
							const next = player.chooseToRespond({
								prompt: `###决樱###是否代替${get.translation(target)}响应牌？（${get.translation(trigger.respondTo[1])}）`,
								filterCard(card, player) {
									const trigger = get.event().getTrigger();
									return trigger.filterCard(card, player, trigger);
								},
							});
							next.set("source", target);
							next.set("skillwarn", `代替${get.translation(target)}响应牌`);
							next.set("ai", card => {
								const { player, source } = get.event();
								if (get.attitude(player, source) <= 0) return 0;
								return 7.5 - get.value(card);
							});
							const result = await next.forResult();
							event.result = {
								bool: result.bool,
								cost_data: result,
								cards: [result.card],
							};
						},
						async content(event, trigger, player) {
							const result = event.cost_data;
							const card = get.copy(result.card || {});
							trigger.result = { bool: true, card, cards: result.cards || [] };
							trigger.responded = true;
							trigger.animate = false;
							if (typeof player.ai.shown == "number" && player.ai.shown < 0.95) {
								player.ai.shown += 0.3;
								if (player.ai.shown > 0.95) {
									player.ai.shown = 0.95;
								}
							}
						},
					},
					rs_youmian: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						usable: 1,
						filterTarget(card, player, target) {
							return !target.hasJudge("lebu") && target.countCards("he") > 0;
						},
						async content(event, trigger, player) {
							const target = event.target;
							const result = await target
								.chooseCard("he", c => get.type2(c) != "trick", `###游眠###是否将一张非锦囊牌当【乐不思蜀】对自己使用，然后将手牌摸至四张？`)
								.set("ai", card => {
									const target = get.player();
									if (player.hasSkill("rs_yeying") && 3 - player.countCards("h") >= 0) {
										return 7 - get.value(card);
									}
									const drawNum = Math.max(0, 4 - (target.countCards("h") - 1));
									if (drawNum > 0) {
										return 7 - get.value(card);
									}
									return 0;
								})
								.forResult();
							if (result.bool) {
								await target.useCard({ name: "lebu" }, result.cards, target);
								const num = 4 - target.countCards("h");
								if (num > 0) await target.drawTo(4);
							}
						},
						ai: {
							order: 1,
							result: {
								target(player, target) {
									if (get.attitude(player, target) <= 0) return 0;
									if (player == target) {
										return 3 - player.countCards("h");
									}
									return Math.max(0, 4 - target.countCards("h") - 1) - 2.5;
								},
							},
						},
					},
					rs_yeying: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "phaseChange",
						},
						filter(event, player) {
							if ((event.phaseList?.[event.num] || "").split("|")[0] != "phaseJieshu") return false;
							return game.hasPlayer(current => current.countCards("ej") > 0);
						},
						async cost(event, trigger, player) {
							const dialog = ui.create.dialog("夜樱：选择获得并使用一张场上的牌", "hidden");
							game.filterPlayer(current => current.countCards("ej") > 0).forEach(current => {
								dialog.addText(get.translation(current));
								dialog.add(current.getCards("ej"));
							});
							const result = await player
								.chooseButton(dialog)
								.set("ai", button => {
									const player = get.player();
									const card = button.link;
									const owner = get.owner(card);
									const pos = get.position(card);
									const att = get.attitude(player, owner);
									if (pos == "j") return att > 0 ? 15 : 0;
									return att > 0 ? 0 : player.getUseValue(card);
								})
								.forResult();
							event.result = {
								bool: result.bool,
								cards: result.links,
							};
						},
						async content(event, trigger, player) {
							const cards = event.cards?.length ? event.cards : event.cards?.[0]?.cards;
							const num = player.countCards("hes");
							if (cards?.length > 0) {
								const cards2 = cards[0].cards?.length ? cards[0].cards : cards;
								await player.gain(cards2, "gain2");
								for (const card of cards2) {
									if (card._name) card.name = card._name;
                                    if (card._nature) card.nature = card._nature;
									if (player.hasUseTarget(card, true, false)) {
										await player.chooseUseTarget(card, true, false);
									}
								}
							}
							const phaseMap = {
								phaseZhunbei: "准备阶段",
								phaseJudge: "判定阶段",
								phaseDraw: "摸牌阶段",
								phaseUse: "出牌阶段",
								phaseDiscard: "弃牌阶段",
							};
							const controls = Object.keys(phaseMap);
							const result = await player
								.chooseControl(controls)
								.set("prompt", "夜樱：请选择将结束阶段改为的阶段")
								.set("choiceList", Object.values(phaseMap))
								.set("ai", () => {
									return "phaseDraw";
								})
								.forResult();
							trigger.phaseList[trigger.num] = `${result.control}|${event.name}`;
							game.log(player, "将结束阶段改为了", `#y${phaseMap[result.control]}`);
							if (player.countCards("hes") > num) {
								player.addTempSkill("rs_yeying_limit", {
									player: ["phaseChange", "phaseAfter"],
								});
							}
						},
						subSkill: {
							limit: {
								charlotte: true,
								mark: true,
								intro: {
									content: "此阶段不能获得与使用牌",
								},
								mod: {
									cardEnabled() {
										return false;
									},
									cardSavable() {
										return false;
									},
								},
								trigger: {
									player: "gainBefore",
								},
								forced: true,
								firstDo: true,
								silent: true,
								filter(event, player) {
									return event.cards?.length > 0;
								},
								async content(event, trigger, player) {
									trigger.cancel();
									await game.cardsDiscard(trigger.cards);
								},
							},
						},
					},
					rs_yueyue: {
						audio: "ext:starlight/audio:2",
						trigger: {
							player: "phaseChange",
						},
						async cost(event, trigger, player) {
							const phaseIndex = trigger.num + 1;
							event.result = await player
								.chooseToUse(`###跃月###此阶段为本回合第${phaseIndex}个阶段（${get.translation(trigger.phaseList[phaseIndex - 1])}），是否使用一张牌？`)
								.set("chooseonly", true)
								.forResult();
						},
						async content(event, trigger, player) {
							const { result } = event.cost_data;
							await player.useResult(result, event);
							const phaseIndex = trigger.num + 1;
							const nameLength = get.translation(result.card.name).length;

							const phaseId = trigger.phaseList[phaseIndex - 1];
							player.markAuto("rs_pojing", phaseId);
							if (phaseIndex == nameLength) {
								const result = await player
									.chooseBool(`###跃月###此阶段为本回合第${phaseIndex}个阶段（${get.translation(phaseId)}），是否摸一张牌并跳过此阶段？`)
									.set("ai", () => () => true)
									.forResult();
								if (result.bool) {
									await player.draw();
									player.when(phaseId + "Begin").then(() => {
										trigger.cancel();
									});
								}
							} else {
								player.tempBanSkill("rs_yueyue", "roundStart");
							}
						},
						group: ["rs_yueyue_clear"],
						subSkill: {
							clear: {
								silent: true,
								charlotte: true,
								trigger: {
									player: "phaseAfter",
								},
								filter(event, player) {
									return player.getStorage("rs_pojing").length > 0;
								},
								async content(event, trigger, player) {
									player.unmarkAuto("rs_pojing", player.getStorage("rs_pojing"));
								},
							},
						},
					},
					rs_pojing: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "phaseEnd",
						},
						filter(event, player) {
							return player.getStorage("rs_pojing").length > 0;
						},
						intro: {
							content: "“破境”回合拥有：$",
						},
						async cost(event, trigger, player) {
							event.result = await player
								.chooseTarget(`###破境###是否令一名角色执行一个特殊回合（${get.translation(player.getStorage("rs_pojing"))}）。`)
								.set("ai", target => {
									const player = get.player();
									return get.attitude(player, target);
								})
								.forResult();
						},
						async content(event, trigger, player) {
							const next = event.targets[0].insertPhase();
							next.phaseList = player.getStorage("rs_pojing").slice();
							player.tempBanSkill("rs_pojing", "roundStart");
						},
					},
					rs_shixin: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "phaseDrawBegin",
						},
						async cost(event, trigger, player) {
							event.result = await player
								.chooseTarget("###识心###是否弃置一名角色一张牌？", (card, player, target) => {
									return target.countDiscardableCards(player, "he") > 0;
								})
								.set("ai", target => {
									const player = get.player();
									return get.effect(target, { name: "guohe_copy2" }, player, player);
								})
								.forResult();
						},
						async content(event, trigger, player) {
							// 懒得优化了
							const target = event.targets[0];
							const allTargets = [target];
							const result1 = await player.discardPlayerCard(target, "he", true).forResult();
							if (!game.hasPlayer(p => p != target && p.countCards("he") > 0)) {
								if (!allTargets.includes(player)) {
									trigger.cancel();
								}
								return;
							}
							const result2 = await player
								.chooseTarget(
									"###识心###请令一名角色重铸一张牌",
									(card, player, target) => {
										return target.countCards("hej") > 0 && target != get.event().banTarget;
									},
									true
								)
								.set("banTarget", target)
								.set("ai", target => {
									const player = get.player();
									return get.attitude(player, target);
								})
								.forResult();

							if (result2.bool) {
								const target2 = result2.targets[0];
								// allTargets.push(target2);
								const result3 = await target2
									.chooseCard("he", true, `###识心###请选择一张牌重铸！`)
									.set("ai", card => {
										return 100 - get.value(card);
									})
									.forResult();
								await target2.recast(result3.cards);

								if (result1.bool) {
									const card = result1.cards.filter(card => get.type(card) != "equip" && target.hasUseTarget(card, true, true))?.[0];
									if (card) {
										await target.chooseUseTarget(card, false);
									}
								}
								if (result3.bool) {
									const card = result3.cards.filter(card => get.type(card) != "equip" && target2.hasUseTarget(card, true, true))?.[0];
									if (card) {
										await target2.chooseUseTarget(card, false);
									}
								}
							}
							if (!allTargets.includes(player)) {
								trigger.cancel();
							}
						},
					},
					rs_xiejing: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							global: "phaseEnd",
						},
						filter(event, player) {
							return player.getStorage("rs_xiejing_isTrue").length > 0;
						},
						logTarget: "player",
						check(event, player) {
							// const storage = player.getStorage("rs_xiejing_isTrue");
							const att = get.attitude(player, event.player);
							// if (storage.length == 1 && (storage[0] == "phaseDiscard" || storage[0] == "phaseJudge")) return att <= 0;
							// if (storage.length == 2 && storage.every(p => p == "phaseDiscard" || p == "phaseJudge")) return att <= 0;
							return att > 0;
						},
						prompt2(event, player) {
							return `是否令${get.translation(event.player)}选择一个阶段执行？`;
						},
						async content(event, trigger, player) {
							const current = trigger.player;
							// const storage = player.getStorage("rs_xiejing_isTrue");
							player.unmarkAuto("rs_xiejing_isTrue", player.getStorage("rs_xiejing_isTrue"));
							const storage = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
							const result = await current
								.chooseControl(storage)
								.set("prompt", "###谐境###选择一个阶段执行！")
								.set("ai", () => {
									const controls = get.event().controls;
									if (controls.includes("phaseDraw")) return "phaseDraw";
									if (controls.includes("phaseUse")) return "phaseUse";
									if (controls.includes("phaseJieshu")) return "phaseJieshu";
									if (controls.includes("phaseZhunbei")) return "phaseZhunbei";
									return controls[0];
								})
								.forResult();
							const phase = result.control;
							for (const target of game.filterPlayer()) {
								target.addTempSkill("baiban", "phaseChange");
							}
							await current[phase]();
						},
						group: ["rs_xiejing_isTrue"],
						subSkill: {
							isTrue: {
								trigger: {
									global: ["phaseZhunbeiSkipped", "phaseZhunbeiCancelled", "phaseJudgeSkipped", "phaseJudgeCancelled", "phaseDrawSkipped","phaseDrawCancelled", "phaseUseSkipped",  "phaseUseCancelled","phaseDiscardSkipped", "phaseDiscardCancelled", "phaseJieshuSkipped", "phaseJieshuCancelled", "phaseAfter"],
								},
								silent: true,
								charlotte: true,
								async content(event, trigger, player) {
									if (event.triggername == "turnStart") {
                                    player.unmarkAuto("rs_xiejing_isTrue", player.getStorage("rs_xiejing_isTrue"));
                                    return;
                                    }
									if (event.triggername == "phaseAfter") {
										player.unmarkAuto("rs_xiejing_isTrue", player.getStorage("rs_xiejing_isTrue"));
										return;
									}
									player.markAuto("rs_xiejing_isTrue", event.triggername.slice(0, -7));
								},
								intro: {
									content: "本回合可以发动“谐境”",
								},
							},
						},
					},
					rs_jiancan: {
						audio: false,
						enable: ["chooseToUse"],
						filter(event, player) {
							if (event.filterCard(get.autoViewAs({ name: "juedou" }, "unsure"), player, event) && player.countCards("she", c => get.type2(c) == "trick")) return true;
							if (event.filterCard(get.autoViewAs({ name: "jiu" }, "unsure"), player, event) && player.countCards("she", "sha")) return true;
							return false;
						},
						hiddenCard(player, name) {
							const names = [];
							player.countCards("she", c => get.type2(c) == "trick") && names.push("juedou");
							player.countCards("she", "sha") && names.push("jiu");
							return names.includes(name);
						},
						chooseButton: {
							dialog(event, player) {
								const list = [];
								if (event.filterCard(get.autoViewAs({ name: "juedou" }, "unsure"), player, event) && player.countCards("she", c => get.type2(c) == "trick")) {
									list.push(["trick", "", "juedou"]);
								}
								if (event.filterCard(get.autoViewAs({ name: "jiu" }, "unsure"), player, event) && player.countCards("she", "sha")) {
									list.push(["basic", "", "jiu"]);
								}
								return ui.create.dialog("见参", [list, "vcard"]);
							},
							filter(button, player) {
								return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
							},
							check(button) {
								if (_status.event.getParent().type != "phase") return 1;
								return get.player().getUseValue({ name: button.link[2] });
							},
							backup(links) {
								return {
									filterCard(card, player) {
										const name = lib.skill.rs_jiancan_backup.rule;
										return name == "jiu" ? card.name == "sha" : get.type2(card) == "trick";
									},
									selectCard: 1,
									check(card) {
										return 7 - get.value(card);
									},
									position: "she",
									viewAs: { name: links[0][2] },
									rule: links[0][2],
									async precontent(event, trigger, player) {
										const name = lib.skill.rs_jiancan_backup.rule;
										const skill = name == "jiu" ? "rs_jiancan_rule1" : "rs_jiancan_rule2";
										player.addTempSkill(skill);
										const extPath = lib.assetURL + "extension/starlight/audio/";
										if (name == "jiu") {
											new Audio(extPath + "rs_jiancan_jiu.mp3").play();
										} else {
											new Audio(extPath + "rs_jiancan_juedou.mp3").play();
										}

										const me = player;
										player
											.when("useCardAfter")
											.filter((evt, player) => {
												return evt.skill == "rs_jiancan_backup";
											})
											.step(() => {
												me.removeSkill(skill);
											});
									},
								};
							},
							prompt(links) {
								const rule = links[0];
								if (rule == "rule1") {
									return "将一张锦囊牌当【决斗】使用（【杀】视为【酒】的规则生效）";
								} else {
									return "请将一张按以下规则使用（另一项规则在其结算中生效）";
								}
							},
						},
						ai: {
							order: 10,
							result: {
								player(player) {
									if (_status.event.dying) return get.attitude(player, _status.event.dying);
									return 1;
								},
							},
						},
						subSkill: {
							rule1: {
								charlotte: true,
								mod: {
									cardname(card) {
										const bool = lib.card?.[card.name]?.type == "trick" || lib.card?.[card.name]?.type == "delay";
										if (bool) return "juedou";
									},
								},
							},
							rule2: {
								charlotte: true,
								mod: {
									cardname(card) {
										if (card.name == "sha") return "jiu";
									},
								},
							},
						},
					},
					rs_ruijing: {
						audio: "ext:starlight/audio/skill:true",
						ai: {
							order() {
								return _status.currentPhase != get.player() ? 20 : 1;
							},
							result: {
								player(player) {
									return 3 - player.countCards("h");
								},
							},
						},
						group: ["rs_ruijing_clear"],
						subSkill: {
							clear: {
								trigger: {
									player: ["dyingAfter", "die"],
								},
								silent: true,
								charlotte: true,
								filter(event, player) {
									return game.hasPlayer(p => p.hasSkill("rs_ruijing_ban"));
								},
								async content(event, trigger, player) {
									for (const target of game.filterPlayer()) {
										target.removeSkill("rs_ruijing_ban");
									}
								},
							},
							ban: {
								charlotte: true,
								mod: {
									cardEnabled(card, player) {
										if (card.name == "tao") return false;
									},
									cardSavable(card, player) {
										if (card.name == "tao") return false;
									},
								},
								mark: true,
								intro: {
									content: "本次濒死结算中无法使用【桃】",
								},
							},
						},
						trigger: {
							player: ["phaseZhunbeiBegin", "phaseJudgeBegin", "phaseDrawBegin", "phaseUseBegin", "phaseDiscardBegin", "phaseJieshuBegin", "dying"],
						},
						filter(event, player, name) {
							return true;
						},
						prompt2(event, player, name) {
							if (name == "dying") {
								return `是否跳过本次濒死结算中对【桃】的询问，然后将手牌调整至三张！`;
							}
							const phase = name.slice(0, -5);
							return `是否跳过阶段：${get.translation(phase)}，然后将手牌调整至三张！`;
						},
						usable: 1,
						check(event, player, name) {
							if (name == "dying") {
								return !player.getFriends(true).some(p => p.countCards("sh", "tao"));
							}
							return player.countCards("h") < 3 && ["phaseJudgeBegin", "phaseDiscardBegin"].includes(name);
						},
						async content(event, trigger, player) {
							const name = event.triggername;
							if (name != "dying") {
								trigger.cancel();
								const hs = player.countCards("h");
								if (hs > 3) {
									await player.chooseToDiscard("h", hs - 3, true);
								} else if (hs < 3) {
									await player.draw(3 - hs);
								}
							} else {
								for (const target of game.filterPlayer()) {
									target.addTempSkill("rs_ruijing_ban", "dyingAfter");
								}
								const hs = player.countCards("h");
								if (hs > 3) {
									await player.chooseToDiscard("h", hs - 3, true);
								} else if (hs < 3) {
									await player.draw(3 - hs);
								}
							}
						},
					},
					rs_yueyong: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "phaseZhunbeiBegin",
						},
						async cost(event, trigger, player) {
							const currentNum = trigger.getParent("phase").num;
							const phaseList = trigger.getParent("phase").phaseList;
							const afterPhaseList = phaseList.slice(currentNum + 1);
							if (afterPhaseList.length == 0) {
								event.result = { bool: false };
								return;
							}
							const before2Phases = afterPhaseList.slice(0, 2);
							const after2Phases = afterPhaseList.slice(-2);
							const dialog = ui.create.dialog(
								"跃踊：请选择要跳过的阶段",
								[
									before2Phases.map(phase => {
										return [phase, `${get.translation(phase)}　　　　　　`];
									}),
									"tdnodes",
								],
								[
									after2Phases.map(phase => {
										return [phase, `${get.translation(phase)}　　　　　　`];
									}),
									"tdnodes",
								]
							);
							const result = await player
								.chooseButton(dialog, [1, 2])
								.set("filterButton", button => {
									const buttons = ui.selected.buttons;
									const { player, before2Phases, after2Phases } = get.event();
									const num = player.countCards("hes");
									if (!buttons.length) {
										if (button.link == "phaseDraw" || button.link == "phaseDiscard") return false;
										
										if (before2Phases.includes(button.link)) return true;
										return num > 0;
									}
									if (buttons.includes(button)) return false;
									if (buttons.length == 1) {
										const must = [...buttons[0].parentElement.childNodes].includes(button);
										if (!must) return false;
										if (before2Phases.includes(button.link)) {
											return true;
										}
										return num > 1;
									}
									return false;
								})
								.set("before2Phases", before2Phases)
								.set("after2Phases", after2Phases)
								.set("ai", button => {
									if (button.link == "phaseJudge" || button.link == "phaseDraw") return 6;
									return 0;
								})
								.forResult();
							event.result = {
								bool: result.bool,
								cost_data: {
									links: result.links,
									position: result.links.every(link => before2Phases.includes(link)) ? "before" : "after",
								},
							};
						},
						async content(event, trigger, player) {
							const { links, position } = event.cost_data;
							game.log(player, "跳过了阶段", `#y${get.translation(links)}`);
							for (const phase of links) {
								player.skip(phase);
							}
							if (position == "before") {
								await player.draw(links.length);
							} else {
								await player.chooseToDiscard("hes", links.length, true);
							}
							const result = await player
								.chooseTarget(`###跃踊###是否令一名角色在此回合结束后执行一个只有${get.translation(links)}的回合？`)
								.set("forced", true)
								.set("ai", target => {
									const player = get.player();
									return get.attitude(player, target);
								})
								.forResult();
							if (result.bool) {
								const next = result.targets[0].insertPhase();
								next.phaseList = links.slice();
							}
						},
					},
					rs_roujing: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							global: "useCardToTargeted",
						},
						usable: 1,
						filter(event, player) {
							if (event.card.name != "sha") return false;
							const target = event.target;
							return [player.next, player.previous].includes(target);
						},
						async cost(event, trigger, player) {
							const target = trigger.target;
							const controls = ["选项一", "选项二"];
							const list = [`令${get.translation(target)}失去一点体力，此牌对其无效`, `令${get.translation(target)}回复一点体力，此牌对其不可被响应`];
							if (target.isHealthy()) {
								controls.remove("选项二");
								list[1] = `<span style="opacity:0.5">${list[1]}</span>`;
							}
							const result = await player
								.chooseControl(controls, "cancel2")
								.set("prompt", `柔境：是否执行一项？`)
								.set("choiceList", list)
								.set("ai", () => {
									const { player, targetz, controls } = get.event();
									const att = get.attitude(player, targetz);
									if (att > 0) {
										return targetz.isDamaged() ? "选项二" : "cancel2";
									}
									return "选项一";
								})
								.set("targetz", target)
								.forResult();
							event.result = {
								bool: result.control != "cancel2",
								cost_data: result.control,
								targets: [target],
							};
						},
						async content(event, trigger, player) {
							const control = event.cost_data;
							if (control == "选项一") {
								await trigger.target.loseHp();
								trigger.getParent().excluded.add(trigger.target);
							} else {
								await trigger.target.recover();
								trigger.getParent().directHit.add(trigger.target);
							}
						},
					},
					rs_yuxin: {
						audio: "ext:starlight/audio:2",
						trigger: {
							player: ["useSkill", "logSkillBegin", "useCard", "respond"],
						},
						forced: true,
						filter(event, player, name) {
							if (name == "useCard" || name == "respond") {
								return Array.isArray(event.respondTo);
							}
							if (name == "useSkill" || name == "logSkillBegin") {
								if (["global", "equip"].includes(event.type)) {
									return false;
								}
								let skill = get.sourceSkillFor(event);
								if (!skill || skill.startsWith("player_when")) {
									return false;
								}
								let info = get.info(skill);
								if (!info || info.charlotte || info.forced || info.locked) {
									return false;
								}
								return true;
							}
							return false;
						},
						async content(event, trigger, player) {
							await player.draw();
							const lockedSkills = player.getSkills(null, false, false).filter(skill => {
								const info = get.info(skill);
								return info && !info.charlotte && !skill.startsWith("player_when") && (info.forced || info.locked);
							});
							if (lockedSkills.length == 0) return;
							const result = await player
								.chooseControl(lockedSkills)
								.set("prompt", "###御心###选择失去一个锁定技直到回合结束！")
								.set("ai", () => {
									const skills = get.event().controls;
									let minValue = Infinity;
									let minSkill = skills[0];
									for (const skill of skills) {
										const value = get.skillRank(skill, "in") || 0;
										if (value < minValue) {
											minValue = value;
											minSkill = skill;
										}
									}
									return minSkill;
								})
								.forResult();
							player.removeSkill(result.control);
							const me = player;
							const skill = result.control;
							player.when({ global: "phaseAfter" }).step(() => {
								if (skill === "rs_yuxin" || skill === "rs_lianwu") {
									me.addSkill(skill);
								}
							});
						},
					},
					rs_lianwu: {
						forced: true,
						mod: {
							selectTarget(card, player, range) {
								if (card.name == "sha" && (!card.color || get.color(card) == "none") && range[1] != -1) {
									range[1]++;
								}
							},
							targetInRange(card, player, target) {
								if (card.name == "sha" && (!card.color || get.color(card) == "none")) {
									const attackRange = player.getAttackRange();
									const distance = get.distance(player, target, "attack");
									if (attackRange + 1 >= distance) {
										return true;
									}
								}
							},
						},
					},
					rs_zhenjing: {
						audio: "ext:starlight/audio/skill:true",
						enable: ["chooseToUse", "chooseToRespond"],

						usable(skill, player) {
        					if (!player) player = get.player();
        					return player.storage.rs_zhenjing_usable || 0;
    					},

						getLockedSkills(player) {
							if (!player) player = get.player();
							if (!player || !player.getSkills) return [];
							return player.getSkills(null, false, false).filter(skill => {
								const info = get.info(skill);
								return info && !info.charlotte && (info.forced || info.locked);
							});
						},
						filter(event, player) {
							const lockedSkills = lib.skill.rs_zhenjing.getLockedSkills(player);
							if (player.countCards("hs") < lockedSkills.length) return false;
							for (const name of lib.inpile) {
								if (get.type(name) != "basic") continue;
								if (event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) {
									return true;
								}
								if (name == "sha") {
									for (const j of lib.inpile_nature) {
										if (event.filterCard(get.autoViewAs({ name: name, nature: j }, "unsure"), player, event)) return true;
									}
								}
							}
							return false;
						},
						hiddenCard(player, name) {
							const lockedSkills = lib.skill.rs_zhenjing.getLockedSkills(player);
							return get.type(name) == "basic" && player.countCards("hs") >= lockedSkills.length;
						},
						chooseButton: {
							dialog(event, player) {
								const list = [];
								for (const name of lib.inpile) {
									if (get.type(name) != "basic") continue;
									if (event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) {
										list.push(["basic", "", name]);
										if (name == "sha") {
											for (const nature of lib.inpile_nature) {
												if (event.filterCard(get.autoViewAs({ name: name, nature: nature }, "unsure"), player, event)) {
													list.push(["basic", "", name, nature]);
												}
											}
										}
									}
								}
								return ui.create.dialog("臻境", [list, "vcard"]);
							},
							filter(button, player) {
								return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
							},
							check(button) {
								const player = _status.event.player;
								const card = { name: button.link[2], nature: button.link[3] };
								if (_status.event.getParent().type != "phase") return 1;
								return player.getUseValue(card);
							},
							backup(links) {
								const cardName = links[0][2];
								const nature = links[0][3];
								return {
									filterCard: true,
									selectCard() {
										const player = get.player();
										const lockedSkills = lib.skill.rs_zhenjing.getLockedSkills(player);
										return lockedSkills.length;
									},
									check(card) {
										return 6.3 - get.value(card);
									},
									position: "sh",
									viewAs: { name: links[0][2], nature: links[0][3] },
								};
							},
							prompt(links) {
								const player = get.player();
								const lockedSkills = lib.skill.rs_zhenjing.getLockedSkills(player);
								const X = lockedSkills.length;
								return `将${X}张手牌当${get.translation(links[0][3] || "") + get.translation(links[0][2])}${_status.event.getParent().name == "chooseToUse" ? "使用" : "打出"}`;
							},
						},
						
						async content(event, trigger, player) {
							player.storage.rs_zhenjing_usable--;
							player.syncStorage("rs_zhenjing_usable");
						},
						
						ai: {
							order(item, player) {
								const lockedSkills = lib.skill.rs_zhenjing.getLockedSkills(player);
								const X = lockedSkills.length;
								if (X >= 2) return 0.5;
								return 10;
							},
							result: {
								player(player) {
									if (_status.event.dying) return get.attitude(player, _status.event.dying);
									return 1;
								},
							},
							respondSha: true,
							respondShan: true,
							fireAttack: true,
							save: true,
							skillTagFilter(player) {
								const lockedSkills = lib.skill.rs_zhenjing.getLockedSkills(player);
								const X = lockedSkills.length;
								return player.countCards("hs") >= X;
							},
						},
						group: ["rs_zhenjing_recover", "rs_zhenjing_refresh"],
						subSkill: {
							refresh: {
            					trigger: {
                					global: ["gameStart", "phaseZhunbeiBegin", "addSkill"], 
           						},
            					silent: true,
            					charlotte: true,
            					filter(event, player, name) {
                					// 如果是 addSkill 触发，必须判断获得的技能是不是锁定技
                					if (name == "addSkill") {
                    					const skillName = event.skill || event.name;
                    					const info = get.info(skillName);
                    					// 如果不是锁定技，直接返回 false，不处理
                    					return info && !info.charlotte && (info.forced || info.locked);
                					}
                					// 回合开始直接放行
                					return true;
           						},
            					async content(event, trigger, player) {
                					// 重新计算当前的锁定技数量，并直接覆盖 storage
                					const lockedSkills = lib.skill.rs_zhenjing.getLockedSkills(player);
                					player.storage.rs_zhenjing_usable = lockedSkills.length;
                					player.syncStorage("rs_zhenjing_usable");
            					},
        					},
							recover: {
								charlotte: true,
								trigger: {
									source: "recoverBegin",
								},
								silent: true,
								filter(event, player) {
									return event.parent.skill == "rs_zhenjing_backup";
								},
								async content(event, trigger, player) {
									if (!player.hasSkill("rs_zhenjing_flag")) {
										player.addTempSkill("rs_zhenjing_flag");
									} else {
										trigger.cancel();
									}
								},
							},
							flag: {
								charlotte: true,
								intro: {
									content: "本回合无法以此法回复体力",
								},
							},
						},
					},
					rs_kanwei: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						getCanDo(player) {
							const cards = player.getCards("she");
							const storage = player.getStorage("rs_kanwei_used");
							const bool1 = [...new Set(cards.map(c => get.color(c)))].length >= 2 && !storage.includes("选项一");
							const bool2 = [...new Set(cards.map(c => get.type2(c)))].length >= 3 && !storage.includes("选项二");
							const bool3 = [...new Set(cards.map(c => get.suit(c)))].length >= 4 && !storage.includes("选项三");
							return [bool1, bool2, bool3];
						},
						filter(event, player) {
							return lib.skill.rs_kanwei.getCanDo(player).some(v => v);
						},
						ai: {
							order() {
								const player = get.player();
								if (player.hasSkill("rs_kanwei_effect")) return 1;
								const canDo = lib.skill.rs_kanwei.getCanDo(player);
								if (canDo.some(v => v)) return 16;
								return 0;
							},
							result: {
								player: 2,
							},
						},
						async content(event, trigger, player) {
							const keys = ["选项一", "选项二", "选项三"];
							const descList = ["重铸2张不同颜色的牌", "重铸3张不同类型的牌", "重铸4张不同花色的牌"];
							let controls = [...keys];
							let list = [...descList];
							const used = player.getStorage("rs_kanwei_used");
							keys.forEach((key, i) => {
								if (used.includes(key)) {
									controls = controls.filter(k => k !== key);
									list[i] = `<span style="opacity:0.5">${list[i]}</span>`;
								}
							});
							const result =
								controls.length == 1
									? { control: controls[0] }
									: await player
											.chooseControl(controls)
											.set("prompt", "瞰威：请选择一个选项")
											.set("choiceList", list)
											.set("ai", () => {
												return _status.event.controls[0];
											})
											.forResult();
							player.markAuto("rs_kanwei_used", result.control);
							player.addTempSkill("rs_kanwei_used");
							player.removeSkill("rs_kanwei_effect"); 
							player.addTempSkill("rs_kanwei_effect");
							if (result.control == "选项一") {
								player.setStorage("rs_kanwei_effect", 2);
								player.markSkill("rs_kanwei_effect");
								const next = await player
									.chooseCard("she", 2)
									.set("filterCard", card => {
										if (ui.selected.cards.length) {
											return get.color(card) != get.color(ui.selected.cards[0]);
										}
										return true;
									})
									.set("ai", card => {
										return 100 - get.value(card);
									})
									.set("complexCard", true)
									.forResult();
								await player.recast(next.cards);
							} else if (result.control == "选项二") {
								player.setStorage("rs_kanwei_effect", 3);
								player.markSkill("rs_kanwei_effect");
								const next = await player
									.chooseCard("she", 3)
									.set("filterCard", card => {
										const types = ui.selected.cards.map(c => get.type2(c));
										return !types.includes(get.type2(card));
									})
									.set("ai", card => {
										return 100 - get.value(card);
									})
									.set("complexCard", true)
									.forResult();
								await player.recast(next.cards);
							} else {
								player.setStorage("rs_kanwei_effect", 4);
								player.markSkill("rs_kanwei_effect");
								const next = await player
									.chooseCard("she", 4)
									.set("filterCard", card => {
										const suits = ui.selected.cards.map(c => get.suit(c));
										return !suits.includes(get.suit(card));
									})
									.set("ai", card => {
										return 100 - get.value(card);
									})
									.set("complexCard", true)
									.forResult();
								await player.recast(next.cards);
							}
						},
						mod: {
							aiOrder(player, card, num) {
								if (player.hasSkill("rs_kanwei_effect") && (card.name == "sha" || get.type(card) == "trick")) return num + 10;
							},
						},
						subSkill: {
							used: {
								charlotte: true,
								onremove: true,
								intro: {
									content: "本回合执行过选项：$",
								},
							},
							effect: {
								intro: {
									content: "下一张下一张【杀】或普通锦囊牌可以指定#个目标（须合法）",
								},
								onremove: true,
								charlotte: true,
								trigger: {
									player: "useCard2",
								},
								locked: true,
								async cost(event, trigger, player) {
									const maxTargets = player.countMark("rs_kanwei_effect");
									const result = await player
										.chooseTarget(`###瞰威###是否为${get.translation(trigger.card)}改为指定${get.cnNumber(maxTargets)}个目标？`, [1, Infinity], function (card, player, target) {
											const { targets, cardz } = get.event();
											if (targets.includes(target)) return true;
											if ((cardz.name == "sha" || cardz.name == "shunshou") && !player.canUse({ name: "sha" }, target, true, false)) return false;
											return lib.filter.targetEnabled2(cardz, player, target);
										})
										.set("filterOk", () => {
											const { player, targets } = get.event();
											const maxTargets = player.countMark("rs_kanwei_effect");
											const kept = targets.filter(p => !ui.selected.targets.includes(p)).length;
											const added = ui.selected.targets.filter(p => !targets.includes(p)).length;
											return kept + added == maxTargets;
										})
										.set("targetprompt", function (target) {
											const { player, targets } = get.event();
											if (targets.includes(target)) return "移除目标";
											return "添加目标";
										})
										.set("complexCard", true)
										.set("targets", trigger.targets)
										.set("cardz", trigger.card)
										.set("ai", function (target) {
											const { targets, cardz, player } = get.event();
											const att = get.attitude(player, target);
											const eff = get.effect(target, cardz, player, player);
											if (targets.includes(target)) {
												return att > 0 ? -eff + Math.random() : 0;
											}
											return eff + Math.random();
										})
										.forResult();
								    if (!result || !result.bool) {
											// 玩家点击了取消，在这里删除标记！
											player.removeSkill("rs_kanwei_effect");
											return; // 直接结束，不往下执行
										}

										// 玩家正常选择了目标，将结果传给后续
										event.result = result;
									},
								filter(event, player) {
									return event.card.name == "sha" || get.type(event.card) == "trick";
								},
								async content(event, trigger, player) {
									player.removeSkill("rs_kanwei_effect");
									const targets = event.targets;
									const removedTargets = trigger.targets.filter(t => targets.includes(t));
									const addedTargets = targets.filter(t => !trigger.targets.includes(t));
									player.removeSkill(event.name);
									if (removedTargets.length) {
										trigger.targets.removeArray(removedTargets);
										game.log(trigger.card, "对", removedTargets, "无效");
									}
									if (addedTargets.length) {
										trigger.targets.addArray(addedTargets);
										game.log(addedTargets, "成为了", trigger.card, "的目标");
									}
								},
							},
						},
					},
					rs_hunwang: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: ["recastAfter", "drawAfter", "damageAfter"],
						},
						getIndex(event, player, name) {
							if (event.parent.name == "rs_hunwang") return 0;
							const storage = player.getStorage("rs_hunwang_used");
							if (name == "damageAfter") {
								const bool1 = !storage.includes("选项一") && player.countCards("she") >= 2;
								const bool2 = !storage.includes("选项二");
								return bool1 || bool2 ? event.num : 0;
							} else if (name == "recastAfter") {
								if (event.cards.map(c => c.original).filter(d => d == "h").length != 2) return false;
								const bool1 = !storage.includes("选项二");
								const bool2 = !storage.includes("选项三");
								return bool1 || bool2 ? 1 : 0;
							} else {
								if (event.num != 1) return false;
								const bool1 = !storage.includes("选项一") && player.countCards("she") >= 2;
								const bool3 = !storage.includes("选项三");
								return bool1 || bool3 ? 1 : 0;
							}
						},
						async cost(event, trigger, player) {
							const storage = player.getStorage("rs_hunwang_used") || [];
							const baseKeys = ["选项一", "选项二", "选项三"];
							const baseTexts = ["重铸两张手牌", "摸一张牌", "受到一点伤害"];
							let keys = [...baseKeys];
							let list = [...baseTexts];
							const name = event.triggername;

							const triggerMap = {
								recastAfter: "选项一",
								drawAfter: "选项二",
							};
							const delKey = triggerMap[name] ?? "选项三";
							keys.remove(delKey);

							[0, 1, 2].forEach(i => {
								const key = baseKeys[i];
								const isDisabled = key === "选项一" ? storage.includes(key) || player.countCards("she") < 2 : storage.includes(key);
								if (isDisabled) keys.remove(key);
								if (!keys.includes(key)) {
									list[i] = `<span style="opacity:0.5">${list[i]}</span>`;
								}
							});
							if (keys.length === 0) return;
							const result = await player
								.chooseControl(keys, "cancel2")
								.set("prompt", "浑王：请选择一个选项")
								.set("choiceList", list)
								.set("ai", () => {
									const { controls, player } = get.event();
									const controls2 = controls.filter(c => c != "选项三");
									if (controls.includes("选项二")) {
										return "选项二";
									}
									if (controls.includes("选项一") && player.getStorage("rs_kanwei_used").includes("选项二") && Math.random() < 0.4) {
										return "选项一";
									}
									return "cancel2";
								})
								.forResult();
							event.result = {
								bool: result.control != "cancel2",
								cost_data: result.control,
							};
						},
						async content(event, trigger, player) {
							const control = event.cost_data;
							player.markAuto("rs_hunwang_used", control);
							player.addTempSkill("rs_hunwang_used");
							if (control == "选项一") {
								const next = await player
									.chooseCard("she", 2, `###浑王###请重铸两张手牌！`, true)
									.set("ai", card => {
										return 100 - get.value(card);
									})
									.forResult();
								await player.recast(next.cards);
							} else if (control == "选项二") {
								await player.draw();
							} else {
								await player.damage();
							}
						},
						subSkill: {
							used: {
								charlotte: true,
								onremove: true,
								intro: {
									content: "本回合执行过：$",
								},
							},
						},
					},
					rs_mingjian: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							global: "useCard2",
						},
						filter(event, player) {
							if (event.targets.length <= 1) return false;
							const history = game.getGlobalHistory("useCard", evt => evt.player == event.player);
							if (history.some(evt => evt.targets.length > event.targets.length)) return false;
							return history.filter(evt => evt.targets.length == event.targets.length).length == 1;
						},
						check(event, player) {
							return get.attitude(player, event.player) > 0;
						},
						logTarget: "player",
						async content(event, trigger, player) {
							let target2 = event.target ? event.target : trigger.player;
							const cards = get.cards(3, true);
							await player.showCards(cards);
							for (const target of [target2, player]) {
								const result = await target
									.chooseCardButton(cards, true, `明谏：请选择一张牌获得！`)
									.set("ai", button => get.buttonValue(button))
									.forResult();
								if (result.bool) {
									await target.gain(result.links[0]);
									cards.remove(result.links[0]);
								}
							}
						},
					},
					rs_jiebi: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						filter(event, player) {
							return game.hasPlayer(p => p.countCards("he") > 1);
						},
						filterTarget(card, player, target) {
							return target.countCards("he") > 1;
						},
						manualConfirm: true,
						usable: 1,
						async content(event, trigger, player) {
							const result = await event.target
								.chooseCard("he", 2, `###诫弼###请重铸两张牌！`, true)
								.set("ai", card => {
									return 100 - get.value(card);
								})
								.forResult();
							if (result.bool) {
								const cards1 = result.cards;
								let cards2 = [];
								await event.target.recast(result.cards);
								const evt = event.target.getHistory("gain", evt => evt.getParent(3).name == "rs_jiebi");
								if (evt?.[0]?.cards.length > 0) {
									cards2 = evt[0].cards;
								}
								const next = await player
									.chooseControl(["选项一", "选项二"])
									.set("prompt", "诫弼：请选择一项！")
									.set("choiceList", [`令${get.translation(event.target)}将以此法获得的牌当【铁索连环】使用`, `令${get.translation(event.target)}将以此法失去的牌当【铁索连环】使用`])
									.set("ai", () => {
										return _status.event.top;
									})
									.set("top", get.attitude(player, event.target) > 0 ? "选项二" : "选项一")
									.forResult();
								if (next.control == "选项一") {
									await event.target.chooseUseTarget(true, { name: "tiesuo" }, cards2);
								} else {
									await event.target.chooseUseTarget(true, { name: "tiesuo" }, cards1);
								}
							}
						},
						ai: {
							order: 15,
							result: {
								target(player, target) {
									const att = get.attitude(player, target);
									return att > 0 ? 2 + Math.random() : -2 - Math.random();
								},
								player: 1,
							},
						},
					},
					rs_zuowang: {
						trigger: {
							player: "damageAfter",
						},
						getIndex(event) {
							return event.num;
						},
						async cost(event, trigger, player) {
							event.result = await player
								.chooseTarget(`###佐王###是否对一名体力上限大于你的角色发动一次“明谏”？`, (card, player, target) => {
									return target.maxHp > player.maxHp && target.countCards("he") > 1;
								})
								.set("ai", () => {
									return Math.random();
								})
								.forResult();
						},
						async content(event, trigger, player) {
							const target = event.targets[0];
							const skill = "rs_mingjian";
							player.logSkill(skill, target);
							const next = game.createEvent(skill);
							next.player = player;
							next.targets = [target];
							next.target = target;
							next.setContent(get.info(skill).content);
							await next;
						},
					},
					rs_balan: {
						audio: false, 
						trigger: {
							source: "damageBegin",
							player: "damageBegin2",
						},
						async cost(event, trigger, player) {
							const controls = ["选项一", "选项二"];
							const list = ["弃两张牌令此伤害+1", "摸两张牌，此技能本回合失效"];
							if (player.countCards("she") < 2) {
								controls.remove("选项一");
								list[0] = `<span style="opacity:0.5">${list[0]}</span>`;
							}
							let choice = "选项二";
							if (trigger.source == player && trigger.player != player && player.countCards("h") > 4) {
								choice = "选项一";
							}
							const result = await player
								.chooseControl(controls, "cancel2")
								.set("prompt", "霸岚：是否执行一项？")
								.set("choiceList", list)
								.set("goon", choice)
								.set("ai", () => {
									return _status.event.goon;
								})
								.forResult();
							event.result = {
								bool: result.control != "cancel2",
								cost_data: result.control,
							};
						},
						async content(event, trigger, player) {
							const control = event.cost_data;
							const extPath = lib.assetURL + "extension/starlight/audio/";
							if (control == "选项一") {
								new Audio(extPath + "balan_a.mp3").play(); 
								await player.chooseToDiscard(2, true, "she");
								trigger.num += 1;
							} else {
								new Audio(extPath + "balan_b.mp3").play();  	
								await player.draw(2);
								player.tempBanSkill("rs_balan");
							}
						},
					},
					rs_zhuwang: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "phaseUseBegin",
						},
						async cost(event, trigger, player) {
							const result = await player
								.chooseButton(
									[
										get.prompt(event.skill),
										[
											[
												["num1", "目标数+1"],
												["num2", "额定使用次数+1"],
											],
											"textbutton",
										],
									],
									[1, 2]
								)
								.set("ai", button => {
									const player = get.player();
									if (ui.selected.buttons.length && player.hp <= 3) return 0;
									if (game.countPlayer(p => player.canUse({ name: "sha" }, p, true)) > 1 && button.link == "num1") {
										return 1;
									}
									if (player.countCards("h", "sha") >= 2 && button.link == "num2") {
										return 1;
									}
									return 0;
								})
								.forResult();
							event.result = {
								bool: result.bool,
								cost_data: result.links,
							};
						},
						async content(event, trigger, player) {
							const links = event.cost_data;
							const single = links.length == 1;
							const storage = {};
							if (links.includes("num1")) {
								if (single) {
									storage.num1 = 2;
								} else {
									storage.num1 = 1;
								}
							}
							if (links.includes("num2")) {
								if (single) {
									storage.num2 = 2;
								} else {
									storage.num2 = 1;
								}
							}
							if (!single) {
								await player.damage("fire", "nosource");
							}
							player.setStorage("rs_zhuwang_effect", storage);
							player.addTempSkill("rs_zhuwang_effect");
						},
						subSkill: {
							effect: {
								mark: true,
								intro: {
									content(s, player) {
										let str = "本回合使用【杀】的";
										if (s.num1) str += `<br/>目标数+${s.num1}`;
										if (s.num2) str += `<br/>额定使用次数+${s.num2}`;
										return str;
									},
									nocount: true,
								},
								charlotte: true,
								onremove: true,
								mod: {
									cardUsable(card, player, num) {
										if (card.name == "sha") {
											const storage = player.getStorage("rs_zhuwang_effect");
											if (storage?.num2) {
												return num + storage.num2;
											}
										}
									},
									selectTarget(card, player, num) {
										const storage = player.getStorage("rs_zhuwang_effect");
										if (card.name == "sha" && num[1] != -1 && storage?.num1) num[1] += storage.num1;
									},
								},
							},
						},
					},
					rs_zhihuang: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						trigger: {
							player: "damageAfter",
						},
						filter(event, player, name) {
							if (!player.countCards("h")) return false;
							if (name == "damageAfter") {
								return true;
							}
							if (player.countCards("h") <= 1) {
								return !player.getStorage("rs_zhihuang_used").includes("选项一");
							} else {
								return player.getStorage("rs_zhihuang_used").length < 2;
							}
						},
						manualConfirm: true,
						async cost(event, trigger, player) {
							const controls = ["选项一", "选项二"];
							const list = ["重铸一张牌", "重铸至一张牌"];
							if (player.countCards("h") <= 1) {
								controls.remove("选项二");
								list[1] = `<span style="opacity:0.5">${list[1]}</span>`;
							}
							const result = await player
								.chooseControl(controls, "cancel2")
								.set("prompt", "稚皇：请选择一个选项。")
								.set("choiceList", list)
								.set("ai", () => {
									return _status.event.controls.includes("选项二") ? "选项二" : "选项一";
								})
								.forResult();
							event.result = {
								bool: result.control != "cancel2",
								cost_data: {
									control: result.control,
									ignore: true,
								},
							};
						},
						async content(event, trigger, player) {
							let control, ignore;
							if (event.cost_data) {
								control = event.cost_data.control;
								ignore = event.cost_data.ignore;
							}
							if (!control) {
								const controls = ["选项一", "选项二"];
								const list = ["重铸一张牌", "重铸至一张牌"];
								const storage = player.getStorage("rs_zhihuang_used");
								if (storage.includes("选项一")) {
									controls.remove("选项一");
									list[0] = `<span style="opacity:0.5">${list[0]}</span>`;
								}
								if (storage.includes("选项二") || player.countCards("h") <= 1) {
									controls.remove("选项二");
									list[1] = `<span style="opacity:0.5">${list[1]}</span>`;
								}
								const result =
									controls.length == 1
										? { control: controls[0] }
										: await player
												.chooseControl(controls)
												.set("prompt", "稚皇：请选择一个选项！")
												.set("choiceList", list)
												.set("ai", () => {
													return _status.event.controls.includes("选项二") ? "选项二" : "选项一";
												})
												.forResult();
								control = result.control;
							}
							if (control == "选项一") {
								const next = await player
									.chooseCard("h", 1, `###稚皇###请重铸一张牌！`, true)
									.set("ai", card => {
										return 100 - get.value(card);
									})
									.forResult();
								await player.showCards(next.cards);
								player.addGaintag(next.cards, "rs_zhihuang_buff");
								player.addTempSkill("rs_zhihuang_buff");
								await player.recast(next.cards);
								if (!ignore) {
									player.markAuto("rs_zhihuang_used", "选项一");
									player.addTempSkill("rs_zhihuang_used");
								}
							} else {
								const next = await player
									.chooseCard("h", player.countCards("h") - 1, `###稚皇###请重铸至一张牌！`, true)
									.set("ai", card => {
										return 100 - get.value(card) - get.tag(card, "damage") * 5;
									})
									.forResult();
								const remain = player.getCards("h", c => !next.cards.includes(c));
								await player.showCards(remain);
								player.addGaintag(remain, "rs_zhihuang_buff");
								player.addTempSkill("rs_zhihuang_buff");
								await player.recast(next.cards);
								if (!ignore) {
									player.markAuto("rs_zhihuang_used", "选项二");
									player.addTempSkill("rs_zhihuang_used");
								}
							}
						},
						ai: {
							order() {
								const player = get.player();
								if (!player.getStorage("rs_zhihuang_used").length) return 15;
								return get.order({ name: "sha" }) + 0.1;
							},
							result: {
								player: 5,
							},
						},
						subSkill: {
							used: {
								charlotte: true,
								onremove: true,
								intro: {
									content: "本回合执行过选项：$",
								},
							},
							buff: {
								onremove(player) {
									player.removeGaintag("rs_zhihuang_buff");
								},
								charlotte: true,
								mod: {
									targetInRange: function(card, player, target) {
										if (card.cards?.every(i => i.hasGaintag("rs_zhihuang_buff"))) return true;
									},
								cardUsable: card => {
									if (card.cards?.every(i => i.hasGaintag("rs_zhihuang_buff"))) return Infinity;
									},
								},
							},
						},
					},
					rs_ruowang: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "recastBegin",
						},
						filter(event, player) {
							return !event.parent.name.endsWith("_recast") && !event.parent.name.endsWith("_recasting");
						},
						getRecast(player) {
							return game.getGlobalHistory("everything", evt => evt.player == player && evt.name == "recast");
						},
						async cost(event, trigger, player) {
							const history = lib.skill.rs_ruowang.getRecast(player);
							const minNum = Math.min(history.length, history.at(-1).cards.length);
							event.result = await player
								.chooseTarget((card, player, target) => player != target && target.countCards("he") > 0)
								.set("prompt", `###若王###是否令一名角色交给你${history.length}张牌，然后交给其${minNum}张被重铸的牌！`)
								.set("ai", () => Math.random())
								.forResult();
							event.result.cost_data = {
								num: history.length,
								cards: history.at(-1).cards,
							};
						},
						async content(event, trigger, player) {
							const { num, cards } = event.cost_data;
							const target = event.targets[0];
							await target.chooseToGive(player, num, "he", true);
							const result =
								cards.length <= num
									? {
											bool: true,
											links: cards,
										}
									: await player
											.chooseCardButton(cards, true, num, `###若王###请交给${get.translation(target)}被重铸的牌！`, true)
											.set("eff", get.attitude(player, target) > 0)
											.set("ai", button => {
												return get.event().eff ? get.buttonValue(button) : 100 - get.buttonValue(button);
											})
											.forResult();
							if (result.bool) {
								await player.give(result.links, target, false);
							}
						},
					},
					rs_anji: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						trigger: {
							global: ["drawAfter", "loseAfter", "damageAfter"],
						},
						usable: 1,
						filter(event, player, name) {
							if (get.distance(player, event.player) > 1 || player.hasSkill("rs_anji_used")) return false;
							if (name == "drawAfter") {
								return event.num == 2;
							}
							if (name == "loseAfter") {
								return event.cards.length == 1 && ui.cardPile.lastChild == event.cards[0];
							}
							if (name == "damageAfter") {
								return event.nature && event.num == 1;
							}
							return true;
						},
						prompt: "闇记",
						prompt2(event, player, name) {
							const map2 = {
								drawAfter: "摸两张牌",
								loseAfter: "将一张牌置于牌堆底",
								damageAfter: "受到一点属性伤害",
							};
							const otherEffectStr = Object.keys(map2)
								.filter(key => key !== name)
								.map(key => map2[key])
								.join("、");

							return `${get.translation(event.player)}执行了：${map2[name] || ""}，你可以执行：${otherEffectStr}。`;
						},
						check(event, player, name) {
							return name == "damageAfter" || (name == "loseAfter" && player.hp > 2);
						},
						effectMap: {
							draw: async player => await player.draw(2),
							damage: async player => {
								const res = await player
									.chooseControl(lib.inpile_nature)
									.set("prompt", "###闇记###请选择伤害的属性！")
									.set("ai", () => {
										return "thunder";
									})
									.forResult();
								await player.damage(res.control);
							},
							toBottom: async player => {
								if (!player.countCards("he")) return;
								const res = await player
									.chooseCard("he", 1, `###闇记###请选择一张牌置于牌堆底！`, true)
									.set("ai", c => 100 - get.value(c))
									.forResult();
								res.bool && (await player.lose(res.cards, ui.cardPile, false, "blank"));
							},
						},
						async content(event, trigger, player) {
							player.addTempSkill("rs_anji_used");
							const name = event.triggername;
							const draw = lib.skill.rs_anji.effectMap.draw;
							const damage = lib.skill.rs_anji.effectMap.damage;
							const toBottom = lib.skill.rs_anji.effectMap.toBottom;
							const map = {
								drawAfter: [toBottom, damage],
								loseAfter: [draw, damage],
								damageAfter: [draw, toBottom],
							};
							const taskList = map[name] || [draw, toBottom, damage];
							for (const fn of taskList) await fn(player);
						},
						ai: {
							order: 5,
							result: {
								player: -0.3,
							},
						},
						subSkill: {
							used: {
								charlotte: true,
							},
						},
					},
					rs_yinwang: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "phaseEnd",
						},
						async cost(event, trigger, player) {
							const controls = ["选项一", "选项二", "选项三", "cancel2"];
							const list = ["摸两张牌", "将一张牌置于牌堆底", "受到一点属性伤害"];
							const result = await player
								.chooseControl(controls)
								.set("prompt", "隐王：请选择一项！")
								.set("choiceList", list)
								.set("ai", () => {
									return _status.event.controls[0];
								})
								.forResult();
							event.result = {
								bool: result.control != "cancel2",
								cost_data: { control: result.control, ind: result.index },
							};
						},
						async content(event, trigger, player) {
							const ind = event.cost_data.ind;
							await lib.skill.rs_anji.effectMap[["draw", "toBottom", "damage"][ind]](player);
							const cards = get.bottomCards(ind + 1, true);
							while (cards.some(card => player.hasUseTarget(card, true, false))) {
								const result = await player
									.chooseCardButton(cards, `###隐王###请使用牌堆底的${ind + 1}张牌！`)
									.set("ai", button => {
										return get.player().getUseValue(button.link);
									})
									.set("filterButton", button => {
										return get.player().hasUseTarget(button.link, true, false);
									})
									.forResult();
								if (result.bool) {
									await player.chooseUseTarget(result.links[0], true, false);
									cards.remove(result.links[0]);
								} else {
									break;
								}
							}
						},
					},
					rs_zhongchong: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						usable: 1,
						selectTarget: [1, Infinity],
						filterTarget(card, player, target) {
							return target.hasCard(card => target.canRecast(card), "he");
						},
						multiline: true,
						multitarget: true,
						ai: {
							order: 9,
							result: {
								target: 1,
							},
						},
						async content(event, trigger, player) {
							const targets = event.targets.sortBySeat();
							let targets2 = [];
							let sameColor = true;
							let color = null;
							for (const target of targets) {
								const result = await target
									.chooseCard("he", true, "###众宠###请选择一张牌重铸！")
									.set("source", player)
									.set("lastColor", color)
									.set("ai", card => {
										const { player, source, lastColor } = get.event();
										const att = get.attitude(player, source);
										const val = get.value(card, player);
										if (att > 0) {
											return get.color(card, player) == lastColor ? 110 - val : 100 - val;
										}
										return get.color(card, player) == lastColor ? 80 - val : 100 - val;
									})
									.forResult();
								if (result.bool) {
									targets2.push(target);
									await target.recast(result.cards);
									const color2 = get.color(result.cards[0], target);
									if (color == null) {
										color = color2;
									} else if (color != color2) {
										sameColor = false;
									}
									color = color2;
								}
							}
							if (sameColor) {
								const targets3 = game.filterPlayer(target => !targets2.includes(target));
								const vcards = get.inpileVCardList(([_, __, name]) => {
									if (get.type(name) != "trick") return false;
									if (get.tag({ name }, "recover") > 0) return false;
									return player.hasUseTarget(get.autoViewAs({ name }, "unsure"));
								});
								if (!vcards.length) {
									return;
								}
								const result = await player
									.chooseButton([`众宠：视为使用一张无法回复体力的普通锦囊牌`, [vcards, "vcard"]], true)
									.set("ai", button => {
										const name = button.link[2];
										const { player, targets2 } = get.event();
										if (!["wuzhong", "wugu"].includes(name)) return 0;
										if (targets.length == 1) return name == "wuzhong" ? 10 : 0;
										return name == "wugu" ? 10 : 9;
									})
									.set("targets2", targets2)
									.forResult();
								if (result.bool) {
									targets3.length &&
										player
											.when("useCardToPlayered")
											.filter((evt, player) => {
												return evt.isFirstTarget && evt.card?.storage?.rs_zhongchong;
											})
											.step(async (evt, tri) => {
												tri.getParent().excluded.addArray(targets3);
											});
									await player.chooseUseTarget(
										{
											name: result.links[0][2],
											storage: {
												rs_zhongchong: true,
											},
										},
										false,
										true
									);
								}
							}
						},
					},
					rs_weigen: {
						audio: "ext:starlight/audio:2",
						trigger: {
							player: ["drawAfter", "damageBegin3"],
							global: ["linkBegin"],
						},
						getIndex(event, player, name) {
							if (event.parent.name == "rs_weigen") return 0;
							if (name == "linkBegin") {
								if (event.parent.player == player) return 1;
								if (event.player == player) return 1;;
								return 0;
							}
							return name == "drawAfter" ? (event.num == 1 ? 1 : 0) : 1;
						},
						async cost(event, trigger, player) {
							const name = event.triggername;
							const remain = ["linkBegin", "drawAfter", "damageBegin3"].filter(p => p != name);
							const maps = {
								linkBegin: "横置或重置一张武将牌",
								drawAfter: "摸一张牌",
								damageBegin3: "受到一点伤害",
							};
							const buttons = remain.map(p => {
								const name2 = p.slice(0, -5);
								return [p, maps[p]];
							});

							const result = await player
								.chooseButton(["危艮：你可以执行任意项", [buttons, "textbutton"]], [1, 2])
								.set("ai", button => {
									const link = button.link;
									if (link == "damageBegin3") return 0;
									if (link == "drawAfter") return 10;
									return get.player().getUseValue({ name: "tiesuo" });
								})
								.forResult();
							event.result = {
								bool: result.bool,
								cost_data: result.links,
							};
						},
						async content(event, trigger, player) {
							const links = event.cost_data;
							if (links.includes("linkBegin")) {
								const result = await player
									.chooseTarget("###危艮###横置或重置一张武将牌", true)
									.set("ai", target => {
										const player = get.player();
										return get.effect(target, { name: "tiesuo" }, player, player);
									})
									.forResult();
								if (result.bool) {
									await result.targets[0].link(!result.targets[0].isLinked());
								}
							}
							if (links.includes("drawAfter")) {
								await player.draw();
							}
							if (links.includes("damageBegin3")) {
								await player.damage(1);
							}
						},
					},
					rs_zhongshu: {
						audio: false,
						enable: "phaseUse",
						filter(event, player) {
							const [filter0, filter1, filter2] = lib.skill.rs_zhongshu.filterx;
							return game.hasPlayer(p => (p === player ? filter0(player) : filter1(player, p) || filter2(player, p)));
						},
						subSkill: {
							used: {
								charlotte: true,
								intro: {
									content(s, player) {
										const index2 = s.map(i => i + 1);
										return `本回合已执行的选项：${get.translation(index2)}`;
									},
								},
								onremove: true,
							},
						},
						filterx: [
							function filter0(player) {
								const storage = player.getStorage("rs_zhongshu_used");
								// if (!storage.includes(0) && player.countCards("h") >= 3) return false;
								// if (!storage.includes(1) && !player.isDamaged()) return false;
								// return true;
								return storage.length < 3;
							},
							function filter1(player, target) {
								if (player.getStorage("rs_zhongshu_used").includes(1)) return false;
								return target.isDamaged() && target.countCards("h") >= 3;
							},
							function filter2(player, target) {
								if (player.getStorage("rs_zhongshu_used").includes(2)) return false;
								return target.isHealthy();
							},
						],
						async content(event, trigger, player) {
							const [filter0, filter1, filter2] = lib.skill.rs_zhongshu.filterx;
							const extPath = lib.assetURL + "extension/starlight/audio/"; 

							while (true) {
								const targets = game.filterPlayer(p => (p === player ? filter0(player) : filter1(player, p) || filter2(player, p)));
								const resultA = await player
									.chooseTarget(`###衷戍###你可以执行剩余所有项，或令一名其他角色执行第X项（其须无法执行第X-1项）`, (card, player, target) => {
										return get.event().targetz.includes(target);
									})
									.set("targetz", targets)
									.set("ai", target => {
										const player = get.player();
										const [filter0, filter1, filter2] = lib.skill.rs_zhongshu.filterx;
										const att = get.attitude(player, target);
										if (filter1(player, target)) {
											return att;
										}
										if (filter2(player, target)) {
											return -att;
										}
										if (filter0(player)) {
											return player.getStorage("rs_zhongshu_used").includes(2);
										}
										return 0;
									})
									.forResult();
								if (!resultA.bool) break;
								const target = resultA.targets[0];
								const resultB =
									player == target
										? {
												bool: true,
												links: [0, 1, 2].filter(i => !player.getStorage("rs_zhongshu_used").includes(i)),
											}
										: await player
												.chooseButton(
													[
														`礼浴：令一名${get.translation(target)}执行第X项（其须无法执行第X-1项）`,
														[
															[
																[0, "将手牌摸至三张"],
																[1, "回复一点体力"],
																[2, "受到你的一点雷电伤害"],
																[3, "返回重新选择目标"],
															],
															"textbutton",
														],
													],
													1,
													true
												)
												.set("filterButton", button => {
													const link = button.link;
													if (link == 3) return true;
													if (link == 0) return false;
													const { player, targetz } = get.event();
													const [filter0, filter1, filter2] = lib.skill.rs_zhongshu.filterx;
													if (link == 1) {
														return filter1(player, targetz);
													}
													return filter2(player, targetz);
												})
												.set("targetz", target)
												.set("ai", button => {
													const { player, targetz } = get.event();
													const att = get.attitude(player, targetz);
													return button.link == 1 ? att : -att;
												})
												.forResult();
								if (resultB.bool && !resultB.links.includes(3)) {
									if (player == target) {
										const links = resultB.links;
										if (links.includes(0) && player.countCards("h") < 3) {
											await player.drawTo(3);
											new Audio(extPath + "rs_zhongshu_draw.mp3").play();
										}
										if (links.includes(1) && player.isDamaged()) {
											await player.recover();
											new Audio(extPath + "rs_zhongshu_recover.mp3").play();
										}
										if (links.includes(2)) {
											await player.damage(1, "thunder", player);
											new Audio(extPath + "rs_zhongshu_damage.mp3").play();
										}
										player.markAuto("rs_zhongshu_used", links);
										player.addTempSkill("rs_zhongshu_used");
										break;
									} else {
										const link = resultB.links[0];
										player.markAuto("rs_zhongshu_used", [link]);
										if (link == 0) {
											await target.drawTo(3);
											new Audio(extPath + "rs_zhongshu_draw.mp3").play();
										}
										if (link == 1) {
											await target.recover();
											new Audio(extPath + "rs_zhongshu_recover.mp3").play();
										}
										if (link == 2) {
											await target.damage(1, "thunder", player);
											new Audio(extPath + "rs_zhongshu_damage.mp3").play();
										}
										break;
									}
								}
							}
						},
						ai: {
							order: 15,
							result: {
								player(player) {
									const [filter0, filter1, filter2] = lib.skill.rs_zhongshu.filterx;
									if (filter0(player)) return player.getStorage("rs_zhongshu_used").includes(2) ? 1 : 0;
									const targets1 = game.filterPlayer(p => filter1(player, p));
									if (targets1.some(p => get.attitude(player, p) > 0)) return 1;
									const targets2 = game.filterPlayer(p => filter2(player, p));
									if (targets2.some(p => get.attitude(player, p) < 0)) return 1;
									return 0;
								},
							},
						},
					},
					rs_weilang: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "damageBegin3",
							source: "damageBegin2",
						},
						filter(event, player, name) {
							return !player.getStorage("rs_weilang_used").includes(name);
						},
						async cost(event, trigger, player) {
							event.result = await player
								.chooseTarget(get.prompt2(event.skill), 1)
								.set("ai", target => {
									const player = get.event().player,
										trigger = get.event().getTrigger();
									if (trigger.hasNature() && target == player) {
										return -get.effect(target, { name: "tiesuo" }, player, player);
									}
									return get.effect(target, { name: "tiesuo" }, player, player);
								})
								.forResult();
						},
						async content(event, trigger, player) {
							for (const i of event.targets) {
								await i.link(!i.isLinked());
							}
							player.markAuto("rs_weilang_used", event.triggername);
							player.addTempSkill("rs_weilang_used");
						},
						subSkill: {
							used: {
								onremove: true,
								charlotte: true,
							},
						},
					},
					rs_mozheng: {
						audio: "ext:starlight/audio:2",
						trigger: {
							global: ["phaseAnyEnd"],
						},
						filter(event, player, name) {
							return player.getHistory("gain", evt => evt.getParent(event.name) == event).length + player.getHistory("lose", evt => evt.getParent(event.name) == event && evt.hs.length).length;
						},
						frequent: true,
						async content(event, trigger, player) {
							if (player.getHistory("gain", evt => evt.getParent(trigger.name) == trigger).length) {
								await player.chooseToGuanxing(3);
							}
							if (player.getHistory("lose", evt => evt.getParent(trigger.name) == trigger && evt.hs.length).length) {
								const cards = get.bottomCards(1, true);
								await player.showCards(cards, "牌堆底的牌");
								if (player.hasUseTarget(cards[0], true, true)) {
									await player.chooseUseTarget(cards[0], true);
								}
							}
						},
					},
					rs_weijiu: {
						audio: "ext:starlight/audio:2",
						trigger: {
							player: ["phaseDiscardBegin", "damageBegin2"],
						},
						async cost(event, trigger, player) {
							const skills = player.getSkills(null, false, false).filter(skill => !lib.skill[skill].charlotte && !skill.startsWith("player_when"));
							const result = await player
								.chooseButton(["###危鸠###令你本回合失去至多两个技能并摸等两张牌，然后弃你拥有的技能数张牌", [skills, "skill"]], [1, 2])
								.set("ai", button => {
									const info = get.info(button.link);
									if (info?.ai?.neg || info?.ai?.halfneg) return 3;
									return 1;
								})
								.forResult();
							event.result = {
								bool: result.bool,
								cost_data: result.links,
							};
						},
						async content(event, trigger, player) {
							const nums = player.getSkills(null, false, false).filter(skill => !lib.skill[skill].charlotte && !skill.startsWith("player_when")).length;
							const skills = event.cost_data;
							for (const skill of skills) {
								player.tempBanSkill(skill);
							}
							await player.draw(skills.length);
							if (nums - skills.length > 0 && player.countCards("he") > 0) {
								await player.chooseToDiscard("hes", nums - skills.length, true);
							}
						},
					},
					rs_xiayi: {
						audio: "ext:starlight/audio/skill:true",
						trigger: {
							player: "loseAfter",
							global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
						},
						filter(event, player) {
							if (_status.currentPhase != player) return false;
							const evt = event.getl(player);
							const cards = evt.cards.filterInD("d");
							return cards.length > 1;
						},
						async cost(event, trigger, player) {
							const cards = trigger.getl(player).cards.filterInD("d");
							const result = await player
								.chooseCardButton(cards, "黠艺：是否获得其中一张牌，并将本回合因此获得的两张牌与牌堆一端三张牌交换？")
								.set("ai", button => {
									return get.buttonValue(button);
								})
								.forResult();
							event.result = {
								bool: result.bool,
								cards: result.links,
							};
						},
						async content(event, trigger, player) {
							const next = player.gain(event.cards, "gain2");
							next.gaintag.add("rs_xiayi");
							await next;
							const cards = player.getCards("she", c => c.hasGaintag("rs_xiayi"));
							player.addTempSkill("rs_xiayi_gained");
							if (cards.length >= 2) {
								const result1 = await player
									.chooseCard(2, "sh", true, c => c.hasGaintag("rs_xiayi"), "###黠艺###将本回合因此获得的两张牌与牌堆一端三张牌交换！")
									.set("ai", card => 100 - get.value(card))
									.forResult();
								if (result1.bool) {
									const result2 = await player
										.chooseControl(["牌堆顶", "牌堆底"])
										.set("prompt", "###黠艺###请选择与本回合因此获得的两张牌交换的牌堆位置！")
										.set("ai", () => ["牌堆顶", "牌堆底"].randomGet())
										.forResult();
									result1.cards.forEach(c => {
										c.gaintag = [];
									});
									if (result2.control == "牌堆顶") {
										await player.gain(get.cards(3), "draw");
										const top = result1.cards.reverse();
										const bottom = [];
										await game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event2, card) => {
											if (event2.top_cards.includes(card)) {
												return ui.cardPile.firstChild;
											}
											return null;
										});
									} else {
										await player.gain(get.bottomCards(3), "draw");
										const top = [];
										const bottom = result1.cards;
										await game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event2, card) => {
											if (event2.top_cards.includes(card)) {
												return ui.cardPile.firstChild;
											}
											return null;
										});
									}
								}
							}
						},
						subSkill: {
							gained: {
								onremove(player) {
									player.removeGaintag("rs_xiayi");
								},
								charlotte: true,
							},
						},
					},
					rs_weidiao: {
						audio: "ext:starlight/audio:2",
						enable: "phaseUse",
						trigger: {
							player: "damageBegin2",
						},
						filter(event, player) {
							return game.hasPlayer(p => p.hasCard(card => p.canRecast(card), "he"));
						},
						filterTarget(card, player, target) {
							return target.countCards("he") > 0;
						},
						async cost(event, trigger, player) {
							event.result = await player
								.chooseTarget("###危貂###是否令一名角色重铸至多两张牌？", (card, player, p) => {
									return p.hasCard(card => p.canRecast(card), "he");
								})
								.set("ai", target => {
									return get.attitude(get.player(), target);
								})
								.forResult();
						},
						async content(event, trigger, player) {
							player.addTempSkill("rs_weidiao_moved");
							const target = event.targets[0];
							// let num = 0;
							const result = await target
								.chooseCard("he", [1, 2], "###危貂###你可以重铸至多两张牌！")
								.set("isTrMe", player == target)
								.set("ai", card => {
									const isTrMe = get.event().isTrMe;
									if (isTrMe && ui.selected.cards.length == 1) {
										return 0;
									}
									return 6.3 - get.value(card) + (card.hasGaintag("rs_xiayi") ? 3 : 0);
								})
								.set("complexCard", true)
								.forResult();
							if (result.bool) {
								await target.recast(result.cards);
								// num += result.cards.length;
								player.addMark("rs_weidiao_moved", result.cards.length);
								if (player.countMark("rs_weidiao_moved") > 2) {
									player.tempBanSkill("rs_weidiao");
									return;
								}
							}
							if (player.canMoveCard()) {
								if (!event.isMine() && player.canMoveCard(true)) {
									const next = player.moveCard();
									next.set("nojudge", true);
									next.pEvent = event;
									await next;
								} else {
									const next = player.moveCard();
									next.set("nojudge", true);
									next.pEvent = event;
									await next;
								}
							}
							const bool =
								game.getGlobalHistory("cardMove", evt => {
									return evt.getParent("moveCard").pEvent == event;
								}).length > 0;
							if (bool) {
								// num++;
								player.addMark("rs_weidiao_moved", 1);
								if (player.countMark("rs_weidiao_moved") > 2) {
									player.tempBanSkill("rs_weidiao");
								}
							}
						},
						ai: {
							order: 8,
							result: {
								target: 2,
							},
						},
						subSkill: {
							moved: {
								onremove: true,
								charlotte: true,
							},
						},
					},
					rs_fuyang: {
						audio: "ext:starlight/audio:2",
						enable: "phaseUse",
						trigger: {
							player: "damageBegin2",
						},
						manualConfirm: true,
						check(event, player) {
							return player.countCards("h") < 1 || player.countCards("h") == 2;
						},
						async content(event, trigger, player) {
							if (player.countCards("h") < 1) {
								await player.draw();
							} else if (player.countCards("h") > 2) {
								await player.chooseToDiscard("h", player.countCards("h") - 2, true);
							} else {
								await player.draw(2);
								player.tempBanSkill("rs_fuyang");
							}
						},
						ai: {
							order: 9,
							result: {
								player(player) {
									return player.countCards("h") < 1 || player.countCards("h") == 2 ? 1 : -1;
								},
							},
						},
					},
					rs_weizhi: {
						audio: false,
						hiddenCard(player, name) {
							return name == "sha" && player.countCards("she") > 1;
						},
						enable: ["chooseToUse", "chooseToRespond"],
						filter(event, player) {
							const num = player.countCards("she");
							return num > 2 ? player.hasUseTarget({ name: "sha", nature: "fire" }, true, false) : player.hasUseTarget({ name: "sha", nature: "thunder" }, false, true);
						},
						chooseButton: {
							dialog(event, player) {
								const list = [
									["basic", "", "sha", "thunder"],
									["basic", "", "sha", "fire"],
								];
								return ui.create.dialog("危雉", [list, "vcard"]);
							},
							filter(button, player) {
								const num = player.countCards("she");
								const cards = player.getCards("she");
								const nature = button.link[3];
								const fakeCards = nature != "thunder" ? [game.createCard("sha", null, null, "fire"), game.createCard("sha", null, null, "fire")] : [game.createCard("sha", null, null, "thunder"), game.createCard("sha", null, null, "thunder"), game.createCard("sha", null, null, "thunder")];
								return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3], storage: { rs_weizhi: true }, cards: fakeCards }, player, _status.event.getParent());
							},
							check(button) {
								if (_status.event.getParent().type != "phase") return 1;
								const player = _status.event.player;
								return player.getUseValue({ name: button.link[2], nature: button.link[3] });
							},
							backup(links) {
								const select = links[0][3] == "thunder" ? 3 : 2;
								return {
									filterCard: true,
									complexCard: true,
									selectCard: select,
									position: "she",
									viewAs: {
										name: links[0][2],
										nature: links[0][3],
										storage: {
											rs_weizhi: true,
										},
									},
									check(card) {
										return 5.6 - get.value(card);
									},
									async precontent(event, trigger, player) {
										const extPath = lib.assetURL + "extension/starlight/audio/";
										const randomNum = Math.random() < 0.5 ? 1 : 2;
										new Audio(extPath + "rs_weizhi" + randomNum + ".mp3").play();
										
										if (event.result.card.nature == "thunder") {
											event.getParent().addCount = false;
										}
									},
								};
							},
							prompt(links, player) {
								return "你可以将三张牌当无次数限制的雷【杀】；或将两张牌当无距离限制的火【杀】使用或打出。";
							},
						},
						ai: {
							order() {
								const player = get.player();
								return player.isPhaseUsing() ? get.order({ name: "sha" }) + 0.1 : 15;
							},
							result: {
								player: 5,
							},
							respondSha: true,
							skillTagFilter(player, tag) {
								return player.countCards("she") > 1;
							},
						},
						mod: {
							cardUsable(card) {
								if (card.name == "sha" && card.storage?.rs_weizhi && card.cards.length == 3) {
									return Infinity;
								}
							},
							targetInRange(card) {
								if (card.name == "sha" && card.storage?.rs_weizhi && card.cards.length == 2) {
									return true;
								}
							},
						},
					},
					rs_qingxie: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						usable: 1,
						filterTarget(card, player, target) {
							if (player == target) return false;
							if (player.storage.rs_qingxie_used) {
								return player.countCards("she");
							}
							return true;
						},
						intro: {
							content: "只能以多换少",
						},
						manualConfirm: true,
						async content(event, trigger, player) {
							const target = event.target;
							const select1 = player.storage.rs_qingxie_used ? [0, Math.min(2, Math.max(0, player.countCards("she") - 1))] : [0, 2];
							const cards1 =
								target.countCards("h") == 0 || select1[1] == 0
									? []
									: (
											await player
												.choosePlayerCard(target, "h", select1, `###青谐###请选择要获得的牌！`, true)
												.set("ai", () => Math.random() - 0.2)
												.forResult()
										).cards || [];
							const select2 = player.storage.rs_qingxie_used ? [cards1.length + 1, Infinity] : [0, Infinity];
							const next = await player
								.chooseCard("she", select2, `###青谐###请选择要交给${get.translation(target)}的牌！（至少选择${select2[0]}张）`, true)
								.set("ai", card => {
									const minNum = get.event().minNum;
									if (ui.selected.cards.length >= minNum) {
										return 0;
									}
									return 100 - get.value(card);
								})
								.set("minNum", select2[0])
								.set("complexCard", true)
								.forResult();
							const cards2 = next.cards || [];
							if (cards1.length > cards2.length && !player.storage.rs_qingxie_used) {
								player.storage.rs_qingxie_used = true;
								player.markSkill("rs_qingxie");
							}
							await player.gain(cards1, target, false);
							await player.give(cards2, target, false);
							// await player.swapHandcards(target, cards2, cards1);
						},
						ai: {
							order: 9,
							result: {
								target(player, target) {
									return player.storage.rs_qingxie_used ? 3 : -5;
								},
								player(player) {
									return player.storage.rs_qingxie_used ? 3 : 0;
								},
							},
						},
					},
					rs_cuilan: {
						audio: "ext:starlight/audio/skill:true",
						filter(event, player) {
							return player.storage.rs_cuilan_record;
						},
						trigger: {
							global: "phaseChange",
						},
						frequent: true,
						async content(event, trigger, player) {
							let distance = -Infinity;
							let remotePlayer = null;
							for (const target of game.filterPlayer(p => p != player)) {
								const dist = get.distance(player, target);
								if (dist > distance) {
									distance = dist;
									remotePlayer = [target];
								} else if (dist == distance) {
									remotePlayer.push(target);
								}
							}
							if (remotePlayer.some(p => player.canUse({ name: "sha" }, p, true, false))) {
								await player.chooseUseTarget({ name: "sha" }, true, false, remotePlayer);
							} else {
								if (player.canMoveCard()) await player.moveCard(true);
								if (remotePlayer.some(p => player.canUse({ name: "sha" }, p, true, false))) {
									await player.chooseUseTarget({ name: "sha" }, true, false, remotePlayer);
								} else {
									if (game.hasPlayer(p => player.canCompare(p))) {
										const result = await player
											.chooseTarget("###翠岚###请选择拼点的角色！", (card, player, target) => {
												return player.canCompare(target);
											})
											.set("ai", target => {
												return -get.attitude(get.player(), target);
											})
											.forResult();
										if (result.bool) {
											await player.chooseToCompare(result.targets[0]);
										}
									}
								}
							}
						},
						group: ["rs_cuilan_record", "rs_cuilan_reset"],
						subSkill: {
							record: {
								trigger: {
									global: "gainAfter",
								},
								silent: true,
								charlotte: true,
								filter(event, player) {
									return event.giver == player && event.cards?.length > 0 && !player.storage.rs_cuilan_record;
								},
								async content(event, trigger, player) {
									player.storage.rs_cuilan_record = true;
								},
							},
							reset: {
								trigger: {
									global: "phaseChange",
								},
								lastDo: true,
								charlotte: true,
								silent: true,
								async content(event, trigger, player) {
									player.storage.rs_cuilan_record = false;
								},
							},
						},
					},
					rs_qingyan: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						usable: 1,
						filterTarget(card, player, target) {
							return player.canCompare(target);
						},
						async content(event, trigger, player) {
							const target = event.target;
							const result = await player.chooseToCompare(target).forResult();
							if (result.tie || !result.winner) return;
							const winner = result.winner;
							const loser = winner == player ? target : player;
							if (!winner.countCards("he") || !winner.canUse({ name: "juedou" }, loser, true, false)) return;
							// rs_qingyan_info: "出牌阶段限一次，你可以和一名其他角色拼点，并选择赢的角色一张牌，令其将此牌当【决斗】对没赢的角色使用。",

							const next = await player
								.choosePlayerCard(winner, "he", true, `###青炎###选择${get.translation(winner)}的一张牌，令其当【决斗】对${get.translation(loser)}使用`)
								.set("ai", button => {
									const { player, winner, loser } = get.event();
									const card = button.link;
									const effect = get.effect(loser, { name: "juedou" }, winner, player);
									return effect * 20 - get.value(card, winner);
								})
								.set("winner", winner)
								.set("loser", loser)
								.forResult();
							if (next.bool && next.cards?.length && winner.isIn() && loser.isIn() && winner.canUse({ name: "juedou" }, loser, true, false)) {
								await winner.useCard(get.autoViewAs({ name: "juedou" }, next.cards), next.cards, loser);
							}
						},
						ai: {
							order() {
								return get.order({ name: "sha" }) + 0.1;
							},
							result: {
								target(player, target) {
									const maxMe =
										player
											.getCards("h")
											.map(c => get.number(c))
											.sort((a, b) => b - a)[0] || 0;
									const maybeHe =
										(target
											.getCards("h")
											.map(c => get.number(c))
											.sort((a, b) => b - a)[0] || 0) + [-2, -1, 0, 1, 2].randomGet();
									if (maxMe <= maybeHe) return 0;
									if (!player.canCompare(target)) return 0;
									return get.effect(target, { name: "juedou" }, player, target);
								},
							},
						},
					},
					rs_chilan: {
						audio: false,
						trigger: {
							global: "useCard",
						},
						init(player) {
							game.broadcastAll(() => {
								lib.translate.use = "使用";
								lib.translate.respond = "打出";
								lib.translate.discard = "被弃置";
								lib.translate.beGained = "被拿取或赠与";
								lib.translate.loseToDiscardpile = "主动或被动置于弃牌堆";
								lib.translate.loseAsync = "同时失去";
								lib.translate.addToExpansion = "置于扩展区";
							});
						},
						filter(event, player, name) {
							return event.card.name == "juedou" && (event.player == player || event.target == player || event.targets?.includes(player));
						},
						direct: true,
						async content(event, trigger, player) {
							const extPath = lib.assetURL + "extension/starlight/audio/";
							new Audio(extPath + "chilan.mp3").play();
							player.addTempSkill("rs_chilan_lose", "useCardAfter");
						},
						getNum(player) {
							return Math.min(4, player.getStorage("rs_chilan_record").length);
						},
						group: ["rs_chilan_record", "rs_chilan_reset"],
						subSkill: {
							lose: {
								trigger: {
									target: "useCardToTargeted",
									player: ["loseAfter", "useCard2", "useCardToPlayered", "chooseToRespondBegin", "chooseToUseBegin"],
									global: ["chooseCardBefore", "chooseButtonBefore"],
								},
								charlotte: true,
								filter(event, player) {
									return player.countCards("h") != lib.skill.rs_chilan.getNum(player);
								},
								check(event, player) {
									return player.countCards("h") < lib.skill.rs_chilan.getNum(player);
								},
								prompt2(event, player) {
									return `是否将手牌数调整至${get.cnNumber(lib.skill.rs_chilan.getNum(player))}张？`;
								},
								async content(event, trigger, player) {
									const num = lib.skill.rs_chilan.getNum(player);
									const hs = player.countCards("h");
									if (hs < num) {
										await player.draw(num - hs);
									} else if (hs > num) {
										await player.chooseToDiscard(hs - num, "h", true);
									}
								},
							},
							record: {
								trigger: {
									player: "loseAfter",
									global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
								},
								charlotte: true,
								silent: true,
								filter(event, player) {
									const evt = event.getl(player);
									return evt && evt.hs && evt.hs.length > 0;
								},
								async content(event, trigger, player) {
									let type = trigger.type || trigger.name;
									if (type == "gain") type = "beGained";
									if (type == "use" && trigger.parent.name == "respond") {
										type = "respond";
									}
									player.markAuto(event.name, type);
								},
								intro: {
									content: "本回合失去手牌的方式：$",
								},
							},
							reset: {
								trigger: {
									global: "phaseAfter",
								},
								charlotte: true,
								silent: true,
								onremove: true,
								content() {
									delete player.storage.rs_chilan_record;
									player.unmarkSkill("rs_chilan_record");
								},
							},
						},
					},
					rs_qingji: {
						audio: "ext:starlight/audio/skill:true",
						enable: "phaseUse",
						filter(event, player) {
							const num = player.getSkills(null, false, false).filter(skill => !lib.skill[skill].charlotte && !skill.startsWith("player_when")).length;
							const hs = player.countCards("h");
							const she = player.countCards("she");
							return hs + num == 3 || (hs + num >= 4 && she + num > 4);
						},
						async content(event, trigger, player) {
							let control = event.cost_data;
							const skills = player.getSkills(null, false, false).filter(skill => !lib.skill[skill].charlotte && !skill.startsWith("player_when"));
							const num = skills.length;
							const hs = player.countCards("h");
							const she = player.countCards("she");
							const controls = ["选项一", "选项二"];
							const list = ["摸两张牌，并失去一个技能", "将任意张牌当【五谷丰登】对至多等量其他角色使用"];
							if (hs + num != 3) {
								controls.remove("选项一");
								list[0] = `<span style="opacity:0.5">${list[0]}</span>`;
							}
							if (!(hs + num >= 4 && she + num > 4)) {
								controls.remove("选项二");
								list[1] = `<span style="opacity:0.5">${list[1]}</span>`;
							}

							if (true) {
								const result =
									controls.length == 1
										? {
												control: controls[0],
											}
										: await player
												.chooseControl(controls)
												.set("choiceList", list)
												.set("prompt", `青姬：请选择执行的选项！`)
												.set("ai", () => {
													const player = get.player();
													if (player.getFriends().length > 0) return _status.event.controls.at(-1);
													return _status.event.controls[0];
												})
												.forResult();
								control = result.control;
							}

							if (control == "选项一") {
								await player.draw(2);
								const result =
									skills.length > 1
										? await player
												.chooseButton(["###青姬###失去一个技能", [skills, "skill"]], true)
												.set("ai", button => {
													const info = get.info(button.link);
													if (info?.ai?.neg || info?.ai?.halfneg) return 3;
													return 1;
												})
												.forResult()
										: { bool: true, links: [skills[0]] };
								if (result.bool && result.links?.length) {
									const me = player;
									const skill = result.links[0];
									player.removeSkill(skill);
									player.when({ global: "phaseAfter" }).step(() => {
										me.addSkill(skill);
									});
								}
							} else {
								let cards2 = [];
								const allHandCards = player.getCards("he").sort((a, b) => {
									const ea = get.position(a) === "e";
									const eb = get.position(b) === "e";
									if (ea !== eb) return ea ? 1 : -1;
									return get.value(a) - get.value(b);
								});
								const selectedSet = new Set();
								const totalHand = player.countCards("h");
								const needPick = totalHand + skills.length - 4;
								for (let i = 0; i < needPick; i++) {
									const c = allHandCards[i];
									if (!c) break;
									if (!selectedSet.has(c)) {
										selectedSet.add(c);
										cards2.push(c);
									}
								}
								const result = await player
									.chooseCardTarget({
										prompt: `###青姬###青将任意张牌当【五谷丰登】对至多等量其他角色使用！`,
										position: "she",
										forced: true,
										selectCard: [1, Infinity],
										filterOk() {
											return get.player().countCards("h", c => !ui.selected.cards.includes(c)) + get.event().skillNum == 4;
										},
										selectTarget() {
											return [1, ui.selected.cards.length];
										},
										complexCard: true,
										filterTarget(card, player2, target) {
											if (target == player2) return false;
											return player2.canUse({ name: "wugu", isCard: true }, target, false);
										},
										ai1(card) {
											const cards2 = get.event().cards2;
											return cards2.includes(card) ? 9 : 0;
										},
										ai2(target) {
											const player2 = get.player();
											return 100 + get.effect(target, { name: "wugu" }, player2, player2);
										},
									})
									.set("complexCard", true)
									.set("cards2", cards2)
									.set("skillNum", skills.length)
									.forResult();
								if (result.bool) {
									await player.useCard({ name: "wugu", isCard: true }, result.cards, result.targets);
								}
							}
						},
						ai: {
							order() {
								return 9;
							},
							result: {
								player(player) {
									const num = player.getSkills(null, false, false).filter(skill => !player.isTempBanned(skill)).length;
									const sum = player.countCards("h") + num;
									if (sum == 3) return 2;
									if (sum > 4) return 1;
									return 0;
								},
							},
						},
					},
					rs_jinlan: {
						audio: "ext:starlight/audio/skill:true",
						trigger: { global: "useCard2" },
						filter(event, player) {
							if (!event.player || event.player != _status.currentPhase) return false;
							const num = event.player.getSkills(null, false, false).filter(skill => !lib.skill[skill].charlotte && !event.player.isTempBanned(skill) && event.player.hasSkill(skill) && !skill.startsWith("player_when")).length;
							return event.targets && event.targets.length == num && num > 0;
						},
						check(event, player) {
							return event.targets.reduce((sum, target) => sum + get.effect(target, event.card, player, player), 0) > 0;
						},
						async content(event, trigger, player) {
							trigger.effectCount++;
							player.removeSkill(event.name);
							const me = player;
							const skill = event.name;
							player.when({ global: "phaseAfter" }).step(() => {
								me.addSkill(skill);
							});
						},
					},
				},
			},
			translation: "少女割据",
			intro: "",
			author: "banana",
			diskURL: "",
			forumURL: "",
			version: "1.0",
		},
		files: { character: [], card: [], skill: [], audio: [] },
	};
}
