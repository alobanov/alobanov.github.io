---
layout: post
title: Write the Spec First
description: Vibe coding worked for prototypes. For real projects, AI needs a blueprint — not a wish.
tags:
  - Thoughts
---

<style>
.lang-toggle {
  position: absolute;
  top: 15px;
  right: 18px;
  display: flex;
  gap: 6px;
}
.lang-btn {
  font-family: var(--code-font);
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--background-color-light);
  color: var(--primary-color);
  cursor: pointer;
  margin: 0;
  transition: background-color 0.2s ease;
}
.lang-btn.active {
  background-color: var(--secondary-color);
  color: var(--background-color);
  border-color: var(--secondary-color);
}
</style>

<div class="lang-toggle">
  <button class="lang-btn active" onclick="setLang('en')">EN</button>
  <button class="lang-btn" onclick="setLang('ru')">RU</button>
</div>

<div id="lang-en" markdown="1">

---

> I typed: *"Add biometric authentication with token refresh"*. The AI built it. It ran. Unit tests passed. Then code review happened — and the whole thing had to be thrown out. No one had talked about the existing Keychain wrapper, the token rotation strategy already in place, or that `BiometricService` was already handling the LAContext lifecycle.

<div class="spacer"></div>

The code was correct. The spec was missing.

<div class="spacer"></div>

---

## The Pattern Everyone Hits

AI coding agents are fast. Dangerously fast. You describe a feature in a sentence, and within seconds you have a full implementation — view models, services, tests.

<div class="spacer"></div>

The problem: **the AI implements what it guesses you want, not what you actually want**. And the gap between those two things is where all the rewrites live.

<div class="spacer"></div>

It has a name now: **context collapse**. The moment the agent forgets what it was supposed to be building — because the context window filled up, or because the original intent was never precise enough to survive the session.

<div class="spacer"></div>

---

## Spec-Driven Development

The fix isn't a better prompt. It's a better spec.

<div class="spacer"></div>

**Spec-Driven Development (SDD)** flips the workflow: instead of jumping straight to *"implement this"*, you write a structured spec first — what we're building, why, and the constraints. Then the AI implements *against that spec*.

<div class="spacer"></div>

The workflow has four phases:

1. **Specify** — write the spec in markdown, stored in the repo
2. **Plan** — AI breaks the spec into tasks
3. **Review** — tasks are validated by a human
4. **Implement** — AI writes code against the approved task list

<div class="spacer"></div>

You own the spec. The agent owns nothing — it just implements.

<div class="spacer"></div>

---

## What a Spec Looks Like

A spec isn't a novel. It's a short markdown file — what we're building, the constraints, and the decisions that aren't obvious from the code.

<div class="spacer"></div>

{% highlight markdown %}
## Feature: Biometric Authentication

### Goal
Add Face ID / Touch ID login using the existing `BiometricService`.

### Constraints
- Must use existing `KeychainWrapper` for token storage
- Token refresh handled by `AuthInterceptor` — do not duplicate
- LAContext lifecycle is managed by `BiometricService` — do not create new instances
- No new dependencies

### Out of scope
- Passcode fallback UI (separate ticket)
- Android biometrics
{% endhighlight %}

<div class="spacer"></div>

That's it. Five lines of constraints. But now the AI has a contract, not a wish.

<div class="spacer"></div>

---

## The Shift

Vibe coding felt like magic when it worked. But as the codebase grows, prompts get longer, the agent starts contradicting itself, and you spend more time debugging AI output than writing code.

<div class="spacer"></div>

Spec-driven development doesn't remove AI from the loop. It gives AI something solid to work against. Tools like [GitHub Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) are already making this a first-class workflow.

<div class="spacer"></div>

The new developer role isn't typing code. It's **writing specs and reviewing implementations**. That's the job now.

</div>

<div id="lang-ru" style="display:none" markdown="1">

---

