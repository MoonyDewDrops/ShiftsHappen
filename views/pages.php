<?php
require_once __DIR__ . '/../core/db_connect.php';
require_once __DIR__ . '/../core/contact_form.php';
require_once __DIR__ . '/../core/page_theme.php';

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
    $currentPage = (int) $page['id'];
    $gridStmt = $con->prepare('SELECT id, columnType FROM paginagrid WHERE pageValue = ? ORDER BY rowPosition ASC');
    $gridStmt->bind_param('i', $currentPage);
    $gridStmt->execute();
    $gridResult = $gridStmt->get_result();
    $paginaGrid = $gridResult->fetch_all(MYSQLI_ASSOC) ?: [];
    $gridStmt->close();
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
        <h1 class="page-title" style="color: var(--page-text-color);"><?= testInput($page['titel']) ?></h1>

        <?php if (!empty($paginaGrid)): ?>
            <?php
            $infoStmt = $con->prepare(
                'SELECT informatie, foto, backgroundColor, backgroundKleur, bold, italic, opacity, kleur
                 FROM paginainfo WHERE whichRow = ? AND colum = ?'
            );
            ?>

            <?php foreach ($paginaGrid as $row): ?>
                <?php
                $rowId = (int) $row['id'];
                $columnType = (int) $row['columnType'];

                switch ($columnType) {
                    case 2:
                    case 3:
                        $columnAmount = 2;
                        break;
                    case 4:
                        $columnAmount = 3;
                        break;
                    default:
                        $columnAmount = 1;
                        break;
                }

                if ($columnType === 1) {
                    $rowClass = 'top-content';
                } elseif ($columnType === 2 || $columnType === 3) {
                    $rowClass = 'middle-content';
                } else {
                    $rowClass = 'row' . $columnType;
                }
                ?>

                <div class="rowContainer">
                    <div class="<?= $rowClass ?>">
                        <?php for ($columnID = 1; $columnID <= $columnAmount; $columnID++): ?>
                            <?php
                            $infoStmt->bind_param('ii', $rowId, $columnID);
                            $infoStmt->execute();
                            $infoStmt->bind_result($informatie, $foto, $backgroundColor, $backgroundKleur, $bolded, $italic, $opacity, $kleur);

                            if (!$infoStmt->fetch()) {
                                continue;
                            }

                            $newOpacity = max(0, min(1, ((int) $opacity) / 10));
                            $isImage = (int) $foto === 1;
                            $textClasses = 'home-text';
                            if ((int) $italic === 1) {
                                $textClasses .= ' italic';
                            }
                            if ((int) $bolded === 1) {
                                $textClasses .= ' bold';
                            }
                            $bgColor = validateHexColor($backgroundKleur ?? '#f9fafb', '#f9fafb');
                            ?>

                            <?php if ($isImage): ?>
                                <div class="<?= $columnType === 1 ? 'top-image' : 'page-image' ?>">
                                    <img class="team-image"
                                        src="<?= asset('img/fotos/' . rawurlencode($informatie)) ?>"
                                        style="opacity: <?= $newOpacity ?>;"
                                        alt="Afbeelding">
                                </div>
                            <?php else: ?>
                                <div class="content-column" style="background-color: <?= testInput($bgColor) ?>;">
                                    <p class="<?= $textClasses ?>"
                                        style="opacity: <?= $newOpacity ?>; color: <?= testInput($kleur) ?>;">
                                        <?= nl2br(testInput($informatie)) ?>
                                    </p>
                                </div>
                            <?php endif; ?>
                        <?php endfor; ?>
                    </div>
                </div>
            <?php endforeach; ?>

            <?php $infoStmt->close(); ?>
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
