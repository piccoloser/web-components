# `<modal-dialog>` Documentation

## Overview
The `<modal-dialog>` component is a custom HTML element designed for creating and managing modal dialog boxes. This component enables you to create responsive and accessible modal dialogs that can be opened, closed, and hidden as required. Additionally, you can display dynamic content based on input data.

## Usage
To use the `<modal-dialog>` component in your HTML, add the <modal-dialog> element to your HTML, including the desired content layout as child elements:

```html
<modal-dialog>
    <h2 data-name="title"></h2>
    <div data-name="content"></div>
    <p>This paragraph has no data-name, so it is not dynamic!</p>
</modal-dialog>
```

### Methods
The `<modal-dialog>` component provides the following methods:
- `display(data: Object, required: boolean = false):` Displays the dialog using `data` to replace the contents of dynamic elements (elements given a `data-name` attribute). If `required` is false, the default exit button will be removed and the backdrop will not be bound to the `close()` method.
- `close()`: Closes the modal dialog and removes its content.
- `hide()`: Hides the modal dialog without removing its content.
- `show()`: Shows the modal dialog if it was previously hidden.

### Styling
The `<modal-dialog>` component uses CSS variables for easy customization. To customize the appearance, set the following CSS variables in your stylesheet:
- `--modal-bd-color`: Background color of the modal backdrop (default: #0008).
- `--modal-bg-color`: Background color of the modal dialog (default: #fff).
- `--modal-color`: Text color of the modal dialog (default: #000).
- `--modal-x-color`: Color of the close button (default: currentColor).
- `--modal-x-hover-color`: Hover color of the close button (default: #222).

## Example
Create a modal dialog with a custom message:

```html
<!-- index.html -->

<modal-dialog>
    <h2 data-name="title"></h2>
    <div data-name="content"></div>
    <p data-name="unspecified"></p>
</modal-dialog>
```

```javascript
// script.js

const modal = document.querySelector("modal-dialog");

modal.display({
    title: "Example Modal",
    content: "This is a custom modal message.",
    notFound: "No element with this data-name.", // This will be ignored.
});
```

In this example, the modal dialog will display the title "Example Modal" and the message "This is a custom modal message." The `<p>` tag with `data-name="unspecified"` will not be changed by the `display()` method.

## Reserved `data-name` Values
The following values for `data-name` are reserved for the `close()` and `hide()` methods.
- `data-name="exit"`
- `data-name="hide"`

These are useful in cases where the `display()` method was called with `required = true`.
