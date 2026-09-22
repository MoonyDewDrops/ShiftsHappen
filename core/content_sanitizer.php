<?php

/**
 * Very small allow-list HTML sanitizer for the rich text used inside
 * page-builder text blocks. Only inline formatting the block editor can
 * itself produce is kept: bold, italic, line breaks, paragraphs and the
 * "grid-title" span used for in-text headings. Everything else (scripts,
 * event handler attributes, unknown tags, inline styles, links, ...) is
 * stripped out. This runs on every save, so it's the thing standing
 * between "someone types in the admin panel" and "arbitrary HTML ends
 * up on the public site".
 */
function sanitizeBlockHtml(?string $html): string
{
    $html = trim((string) $html);
    if ($html === '') {
        return '';
    }

    $allowedTags = ['b', 'strong', 'i', 'em', 'br', 'span', 'p', 'div'];
    $allowedClasses = ['grid-title'];

    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML(
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' .
        '<div id="sanitizer-root">' . $html . '</div>',
        LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_HTML_NODEFDTD
    );
    libxml_clear_errors();

    $root = $doc->getElementById('sanitizer-root');
    if (!$root) {
        return htmlspecialchars(strip_tags($html), ENT_QUOTES, 'UTF-8');
    }

    sanitizeBlockNode($root, $allowedTags, $allowedClasses);

    $inner = '';
    foreach (iterator_to_array($root->childNodes) as $child) {
        $inner .= $doc->saveHTML($child);
    }

    return trim($inner);
}

function sanitizeBlockNode(DOMNode $node, array $allowedTags, array $allowedClasses): void
{
    foreach (iterator_to_array($node->childNodes) as $child) {
        if ($child->nodeType === XML_TEXT_NODE) {
            continue;
        }

        if (!($child instanceof DOMElement)) {
            $node->removeChild($child);
            continue;
        }

        $tag = strtolower($child->tagName);

        if (!in_array($tag, $allowedTags, true)) {
            // Unwrap: keep whatever text/children were inside, drop the tag itself.
            while ($child->firstChild) {
                $node->insertBefore($child->firstChild, $child);
            }
            $node->removeChild($child);
            continue;
        }

        foreach (iterator_to_array($child->attributes) as $attr) {
            if ($tag === 'span' && $attr->name === 'class') {
                $classes = array_values(array_intersect(preg_split('/\s+/', $attr->value), $allowedClasses));
                if (!empty($classes)) {
                    $child->setAttribute('class', implode(' ', $classes));
                    continue;
                }
            }
            $child->removeAttribute($attr->name);
        }

        sanitizeBlockNode($child, $allowedTags, $allowedClasses);
    }
}

/**
 * True when the rich text has no visible characters (ignoring markup).
 */
function blockTextIsEmpty(?string $html): bool
{
    return trim(strip_tags((string) $html)) === '';
}

/**
 * Renders a block for the public page: re-sanitizes as a defense-in-depth
 * measure (cheap, idempotent) and turns any leftover raw newlines (old
 * plain-text content saved before this feature existed) into <br>.
 */
function renderBlockHtml(?string $html): string
{
    return nl2br(sanitizeBlockHtml($html));
}