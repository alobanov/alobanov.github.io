---
layout: post
title: Мультиязычность в iOS
description: инструментрарий
categories: libs
---

<!-- <div class="size-960 banner-red">
    <img src="/images/github.svg" alt="GitHub" size="100">
 </div>-->

Стандартное решение от :apple:**Apple** предлагает отталкиваться от выбранного языка на нашем устройстве. То есть, чтобы поменять язык в приложении, необходимо полностью поменять язык системы. Что делать, если хочется изменить язык на лету, не выходя из приложения и, тем более, не меняя полностью локаль на устройстве?

Один из вариантов – брать необходимый файл переводов и локализовать приложение на основе выставления своих настроек языка, сохраняя их например в <span class="wordcode">UserDefaults</span>.

Я подготовил менеджер который позволит без труда реализовать быстрое переключение языка в приложении. Проект можно скачать тут [ALLocalizedManager](https://github.com/alobanov/ALLocalizedManager).

---

# Менеджер мультиязычноти

Чтобы все это дело заработало необходимо проинициализировать [ALLocalizedManager](https://github.com/alobanov/ALLocalizedManager) :octocat: вызвав метод <span class="wordcode">ALLocalizedInit</span> (все методы менеджера сделаны макросами, для удобства) желательно поместить вызов в <span class="wordcode">didFinishLaunchingWithOptions</span> класса <span class="wordcode">AppDelegate</span>.

В момент инициализации проверяется установленый язык из <span class="wordcode">UserDefaults</span>, если настроек еще нет (например, при первом запуске приложения), то берем язык системы и записываем в <span class="wordcode">UserDefaults</span>. После этого, даже если поменять язык системы, в приложении сохранится тот язык, который был проинициалищирован при первом запуске приложения.

---

### использование

В момент установки новой локали необходимо разослать сообщение об этом изменении:

{% highlight objective-c %}
ALLocalizationSetLanguage(@"en");
ALLocalizationThrowNotification;
{% endhighlight %}

Так как необходимо переключать язык на лету надо отслеживать события измененя, поэтому подписываемся на событие <span class="wordcode">ALLocalizedManagerChangeLangNotification</span>:

{% highlight objective-c %}
NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
    [nc addObserver:self
           selector:@selector(changeAppLanguage:)
               name:ALLocalizedManagerChangeLangNotification
             object:nil];

-(void) updateTitles:(NSNotification*) notify {
    NSLog(ALLocalizedString(@"Change_language", @"Изменить язык"));
                    forState:UIControlStateNormal ];
    NSLog(ALLocalizedString(@"Hello", @"Привет мир"));
    NSLog(ALLocalizedStringFromTable(@"Current_lang", @"Русский", @"examplePlist"));
}
{% endhighlight %}

После этого в методе обновления нужно обновить текстовки **/** картинки **/** ресурсы.

---

### настройка языков

Логика выбора языка во время первого запуска приложения: берется язык системы и проверяется, есть ли он в определенном нами списке  языков. Если системный язык отсутствует в словаре, берем тот, который отмечен ключом <span class="wordcode">isDefault</span>.

Пример словаря языков, который необходимо настроить в зависимости от вашего проекта:

{% highlight objective-c %}
- (NSArray *) languageList {
    return @[@{@"ru": @"Русский", @"isDefault":@"YES"},
             @{@"en": @"English"},
             @{@"es": @"Spanish"}];
}
{% endhighlight %}

#### Также можно локализовать ресурсы и картинки (ALLocalizationResource, ALLocalizationImage)

---

### методы

Все макросы для работы с менеджером:metal::

<script src="https://gist.github.com/alobanov/f07585a35c96de9345514acff490b062.js"></script>

---

### Pluralization (Числительные формы)

Для того чтобы добавить в проект числительные формы необходимо сделать слудующее:

1. Добавить <span class="wordcode">.strings</span> файл <span class="wordcode">LocalizablePlural</span>
2. Допишите в него числовых формы, например:

{% highlight objective-c %}
/* LocalizablePlural */
"%d Murloc (plural rule: one)" = "%d мурлок";
"%d Murloc (plural rule: few)" = "%d мурлока";
"%d Murloc (plural rule: many)" = "%d мурлоков";
"%d Murloc (plural rule: other)" = "%d мурлока";

// Использование в проекте
NSString *pluralString = ALLocalizedPluralString(@"Murloc", 4, nil);
{% endhighlight %}

#### Есть вопросы? Пишите сюда – [@alobanov](https://twitter.com/alobanov)
