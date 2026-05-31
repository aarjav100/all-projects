import bleach

ALLOWED_TAGS = [
    "p", "br", "strong", "em", "b", "i", "u", "s",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "table", "thead", "tbody", "tr", "th", "td",
    "blockquote", "pre", "code", "span", "div",
    "a", "img",
]

ALLOWED_ATTRS = {
    "*": ["class", "id", "style"],
    "a": ["href", "title", "target"],
    "img": ["src", "alt", "width", "height"],
    "td": ["colspan", "rowspan"],
    "th": ["colspan", "rowspan", "scope"],
}

ALLOWED_STYLES = [
    "color", "background-color", "font-family", "font-size",
    "font-weight", "text-align", "margin", "padding",
    "border", "width", "height", "display",
]


def sanitize_html(html: str) -> str:
    """Sanitize HTML to prevent XSS while preserving safe markup."""
    return bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRS,
        strip=True,
    )


def sanitize_text(text: str) -> str:
    """Strip all HTML tags from text."""
    return bleach.clean(text, tags=[], strip=True)
