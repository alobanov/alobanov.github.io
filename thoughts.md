---
layout: thoughts 
title: Thoughts
permalink: /thoughts/
---

{% for thought in site.thoughts %}
<div class="bubble">
  {{ thought.content | markdownify }}
</div>
{% endfor %}