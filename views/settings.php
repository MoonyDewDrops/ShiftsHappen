<?php
require_once __DIR__ . '/../core/admin_header.php';
require_once __DIR__ . '/../core/site_settings.php';

$notice = '';
$noticeError = false;
$settings = getSiteSettings($con);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'header_bg' => validateHexColor($_POST['header_bg'] ?? '#111827'),
        'header_text' => validateHexColor($_POST['header_text'] ?? '#f9fafb'),
        'header_link' => validateHexColor($_POST['header_link'] ?? '#dbeafe'),
        'body_bg' => $settings['body_bg'],
        'page_bg' => $settings['page_bg'],
        'accent_color' => validateHexColor($_POST['accent_color'] ?? '#2563eb'),
        'footer_bg' => $settings['footer_bg'],
        'footer_text' => $settings['footer_text'],
        'cookie_enabled' => isset($_POST['cookie_enabled']) ? 1 : 0,
        'cookie_tekst' => trim($_POST['cookie_tekst'] ?? ''),
        'cookie_button_text' => trim($_POST['cookie_button_text'] ?? 'Accepteren'),
        'cookie_bg' => validateHexColor($_POST['cookie_bg'] ?? '#111827'),
        'cookie_text_color' => validateHexColor($_POST['cookie_text_color'] ?? '#f9fafb'),
        'cookie_button_bg' => validateHexColor($_POST['cookie_button_bg'] ?? '#2563eb'),
        'cookie_button_text_color' => validateHexColor($_POST['cookie_button_text_color'] ?? '#ffffff'),
        'font_family' => sanitizeFontFamily($_POST['font_family'] ?? 'Arial, sans-serif'),
        'font_size' => sanitizeFontSize((int) ($_POST['font_size'] ?? 16)),
        'font_color' => validateHexColor($_POST['font_color'] ?? '#000000'),
    ];

    if ($data['cookie_tekst'] === '') {
        $notice = 'Cookie-tekst mag niet leeg zijn.';
        $noticeError = true;
    } elseif (saveSiteSettings($con, $data)) {
        $settings = getSiteSettings($con);
        $notice = 'Instellingen opgeslagen.';
    } else {
        $notice = 'Opslaan mislukt.';
        $noticeError = true;
    }
}
?>

<div class="admin-panel">
    <h1>Website instellingen</h1>
    <p>Pas de globale header, accentkleur, font, font grootte, en font kleur samen met de cookie-popup aan. Pagina-kleuren stel je per pagina in via <strong>Layout bewerken</strong>.</p>

    <?php if ($notice !== ''): ?>
        <div class="pop-up <?= $noticeError ? 'pop-up--error' : 'pop-up--success' ?>">
            <p><?= testInput($notice) ?></p>
        </div>
    <?php endif; ?>

    <form method="post" class="admin-form">
        <section class="settings-block">
            <h2>Header & accent (globaal)</h2>
            <div class="color-grid">
                <div class="inputField">
                    <label>Header achtergrond</label>
                    <input type="color" name="header_bg" value="<?= testInput($settings['header_bg']) ?>">
                </div>
                <div class="inputField">
                    <label>Header tekst</label>
                    <input type="color" name="header_text" value="<?= testInput($settings['header_text']) ?>">
                </div>
                <div class="inputField">
                    <label>Header links</label>
                    <input type="color" name="header_link" value="<?= testInput($settings['header_link']) ?>">
                </div>
                <div class="inputField">
                    <label>Accentkleur (logo)</label>
                    <input type="color" name="accent_color" value="<?= testInput($settings['accent_color']) ?>">
                </div>
            </div>
        </section>

        <section class="settings-block">
            <h2>Cookie popup</h2>
            <div class="inputField inputField--checkbox">
                <label>
                    <input type="checkbox" name="cookie_enabled" value="1" <?= !empty($settings['cookie_enabled']) ? 'checked' : '' ?>>
                    Cookie popup tonen
                </label>
            </div>
            <div class="inputField">
                <label for="cookie_tekst">Tekst</label>
                <textarea name="cookie_tekst" id="cookie_tekst" rows="3" required><?= testInput($settings['cookie_tekst']) ?></textarea>
            </div>
            <div class="inputField">
                <label for="cookie_button_text">Knoptekst</label>
                <input type="text" name="cookie_button_text" id="cookie_button_text" value="<?= testInput($settings['cookie_button_text']) ?>" required>
            </div>
            <div class="color-grid">
                <div class="inputField">
                    <label>Popup achtergrond</label>
                    <input type="color" name="cookie_bg" value="<?= testInput($settings['cookie_bg']) ?>">
                </div>
                <div class="inputField">
                    <label>Popup tekst</label>
                    <input type="color" name="cookie_text_color" value="<?= testInput($settings['cookie_text_color']) ?>">
                </div>
                <div class="inputField">
                    <label>Knop achtergrond</label>
                    <input type="color" name="cookie_button_bg" value="<?= testInput($settings['cookie_button_bg']) ?>">
                </div>
                <div class="inputField">
                    <label>Knop tekst</label>
                    <input type="color" name="cookie_button_text_color" value="<?= testInput($settings['cookie_button_text_color']) ?>">
                </div>
            </div>
        </section>

        <section class="settings-block">
            <h2>Font, grootte & kleur (globaal)</h2>
            <div class="inputField">
                <label for="font_family">Font familie</label>
                <select name="font_family" id="font_family">
                    <?php foreach (allowedFontFamilies() as $fontFamily): ?>
                        <?php
                        $fontLabel = explode(',', $fontFamily)[0];
                        $fontLabel = trim($fontLabel, " '\"");
                        ?>
                        <option value="<?= testInput($fontFamily) ?>" <?= $settings['font_family'] === $fontFamily ? 'selected' : '' ?>>
                            <?= testInput($fontLabel) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="inputField">
                <label for="font_size">Font grootte (px)</label>
                <input type="number" name="font_size" id="font_size" value="<?= testInput($settings['font_size']) ?>" min="8" max="72">
            </div>
            <div class="inputField">
                <label for="font_color">Font kleur</label>
                <input type="color" name="font_color" id="font_color" value="<?= testInput($settings['font_color']) ?>">
            </div>
        </section>

        <button type="submit">Instellingen opslaan</button>
    </form>
</div>

<?php require_once __DIR__ . '/../core/admin_footer.php'; ?>
