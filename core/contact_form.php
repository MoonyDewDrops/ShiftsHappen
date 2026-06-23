<?php

function handleContactForm(mysqli $con): array
{
    $naam = trim($_POST['naam'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $bericht = trim($_POST['bericht'] ?? '');

    if ($naam === '' || $email === '' || $bericht === '') {
        return ['message' => 'Vul alle velden in.', 'error' => true];
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['message' => 'Vul een geldig e-mailadres in.', 'error' => true];
    }

    $stmt = $con->prepare('INSERT INTO contactberichten (naam, email, bericht) VALUES (?, ?, ?)');
    $stmt->bind_param('sss', $naam, $email, $bericht);

    if ($stmt->execute()) {
        $stmt->close();
        return ['message' => 'Bedankt! Je bericht is verstuurd.', 'error' => false];
    }

    $stmt->close();
    return ['message' => 'Versturen mislukt. Probeer het later opnieuw.', 'error' => true];
}

function renderContactForm(array $feedback = []): void
{
    $message = $feedback['message'] ?? '';
    $isError = $feedback['error'] ?? false;
    ?>
    <section class="contact-section">
        <h2>Contact</h2>

        <?php if ($message !== ''): ?>
            <div class="pop-up <?= $isError ? 'pop-up--error' : 'pop-up--success' ?>">
                <p><?= testInput($message) ?></p>
            </div>
        <?php endif; ?>

        <form method="post" class="contact-form">
            <input type="hidden" name="contact_submit" value="1">

            <div class="inputField">
                <label for="contact-naam">Naam</label>
                <input type="text" name="naam" id="contact-naam" required
                    value="<?= testInput($_POST['naam'] ?? '') ?>">
            </div>

            <div class="inputField">
                <label for="contact-email">E-mail</label>
                <input type="email" name="email" id="contact-email" required
                    value="<?= testInput($_POST['email'] ?? '') ?>">
            </div>

            <div class="inputField">
                <label for="contact-bericht">Bericht</label>
                <textarea name="bericht" id="contact-bericht" rows="5" required><?= testInput($_POST['bericht'] ?? '') ?></textarea>
            </div>

            <button type="submit">Verstuur bericht</button>
        </form>
    </section>
    <?php
}
