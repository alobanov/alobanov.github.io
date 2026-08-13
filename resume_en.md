---
layout: page
title: CV
permalink: /about_en/
---

{% assign this_year = 'now' | date: "%Y" | plus: 0 %}
{% assign years_of_experience = this_year | minus: site.data.cv.since %}

<img src="/assets/img/workplace.jpeg" alt="Aleksei Lobanov at his workplace"
     class="full-width-rounded-image" width="1200" height="801" loading="lazy" decoding="async">

<div class="bubble yellow">
  👋 I'm <strong>Aleksei Lobanov</strong>, a mobile engineer.
  I've been building apps since <strong class="stat-c stat-c--game">{{ site.data.cv.since }}</strong> —
  that's <strong class="stat-c stat-c--location">{{ years_of_experience }}</strong> years,
  from Objective-C through native iOS to Flutter today.
  I care about interfaces that behave the way people expect, and I get involved early,
  telling designers and managers how a screen should actually work before it gets built.
  These days a lot of that work happens with coding agents in the loop — this site among them.
  <hr class="bubble-sep">
  <dl class="cv-facts">
    {%- for fact in site.data.cv.facts %}
    <div class="cv-fact">
      <dt>{{ fact.label }}</dt>
      <dd>
        {%- if fact.link -%}
          <a href="{{ fact.link }}"{% unless fact.link contains 'mailto:' %} target="_blank" rel="noopener"{% endunless %}>{{ fact.value }}</a>
        {%- else -%}
          {{ fact.value }}
        {%- endif -%}
      </dd>
    </div>
    {%- endfor %}
    <div class="cv-fact">
      <dt>Elsewhere</dt>
      <dd class="cv-elsewhere">
        {%- for link in site.data.cv.links %}
        <a href="{{ link.url }}" target="_blank" rel="noopener">{{ link.label }}</a>
        {%- endfor %}
      </dd>
    </div>
  </dl>
</div>

<h2 class="cv-section">Skills</h2>

<div class="cv-skills">
  {%- for group in site.data.cv.skills %}
  <div class="cv-skill-group">
    <div class="cv-skill-label">{{ group.label }}</div>
    <div class="cv-skill-items">
      {%- for item in group.items %}<span class="cv-chip cv-chip--{{ group.kind }}">{{ item }}</span>{% endfor -%}
    </div>
  </div>
  {%- endfor %}
</div>

<h2 class="cv-section">Experience</h2>

{% include cv_experience.html %}

<h2 class="cv-section">Education</h2>

<div class="bubble">
{% capture markdown_content %}
**{{ site.data.cv.education.degree }}** — {{ site.data.cv.education.field }}, {{ site.data.cv.education.years }}

Recognised by [Anabin](http://anabin.kmk.org/): {% for l in site.data.cv.education.links %}[{{ l.label }}]({{ l.url }}){% unless forloop.last %}, {% endunless %}{% endfor %}
{% endcapture %}
{{ markdown_content | markdownify }}
</div>

{% include grain_import.html %}
