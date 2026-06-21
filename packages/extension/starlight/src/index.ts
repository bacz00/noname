import { lib, game, ui, get, ai, _status } from "noname";

export const type = "extension";

export default function (): importExtensionConfig {
	return {
		name: "starlight",
		editable: false,
		connect: true,
		content: function () {},
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
