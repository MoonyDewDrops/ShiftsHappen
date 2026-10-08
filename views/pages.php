<?php
require_once __DIR__ . '/../core/db_connect.php';
require_once __DIR__ . '/../core/contact_form.php';
require_once __DIR__ . '/../core/page_theme.php';
require_once __DIR__ . '/../core/page_grid.php';
require_once __DIR__ . '/../core/grid_styles.php';

$page = null;
$paginaGrid = [];
$contactFeedback = [];

$slug = trim($_GET['slug'] ?? '');
$pageId = (int) ($_GET['id'] ?? 0);

if ($slug !== '') {
    $stmt = $con->prepare(
        'SELECT id, titel, slug, inhoud, heeft_contactformulier, body_bg, page_bg, page_text_color, footer_bg, footer_text
         FROM paginas WHERE slug = ?'
    );
    $stmt->bind_param('s', $slug);
} elseif ($pageId > 0) {
    $stmt = $con->prepare(
        'SELECT id, titel, slug, inhoud, heeft_contactformulier, body_bg, page_bg, page_text_color, footer_bg, footer_text
         FROM paginas WHERE id = ?'
    );
    $stmt->bind_param('i', $pageId);
} else {
    $stmt = $con->prepare(
        'SELECT id, titel, slug, inhoud, heeft_contactformulier, body_bg, page_bg, page_text_color, footer_bg, footer_text
         FROM paginas WHERE slug = ?'
    );
    $defaultSlug = 'home';
    $stmt->bind_param('s', $defaultSlug);
}

$stmt->execute();
$result = $stmt->get_result();
$page = $result->fetch_assoc();
$stmt->close();

if ($page && !empty($page['heeft_contactformulier']) && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['contact_submit'])) {
    $contactFeedback = handleContactForm($con);
}

if ($page) {
    $paginaGrid = getPageGridRows($con, (int) $page['id']);
}

$pageTitle = $page['titel'] ?? 'Pagina niet gevonden';
$pageTheme = $page ? getPageTheme($page, $con) : null;
include __DIR__ . '/../core/header.php';
?>

<?php if (!$page): ?>
    <div class="page-error">
        <h1>Pagina niet gevonden</h1>
        <p>Deze pagina bestaat niet (meer).</p>
        <p><a href="<?= view('pages.php') ?>?slug=home">Terug naar home</a></p>
    </div>
<?php else: ?>
    <div class="page-container">
        <h1 class="page-title" style="color: var(--page-text-color);"></h1>

        <?php if (!empty($paginaGrid)): ?>
            <?php foreach ($paginaGrid as $gridRow): ?>
                <?php
                $columnType = (int) $gridRow['columnType'];
                $columnAmount = gridColumnCount($columnType);
                $rowLayout = normalizeRowLayout($gridRow);
                $flushRow = !empty($rowLayout['flush_columns']) || (int) $rowLayout['column_gap'] === 0;
                $gridClass = rowGridClass($columnType, $gridRow);
                $wrapperStyle = buildRowWrapperStyle($gridRow);
                $gridStyle = buildRowGridStyle($gridRow, $gridRow['columns'], $columnAmount);
                ?>
                <div class="rowContainer">
                    <div class="row-wrapper" style="<?= $wrapperStyle ?>">
                        <div class="<?= $gridClass ?>" style="<?= $gridStyle ?>">
                            <?php for ($columnID = 1; $columnID <= $columnAmount; $columnID++): ?>
                                <?php
                                $column = $gridRow['columns'][$columnID] ?? null;
                                if (!$column) {
                                    continue;
                                }

                                $newOpacity = max(0, min(1, ((int) ($column['opacity'] ?? 10)) / 10));
                                $contentMode = (int) ($column['content_mode'] ?? (((int) ($column['foto'] ?? 0) === 1) ? 1 : 0));
                                $textClasses = 'home-text';
                                if ((int) ($column['italic'] ?? 0) === 1) {
                                $textClasses .= ' italic';
                                }
                                if ((int) ($column['bold'] ?? 0) === 1) {
                                    $textClasses .= ' bold';
                                }
                                $bgColor = validateHexColor($column['backgroundKleur'] ?? '#f9fafb', '#f9fafb');
                                $isImageOnly = $contentMode === 1;
                                $columnStyle = buildColumnStyle($column, $isImageOnly, $flushRow);
                                $imageClass = $flushRow ? 'grid-image grid-image--flush' : 'grid-image';
                                $imagePosition = sanitizeAlign($column['image_position'] ?? 'top', ['top', 'right', 'bottom', 'left'], 'top');
                                $imageFile = $column['image_filename'] ?? '';
                                ?>

                                <div class="grid-cell" style="<?= $columnStyle ?>">
                                    <?php if ($contentMode === 1): ?>
                                        <?php if (!empty($imageFile)): ?>
                                            <div class="<?= $imageClass ?>">
                                                <img class="team-image"
                                                    src="<?= asset('img/fotos/' . rawurlencode($imageFile)) ?>"
                                                    style="opacity: <?= $newOpacity ?>;"
                                                    alt="Afbeelding">
                                            </div>
                                        <?php endif; ?>
                                    <?php elseif ($contentMode === 2): ?>
                                        <div class="content-both content-both--<?= testInput($imagePosition) ?>" style="width: 100%;">
                                            <?php if (!empty($imageFile)): ?>
                                                <div class="content-both__image <?= $imageClass ?>">
                                                <img class="team-image"
                                                src="<?= asset('img/fotos/' . rawurlencode($imageFile)) ?>"
                                                style="opacity: <?= $newOpacity ?>;"
                                                alt="Afbeelding">
                                                </div>
                                            <?php endif; ?>
                                        <div class="content-both__text content-column" style="background-color: <?= testInput($bgColor) ?>;">
                                            <p class="<?= $textClasses ?>"
                                            style="opacity: <?= $newOpacity ?>; color: <?= testInput($column['kleur'] ?? '#111827') ?>;">
                                            <?= renderBlockHtml($column['informatie'] ?? '') ?>
                                            </p>
                                        </div>
                                    </div>
                                    <?php else: ?>
                                        <div class="content-column" style="background-color: <?= testInput($bgColor) ?>; width: 100%;">
                                            <p class="<?= $textClasses ?>"
                                                style="opacity: <?= $newOpacity ?>; color: <?= testInput($column['kleur'] ?? '#111827') ?>;">
                                                <?= renderBlockHtml($column['informatie'] ?? '') ?>
                                            </p>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            <?php endfor; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="page-content">
                <?= nl2br(testInput($page['inhoud'])) ?>
            </div>
        <?php endif; ?>

        <?php if (!empty($page['heeft_contactformulier'])): ?>
            <?php renderContactForm($contactFeedback); ?>
        <?php endif; ?>
    </div>
<?php endif; ?>

<?php include __DIR__ . '/../core/footer.php'; ?>
