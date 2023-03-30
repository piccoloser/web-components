# `<nm-dialog>` Documentation

## Overview
`<nm-dialog>` is a custom HTML component for creating and managing non-modal (temporary) dialog boxes. With this component, you can create responsive and accessible non-modal dialogs that display a message for a specified amount of time and can be closed manually if needed.

## Usage
To use the `<nm-dialog>` component in your HTML, add the <nm-dialog> element to your HTML:

```html
<nm-dialog></nm-dialog>
```

### Methods
The `<nm-dialog>` component provides the following methods:
- `display(message: string, duration: number = 10)`: Displays the dialog with the specified message for the specified duration (in seconds). If no duration is provided, the default value is 10 seconds.
- `close()`: Closes the dialog and removes its content.

### Styling
The `<nm-dialog>` component uses CSS variables to allow for easy customization. To customize the appearance, set the following CSS variables in your stylesheet:
- `--nm-bg-color`: Background color of the non-modal dialog (default: #ddd).
- `--nm-color`: Text color of the non-modal dialog (default: #000).
- `--nm-x-color`: Color of the close button (default: currentColor).
- `--nm-x-hover-color`: Hover color of the close button (default: #222).
- `--nm-bar-color`: Color of the progress bar (default: #aaa).

## Example
Display a non-modal dialog with a custom message and duration:

```javascript
const nmDialog = document.querySelector("nm-dialog");
nmDialog.display("This is a non-modal message!", 5);
```

In this example, the non-modal dialog will display the message "This is a non-modal message!" for 5 seconds.
