---
layout: post
title: BLoC file structure
description: Setting up a feature structure based on BLoC architecture.
superscript: Part 1
tags:
  - BLoC
---

---

> What we strive for is readable (assuming a consistent architectural style), testable code that is easy to extend and maintain.

<br/>

In applications using the <span class='wordcode'>BLoC</span> (Business Logic Component) architecture, there is a clear separation between business logic and the user interface.

<div class="spacer"></div>

It's important to strictly separate these layers: the UI should be independent of business logic and display data based on the state provided by it.

<div class="spacer"></div>

Business logic forms a simplified description of how the UI should look at any given moment. This separation improves code cleanliness, testability, readability, and ease of maintenance.

<br/>

---

## Structure

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

> This directory contains the <span class='wordcode'>BLoC</span> components. The key rule is that all data manipulation must happen at this level.

<br/>

Working with services, preparing data, and forming states for the user interface.
If you notice that some parts of the code are getting bulky, extract them into separate services, helpers, or providers and pass them as dependencies to the <span class='wordcode'>bloc</span>.

<br/>

<ol class="custom-counter">
  <li>
{% capture markdown_content %}
  **feature_event.dart** — for events, follow this rule: if you have an atomic action, create a corresponding event. Avoid situations where you have two actions such as **delete/add** and you create a single **`Event`** with an action parameter. It's preferable to create two separate <span class='wordcode'>Event</span> classes — one for deletion and one for creation. This improves readability and clarity, and ensures atomic events.
{% endcapture %}
{{ markdown_content | markdownify }}
  </li>
  <li>
{% capture markdown_content %}
  **feature_state.dart** — contains a set of states. It's important not to add extensions (<span class='wordcode'>extensions</span>) to this class for computing additional properties. If such computations are needed, add a new property and perform the computation in <span class='wordcode'>feature_bloc</span>, then place the result in <span class='wordcode'>feature_state</span>.
{% endcapture %}
{{ markdown_content | markdownify }}
  </li>
</ol>

---

## models/

> This directory holds data models such as <span class='wordcode'>keys.dart</span>, which represents keys for UI components, as well as any models for rendering widgets related to this screen.

<br/>

--- 

## cubit/

> This directory contains all cubits, which are mostly responsible for direct interaction with the <span class='wordcode'>View</span>. For example, <span class='wordcode'>navigation_cubit.dart</span> contains calls responsible for screen-opening actions. We can call an <span class='wordcode'>openScreen</span> method in <span class='wordcode'>bloc</span> and handle the related state in the <span class='wordcode'>View</span>. It's also advisable to create separate cubits if they differ in functionality or purpose.

<br/>

---

## route/

> This directory contains components responsible for the component's navigation.

<br/>

<ol class="custom-counter">
  <li>
{% capture markdown_content %}
  **External_router** provides a convenient interface for displaying the current screen. (Not needed if the component is not a screen (<span class='wordcode'>Route</span>) but a simple widget.)
{% endcapture %}
{{ markdown_content | markdownify }}
  </li>
  <li>
{% capture markdown_content %}
  **Internal_router** provides an interface for opening other widgets and screens.
{% endcapture %}
{{ markdown_content | markdownify }}
  </li>
   <li>
{% capture markdown_content %}
  **feature_route (view_provider)** — this is where all dependencies are configured and all components are initialized. All dependencies that will be accessed at the UI level using the **Provider** framework are registered here.
  
  <div class="spacer"></div>

  > Use <span class='wordcode'>BlockProvider</span> for the bloc, and <span class='wordcode'>RepositoryProvider</span> for all other services. Also create a <span class='wordcode'>feature_arguments</span> class if more than one parameter needs to be passed.
{% endcapture %}
{{ markdown_content | markdownify }}
  </li>
</ol>

---

## view/

> Contains the screen widget. In this case, <span class='wordcode'>feature_view.dart</span> represents the main screen. Add all necessary event handlers related to the screen here via <span class='wordcode'>BlocListener</span> (e.g., navigation handling, processing <span class='wordcode'>NavigationCubit</span> or <span class='wordcode'>PaginationCubit</span> states).

<br/>

---

## widgets/

> This directory holds reusable widgets used on the screen. For example, <span class='wordcode'>tile_item.dart</span> can be a widget for rendering an individual list item.

<br/>

#### More examples:
- **feature_loading.dart** — add a shimmer for the screen
- **feature_loaded.dart** — main <span class='wordcode'>view</span> where the <span class='wordcode'>UI</span> with data is rendered
- **feature_empty.dart** / **feature_error.dart** — error and empty state respectively

---

### Very important

> Note that no additional computations for displaying data should happen in the <span class='wordcode'>View</span>. The only thing permitted in the <span class='wordcode'>View</span> is simple conditions based on boolean values stored in <span class='wordcode'>state</span>. This keeps the UI code clean and readable, and reduces the complexity of visual components.

<br/>

---

#### Questions? Write here – [@alobanov](https://twitter.com/alobanov)
