<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="assets/css/contact.css">
    <title>Contact</title>
</head>

<body>
    <?php include __DIR__ . '/includes/header.php'; ?>
    <section class="contactTitel">
        <div>
            <h1>Neem contact op</h1>
            <p>Altijd leuk om kennis te maken en even te sparren.</p>
            <p>Dit hoeft nergens op uit te lopen. Mag uiteraard wel.</p>
        </div>

    </section>
    <section class="advertColumn">
        <div class="advertEen">
            <p>Wil je samen aan de slag met collectieve gedragsverandering in jouw organisatie of netwerk?</p>
            <p>Laat hieronder je gegevens achter, dan neem ik contact met je op.</p>
            <p>Liever bellen of een berichtje sturen? Dat kan natuurlijk ook.</p>
        </div>
    </section>

    <section class="overShiftsHappen">
        <div>
            <p>Marieke begon haar loopbaan met een studie HRM en werkervaring bij verschillende commerciele organisaties— waar ze leerde hoe organisaties bewegen, wat mensen drijft en waarom verandering zo vaak vastloopt op gedrag. Ook besloot ze om haar carriere in te zetten om maatschappelijk impact te maken. Daarna koos ze bewust voor echte actie in de verpleegkunde: dichtbij mensen, onder druk, met twee handen en een open hart. Die combinatie van organisatieverstand én menselijk vakmanschap bleken een gouden combinatie. Een Master Sociale Psychologie voegde de laatste puzzelstukken samen — gedrag, systemen en maatschappelijke vraagstukken. </p>
            <p>Vandaag verbindt ze als oprichter van Shifts Happen die drie werelden dagelijks. Ze organiseert grote trajecten met veel bewegende delen, houdt het hoofd koel als het ingewikkeld wordt en verliest het einddoel nooit uit het oog. Haar communicatie is direct, warm en raak — of het nu gaat om een beleidsstuk, een workshop of een gesprek op de werkvloer. Ze brengt richting zonder te duwen, verbindt mensen die elkaar anders nooit zouden vinden en bedenkt oplossingen waar anderen nog een probleem zien. Haar enthousiasme en “glas altijd halfvol”-houding maken haar in staat om aan te jagen en optimisme te verspreiden, zelfs wanneer de uitdagingen groot lijken.</p>
            <p>In de verschillende opdrachten werkt Marieke samen met professionals uit haar brede netwerk om kennis, ervaring en vakmanschap te bundelen voor het beste resultaat.</p>
            <p>Wij staan voor het creëren van een wereld waarin gedragsverandering niet alleen mogelijk maar ook aantrekkelijk en toegankelijk is voor iedereen. Wij geloven in de kracht van creativiteit, samenwerking en eerlijkheid. Onze missie is om collectieven en systemen in beweging te krijgen richting richting een sociale en ecologische sterke toekomst. Dit doen we door positieve, creatieve interventies te ontwerpen die collectieve verandering mogelijk maken.</p>
            <p>Meer over onze aanpak:</p>
            <a href="aanbod.php">Aanbod pagina</a> | <a href="portfolio.php">Portfolio pagina</a>
        </div>
    </section>
    <section class="sectionDivider">
        <div>
            <img src="assets/img/fotos/img_0d12d3b937b6b776.png" alt="Green Divider">
        </div>
    </section>
    <section class="goosInformation">
        <p>Vaak aan onze zijde: Golden Retriever Goos — de dagelijkse reminder dat onvoorwaardelijke liefde het beste gedrag uitlokt. En Shit really happens ;)</p>
        <img src="assets/img/fotos/img_6208aeb8ab1ed671.png" alt="Image">
    </section>

    <section class="contact-section">
        <h2>Contact formulier</h2>
        <form method="post" class="contact-form">
            <div class="contact-row">
                <div class="inputField">
                    <input type="text" name="naam" id="contact-naam" required placeholder="Naam (verplicht)"
                        value="naam">
                </div>

                <div class="inputField">
                    <input type="text" name="organisatie" id="contact-organisatie" placeholder="Organisatie"
                        value="organisatie">
                </div>

                <div class="inputField">
                    <input type="email" name="email" id="contact-email" required placeholder="E-mailadres (verplicht)"
                        value="email">
                </div>

                <div class="inputField">
                    <input type="tel" name="telefoonnummer" id="contact-telefoonnummer" placeholder="Telefoonnummer"
                        value="telefoonnummer">
                </div>
            </div>

            <div class="contact-column">
                <div class="inputField">
                    <textarea name="bericht" id="contact-bericht" rows="5" placeholder="Bericht/vraag (verplicht)" required>bericht</textarea>
                </div>
            </div>

            <div class="checkbox-column">
                <input type="checkbox" id="checkbox-email" name="checkbox" value="checkbox-email">
                <label for="checkbox">Ik ontvang graag updates of inspiratie via e-mail</label><br>
            </div>

            <div class="verstuur-row">
                <input type="hidden" name="contact_submit" value="1">
                <button id="verstuur-button" type="submit">Verstuur bericht</button>
            </div>
        </form>
    </section>

    <?php include __DIR__ . '/includes/footer.php'; ?>
</body>

</html>