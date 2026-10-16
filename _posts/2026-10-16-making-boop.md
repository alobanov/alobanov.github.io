---
layout: post
title: Making Boop
icon: "📓"
superscript: Three trackers, one notebook, and a lot of App Store paperwork
description: Why I built a journaling app that turns a few lines and a mood into a doodle — and what actually ate the time along the way.
tags:
  - Projects
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
.boop-banner {
  display: block;
  width: 100%;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  margin: 0;
}
.boop-shot {
  display: block;
  max-width: 260px;
  margin: 0 auto;
  border-radius: 22px;
  border: 1px solid var(--border-color);
  box-shadow: 0 16px 34px -14px rgba(0, 0, 0, 0.25);
}
.boop-caption {
  display: block;
  text-align: center;
  font-family: var(--code-font);
  font-size: 12px;
  opacity: 0.6;
  margin-top: 8px;
}
</style>

<div class="lang-toggle">
  <button class="lang-btn active" onclick="setLang('en')">EN</button>
  <button class="lang-btn" onclick="setLang('ru')">RU</button>
</div>

<div id="lang-en" markdown="1">

---

> For a while I was tracking my days across three different apps — one for notes, one for habits — plus an actual paper notebook, because that's where I draw. This is roughly how that turned into one app instead.

<div class="spacer"></div>

<figure>
  <img src="/assets/img/boop/header-poster.jpg" alt="Boop app banner: hand-drawn doodle icons surrounding the Boop diary and habits logo" class="boop-banner" />
</figure>

<div class="spacer"></div>

## The Itch

I had a notes app for writing down what happened during the day. A separate habit tracker, the usual grid of checkmarks. And my real notebook, on paper, where I've drawn little sketches for years instead of just writing things down. None of these talked to each other, and the one I actually liked using was the one that couldn't live on my phone.

<div class="spacer"></div>

That's basically the whole origin story. I wasn't chasing a gap in the market or sketching out a business — I was just annoyed that one simple habit needed three tools, and the part I actually cared about, the sketching, kept getting left out of whatever I used digitally.

<div class="spacer"></div>

---

## The Idea

What I landed on: write a couple of lines, pick a mood, tick off whatever habits you track — and let the app turn that into a small drawing for the day. Less typing, more doodle. Do it daily and the days start piling up into something like a yearly canvas, the same way a page-a-day notebook works, except this one draws for you.

<div class="spacer"></div>

Once I had that shape in my head, a few other calls followed pretty naturally. No accounts, no ads, no tracking what you actually write — a diary that phones home kind of defeats the point of being a diary. That call ended up shaping a good chunk of the technical side, too.

<div class="spacer"></div>

<figure>
  <img src="/assets/img/boop/day-entry.webp" alt="A Boop diary entry: a few lines of text, small doodles, and a row of habit counters for water, reading, morning routine and coffee" class="boop-shot" />
  <figcaption class="boop-caption">One day: a few lines, a mood, habits ticked off</figcaption>
</figure>

<div class="spacer"></div>

---

## Picking the Stack

I wanted one codebase for both iOS and Android, and I wanted "no backend" to actually be true, not just a line in the privacy policy.

<div class="spacer"></div>

| Layer | Choice | Why |
|---|---|---|
| Framework | **Flutter** | One codebase, iOS and Android both |
| State | **BLoC** + **freezed** | Something consistent for state that's always changing — every word typed, every habit tapped |
| Storage | **Drift** | A local database — nothing to host, nothing to pay for, nothing that can leak |
| iOS extras | **WidgetKit** | So the year-canvas also works as a home screen widget |

<div class="spacer"></div>

Drift mattered more than I expected going in. Without a backend, the local database is pretty much the whole data story of the app — get it wrong, and there's no server to quietly fix things from.

<div class="spacer"></div>

---

## Friends Are Better Than Any QA Team

Honestly, the biggest jump in quality didn't come from me sitting and testing my own app. I put a handful of friends on TestFlight, and the bugs they ran into were the ones I was never going to find on my own — the kind that only show up when it's someone else's routine, someone else's habits, someone else's way of poking at a screen.

<div class="spacer"></div>

<figure>
  <img src="/assets/img/boop/appearance.webp" alt="Boop's appearance settings: theme, background color, text size, font and paper style options" class="boop-shot" />
  <figcaption class="boop-caption">Half of these settings exist because a friend asked for them</figcaption>
</figure>

<div class="spacer"></div>

If you're building something on your own, get it in front of real people before you feel ready. A week of that does more than a month of testing it yourself.

<div class="spacer"></div>

---

## The Real Bottleneck Wasn't the Code

Here's something that caught me off guard: writing the app wasn't the slow part. Getting it in front of people was. Setting up the Apple Developer account, getting through App Store review, sorting out the metadata and screenshots — all of that ate way more time than any bug fix did.

<div class="spacer"></div>

If you're planning to ship something solo, leave real time for this step specifically. It's not a formality tacked on at the end, it's basically its own project.

<div class="spacer"></div>

---

## What's Next

Boop's live on iOS and Android right now. Next up is mostly paperwork again, not code — getting through Google Play's own registration, which I'm expecting to be its own version of the App Store slog I just finished.

<div class="spacer"></div>

<figure>
  <img src="/assets/img/boop/year-canvas.webp" alt="The Boop year view: hundreds of small colorful doodles tiling into a canvas for 2026" class="boop-shot" />
  <figcaption class="boop-caption">365 small drawings, one canvas</figcaption>
</figure>

<div class="spacer"></div>

If you want to see where the notebook ended up, it's here:

<div class="spacer"></div>

