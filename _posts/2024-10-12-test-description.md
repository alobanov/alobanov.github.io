---
layout: post
title: Unit test
superscript: Description
description: A guide on how to write comments for unit tests.
tags:
  - Unit Test
---

---

> Test descriptions should be clear and structured so that anyone can easily understand what the test checks and under what conditions. A good practice is to split the description into two parts:

<br/> 

### What is expected (Expected Outcome):
Start with what you expect from the test. The description should answer the question "What behavior or result do we want to see?". This helps communicate the purpose of the test and its end result.

<br/>  

```
the sky is blue
and the grass is green
```
<br/> 
This clearly states that the test should confirm that the sky is blue and the grass is green. The expected result must always be specific and unambiguous.

<br/> 

### Conditions / Actions:
Then describe the conditions under which the test runs and what actions take place. This part describes the context or triggers for test execution and the steps that lead to the expected result.

<br/>     

```
when season is summer
and the wind is blowing south
and the rain is over
```

<br/>  

This block explains what must happen during the test in order to verify the expected result. Actions should be logical and sequential.

<br/>     

### General principles:

- **Specificity**: The expected result and conditions must be clear and unambiguous.
- **Readability**: The wording should be simple enough that any developer can understand the test's purpose, even without prior knowledge of the feature.
- **Completeness**: All conditions that might affect the result should be stated in the description.

This separation helps tests be more structured and easier to understand and maintain.
