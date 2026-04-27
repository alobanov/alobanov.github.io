---
layout: post
title: GitTown
superscript: Simplifying Git workflows
description: Git Town simplifies Git usage, making it more convenient so developers can use its full potential.
tags:
  - Git
---

--- 

> A familiar situation: someone writes in the team chat — *"I pushed changes, please rebase"*. You have to stop what you're doing and run several commands to update. It's routine that breaks your focus. I decided to find a solution and discovered there are many options. After researching several, I chose [GitTown](https://www.git-town.com) — a tool that speeds up routine Git tasks.

<br/>

---

## Trunk-Based Development

Using **trunk-based development** means regularly merging changes from feature branches into the main branch, keeping it up to date and working.

<div class="spacer"></div>

For each new feature, fix, or improvement, a separate branch is created and merged into the main branch as soon as the work is done.

<div class="spacer"></div>

I use rebase to keep history clean, and squash many small commits into one (**squash commit**). This simplifies the integration process and helps avoid conflicts in an actively changing repository.

<div class="spacer"></div>

That's why syncing with the main branch happens quite often, and if you add a **stacked branch** approach on top of that, it can take a lot of time and become tedious routine.

<br/>

---

## New feature branch

While in a working branch <span class="wordcode">current-feature</span>, I can run <span class="wordcode">git town hack feat/mob-1-test-fix</span>. This command automates several routine operations: it first syncs the main branch with remote (to avoid future conflicts), then creates a new branch from the updated main and automatically switches to it.

<div class="spacer"></div>

{% highlight bash %}
~ on [current-feature] git town hack feat/mob-1-test-fix

[current-feature] git fetch --prune --tags
[current-feature] git checkout develop
[develop] git rebase origin/develop
[develop] git checkout -b feat/mob-1-test-fix

~ on [feat/mob-1-test-fix]
{% endhighlight %}

<small>Log of the <span class="wordcode">hack</span> command</small> 👆

<div class="spacer"></div> 

---

## Quick sync

Working in a <span class="wordcode">feature branch</span>, you need to update the main branch and rebase to integrate the latest changes. The <span class="wordcode">git town sync</span> command automates this process: it updates the main branch and performs a rebase, simplifying synchronization.

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

<small>Log of the <span class="wordcode">sync</span> command</small> 👆

<div class="spacer"></div> 

---

## Stacked branches

The most convenient command to use is <span class="wordcode">stacked branch</span>. To add a new feature on top of the current branch, simply run <span class="wordcode">append</span>. The branch structure can be viewed with the <span class="wordcode">branch</span> command.

<div class="spacer"></div>

Then, switch to the last branch in the stack and run <span class="wordcode">git town sync</span>. This command syncs all branches sequentially — starting from the main branch and ending with the current one.

<div class="spacer"></div>

{% highlight bash %}
~ on [MOB-current-feature] git town branch

 develop
   mob-1-current-feature
*    mob-2-add-more-ui

{% endhighlight %}
<small>Log of the <span class="wordcode">branch</span> command</small> 👆

<div class="spacer"></div>