**[Visit Boop →](https://alobanov.github.io/getboop/)**

</div>

<div id="lang-ru" markdown="1" style="display: none">

---

> Какое-то время я вёл свой день сразу в трёх приложениях — одно для заметок, другое для привычек — плюс настоящий бумажный блокнот, потому что рисую я именно там. Вот примерно как это всё свелось в одно приложение.

<div class="spacer"></div>

<figure>
  <img src="/assets/img/boop/header-poster.jpg" alt="Баннер Boop: рисованные от руки иконки вокруг логотипа Boop diary and habits" class="boop-banner" />
</figure>

<div class="spacer"></div>

## Раздражение, с которого всё началось

У меня было приложение для заметок — записывать, что случилось за день. Отдельный трекер привычек с обычной сеткой галочек. И настоящий блокнот на бумаге, где я годами рисовал скетчи вместо того, чтобы просто писать. Друг с другом они не общались, а то, что мне реально нравилось использовать, не могло жить в телефоне.

<div class="spacer"></div>

Это, по сути, вся история целиком. Я не искал нишу на рынке и не продумывал бизнес — просто раздражало, что для одной простой привычки нужно три инструмента, а то, что мне было важнее всего, скетчи, постоянно оставалось за бортом цифровой версии.

<div class="spacer"></div>

---

## Идея

В итоге получилось так: пишешь пару строк, выбираешь настроение, отмечаешь привычки — а приложение превращает это в маленький рисунок дня. Меньше печатать, больше получать скетч. Делаешь так каждый день — и дни постепенно складываются в что-то вроде холста на год, как в блокноте «страница в день», только тут рисует не ты, а он.

<div class="spacer"></div>

Как только эта форма сложилась в голове, следом довольно естественно пришли и другие решения. Без аккаунтов, без рекламы, без отслеживания того, что человек реально пишет — дневник, который звонит домой, как-то сразу перестаёт быть дневником. Это решение потом сильно определило и техническую часть.

<div class="spacer"></div>

<figure>
  <img src="/assets/img/boop/day-entry.webp" alt="Запись дня в Boop: пара строк текста, маленькие скетчи и счётчики привычек — вода, чтение, утренний ритуал, кофе" class="boop-shot" />
  <figcaption class="boop-caption">Один день: пара строк, настроение, отмеченные привычки</figcaption>
</figure>

<div class="spacer"></div>

---

## Выбор стека

Хотелось одну кодовую базу под iOS и Android, и хотелось, чтобы «без бэкенда» было правдой на самом деле, а не просто строчкой в политике конфиденциальности.

<div class="spacer"></div>

| Слой | Выбор | Почему |
|---|---|---|
| Фреймворк | **Flutter** | Одна кодовая база, сразу iOS и Android |
| Состояние | **BLoC** + **freezed** | Что-то предсказуемое для состояния, которое меняется постоянно — каждое набранное слово, каждая отмеченная привычка |
| Хранение | **Drift** | Локальная база данных — ничего не хостить, не оплачивать и нечему утекать |
| Отдельно для iOS | **WidgetKit** | Чтобы холст года работал ещё и как виджет на главном экране |

<div class="spacer"></div>

Drift оказался важнее, чем я думал на старте. Без бэкенда локальная база данных — это, по сути, вся история данных приложения. Ошибёшься здесь — и нет сервера, на который можно тихо всё свалить и починить.

<div class="spacer"></div>

---

## Друзья лучше любой команды QA

Если честно, самый большой скачок в качестве случился не от того, что я сам сидел и тестировал своё приложение. Я позвал несколько друзей в TestFlight, и баги, на которые они натыкались, были ровно те, что я сам никогда бы не нашёл — такие, что всплывают только тогда, когда это чужой распорядок дня, чужие привычки, чужая манера тыкать в экран.

<div class="spacer"></div>

<figure>
  <img src="/assets/img/boop/appearance.webp" alt="Настройки внешнего вида в Boop: тема, цвет фона, размер текста, шрифт и стиль бумаги" class="boop-shot" />
  <figcaption class="boop-caption">Половина этих настроек существует, потому что их попросил добавить друг</figcaption>
</figure>

<div class="spacer"></div>

Если делаете что-то в одиночку — покажите это реальным людям раньше, чем почувствуете, что готовы. Одна такая неделя даёт больше, чем месяц тестирования самим собой.

<div class="spacer"></div>

---

## Настоящим узким местом оказался не код

Вот что застало меня врасплох: написать приложение оказалось не самой медленной частью. Медленной частью оказалось донести его до людей. Завести аккаунт Apple Developer, пройти ревью App Store, привести в порядок метаданные и скриншоты — всё это съело куда больше времени, чем любое исправление багов.

<div class="spacer"></div>

Если планируете соло-запуск — закладывайте на этот шаг реальное время отдельно. Это не формальность под конец, это отдельный проект.

<div class="spacer"></div>

---

## Что дальше

Boop сейчас живёт и в iOS, и в Android. Дальше снова в основном бумажная работа, а не код — регистрация в Google Play, и я уже готовлюсь, что это будет свой собственный марафон вроде того, что я только что прошёл с App Store.

<div class="spacer"></div>

<figure>
  <img src="/assets/img/boop/year-canvas.webp" alt="Холст года в Boop: сотни маленьких цветных скетчей складываются в полотно на 2026 год" class="boop-shot" />
  <figcaption class="boop-caption">365 маленьких рисунков — один холст</figcaption>
</figure>

<div class="spacer"></div>

Если хочется посмотреть, во что превратился блокнот:

<div class="spacer"></div>

**[Заглянуть в Boop →](https://alobanov.github.io/getboop/)**

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
    localStorage.setItem('post-lang-boop', lang);
  };
  var saved = localStorage.getItem('post-lang-boop');
  if (saved && saved !== 'en') setLang(saved);
})();
</script>
