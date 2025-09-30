<<<<<<< HEAD
[Hux Blog](https://huangxuan.me)
================================

> I never expected this to become popular.

![](http://huangxuan.me/img/blog-desktop.jpg)


[User Manual 👉](_doc/Manual.md)
--------------------------------------------------

### Getting Started

1. You will need [Ruby](https://www.ruby-lang.org/en/) and [Bundler](https://bundler.io/) to use [Jekyll](https://jekyllrb.com/). Following [Using Jekyll with Bundler](https://jekyllrb.com/tutorials/using-jekyll-with-bundler/) to fullfill the enviromental requirement.

2. Installed dependencies in the `Gemfile`:

```sh
$ bundle install 
```

3. Serve the website (`localhost:4000` by default):

```sh
$ bundle exec jekyll serve  # alternatively, npm start
```

### Development (Build From Source)

To modify the theme, you will need [Grunt](https://gruntjs.com/). There are numbers of tasks you can find in the `Gruntfile.js`, includes minifing JavaScript, compiling `.less` to `.css`, adding banners to keep the Apache 2.0 license intact, watching for changes, etc. 

Yes, they were inherited and are extremely old-fashioned. There is no modularization and transpilation, etc.

Critical Jekyll-related code are located in `_include/` and `_layouts/`. Most of them are [Liquid](https://github.com/Shopify/liquid/wiki) templates.

This theme uses the default code syntax highlighter of jekyll, [Rouge](http://rouge.jneen.net/), which is compatible with Pygments theme so just pick any pygments theme css (e.g. from [here](http://jwarby.github.io/jekyll-pygments-themes/languages/javascript.html) and replace the content of `highlight.less`.


### Interesting to know more? Checkout the [full user manual](_doc/Manual.md)!


Other Resources
---------------

Ports
- [**Hexo**](https://github.com/Kaijun/hexo-theme-huxblog) by @kaijun
- [**React-SSR**](https://github.com/LucasIcarus/huxpro.github.io/tree/ssr) by @LucasIcarus

[Starter/Boilerplate](https://github.com/huxpro/huxblog-boilerplate)
- Out of date. Helps wanted for updating it on par with the main repo

Translation
- [🇨🇳  中文文档（有点过时）](https://github.com/Huxpro/huxpro.github.io/blob/master/_doc/README.zh.md)


License
-------

Apache License 2.0.
Copyright (c) 2015-present Huxpro

Hux Blog is derived from [Clean Blog Jekyll Theme (MIT License)](https://github.com/BlackrockDigital/startbootstrap-clean-blog-jekyll/)
Copyright (c) 2013-2016 Blackrock Digital LLC.
=======
## You like and use this theme? Then support me. Just [paypal.me/PhlowMedia](https://www.paypal.me/PhlowMedia) :)

# Newsletter: Stay in Touch for Future Updates

If you are a webdesigner interested in Jekyll, the static website generator, this little newsletter is for you. I share tutorials, clever code snippets and information about my own Jekyll Themes called [*Feeling Responsive*][7] and [*Simplicity*][8]. Please don't expect weekly emails :)

[![Subscribe to Jekyll Newsletter](https://phlow.github.io/static/tinyletter_subscribe_button.png)](https://tinyletter.com/feeling-responsive)


[![Start Video](https://github.com/Phlow/feeling-responsive/blob/gh-pages/images/video-feeling-responsive-1280x720.jpg)](https://www.youtube.com/embed/3b5zCFSmVvU)

## A Responsive Jekyll Theme: *Feeling Responsive*

Do you want to get to know *Feeling Responsive*? Than check it out first and have a look on its home at  <http://phlow.github.io/feeling-responsive/>.

To get to know *Feeling Responsive* check out all the features explained in the [documentation][1].

And what license is *Feeling Responsive* released under? [This one][2].



## Why use this theme?

Feeling Responsive is heavily customizable.

1. Language-Support :)
2. Optimized for speed and it's responsive.
3. Built on Foundation Framework.
4. Six different Headers.
5. Customizable navigation, footer,...

**[More ›][3]**



## Changelog

*Feeling Responsive* is in active development. Thank you to everyone who contributed, especially [Róbert Papp][5], [Alexandra von Criegern](https://github.com/plutonik-a) and [Juan Jose Amor Iglesias](https://github.com/jjamor).

**[Read Changelog ›][6]**



## Video Tutorial

Click the image to [watch the YouTube-Video-Tutorial][4].

[![Start Video](https://github.com/Phlow/feeling-responsive/blob/gh-pages/images/video-feeling-responsive-tutorial-frontpage.jpg)](https://www.youtube.com/watch?v=rLS-BEvlEyY)








 [1]: http://phlow.github.io/feeling-responsive/documentation/
 [2]: https://github.com/Phlow/feeling-responsive/blob/gh-pages/LICENSE
 [3]: http://phlow.github.io/feeling-responsive/info/
 [4]: https://www.youtube.com/watch?v=rLS-BEvlEyY
 [5]: https://github.com/TWiStErRob
 [6]: https://phlow.github.io/feeling-responsive/changelog/
 [7]: http://phlow.github.io/feeling-responsive/
 [8]: http://phlow.github.io/simplicity/
 [9]: #
 [10]: #
>>>>>>> 01b5b3ba47b23071dd683b0700d15e8413e0da9c
