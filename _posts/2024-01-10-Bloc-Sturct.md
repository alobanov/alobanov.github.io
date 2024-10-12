---
layout: post
title: BLoC and File structure
categories: article
tags:
  - BLoC
---

---

> К чему мы стремимся - это создать читаемый (с предположением использования единого архитектурного стиля), тестируемый код, который легко расширяется и поддерживается.

<br/>

В приложениях, использующих архитектуру <span class='wordcode'>BLoC</span> (Business Logic Component), обеспечивается четкое разделение между бизнес-логикой и пользовательским интерфейсом. 

<div class="spacer"></div>

Важно строго разграничивать эти слои: интерфейс должен быть независимым от бизнес-логики и отображать данные на основе состояния, предоставленного ею. 

<div class="spacer"></div>

Бизнес-логика формирует упрощенное описание того, как интерфейс должен выглядеть в данный момент. Такое разделение повышает чистоту кода, его тестируемость, читаемость и упрощает сопровождение.

<br/>

---

## Структура 

```
feature/
|-- bloc/
|   |-- feature_bloc.dart
|   |-- feature_event.dart
|   |-- feature_state.dart
|
|-- models/
|   |-- feature_keys.dart
|
|-- cubit/
|   |-- navigation_cubit.dart
|
|-- route/
|   |-- feature_internal_router.dart
|   |-- feature_external_router.dart
|   |-- feature_route.dart (feature_view_provider.dart)
|
|-- view/
|   |-- feature_view.dart
|
|-- widgets/
|   |-- feature_empty.dart
|   |-- feature_loading.dart
|   |-- feature_error.dart
|   |-- feature_loaded.dart
```

<br/>

## bloc/

> Этот каталог содержит <span class='wordcode'>BLoC</span> -- компоненты. Основное правило заключается в том, что все манипуляции с данными должны осуществляться на этом уровне

<br/>

Pабота с сервисами, подготовка данных и формирование состояний для пользовательского интерфейса. 
Если вы замечаете, что некоторые части кода начинают выглядеть громоздко, то их следует вынести в отдельные сервисы, хелперы или провайдеры и передать в качестве зависимости в <span class='wordcode'>bloc</span>.

<br/>

<ol class="custom-counter">
  <li>
{% capture markdown_content %}
  **feature_event.dart** для событий мы должны придерживаться следующего правила: если у вас есть атомарное действие, создается соответствующее событие. Следует избегать ситуаций, когда у вас есть два действия, такие как **удалить/добавить**, и вы создаете один **`Event`** с параметром действия. В таком случае более предпочтительным подходом является создание двух отдельных <span class='wordcode'>Event</span> - одного для удаления и другого для создания. Это повышает читаемость и ясность кода, а также обеспечивает атомарность событий.
{% endcapture %}
{{ markdown_content | markdownify }}
  </li>
  <li>
{% capture markdown_content %}
  **feature_state.dart** - содержит набор состояний. Важно никоим образом не добавлять расширения (<span class='wordcode'>extensions</span>) к этому классу для вычисления дополнительных свойств. Если возникает необходимость в таких вычислениях, лучше добавить новое свойство и произвести вычисления в классе <span class='wordcode'>feature_bloc</span>, а затем поместить полученное значение в <span class='wordcode'>feature_state</span>.
{% endcapture %}
{{ markdown_content | markdownify }}
  </li>
</ol>

---

## models/

> В этом каталоге размещаются модели данных, такие как <span class='wordcode'>keys.dart</span>, которая представляет ключи для компонентов пользовательского интерфейса, а также любые модели для отрисовки виджетов, связанных с данным экраном.

<br/>

--- 

## cubit/

> В этом каталоге находятся все кубиты, которые в большинстве своем отвечают за прямое взаимодействие с <span class='wordcode'>View</span>. Например, <span class='wordcode'>navigation_cubit.dart</span> содержит вызовы, отвечающие за действия открытия экранов. Мы можем вызвать метод <span class='wordcode'>openScreen</span> в <span class='wordcode'>bloc</span> и обработать состояние, связанное с открытием этого экрана во <span class='wordcode'>View</span>. Также желательно создавать отдельные кубиты, если они отличаются по своей функциональности или смыслу.

<br/>

---

## route/

> Здесь хранятся компоненты отвечающие за навигацию компонента.

<br/>

<ol class="custom-counter">
  <li>
{% capture markdown_content %}
  **External_router** предоставляет удобный интефейс показа текущего экрана (Не нужен если в качестве компонента используется не экран (<span class='wordcode'>Route</span>), а простой виджет.
{% endcapture %}
{{ markdown_content | markdownify }}
  </li>
  <li>
{% capture markdown_content %}
  **Internal_router** предоставляет интерфейс открытия других виджетов и экранов.
{% endcapture %}
{{ markdown_content | markdownify }}
  </li>
   <li>
{% capture markdown_content %}
  **feature_route (view_provider)** - В этом месте происходит конфигурация всех зависимостей и инициализация всех компонентов. Здесь регистрируются все зависимости, к которым будет осуществляться доступ на уровне пользовательского интерфейса с использованием фреймворка **Provider**. 
  
  <div class="spacer"></div>

  > Для блока следует использовать <span class='wordcode'>BlockProvider</span>, а для всех остальных сервисов - <span class='wordcode'>RepositoryProvider</span>. Важно также создавать класс <span class='wordcode'>feature_arguments</span>, если необходимо передать более одного параметра.
{% endcapture %}
{{ markdown_content | markdownify }}
  </li>
</ol>

---

## view/

> Cодержит виджет экрана. В данном случае, <span class='wordcode'>feature_view.dart</span> представляет собой главный экран. Также здесь нужно добавить все необходимые обработчики событий которые относятся к экрану через <span class='wordcode'>BlocListener</span> (например то что касается навигации, обработка состояний <span class='wordcode'>NavigationCubit</span> или <span class='wordcode'>PaginationCubit</span>).

<br/>

---

## widgets/

> В этом каталоге можно хранить многоразовые виджеты, которые используются на экране. Например, <span class='wordcode'>tile_item.dart</span> может быть виджетом для отображения отдельного элемента в списке.

<br/>

#### Еще примеры:
- **feature_loading.dart** - добавляем шиммер для экрана
- **feature_loaded.dart** - основное <span class='wordcode'>view</span> на котором отрисовываем <span class='wordcode'>UI</span> с данными
- **feature_empty.dart**/**feature_error.dart** - ошибка и пустое состояние соответственно

### Очень важно

> Добавлю, что в <span class='wordcode'>View</span> не должно происходить никаких дополнительных вычислений для отображения данных. Единственное, что разрешается во <span class='wordcode'>View</span>, это простейшие условия, зависящие от логических значений, хранящихся в <span class='wordcode'>state</span>. Это позволяет поддерживать чистоту и читаемость кода в пользовательском интерфейсе и уменьшает сложность визуальных компонентов.

<br/>

---

#### Есть вопросы? Пишите сюда – [@alobanov](https://twitter.com/alobanov)