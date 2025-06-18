---
title: 'Tag Archive'
layout: 'layouts/feed'
pagination:
  data: collections
  size: 1
  alias: tag
  # Filter out collections we don't want to include
  # filter: ['all', 'nav', 'blog', 'work', 'featuredWork', 'people', 'rss']
permalink: '/tag/{{ tag | slugify }}/'
---
