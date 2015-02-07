---
layout: post
title: Мультиязычность в iOS
description: инструментрарий
categories: libs
---

Стандартные гайды iOS предлагают нам отталкиваться от выбранного языка на нашем устройстве. То есть чтобы поменять язык в нашем приложении нам необходимо полность поменять язык системы. Что делать если хочется изменить язык не выходя из приложения и тем более не меняя настройки языка устройства?

Один из вариантов брать необходимый нам файл переводов и локализовать приложение на основе выставления своих настроек языка сохраняя их например в `UserDefaults`. Все необходимые методы для реализации этого решения имеются.

Менеджер можно скачать тут [ALLocalizedManager](https://github.com/alobanov/ALLocalizedManager).

---

#Менеджер мультиязычноти

Чтобы начать использовать [ALLocalizedManager](https://github.com/alobanov/ALLocalizedManager) необходимо его проинициализировать вызвав метод `ALLocalizedInit;` (*все методы менеджера сделаны макросами, для удобства*) желательно поместить вызов в `didFinishLaunchingWithOptions` класса `AppDelegate`. В момент инициализации проверяем в `UserDefaults` наши настройки языка, если их нет то берем язык системы и записываем в `UserDefaults`, в дальнейшем будем работать только с этими настройками.

---

###использование

Для измения языка приложения выставляем нужный нам и рассылаем сообщение об этом изменении:

{% highlight objective-c %}
ALLocalizationSetLanguage(@"en");
ALLocalizationThrowNotification;
{% endhighlight %}

Так как необходимо переключать язык на лету надо отслеживать в какой момент мы его изменили, для этого нужно подписаться на оповещения события `ALLocalizedManagerChangeLangNotification`:

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

После этого в методе обновления нужно заново локализовать все текты.

---

###настройка языков

Логика выбора первого языка: сначало берем язык системы и проверяем есть ли он в нашем списке определенных нами языковых словарей. Если системный язык отсутствует в словаре берем из списка тот который отмечен ключом `isDefault`.

Пример словаря языков который необходимо настроить в зависимости от вашего проекта:

{% highlight objective-c %}
- (NSArray *) languageList {
    return @[@{@"ru": @"Русский", @"isDefault":@"YES"},
             @{@"en": @"English"},
             @{@"es": @"Spanish"}];
}
{% endhighlight %}

Если есть предложения по улучшению пишите.

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

####Используйте этот клас на свой страх и риск
