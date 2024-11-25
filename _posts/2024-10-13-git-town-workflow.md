---
layout: post
title:  GitTown
superscript: Упрощяем работу с Git
description: Git Town упрощает использование Git, делая его удобнее, чтобы разработчики могли использовать его возможности на полную.
tags:
  - Git
---

--- 

> Знакомая ситуация: кто-то пишет в рабочем чате — *“я внёс изменения, ребейзнитесь, пожалуйста”*. Приходится прерывать работу, выполнять несколько команд для обновления. Это рутина, которая отвлекает. Я решил найти решение и обнаружил, что их много. После изучения нескольких вариантов я выбрал [GitTown](https://www.git-town.com) — инструмент, который ускоряет рутинные задачи при работе с **Git**.

<br/>

---

## Trunk-Base

Используя **trunk-based development**, который подразумевает регулярное слияние изменений из рабочих веток в основную, поддерживая её актуальной и рабочей. 

<div class="spacer"></div>

Для каждой новой фичи, исправления или улучшения создается отдельная ветка и сливается в основную, как только работа завершена.

<div class="spacer"></div>

Использую ребейз, чтобы сохранять историю чистой, а множество мелких коммитов объединяю в один (**squash-commit**). Это упрощает процесс интеграции и помогает избежать сложностей при слиянии в активно изменяемом репозитории.

<div class="spacer"></div>

Поэтому cинхронизация с основной веткой происходит довольно часто, а если добавить использование подхода **stacked branch** это может отнимать много времени и превращаться в рутину.

<br/>

---

## Новая фича ветка

Находясь в рабочей ветке <span class="wordcode">current-feature</span>, я могу выполнить <span class="wordcode">git town hack feat/mob-1-test-fix</span>. Эта команда автоматизирует несколько рутинных операций: сначала синхронизирует основную ветку с удалённой (чтобы избежать конфликтов в будущем), затем создаст новую ветку от обновлённой основной и автоматически переключит меня на неё.

<div class="spacer"></div>

{% highlight bash %}
~ on [current-feature] git town hack feat/mob-1-test-fix

[current-feature] git fetch --prune --tags
[current-feature] git checkout develop
[develop] git rebase origin/develop
[develop] git checkout -b feat/mob-1-test-fix

~ on [feat/mob-1-test-fix]
{% endhighlight %}

<small>Лог команды <span class="wordcode">hack</span></small> 👆

<div class="spacer"></div> 

---

## Быстрая синхронизация

Работая в <span class="wordcode">feature-ветке</span>, нужно обновить основную ветку и выполнить ребейз для интеграции последних изменений. Команда <span class="wordcode">git town sync</span> автоматизирует этот процесс: обновляет основную ветку и выполняет ребейз, упрощая синхронизацию.

<div class="spacer"></div>

{% highlight bash %}
~ on [MOB-current-feature] git town sync

[MOB-current-feature] git fetch --prune --tags
[MOB-current-feature] git checkout develop
[develop] git rebase origin/develop
[develop] git checkout MOB-current-feature
[MOB-current-feature] git rebase develop
[MOB-current-feature] git push -u origin MOB-current-feature

~ on [MOB-current-feature]
{% endhighlight %}

<small>Лог команды <span class="wordcode">sync</span></small> 👆

<div class="spacer"></div> 

---

## Stacked branshes

Наиболее удобно использовать команду <span class="wordcode">stacked branch</span>. Чтобы добавить новую функцию на основе текущей ветки, просто выполните команду <span class="wordcode">append</span>. Структуру веток можно просмотреть с помощью команды <span class="wordcode">branch<span>.

<div class="spacer"></div>

Далее, перейдите на последнюю ветку в стеке и запустите <span class="wordcode">git town sync</span>. Эта команда синхронизирует все ветки последовательно — начиная с основной и заканчивая текущей.

<div class="spacer"></div>

{% highlight bash %}
~ on [MOB-current-feature] git town branch

 develop
   mob-1-current-feature
*    mob-2-add-more-ui

{% endhighlight %}
<small>Лог команды <span class="wordcode">branch</span></small> 👆

<div class="spacer"></div> 