---
layout: post
title: Daily Stand-Up? Handled.
description: How I automated my daily developer report using a simple Git script and a prompt for ChatGPT — never blank out at a stand-up again.
tags:
  - Automation
---

--- 

> As a developer, I often found myself dreading one simple question in daily stand-ups: 
> **"- What did you work on yesterday?"**. 
> I'd mentally rewind the day, try to recall commits, branches, context switches — and inevitably forget something.

<div class="spacer"></div>

So **I built a [script](https://github.com/alobanov/daily-report)[^1]** that solved the problem once and for all.

<div class="spacer"></div>

---


## 📋 What It Does?

Every morning, I run a script that:

1. Gathers all my **Git** commits from the previous day.
2. Groups them by branch.
3. Displays them in a clean, readable format.
4. Appends a custom prompt that I paste into **ChatGPT** — and boom — it generates a clear, concise status update for my stand-up.

Here's what the Git output looks like:

{% highlight bash %}
❯ python3 git_log.py --date 2025-05-15

📦 Commits by 'Aleksey Lobanov' for 2025-05-15:

🔀 Branch: develop
• a2f9b3d1e 2025-05-15 MOB-762-settings-theme-switcher-finalization
• c8412eb74 2025-05-15 MOB-781-user-session-cleanup-on-logout

🔀 Branch: MOB-762-settings-theme-switcher-finalization
• 14cbe81e3 2025-05-15 feat(settings): MOB-762 implement dynamic theme switching with persistence across sessions
• f3d5e66ba 2025-05-15 refactor(ui): MOB-762 extract common theme logic into ThemeController
• 7e9123a84 2025-05-15 fix(auth): MOB-762 ensure proper cleanup of tokens and session state on manual logout
{% endhighlight %}

Then I append this prompt below:

{% highlight bash %}
🔧 Generate a daily summary for the commits above in this format:

Yesterday:
- <summary of task 1>
- <summary of task 2>

📌 Rules:
• Group commits by branch. Each branch = 1 task.
• Describe what was done abstractly, no low-level detail.
• If any MOB- tasks appear in develop, they are considered completed.
{% endhighlight %}

ChatGPT does the rest. And now, I never draw a blank in a daily sync again. Here is the result:

{% highlight bash %}
Yesterday:
- Completed task MOB-762 — finalized implementation of theme switching in app settings with improved logic reuse and persistent behavior across sessions.
- Completed task MOB-781 — ensured proper cleanup of user session data during logout to improve stability and security.
{% endhighlight %}

<div class="spacer"></div> 

### 🧠 Why This Works

- No more manual memory scanning.
-	Instant context when switching tasks or reviewing progress.
-	Easy way to track completed vs. in-progress work.

---

## 🛠️ Implementation & Usage

[The script](https://github.com/alobanov/daily-report)[^1] is now available as a standalone tool with additional features:

<div class="spacer"></div> 

#### Quick Start

{% highlight bash %}
# Setup
❯ python3.12 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
echo "OPENAI_API_KEY=sk-..." > .env

# Run
❯ python git_daily_report.py --date YYYY-MM-DD
{% endhighlight %}

#### Key Features
- Automatic ChatGPT API integration
- Custom repository and author filtering
- Flexible output formats

#### Usage Examples

{% highlight bash %}
# Basic usage
❯ python git_daily_report.py

# With ChatGPT API
❯ python git_daily_report.py --use-gpt

# Specific repository
❯ python git_daily_report.py --repo /path/to/repo

# Custom author
❯ python git_daily_report.py --email user@example.com
{% endhighlight %}

It's a simple fix, but it's changed the way I show up to stand-ups.
If you're a dev who forgets what you did yesterday — this little combo of **Git + Python + ChatGPT** might save your mornings.

<div class="spacer"></div>

---

### 💬 Feedback
If you have suggestions for improving the script or have found a bug, please create an issue on GitHub[^2] or join our community discussions[^3].

[^1]: [GitHub Repository](https://github.com/alobanov/daily-report) - Full source code and documentation
[^2]: [GitHub Issues](https://github.com/alobanov/daily-report/issues) - Report bugs or suggest improvements
[^3]: [GitHub Discussions](https://github.com/alobanov/daily-report/discussions) - Join the community discussion

