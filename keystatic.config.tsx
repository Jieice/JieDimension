import { collection, config, fields } from "@keystatic/core";

export default config({
	// 存储方式：直接读写 GitHub 仓库（通过 Keystatic Cloud 免费认证）
	storage: {
		kind: "github",
		repo: {
			owner: "Jieice",
			name: "JieDimension",
			branch: "master",
		},
	},
	collections: {
		posts: collection({
			label: "文章 / 游戏",
			description: "博客文章与游戏页面",
			slugField: "title",
			path: "src/content/posts/*",
			format: { contentField: "content" },
			columns: ["title", "published", "draft"],
			schema: {
				title: fields.slug({
					name: { label: "标题", validation: { isRequired: true } },
					slug: { label: "URL 别名（文件名，英文短横线）" },
				}),
				published: fields.date({
					label: "发布时间",
					validation: { isRequired: true },
				}),
				updated: fields.date({ label: "更新时间（可选）" }),
				draft: fields.checkbox({
					label: "草稿（勾选则不发布）",
					defaultValue: false,
				}),
				pinned: fields.checkbox({ label: "置顶", defaultValue: false }),
				description: fields.text({
					label: "描述 / 简介",
					multiline: true,
				}),
				image: fields.text({
					label: "封面图路径（如 /assets/images/games/xxx.avif）",
				}),
				category: fields.text({ label: "分类（如 游戏作品）" }),
				tags: fields.array(fields.text({ label: "标签" }), {
					label: "标签",
					itemLabel: (props) => props.value || "新标签",
				}),
				lang: fields.text({ label: "语言", defaultValue: "zh-CN" }),
				author: fields.text({ label: "作者（可选）" }),

				// —— 游戏类文章专用字段（普通文章留空即可）——
				type: fields.text({ label: "类型（article / game，可选）" }),
				gameUrl: fields.text({ label: "游戏外链（可选）" }),
				playUrl: fields.text({ label: "本地游玩地址（可选）" }),
				repoUrl: fields.text({ label: "仓库地址（可选）" }),

				// —— 其他元信息 ——
				sourceLink: fields.text({ label: "来源链接（可选）" }),
				licenseName: fields.text({ label: "许可协议名（可选）" }),
				licenseUrl: fields.text({ label: "许可协议链接（可选）" }),
				comment: fields.checkbox({ label: "开启评论", defaultValue: true }),
				password: fields.text({ label: "加密密码（可选）" }),
				passwordHint: fields.text({ label: "密码提示（可选）" }),

				content: fields.markdoc({ label: "正文" }),
			},
		}),
	},
});
