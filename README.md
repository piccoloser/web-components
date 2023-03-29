# Web Components (Unnamed)

This is a lightweight, pure JavaScript web component library focused on providing simple and easy-to-use components for frontend development.


# Getting Started
Include the following line in your `index.html` file:

```html
    <script type="module" src="https://cdn.jsdelivr.net/gh/piccoloser/web-components@v0.3.1/minified/main.js"></script>
```

# Included Components

## `<tab-menu>`
A web component that creates a tab-based menu.

### Usage
```html
    <tab-menu>
        <div name="Tab 1">Tab 1 content</div>
        <div name="Tab 2">Tab 2 content</div>
        <div name="Tab 3" disabled>This tab cannot be opened.</div>
    </tab-menu>
```

#### Attributes
- `closed`: Keep all tabs closed initially.
- `numbered`: Display tab numbers.
- `open`: Set the initial open tab by its name.

## `<modal-dialog>`
A web component that creates a modal dialog.

### Usage
```html
    <modal-dialog>
        <h2 data-name="title"></h2>
        <div data-name="body"></div>
        <div class="my-public-class" slot>
            <p>This div can be styled by the light DOM because "slot" was specified.</p>
        </div>
    </modal-dialog>
```

#### Methods
- `close()`: Close and remove the modal dialog from the DOM.
- `display(data, required = false)`: Display the modal dialog.
- `hide()`: Hide the modal dialog without removing it.
- `show()`: Display a modal dialog which has been hidden.

## `<nm-dialog>`
A web component that creates a non-modal dialog.

### Usage
```html
    <nm-dialog></nm-dialog>
```

#### Methods
- `close()`: Close and remove the non-modal dialog from the DOM.
- `display(content, duration = 10)`: Display the non-modal dialog with the given content for the specified duration (in seconds).