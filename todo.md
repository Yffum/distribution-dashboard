# 2025-08-27

## Essential

- [x] Add privacy policy

## Feature

- [ ] Add theme-specific colors

## Refinement

- [ ] Make p input field larger (auto size)
- [ ] Write a more welcoming intro for the Pokemon theme
- [ ] Update the chart dot width dynamically based on p; for large p (low max n) show dots, otherwise hide

## Organization

- [ ] Make naming format consistent across HTML, e.g. for class, subclass, id
- [ ] Refactor html to use semantic elements for clarity and scalability (header, main, instead of divs)
- [ ] Refactor CSS
  - [ ] Use more vars for consistency, e.g. remove loose colors, define content width
  - [ ] Organize separate files, maybe combine or regroup
- [ ] Extract theme-specific html elements from main file, e.g. the Pokemon dropdown
  - [ ] Research best method to compose and inject html elements

## Optimization

- [ ] Refactor mobile device handling from js to CSS using media queries (@media)
- [ ] Profile performance
  - [ ] Check for superfluous HTTP requests
  - [ ] Research website performance profiling