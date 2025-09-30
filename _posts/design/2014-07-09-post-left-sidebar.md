---
layout: page
sidebar: left
subheadline: 模板
title:  "带左侧边栏的页面/文章"
teaser: "这是一个带左侧边栏的页面/文章示例。"
breadcrumb: true
tags:
    - 文章格式
categories:
    - 设计
image:
    thumb: gallery-example-3-thumb.jpg
    title: gallery-example-3.jpg
    caption_url: http://unsplash.com
---
*Feeling Responsive* 默认显示元数据。默认行为可以通过 `config.yml` 更改。要在页面/文章末尾显示元数据，只需在 Front Matter 中添加以下内容：
<!--more-->

~~~
show_meta: true
~~~

如果您不想显示元数据，也很简单：

~~~
show_meta: false
~~~


## 其他文章格式
{: .t60 }
{% include list-posts tag='文章格式' %}
