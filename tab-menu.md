# `<tab-menu>` Documentation

## Overview
`<tab-menu>` is a custom HTML component for creating a responsive, accessible, and customizable tab menu. With this component, you can create multiple tabs with associated content and easily manage their open, close, and minimize actions.
Usage

## Usage
To use the `<tab-menu>` component in your HTML, add the `<tab-menu>` element to your HTML, including the desired tabs and their content as child elements:

```html
<tab-menu>
    <div name="Tab 1">Content for Tab 1</div>
    <div name="Tab 2">Content for Tab 2</div>
    <div name="Tab 3">Content for Tab 3</div>
</tab-menu>
```

### Attributes
The <tab-menu> component supports the following attributes:
- `numbered`: Adds numbers before tab names.
- `sep`: Specifies the separator string between numbers and tab names (default is `": "`).
- `open`: Specifies the name of the tab that should be open by default.
- `closed`: If present, the tab menu will be initialized with all tabs closed.
- `disabled`: Disables a specific tab if added to its `<div>` element.

### Styling
The `<tab-menu>` component uses CSS variables to allow for easy customization. To customize the appearance, set the following CSS variables in your stylesheet:
- `--tab-inactive-bg-color:` Background color of inactive tabs (default: `#999`).
- `--tab-inactive-color:` Text color of inactive tabs (default: `currentColor`).
- `--tab-menu-bg-color:` Background color of the active tab and content (default: `#ccc`).
- `--tab-color:` Text color of the active tab and content (default: `currentColor`).

## Examples
### Example 1: Basic `<tab-menu>` with default open tab
```html
<tab-menu open="Tab 2">
    <div name="Tab 1">Content for Tab 1</div>
    <div name="Tab 2">This tab will be open by default.</div>
    <div name="Tab 3">Content for Tab 3</div>
</tab-menu>
```

### Example 2: Numbered `<tab-menu>` with custom separator (default is `": "`)
```html
<tab-menu numbered sep=" - ">
    <div name="Tab 1">Content for Tab 1</div>
    <div name="Tab 2">Content for Tab 2</div>
    <div name="Tab 3">Content for Tab 3</div>
</tab-menu>
```

### Example 3: `<tab-menu>` with disabled tab
```html
<tab-menu>
    <div name="Tab 1">Content for Tab 1</div>
    <div name="Tab 2" disabled>You cannot open this tab.</div>
    <div name="Tab 3">Content for Tab 3</div>
</tab-menu>
```
