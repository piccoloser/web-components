from pathlib import Path
import re
import requests


def minify_lines(lines):
    """Makes a POST request to the Toptal API. Returns the response."""
    return requests.post(
        "https://www.toptal.com/developers/javascript-minifier/api/raw",
        {"input": "\n".join(lines)},
    )


def remove_imports(lines):
    """Removes lines which begin with "import"."""
    return list(filter(lambda line: not line.strip().startswith("import"), lines))


def main():
    # Read all files into a list of lines.
    lines = []
    for file in Path(".").glob("*.js"):
        with open(file) as f:
            lines.extend(f.readlines())

    # Remove blank lines.
    lines = list(filter(None, map(str.strip, lines)))

    # Remove import lines.
    lines = remove_imports(lines)

    # Send a POST request to Toptal's JavaScript minifier.
    response = re.sub("\n", "", minify_lines(lines).text)

    # Write output to a new JavaScript file.
    output = Path("./minified/main.js")

    # Ensure that the minified directory exists, then write the file.
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(response)
    output.touch()


if __name__ == "__main__":
    main()
