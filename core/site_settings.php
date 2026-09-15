<?php

function defaultSiteSettings(): array
{
    return [
        'id' => 1,
        'header_bg' => '#111827',
        'header_text' => '#f9fafb',
        'header_link' => '#dbeafe',
        'body_bg' => '#f3f4f6',
        'page_bg' => '#ffffff',
        'accent_color' => '#2563eb',
        'footer_bg' => '#111827',
        'footer_text' => '#9ca3af',
        'font_family' => allowedFontFamilies()[0],
        'font_size' => 16,
        'font_color' => '#000000',
        'cookie_enabled' => 1,
        'cookie_tekst' => 'We gebruiken cookies om je ervaring op onze website te verbeteren. Door op Accepteren te klikken ga je akkoord met ons cookiebeleid.',
        'cookie_button_text' => 'Accepteren',
        'cookie_bg' => '#111827',
        'cookie_text_color' => '#f9fafb',
        'cookie_button_bg' => '#2563eb',
        'cookie_button_text_color' => '#ffffff',
    ];
}

function allowedFontFamilies(): array
{
    return [
        'Arial, sans-serif',
        "'Helvetica Neue', Helvetica, sans-serif",
        "'Times New Roman', Times, serif",
        "'Courier New', Courier, monospace",
        'Verdana, Geneva, sans-serif',
    ];
}

function sanitizeFontFamily(string $font): string
{
    $allowed = allowedFontFamilies();

    return in_array($font, $allowed, true) ? $font : $allowed[0];
}

function sanitizeFontSize(int $size): int
{
    return max(8, min(72, $size));
}

function ensureSiteSettingsColumns(mysqli $con): void
{
    static $ensured = false;

    if ($ensured) {
        return;
    }

    $columns = [
        'font_family' => "VARCHAR(100) NOT NULL DEFAULT 'Arial, sans-serif'",
        'font_size' => 'TINYINT UNSIGNED NOT NULL DEFAULT 16',
        'font_color' => "VARCHAR(20) NOT NULL DEFAULT '#000000'",
    ];

    foreach ($columns as $name => $definition) {
        $exists = $con->query("SHOW COLUMNS FROM site_settings LIKE '{$name}'");
        if ($exists && $exists->num_rows === 0) {
            $con->query("ALTER TABLE site_settings ADD COLUMN {$name} {$definition}");
        }
    }

    $ensured = true;
}

function getSiteSettings(mysqli $con): array
{
    ensureSiteSettingsColumns($con);
    $result = $con->query('SELECT * FROM site_settings WHERE id = 1');

    if ($result && $row = $result->fetch_assoc()) {
        $settings = array_merge(defaultSiteSettings(), $row);
        $settings['font_family'] = sanitizeFontFamily((string) ($settings['font_family'] ?? ''));
        $settings['font_size'] = sanitizeFontSize((int) ($settings['font_size'] ?? 16));

        return $settings;
    }

    return defaultSiteSettings();
}

function saveSiteSettings(mysqli $con, array $data): bool
{
    ensureSiteSettingsColumns($con);

    $defaults = defaultSiteSettings();
    $settings = array_merge($defaults, $data);
    $settings['font_family'] = sanitizeFontFamily((string) $settings['font_family']);
    $settings['font_size'] = sanitizeFontSize((int) $settings['font_size']);
    $fontSize = $settings['font_size'];

    $stmt = $con->prepare(
        'INSERT INTO site_settings (
            id, header_bg, header_text, header_link, body_bg, page_bg, accent_color,
            footer_bg, footer_text, font_family, font_size, font_color,
            cookie_enabled, cookie_tekst, cookie_button_text,
            cookie_bg, cookie_text_color, cookie_button_bg, cookie_button_text_color
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            header_bg = VALUES(header_bg),
            header_text = VALUES(header_text),
            header_link = VALUES(header_link),
            body_bg = VALUES(body_bg),
            page_bg = VALUES(page_bg),
            accent_color = VALUES(accent_color),
            footer_bg = VALUES(footer_bg),
            footer_text = VALUES(footer_text),
            font_family = VALUES(font_family),
            font_size = VALUES(font_size),
            font_color = VALUES(font_color),
            cookie_enabled = VALUES(cookie_enabled),
            cookie_tekst = VALUES(cookie_tekst),
            cookie_button_text = VALUES(cookie_button_text),
            cookie_bg = VALUES(cookie_bg),
            cookie_text_color = VALUES(cookie_text_color),
            cookie_button_bg = VALUES(cookie_button_bg),
            cookie_button_text_color = VALUES(cookie_button_text_color)'
    );

    $cookieEnabled = !empty($settings['cookie_enabled']) ? 1 : 0;

    if (!$stmt) {
        return false;
    }

    $stmt->bind_param(
        'sssssssssisissssss',
        $settings['header_bg'],
        $settings['header_text'],
        $settings['header_link'],
        $settings['body_bg'],
        $settings['page_bg'],
        $settings['accent_color'],
        $settings['footer_bg'],
        $settings['footer_text'],
        $settings['font_family'],
        $fontSize,
        $settings['font_color'],
        $cookieEnabled,
        $settings['cookie_tekst'],
        $settings['cookie_button_text'],
        $settings['cookie_bg'],
        $settings['cookie_text_color'],
        $settings['cookie_button_bg'],
        $settings['cookie_button_text_color']
    );

    $ok = $stmt->execute();
    $stmt->close();

    return $ok;
}
