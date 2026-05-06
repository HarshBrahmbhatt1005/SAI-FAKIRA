# Sindhu Bhavan Filter Fix

## Problem
Properties located at "Sindhu Bhavan Road" were not showing up when filtering by that location.

## Root Cause
There was a mismatch between:
- **Filter value in LOCATIONS_DATA**: `"Sindhu-Bhavan"` (with hyphens, no "Road")
- **Property data in cardsData.js**: `"propertyLocation": "Sindhu Bhavan Road"` (with spaces and "Road")

When the filter compared these values (after normalization), they didn't match:
- Filter: `"sindhu-bhavan"` → normalized to `"sindhu-bhavan"`
- Property: `"Sindhu Bhavan Road"` → normalized to `"sindhu bhavan road"`

## Solution
Updated the `LOCATIONS_DATA` array in `main.js` to use the exact format that matches the property data:

**Before:**
```javascript
{ value: "Sindhu-Bhavan", label: "Sindhu Bhavan Road" }
```

**After:**
```javascript
{ value: "Sindhu Bhavan Road", label: "Sindhu Bhavan Road" }
```

## Affected Properties
This fix enables filtering for the following properties:
1. **Wynn by A.Shridhar** (ID: 10) - Commercial
2. **Absolute by A.Shridhar** (ID: 115) - Commercial
3. **The Indus** (ID: 333) - Mixed (Residential + Commercial)
4. **Ikebana** (ID: 344) - Residential with Duplex

## Testing
To verify the fix works:
1. Open index.html in a browser
2. Click on the "Locations" filter dropdown
3. Select "Sindhu Bhavan Road"
4. All 4 properties should now appear in the filtered results

## Note
This same pattern should be checked for other locations if similar issues occur. The key is that the `value` in `LOCATIONS_DATA` must match the `propertyLocation` field in `cardsData.js` (after normalization).
