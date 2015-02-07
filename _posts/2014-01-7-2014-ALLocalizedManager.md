---
layout: post
title: Мультиязычность в iOS
description: инструментрарий
categories: libs
---

Стандартное решение от Apple, предлагает нам отталкиваться от выбранного языка на нашем устройстве. То есть чтобы поменять язык в нашем приложении нам необходимо полность поменять язык системы. Что делать если хочется изменить язык на лету не выходя из приложения и тем более не меняя полностью локаль на устройстве?

Один из вариантов: брать необходимый нам файл переводов и локализовать приложение на основе выставления своих настроек языка, сохраняя их например в `UserDefaults`. 

Я подготовил менеджер который позволит нам без труда реализовать быстрое переключение языка в приложении. Проект можно скачать тут [ALLocalizedManager](https://github.com/alobanov/ALLocalizedManager).

---

#Менеджер мультиязычноти

Чтобы все это дело заработало необходимо проинициализировать   [ALLocalizedManager](https://github.com/alobanov/ALLocalizedManager) вызвав метод `ALLocalizedInit;` (*все методы менеджера сделаны макросами, для удобства*) желательно поместить вызов в `didFinishLaunchingWithOptions` класса `AppDelegate`. В момент инициализации проверяется установленый язык из `UserDefaults`, если настроек еще нет (например при первом запуске приложения), то берем язык системы и записываем в `UserDefaults`, после этого даже если вы поменяете язык системы в приложении сохранится тот язык который был проинициалищирован при первом запуске приложения.

---

###использование

В момент установки новой локали необходимо разослать сообщение об этом изменении:

{% highlight objective-c %}
ALLocalizationSetLanguage(@"en");
ALLocalizationThrowNotification;
{% endhighlight %}

Так как необходимо переключать язык на лету надо отслеживать события измененя , поэтому подписываемся на событие `ALLocalizedManagerChangeLangNotification`:

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

После этого в методе обновления нужно обновить ваши текстовки/картинки/ресурсы. 

---

###настройка языков

Логика выбора языка во время первого запуска приложения: берется язык системы и проверяется есть ли он в определенном нами списке  языков. Если системный язык отсутствует в словаре берем тот который отмечен ключом `isDefault`.

Пример словаря языков который необходимо настроить в зависимости от вашего проекта:

{% highlight objective-c %}
- (NSArray *) languageList {
    return @[@{@"ru": @"Русский", @"isDefault":@"YES"},
             @{@"en": @"English"},
             @{@"es": @"Spanish"}];
}
{% endhighlight %}

#### Также можно локализовать ресурсы и картинки (ALLocalizationResource, ALLocalizationImage) 

---

###методы

Все макросы для работы с менеджером:

{% highlight objective-c %}
// init localized manager
ALLocalizedInit

// Update current index by index 
ALLocalizationSetLanguageByIndex(language)

// set language (example "ru","en")
ALLocalizationSetLanguage(language)

// return "ru","en" and etc.
ALLocalizationGetLanguage

// Full name of lang
ALLocalizationGetNameLanguage

// take current index selected language
ALLocalizationGetLanguageIndex

// reset all by default
ALLocalizationReset

// after selecting language you can throw notice
ALLocalizationThrowNotification

// localized images
ALLocalizationResource(resource, type)
ALLocalizationImage(resource, type) 

// localized string
ALLocalizedString(key, comment)
ALLocalizedStringFromTable(key, comment, tableName)
{% endhighlight %}
