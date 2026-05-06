# How to Add New Areas/Locations

## Quick Guide

To add a new area to both desktop and mobile filters, you only need to edit **ONE place** in the code.

### Steps:

1. Open the file: `main.js`

2. Find the `LOCATIONS_DATA` array at the top of the file (around line 3-55)

3. Add your new location to the array in this format:
   ```javascript
   { value: "Area-Name", label: "Display Name" }
   ```

### Example:

If you want to add "Maninagar" as a new area:

```javascript
const LOCATIONS_DATA = [
  { value: "Adalaj", label: "Adalaj" },
  { value: "Adani-Shantigram", label: "Adani Shantigram" },
  // ... other locations ...
  { value: "Maninagar", label: "Maninagar" },  // ← Add your new area here
  { value: "Zundal", label: "Zundal" }
];
```

### Important Notes:

- **value**: This is used internally for filtering (use hyphens for multi-word names)
- **label**: This is what users see in the dropdown (can have spaces)
- The location will automatically appear in:
  - Desktop location filter dropdown
  - Mobile location filter dropdown
  - Both will stay in sync!

### That's it! 🎉

No need to edit HTML files or duplicate code. The JavaScript will automatically populate both filters from this single data source.

---

## Technical Details

The system works by:
1. Storing all locations in a centralized `LOCATIONS_DATA` array
2. The `initializeFilters()` function dynamically generates desktop filter options
3. The `initializeMobileFilters()` function dynamically generates mobile filter options
4. Both read from the same data source, ensuring consistency
