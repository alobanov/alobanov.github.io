---
layout: post
title: Anatomy of a Prompt
superscript: Ghostty, Starship and the rest of the stack
description: A line-by-line guide to my terminal setup — what every segment of the prompt means, how it is built, and what it costs.
tags:
  - Tools
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
.terminal-shot {
  display: block;
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background-color: #0f1419;
  margin: 0;
}
.terminal-shot-caption {
  display: block;
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

> Every time someone sees my terminal over a screen share, the same question comes up: *"what is that prompt?"*. So here is the whole thing — every segment, what produces it, and how to rebuild it from scratch.

<div class="spacer"></div>

This is what it looks like inside a repository:

<figure>
  <img src="/assets/img/terminal-prompt.png" alt="Terminal prompt showing a blue directory block reading risk, a yellow git branch block reading master, git status [!?] and metrics +1 -32, with Node and Docker context right-aligned, and the git email on a second line" class="terminal-shot" />
  <figcaption class="terminal-shot-caption">Ghostty · ayu · JetBrains Mono Nerd Font · Starship</figcaption>
</figure>

<div class="spacer"></div>

Nine pieces of information, none of which I had to ask for. Where I am, which branch, that the working tree is dirty and has untracked files, that I am one commit ahead in additions and thirty-two in deletions, which Node version this project uses, which Docker context is active, and — critically — **which git identity I am committing as**.

<div class="spacer"></div>

That last one is not vanity. It is the reason the second line exists at all.

<div class="spacer"></div>

---

## The Stack

Four independent layers. You can adopt any one of them without the others.

<div class="spacer"></div>

| Layer | Tool | What it does |
|---|---|---|
| Terminal | **Ghostty** | Window, colours, transparency, font rendering |
| Font | **JetBrains Mono Nerd Font** | The glyphs — without it you get boxes |
| Prompt | **Starship** | Everything you see before the `❯` |
| Shell tooling | atuin, zoxide, fzf, eza, yazi | History, navigation, listing, file browsing |

<div class="spacer"></div>

Install all of it in one go:

{% highlight bash %}
brew install --cask ghostty font-jetbrains-mono-nerd-font
brew install starship atuin zoxide fzf eza yazi
{% endhighlight %}

<div class="spacer"></div>

---

## Layer 1 — The Terminal

Ghostty is a GPU-accelerated terminal written by Mitchell Hashimoto. It is fast, it is native on macOS, and — the part that matters here — it is configured by a plain text file rather than a settings panel.

<div class="spacer"></div>

The config lives at `~/Library/Application Support/com.mitchellh.ghostty/config` on macOS (or `~/.config/ghostty/config` if you prefer XDG). Mine, in full:

<div class="spacer"></div>

{% highlight ini %}
theme = ayu
window-padding-x = 24
window-padding-y = 0
window-padding-balance = true

font-family = "JetBrainsMono NFM Medium"
font-family-bold = "JetBrainsMono NFM Bold"
font-family-italic = "JetBrainsMono NFM Medium Italic"
font-family-bold-italic = "JetBrainsMono NFM Bold Italic"

font-size = 12
window-decoration = true

background-opacity = 0.85
background-blur-radius = 27

font-thicken = true
shell-integration = detect
shell-integration-features = sudo,no-cursor
cursor-style = bar
cursor-style-blink = true
mouse-hide-while-typing = true
confirm-close-surface = true
macos-icon = retro
macos-icon-frame = aluminum
macos-window-shadow = false
{% endhighlight %}

<div class="spacer"></div>

A few of these earn their place more than others:

<div class="spacer"></div>

- **`window-padding-x = 24`** — the single highest-impact line in the file. Text pinned to the window edge reads as cramped; 24px of breathing room does more for legibility than any colour scheme.
- **`background-opacity` + `background-blur-radius`** — translucency without the blur is unreadable noise. The two go together or not at all.
- **`shell-integration = detect`** — lets Ghostty know where prompts start and end, which is what makes scroll-to-previous-command work.
- **`font-thicken = true`** — macOS renders thin fonts thinner than you expect. This compensates.

<div class="spacer"></div>

Run `ghostty +show-config --default --docs` to see every option with inline documentation. It is one of the better-documented configs I have worked with.

<div class="spacer"></div>

---

## Layer 2 — The Font

This is the step people skip, and then nothing works.

<div class="spacer"></div>

The prompt uses glyphs — the powerline arrow ``, the git branch symbol ``, the Node hexagon `` — that do not exist in normal fonts. A **Nerd Font** is a regular font with those glyphs patched in. Without one you get `` boxes where the icons should be.

<div class="spacer"></div>

{% highlight bash %}
brew install --cask font-jetbrains-mono-nerd-font
{% endhighlight %}

<div class="spacer"></div>

Then point the terminal at it. Note the name in my config is `JetBrainsMono NFM` — **NFM** is the *Nerd Font Mono* variant, where the icons are squeezed into a single character cell. There is also plain **NF**, where icons take up two cells. NFM keeps column alignment predictable; NF looks slightly better at large sizes. Pick one and be consistent.

<div class="spacer"></div>

> If you are reading this article in a browser without a Nerd Font installed, some glyphs in the code blocks below will render as empty boxes. That is expected — they will look correct in your terminal.

<div class="spacer"></div>

---

## Layer 3 — The Prompt

[Starship](https://starship.rs) is a single binary that renders the prompt. It is cross-shell, it is configured in one TOML file, and it detects context automatically — you do not tell it "this is a Node project", it notices.

<div class="spacer"></div>

Hook it into zsh as the **last** line of your `~/.zshrc`, after any theme framework:

{% highlight bash %}
eval "$(starship init zsh)"
{% endhighlight %}

<div class="spacer"></div>

If you use oh-my-zsh, set `ZSH_THEME=""` so it does not fight Starship for the prompt.

<div class="spacer"></div>

### The format string is the table of contents

Everything in Starship flows from one `format` key in `~/.config/starship.toml`. Read it top to bottom and you have read the prompt:

<div class="spacer"></div>

{% highlight toml %}
add_newline = true
command_timeout = 2000

format = """\
[](fg:#3B76F0)\
$directory\
${custom.directory_separator_not_git}\
${custom.directory_separator_git}\
$git_branch[](fg:#FCF392)\
$git_commit$git_status$git_metrics$git_state$fill$cmd_duration$nodejs$all\
${custom.git_config_email}
$character"""
{% endhighlight %}

<div class="spacer"></div>

Two mechanics to notice before the modules themselves:

<div class="spacer"></div>

**Trailing backslashes.** Each `\` joins the next line without a newline. It lets you write the format one module per line — otherwise this would be one unreadable 300-character string.

<div class="spacer"></div>

**The line break is literal.** There is exactly one real newline in that string, right before `$character`. That is what puts the email on its own row and the `❯` below it.

<div class="spacer"></div>

`command_timeout = 2000` matters because of the custom modules further down — they shell out, and the default 500ms timeout will make Starship complain on a cold filesystem cache.

<div class="spacer"></div>

### The directory block

{% highlight toml %}
[directory]
truncate_to_repo = true
format = "[ $path ]($style)"
style = "fg:#ffffff bg:#3B76F0"
{% endhighlight %}

<div class="spacer"></div>

`truncate_to_repo = true` is the setting that makes this readable. Inside a repo it shows the repo name, not the eleven directories above it. `~/Development/work/clients/2026/risk-engine/apps/mobile` becomes `risk`.

<div class="spacer"></div>

The background colour is set on the *style*, not drawn separately — that is how you get a solid block rather than coloured text.

<div class="spacer"></div>

### The powerline trick

This is the part of the config I am most pleased with and the part that is least obvious.

<div class="spacer"></div>

A powerline separator is just the glyph `` painted with the previous block's colour as **foreground** and the next block's colour as **background**. Easy — except the colour that comes next depends on whether you are in a git repo. Inside a repo it is the yellow branch block; outside, it is nothing.

<div class="spacer"></div>

Starship has no `if` statement. But **custom modules have a `when` condition**, and a custom module with an empty command is a pure conditional renderer:

<div class="spacer"></div>

{% highlight toml %}
[custom.directory_separator_git]
description = "Separator after the directory when inside a git repository."
command = ""
format = "[](fg:#3B76F0 bg:#FCF392)"
when = "git rev-parse --is-inside-work-tree >/dev/null 2>&1"

[custom.directory_separator_not_git]
description = "Separator after the directory when NOT inside a git repository."
command = ""
format = "[](fg:#3B76F0)"
when = "! git rev-parse --is-inside-work-tree > /dev/null 2>&1"
{% endhighlight %}

<div class="spacer"></div>

Both sit in the format string next to each other. Exactly one ever renders. Inside a repo the arrow bridges blue into yellow; outside, it fades blue into the background. The seam is invisible either way.

<div class="spacer"></div>

Same trick, opposite end: `$git_branch[](fg:#FCF392)` closes the yellow block back to the background, and that closing arrow is written inline in the format string rather than as its own module — it only ever renders when `$git_branch` does.

<div class="spacer"></div>

### Git state

{% highlight toml %}
[git_branch]
symbol = " "
format = "[ $symbol$branch(:$remote_branch) ]($style)"
style = "fg:#1C3A5E bg:#FCF392"

[git_metrics]
disabled = false
{% endhighlight %}

<div class="spacer"></div>

`git_metrics` is **off by default** and worth turning on — it is the `+1 -32` in the sample prompt, lines added and deleted since the last commit. It is the difference between knowing you have changes and knowing how big they are.

<div class="spacer"></div>

`git_status` is on by default and needs no config. Its shorthand is worth memorising:

<div class="spacer"></div>

| Symbol | Meaning |
|---|---|
| `!` | modified files |
| `?` | untracked files |
| `+` | staged changes |
| `$` | stashed changes |
| `⇡` / `⇣` | ahead / behind remote |
| `=` | merge conflict |

<div class="spacer"></div>

So `[!?] +1 -32` reads as: modified and untracked files present, one line added, thirty-two removed.

<div class="spacer"></div>

### Pushing things to the right

{% highlight toml %}
[fill]
symbol = " "

[cmd_duration]
min_time = 2_000
format = "[ ⏲︎ $duration ]($style)"
style = "white"
{% endhighlight %}

<div class="spacer"></div>

The `fill` module expands to consume all remaining terminal width. Anything after it in the format string gets pushed to the right edge. That is how the Node version and Docker context end up right-aligned without any manual padding.

<div class="spacer"></div>

`cmd_duration` with `min_time = 2000` only appears when a command took longer than two seconds. Silent when it does not matter, informative when it does — which is the right default for almost every prompt segment.

<div class="spacer"></div>

### `$all` — the catch-all

The `$all` at the end of the format string is a wildcard: it renders every module not already mentioned explicitly. That is where `via  v24.4.0` and `via 🐳 colima` come from — I never configured a Node module or a Docker module. Starship detected a `package.json` and an active Docker context and said so.

<div class="spacer"></div>

Same for Python virtualenvs, Rust toolchains, Ruby versions, Kubernetes contexts, AWS profiles. It is the highest ratio of information to configuration in the whole file.

<div class="spacer"></div>

If a language shows up that you do not care about, disable it individually:

{% highlight toml %}
[ruby]
disabled = true
{% endhighlight %}

<div class="spacer"></div>

### The second line

{% highlight toml %}
[custom.git_config_email]
description = "Output the current git user's configured email address."
command = "git config user.email"
format = "\n[$symbol(  $output)]($style)"
when = "git rev-parse --is-inside-work-tree >/dev/null 2>&1"
style = "text"
{% endhighlight %}

<div class="spacer"></div>

This is the segment I would keep if I had to throw away the rest.

<div class="spacer"></div>

If you work across a personal account and a work account, you will eventually commit to one with the identity of the other. You will notice weeks later, in a code review, on a branch that has already been merged. The fix is `git config user.email` per repository — but only if you remember to check, and nobody remembers to check.

<div class="spacer"></div>

So the prompt checks. Every time. On its own line, in muted text, only inside repositories.

<div class="spacer"></div>

---

## Layer 4 — The Shell Around It

The prompt is what people notice. These are what I would actually miss.

<div class="spacer"></div>

### atuin — history that is a database

{% highlight bash %}
eval "$(atuin init zsh)"
bindkey '^R' atuin-search
bindkey '^[[A' atuin-search   # intercept the up arrow too
{% endhighlight %}

<div class="spacer"></div>

Atuin replaces `~/.zsh_history` with a SQLite database and gives you a full-screen fuzzy search over it, filtered by directory, with exit codes and durations recorded. The second `bindkey` is the opinionated part: it hijacks the **up arrow** as well, so the reflex you already have opens the good search instead of the bad one.

<div class="spacer"></div>

### zoxide — `cd` that learns

{% highlight bash %}
eval "$(zoxide init zsh)"
{% endhighlight %}

<div class="spacer"></div>

Tracks which directories you actually visit and ranks them by frequency and recency. `z risk` jumps to the risk-engine repo from anywhere. After a week of use you stop typing paths.

<div class="spacer"></div>

### fzf — fuzzy finding everywhere

{% highlight bash %}
source <(fzf --zsh)
{% endhighlight %}

<div class="spacer"></div>

One line, and `Ctrl-T` becomes a fuzzy file picker, `Alt-C` a fuzzy `cd`. Many other tools use fzf as a backend, so installing it makes things you have not installed yet better.

<div class="spacer"></div>

### eza — `ls` with git awareness

{% highlight bash %}
alias ee='eza --icons -l -F --colour=always -a --git --header --time-style=iso'
alias ee2='eza --icons -l -TL 2 --total-size -F --colour=always'
{% endhighlight %}

<div class="spacer"></div>

`--git` annotates each file with its git status, which is the flag that makes eza worth the switch. The second alias is a two-level tree with directory sizes — the fastest way to answer "what is taking up space here".

<div class="spacer"></div>

### yazi — a file manager that changes your shell's directory

{% highlight bash %}
function y() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
	yazi "$@" --cwd-file="$tmp"
	IFS= read -r -d '' cwd < "$tmp"
	[ -n "$cwd" ] && [ "$cwd" != "$PWD" ] && builtin cd -- "$cwd"
	rm -f -- "$tmp"
}
{% endhighlight %}

<div class="spacer"></div>

A child process cannot change its parent's working directory, so yazi writes its final directory to a temp file and the wrapper `cd`s there afterwards. Browse visually with `y`, quit, and the shell is already where you were looking.

<div class="spacer"></div>

### One more line worth stealing

{% highlight bash %}
precmd() { print -Pn "\e]0;%~\a" }
{% endhighlight %}

<div class="spacer"></div>

Sets the terminal tab title to the current directory before each prompt. Trivial, and the difference between six identifiable tabs and six tabs labelled "zsh".

<div class="spacer"></div>

---

## What It Costs

Pretty prompts have a reputation for being slow, and this one is not free. Starship will tell you exactly how much:

<div class="spacer"></div>

{% highlight bash %}
starship timings
{% endhighlight %}

<div class="spacer"></div>

Measured in a real repository on my machine:

<div class="spacer"></div>

{% highlight text %}
custom.git_config_email             -  15ms
custom.directory_separator_git      -   8ms
custom.directory_separator_not_git  -   7ms
ruby                                -   5ms
git_metrics                         -   4ms
directory                           -   4ms
git_branch                          -  <1ms
{% endhighlight %}

<div class="spacer"></div>

The three custom modules account for **30ms of the roughly 45ms total** — two thirds of the cost, for one email address and one cosmetic arrow. Each of them spawns a process on every single prompt, and the two separator modules both run their check even though only one can ever render.

<div class="spacer"></div>

Modules run in parallel, so the wall-clock hit is smaller than the sum. At 45ms it stays under the threshold where a prompt feels sluggish, and I consider the git identity check worth it. But it is a real trade, and it is worth knowing which lines in your config you are paying for. If you want the aesthetics without the cost, drop the separator modules and accept a hard colour edge — you get 15ms back for a change most people would not notice.

<div class="spacer"></div>

One more piece of honesty: my config carries a leftover `$symbol` in the format string. `symbol` is not a module, so Starship silently renders nothing for it. It has been there for a year doing absolutely nothing. Check your own config with `starship timings` — anything that never appears in the output is not running.

<div class="spacer"></div>

---

## Where to Start

If you adopt one thing from this article, make it the Nerd Font and Starship with a default config — that is fifteen minutes and most of the visual payoff.

<div class="spacer"></div>

If you adopt two, add atuin. Searchable history with directory context changes how you use a shell more than any prompt does.

<div class="spacer"></div>

The rest is decoration. Good decoration, tuned over a couple of years, and I would rebuild all of it on a new machine — but decoration.

<div class="spacer"></div>

> One warning before you copy anyone's dotfiles, mine included: check them for secrets first. API tokens exported in a `.zshrc` are the single most common way a private repo becomes a public incident. Keep them in a secret manager and read them at runtime.

</div>

<div id="lang-ru" markdown="1" style="display: none">

---

> Каждый раз, когда кто-то видит мой терминал в шаринге экрана, звучит один и тот же вопрос: *«что это за промпт?»*. Поэтому вот он целиком — каждый сегмент, что его порождает и как собрать всё с нуля.

<div class="spacer"></div>

Вот как это выглядит внутри репозитория:

<figure>
  <img src="/assets/img/terminal-prompt.png" alt="Промпт терминала: синяя плашка директории risk, жёлтая плашка ветки master, статус git [!?] и метрики +1 -32, справа версия Node и Docker-контекст, на второй строке git-email" class="terminal-shot" />
  <figcaption class="terminal-shot-caption">Ghostty · ayu · JetBrains Mono Nerd Font · Starship</figcaption>
</figure>

<div class="spacer"></div>

Девять единиц информации, ни одну из которых не пришлось запрашивать. Где я, какая ветка, что рабочее дерево грязное и есть неотслеживаемые файлы, что добавлена одна строка и удалено тридцать две, какая версия Node в проекте, какой Docker-контекст активен и — самое важное — **под какой git-личностью я коммичу**.

<div class="spacer"></div>

Последнее — не тщеславие. Именно ради него существует вторая строка.

<div class="spacer"></div>

---

## Стек

Четыре независимых слоя. Любой можно взять отдельно от остальных.

<div class="spacer"></div>

| Слой | Инструмент | Что делает |
|---|---|---|
| Терминал | **Ghostty** | Окно, цвета, прозрачность, рендер шрифта |
| Шрифт | **JetBrains Mono Nerd Font** | Глифы — без него будут квадраты |
| Промпт | **Starship** | Всё, что видно до `❯` |
| Обвязка | atuin, zoxide, fzf, eza, yazi | История, навигация, листинг, файловый менеджер |

<div class="spacer"></div>

Установить всё разом:

{% highlight bash %}
brew install --cask ghostty font-jetbrains-mono-nerd-font
brew install starship atuin zoxide fzf eza yazi
{% endhighlight %}

<div class="spacer"></div>

---

## Слой 1 — Терминал

Ghostty — GPU-ускоренный терминал за авторством Митчелла Хашимото. Быстрый, нативный на macOS и — что здесь важнее всего — настраивается текстовым файлом, а не панелью настроек.

<div class="spacer"></div>

Конфиг лежит в `~/Library/Application Support/com.mitchellh.ghostty/config` на macOS (или в `~/.config/ghostty/config`, если предпочитаете XDG). Мой целиком:

<div class="spacer"></div>

{% highlight ini %}
theme = ayu
window-padding-x = 24
window-padding-y = 0
window-padding-balance = true

font-family = "JetBrainsMono NFM Medium"
font-family-bold = "JetBrainsMono NFM Bold"
font-family-italic = "JetBrainsMono NFM Medium Italic"
font-family-bold-italic = "JetBrainsMono NFM Bold Italic"

font-size = 12
window-decoration = true

background-opacity = 0.85
background-blur-radius = 27

font-thicken = true
shell-integration = detect
shell-integration-features = sudo,no-cursor
cursor-style = bar
cursor-style-blink = true
mouse-hide-while-typing = true
confirm-close-surface = true
macos-icon = retro
macos-icon-frame = aluminum
macos-window-shadow = false
{% endhighlight %}

<div class="spacer"></div>

Несколько строк оправдывают себя больше остальных:

<div class="spacer"></div>

- **`window-padding-x = 24`** — самая полезная строка в файле. Текст, прижатый к краю окна, читается тесно; 24 пикселя воздуха дают для читаемости больше, чем любая цветовая схема.
- **`background-opacity` + `background-blur-radius`** — прозрачность без блюра превращается в нечитаемый шум. Или вместе, или никак.
- **`shell-integration = detect`** — Ghostty начинает понимать, где начинается и заканчивается промпт, благодаря чему работает прыжок к предыдущей команде.
- **`font-thicken = true`** — macOS рендерит тонкие шрифты тоньше, чем ожидаешь. Это компенсирует.

<div class="spacer"></div>

`ghostty +show-config --default --docs` покажет все опции с документацией прямо в выводе. Один из лучше всего задокументированных конфигов, что мне попадались.

<div class="spacer"></div>

---

## Слой 2 — Шрифт

Этот шаг обычно пропускают, и дальше ничего не работает.

<div class="spacer"></div>

Промпт использует глифы — powerline-стрелку ``, символ ветки ``, шестиугольник Node `` — которых нет в обычных шрифтах. **Nerd Font** — это обычный шрифт с вшитыми в него этими глифами. Без него вместо иконок будут квадраты ``.

<div class="spacer"></div>

{% highlight bash %}
brew install --cask font-jetbrains-mono-nerd-font
{% endhighlight %}

<div class="spacer"></div>

Дальше указать его в терминале. Обратите внимание на имя в моём конфиге — `JetBrainsMono NFM`, где **NFM** это вариант *Nerd Font Mono*: иконки ужаты в одну знакоместо. Есть ещё просто **NF**, где иконки занимают две ячейки. NFM даёт предсказуемое выравнивание колонок, NF чуть красивее на крупных кеглях. Выберите один и держитесь его.

<div class="spacer"></div>

> Если вы читаете статью в браузере без установленного Nerd Font, часть глифов в блоках кода отрисуется пустыми квадратами. Это ожидаемо — в терминале они будут выглядеть правильно.

<div class="spacer"></div>

---

## Слой 3 — Промпт

[Starship](https://starship.rs) — один бинарник, который рисует промпт. Работает с любой оболочкой, настраивается одним TOML-файлом и определяет контекст сам: не нужно говорить «здесь Node-проект», он это замечает.

<div class="spacer"></div>

Подключается **последней** строкой в `~/.zshrc`, после любого фреймворка тем:

{% highlight bash %}
eval "$(starship init zsh)"
{% endhighlight %}

<div class="spacer"></div>

Если используете oh-my-zsh — поставьте `ZSH_THEME=""`, чтобы он не спорил со Starship за промпт.

<div class="spacer"></div>

### Строка format — это оглавление

Всё в Starship вырастает из одного ключа `format` в `~/.config/starship.toml`. Прочитали его сверху вниз — прочитали весь промпт:

<div class="spacer"></div>

{% highlight toml %}
add_newline = true
command_timeout = 2000

format = """\
[](fg:#3B76F0)\
$directory\
${custom.directory_separator_not_git}\
${custom.directory_separator_git}\
$git_branch[](fg:#FCF392)\
$git_commit$git_status$git_metrics$git_state$fill$cmd_duration$nodejs$all\
${custom.git_config_email}
$character"""
{% endhighlight %}

<div class="spacer"></div>

Две механики, которые стоит заметить раньше самих модулей:

<div class="spacer"></div>

**Обратные слэши в конце строк.** Каждый `\` приклеивает следующую строку без переноса. Это позволяет писать format по модулю на строку — иначе получилась бы одна нечитаемая строка на 300 символов.

<div class="spacer"></div>

**Перенос строки — буквальный.** В этой строке ровно один настоящий перенос — прямо перед `$character`. Именно он выносит email на отдельный ряд, а `❯` под него.

<div class="spacer"></div>

`command_timeout = 2000` нужен из-за кастомных модулей ниже: они запускают внешние процессы, и дефолтные 500 мс заставят Starship ругаться на холодном кеше файловой системы.

<div class="spacer"></div>

### Блок директории

{% highlight toml %}
[directory]
truncate_to_repo = true
format = "[ $path ]($style)"
style = "fg:#ffffff bg:#3B76F0"
{% endhighlight %}

<div class="spacer"></div>

`truncate_to_repo = true` — та самая настройка, которая делает блок читаемым. Внутри репозитория показывается имя репозитория, а не одиннадцать директорий над ним. `~/Development/work/clients/2026/risk-engine/apps/mobile` превращается в `risk`.

<div class="spacer"></div>

Цвет фона задаётся в *стиле*, а не рисуется отдельно — именно так получается сплошная плашка, а не просто цветной текст.

<div class="spacer"></div>

### Powerline-трюк

Это та часть конфига, которой я доволен больше всего, и одновременно наименее очевидная.

<div class="spacer"></div>

Powerline-разделитель — это просто глиф ``, у которого **цвет текста** равен цвету предыдущей плашки, а **фон** — цвету следующей. Просто. Если бы не одно: цвет следующей плашки зависит от того, в репозитории вы или нет. Внутри — жёлтая ветка, снаружи — ничего.

<div class="spacer"></div>

В Starship нет `if`. Зато у **кастомных модулей есть условие `when`**, а кастомный модуль с пустой командой — это чистый условный рендерер:

<div class="spacer"></div>

{% highlight toml %}
[custom.directory_separator_git]
description = "Разделитель после директории внутри git-репозитория."
command = ""
format = "[](fg:#3B76F0 bg:#FCF392)"
when = "git rev-parse --is-inside-work-tree >/dev/null 2>&1"

[custom.directory_separator_not_git]
description = "Разделитель после директории вне git-репозитория."
command = ""
format = "[](fg:#3B76F0)"
when = "! git rev-parse --is-inside-work-tree > /dev/null 2>&1"
{% endhighlight %}

<div class="spacer"></div>

Оба стоят в format рядом друг с другом. Отрисуется ровно один. Внутри репозитория стрелка соединяет синий с жёлтым, снаружи — растворяет синий в фоне. Шов не виден ни там, ни там.

<div class="spacer"></div>

Тот же приём с другой стороны: `$git_branch[](fg:#FCF392)` закрывает жёлтую плашку обратно в фон, и эта закрывающая стрелка написана прямо в строке format, а не отдельным модулем — так она отрисуется только тогда, когда отрисуется `$git_branch`.

<div class="spacer"></div>

### Состояние git

{% highlight toml %}
[git_branch]
symbol = " "
format = "[ $symbol$branch(:$remote_branch) ]($style)"
style = "fg:#1C3A5E bg:#FCF392"

[git_metrics]
disabled = false
{% endhighlight %}

<div class="spacer"></div>

`git_metrics` **выключен по умолчанию**, и его стоит включить — это то самое `+1 -32` в примере, добавленные и удалённые строки с последнего коммита. Разница между «я знаю, что есть изменения» и «я знаю, насколько они большие».

<div class="spacer"></div>

`git_status` включён по умолчанию и не требует настройки. Его сокращения стоит запомнить:

<div class="spacer"></div>

| Символ | Значение |
|---|---|
| `!` | изменённые файлы |
| `?` | неотслеживаемые файлы |
| `+` | файлы в индексе |
| `$` | есть stash |
| `⇡` / `⇣` | впереди / позади remote |
| `=` | конфликт слияния |

<div class="spacer"></div>

Значит `[!?] +1 -32` читается так: есть изменённые и неотслеживаемые файлы, добавлена одна строка, удалено тридцать две.

<div class="spacer"></div>

### Как прижать часть промпта вправо

{% highlight toml %}
[fill]
symbol = " "

[cmd_duration]
min_time = 2_000
format = "[ ⏲︎ $duration ]($style)"
style = "white"
{% endhighlight %}

<div class="spacer"></div>

Модуль `fill` растягивается на всю оставшуюся ширину терминала. Всё, что стоит после него в format, уезжает к правому краю. Так версия Node и Docker-контекст оказываются выровнены по правому краю без ручных отступов.

<div class="spacer"></div>

`cmd_duration` с `min_time = 2000` появляется только если команда выполнялась дольше двух секунд. Молчит, когда неважно, говорит, когда важно — правильное поведение почти для любого сегмента промпта.

<div class="spacer"></div>

### `$all` — всё остальное

`$all` в конце format — это подстановочный знак: он отрисовывает все модули, не упомянутые явно. Оттуда берутся `via  v24.4.0` и `via 🐳 colima` — я никогда не настраивал ни модуль Node, ни модуль Docker. Starship нашёл `package.json` и активный Docker-контекст и сообщил об этом.

<div class="spacer"></div>

Так же с виртуальными окружениями Python, тулчейнами Rust, версиями Ruby, контекстами Kubernetes, профилями AWS. Самое высокое отношение полезной информации к объёму конфига во всём файле.

<div class="spacer"></div>

Если вылезает язык, который вам не нужен — выключите его отдельно:

{% highlight toml %}
[ruby]
disabled = true
{% endhighlight %}

<div class="spacer"></div>

### Вторая строка

{% highlight toml %}
[custom.git_config_email]
description = "Показать email из текущей конфигурации git."
command = "git config user.email"
format = "\n[$symbol(  $output)]($style)"
when = "git rev-parse --is-inside-work-tree >/dev/null 2>&1"
style = "text"
{% endhighlight %}

<div class="spacer"></div>

Это тот сегмент, который я бы оставил, если бы пришлось выбросить всё остальное.

<div class="spacer"></div>

Если вы работаете с личным и рабочим аккаунтами одновременно, рано или поздно вы закоммитите в один под личностью другого. И заметите через несколько недель, на код-ревью, в ветке, которую уже вмержили. Лечится через `git config user.email` в каждом репозитории — но только если не забыть проверить, а проверить забывают все.

<div class="spacer"></div>

Поэтому проверяет промпт. Каждый раз. Отдельной строкой, приглушённым текстом, только внутри репозиториев.

<div class="spacer"></div>

---

## Слой 4 — Обвязка вокруг

Промпт — это то, что замечают. А вот чего мне действительно не хватало бы:

<div class="spacer"></div>

### atuin — история как база данных

{% highlight bash %}
eval "$(atuin init zsh)"
bindkey '^R' atuin-search
bindkey '^[[A' atuin-search   # перехватываем ещё и стрелку вверх
{% endhighlight %}

<div class="spacer"></div>

Atuin заменяет `~/.zsh_history` на базу SQLite и даёт полноэкранный нечёткий поиск по ней — с фильтром по директории, с кодами возврата и длительностью выполнения. Второй `bindkey` — вкусовщина: он перехватывает ещё и **стрелку вверх**, чтобы уже выработанный рефлекс открывал хороший поиск вместо плохого.

<div class="spacer"></div>

### zoxide — `cd`, который учится

{% highlight bash %}
eval "$(zoxide init zsh)"
{% endhighlight %}

<div class="spacer"></div>

Запоминает, в какие директории вы реально ходите, и ранжирует их по частоте и свежести. `z risk` прыгает в нужный репозиторий откуда угодно. Через неделю перестаёшь набирать пути.

<div class="spacer"></div>

### fzf — нечёткий поиск везде

{% highlight bash %}
source <(fzf --zsh)
{% endhighlight %}

<div class="spacer"></div>

Одна строка — и `Ctrl-T` становится нечётким выбором файла, `Alt-C` — нечётким `cd`. Множество других инструментов использует fzf как бэкенд, так что его установка улучшает даже то, что вы ещё не поставили.

<div class="spacer"></div>

### eza — `ls`, который знает про git

{% highlight bash %}
alias ee='eza --icons -l -F --colour=always -a --git --header --time-style=iso'
alias ee2='eza --icons -l -TL 2 --total-size -F --colour=always'
{% endhighlight %}

<div class="spacer"></div>

`--git` помечает каждый файл его git-статусом — именно этот флаг оправдывает переход на eza. Второй алиас — дерево на два уровня с размерами директорий, самый быстрый способ ответить на вопрос «что здесь занимает место».

<div class="spacer"></div>

### yazi — файловый менеджер, который меняет директорию оболочки

{% highlight bash %}
function y() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
	yazi "$@" --cwd-file="$tmp"
	IFS= read -r -d '' cwd < "$tmp"
	[ -n "$cwd" ] && [ "$cwd" != "$PWD" ] && builtin cd -- "$cwd"
	rm -f -- "$tmp"
}
{% endhighlight %}

<div class="spacer"></div>

Дочерний процесс не может изменить рабочую директорию родителя, поэтому yazi записывает свою финальную директорию во временный файл, а обёртка потом делает туда `cd`. Побродили визуально через `y`, вышли — и оболочка уже там, куда вы смотрели.

<div class="spacer"></div>

### Ещё одна строка, которую стоит украсть

{% highlight bash %}
precmd() { print -Pn "\e]0;%~\a" }
{% endhighlight %}

<div class="spacer"></div>

Ставит в заголовок вкладки терминала текущую директорию перед каждым промптом. Мелочь — и при этом разница между шестью различимыми вкладками и шестью вкладками с подписью «zsh».

<div class="spacer"></div>

---

## Сколько это стоит

За красивыми промптами тянется репутация медленных, и этот не бесплатный. Starship сам скажет, сколько именно:

<div class="spacer"></div>

{% highlight bash %}
starship timings
{% endhighlight %}

<div class="spacer"></div>

Замер в реальном репозитории на моей машине:

<div class="spacer"></div>

{% highlight text %}
custom.git_config_email             -  15ms
custom.directory_separator_git      -   8ms
custom.directory_separator_not_git  -   7ms
ruby                                -   5ms
git_metrics                         -   4ms
directory                           -   4ms
git_branch                          -  <1ms
{% endhighlight %}

<div class="spacer"></div>

Три кастомных модуля забирают **30 мс из примерно 45 мс общих** — две трети стоимости ради одного email-адреса и одной косметической стрелки. Каждый из них порождает процесс на каждой отрисовке промпта, причём оба модуля-разделителя выполняют свою проверку, хотя отрисоваться может только один.

<div class="spacer"></div>

Модули считаются параллельно, поэтому по времени выходит меньше суммы. 45 мс держатся ниже порога, за которым промпт начинает ощущаться вялым, и проверку git-личности я считаю оправданной. Но это реальный размен, и полезно понимать, за какие строки конфига вы платите. Хотите эстетику без цены — уберите модули-разделителей и примите жёсткую границу цветов: вернёте 15 мс за изменение, которого большинство не заметит.

<div class="spacer"></div>

И ещё немного честности: в моём конфиге в строке format болтается забытый `$symbol`. `symbol` — не модуль, поэтому Starship молча рисует вместо него ничего. Он живёт там год и не делает ровным счётом ничего. Проверьте свой конфиг через `starship timings` — всё, чего нет в выводе, не работает.

<div class="spacer"></div>

---

## С чего начать

Если возьмёте из статьи одну вещь — берите Nerd Font и Starship с дефолтным конфигом. Пятнадцать минут и большая часть визуального эффекта.

<div class="spacer"></div>

Если две — добавьте atuin. Искомая история с учётом директории меняет способ работы с оболочкой сильнее, чем любой промпт.

<div class="spacer"></div>

Остальное — украшательство. Хорошее, отточенное за пару лет, и я бы восстановил его целиком на новой машине — но украшательство.

<div class="spacer"></div>

> Одно предупреждение, прежде чем копировать чьи-либо дотфайлы, включая мои: сначала проверьте их на секреты. API-токены, экспортированные в `.zshrc` — самый частый способ превратить приватный репозиторий в публичный инцидент. Держите их в менеджере секретов и читайте в рантайме.

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
    localStorage.setItem('post-lang-terminal', lang);
  };
  var saved = localStorage.getItem('post-lang-terminal');
  if (saved && saved !== 'en') setLang(saved);
})();
</script>
