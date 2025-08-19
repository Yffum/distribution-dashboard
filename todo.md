## To run with modules:
python -m http.server 8000
http://localhost:8000

# ToDo

## 2025-08-18
- [x] Separate updateChart into general function for all themes, and separate function for no theme
- [x] Create updateThemeContent var that gets assigned a function based on theme

## 2025-08-15
- [x] Fix: top label gets clipped for p>=0.001
  - [-] Adjust label staggering. Label height should only be staggered if horizontal distance to previous label is sufficiently small, e.g. the 99% label is too high because it's far enough from the previous label horizontally that it shouldn't be staggered.
- [x] Plan features
  - [x] Specialized themes with dropdown menus for specific uses; e.g., Dice:d6/d20, Pokemon:eggs/dynamax
  - [ ] Other distributions?
- [ ] Update the dot width dynamically based on p; for large p (low max n) show dots, otherwise hide