> Я написал: *«Добавь биометрическую аутентификацию с обновлением токена»*. AI построил. Запустилось. Юнит-тесты прошли. Потом был код-ревью — и всё выбросили. Никто не говорил о существующем `KeychainWrapper`, о стратегии ротации токенов, которая уже была, и о том, что `BiometricService` уже управляет жизненным циклом `LAContext`.

<div class="spacer"></div>

Код был правильным. Спека не было.

<div class="spacer"></div>

---

## Паттерн, на который все натыкаются

AI-агенты быстрые. Опасно быстрые. Описываешь фичу одним предложением — и через секунды у тебя полная реализация: вью-модели, сервисы, тесты.

<div class="spacer"></div>

Проблема: **AI реализует то, что, по его мнению, ты хочешь — а не то, что ты на самом деле хочешь**. И в этом разрыве живут все переписывания.

<div class="spacer"></div>

У этого есть имя: **context collapse**. Момент, когда агент забывает, что вообще строил — потому что контекстное окно переполнилось, или потому что изначальное намерение было недостаточно точным, чтобы пережить сессию.

<div class="spacer"></div>

---

## Spec-Driven Development

Решение — не лучший промпт. Это лучший спек.

<div class="spacer"></div>

**Spec-Driven Development (SDD)** переворачивает воркфлоу: вместо того, чтобы сразу говорить *«реализуй это»*, сначала пишешь структурированный спек — что строим, почему, ограничения. Потом AI реализует *по этому спеку*.

<div class="spacer"></div>

Воркфлоу из четырёх этапов:

1. **Specify** — пишешь спек в markdown, он хранится в репо
2. **Plan** — AI разбивает спек на задачи
3. **Review** — задачи проверяет человек
4. **Implement** — AI пишет код по утверждённому списку задач

<div class="spacer"></div>

Спек — твоя зона. Агент ничем не владеет — он просто реализует.

<div class="spacer"></div>

---

## Как выглядит спек

Спек — не роман. Это короткий markdown-файл — что строим, ограничения и решения, которые не очевидны из кода.

<div class="spacer"></div>

{% highlight markdown %}
## Feature: Biometric Authentication

### Goal
Add Face ID / Touch ID login using the existing `BiometricService`.

### Constraints
- Must use existing `KeychainWrapper` for token storage
- Token refresh handled by `AuthInterceptor` — do not duplicate
- LAContext lifecycle is managed by `BiometricService` — do not create new instances
- No new dependencies

### Out of scope
- Passcode fallback UI (separate ticket)
- Android biometrics
{% endhighlight %}

<div class="spacer"></div>

Всё. Пять строк ограничений. Но теперь у AI есть контракт, а не пожелание.

<div class="spacer"></div>

---

## Перемены

Vibe coding ощущался как магия, когда работал. Но по мере роста кодовой базы промпты становятся длиннее, агент начинает противоречить сам себе, и ты тратишь больше времени на отладку AI-вывода, чем на написание кода.

<div class="spacer"></div>

Spec-driven development не убирает AI из процесса. Он даёт AI что-то надёжное, против чего работать. Инструменты вроде [GitHub Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) уже делают это первоклассным воркфлоу.

<div class="spacer"></div>

Новая роль разработчика — не набирать код. Это **писать спеки и проверять реализации**. Теперь это и есть работа.

</div>

<script>
(function () {
  var btns = document.querySelectorAll('.lang-btn');
  window.setLang = function (lang) {
    document.getElementById('lang-en').style.display = lang === 'en' ? 'block' : 'none';
    document.getElementById('lang-ru').style.display = lang === 'ru' ? 'block' : 'none';
    btns.forEach(function (b) {
      b.classList.toggle('active', b.textContent.toLowerCase() === lang);
    });
    localStorage.setItem('post-lang-spec', lang);
  };
  var saved = localStorage.getItem('post-lang-spec');
  if (saved && saved !== 'en') setLang(saved);
})();
</script>
