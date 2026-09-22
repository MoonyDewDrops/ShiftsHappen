-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Gegenereerd op: 22 sep 2026 om 09:45
-- Serverversie: 8.0.46
-- PHP-versie: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shiftshappen`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `contactberichten`
--

CREATE TABLE `contactberichten` (
  `id` int UNSIGNED NOT NULL,
  `naam` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bericht` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `gelezen` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `contactberichten`
--

INSERT INTO `contactberichten` (`id`, `naam`, `email`, `bericht`, `gelezen`, `created_at`) VALUES
(1, 'Test Gebruiker', 'test@example.com', 'Dit is een voorbeeld contactbericht.', 0, '2026-06-23 09:26:21');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `logininfo`
--

CREATE TABLE `logininfo` (
  `id` int UNSIGNED NOT NULL,
  `gebruikersnaam` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wachtwoord` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `logininfo`
--

INSERT INTO `logininfo` (`id`, `gebruikersnaam`, `wachtwoord`, `created_at`) VALUES
(1, 'admin', '$2y$10$ZdeeIpPCW/TQlr2ezKFkDuTiNTXSbhrJ/6bDPbwkuWZbPXnixzGzK', '2026-06-23 09:26:21');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `paginagrid`
--

CREATE TABLE `paginagrid` (
  `id` int UNSIGNED NOT NULL,
  `pageValue` int UNSIGNED NOT NULL,
  `rowPosition` int NOT NULL DEFAULT '0',
  `columnType` tinyint NOT NULL DEFAULT '1',
  `row_width_pct` tinyint UNSIGNED NOT NULL DEFAULT '100',
  `row_align` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'left',
  `column_gap` smallint UNSIGNED NOT NULL DEFAULT '16',
  `flush_columns` tinyint(1) NOT NULL DEFAULT '0',
  `border_top` tinyint(1) NOT NULL DEFAULT '0',
  `border_right` tinyint(1) NOT NULL DEFAULT '0',
  `border_bottom` tinyint(1) NOT NULL DEFAULT '0',
  `border_left` tinyint(1) NOT NULL DEFAULT '0',
  `border_width` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `border_color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#d1d5db'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `paginagrid`
--

INSERT INTO `paginagrid` (`id`, `pageValue`, `rowPosition`, `columnType`, `row_width_pct`, `row_align`, `column_gap`, `flush_columns`, `border_top`, `border_right`, `border_bottom`, `border_left`, `border_width`, `border_color`) VALUES
(13, 7, 1, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(15, 7, 2, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(17, 7, 3, 2, 100, 'center', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(18, 7, 4, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(19, 7, 5, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(20, 7, 6, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(21, 7, 7, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(22, 7, 8, 2, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(23, 7, 9, 1, 100, 'left', 16, 0, 1, 0, 0, 0, 1, '#000000'),
(24, 7, 10, 1, 100, 'right', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(25, 7, 11, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(26, 7, 12, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(27, 7, 13, 2, 100, 'left', 16, 0, 1, 0, 1, 0, 1, '#000000'),
(28, 7, 14, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(29, 9, 1, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#f5f2e8'),
(30, 9, 2, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#000000'),
(31, 9, 3, 1, 100, 'left', 16, 0, 1, 0, 1, 0, 3, '#000000'),
(32, 9, 4, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(33, 9, 5, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(34, 9, 6, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(35, 9, 7, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(36, 9, 8, 1, 100, 'center', 16, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(37, 9, 9, 1, 100, 'left', 16, 0, 0, 0, 1, 0, 3, '#000000'),
(38, 1, 1, 1, 100, 'left', 16, 0, 0, 0, 1, 0, 2, '#000000'),
(48, 1, 2, 1, 100, 'left', 16, 0, 0, 0, 1, 0, 2, '#000000'),
(53, 1, 3, 3, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(54, 1, 4, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(55, 1, 5, 1, 100, 'left', 16, 0, 1, 0, 0, 0, 2, '#000000'),
(56, 1, 6, 3, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(57, 1, 7, 3, 100, 'left', 16, 0, 1, 0, 0, 0, 2, '#000000'),
(58, 1, 8, 3, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(59, 1, 9, 3, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db'),
(60, 1, 10, 1, 100, 'left', 16, 0, 1, 0, 0, 0, 2, '#000000'),
(61, 1, 11, 1, 100, 'left', 16, 0, 1, 0, 0, 0, 2, '#000000'),
(62, 6, 1, 1, 100, 'left', 16, 0, 0, 0, 1, 0, 2, '#000000'),
(63, 6, 2, 3, 100, 'left', 16, 0, 0, 0, 0, 0, 2, '#000000'),
(64, 6, 3, 1, 100, 'left', 16, 0, 1, 0, 0, 0, 2, '#000000'),
(66, 6, 4, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#000000'),
(68, 6, 5, 1, 100, 'left', 16, 0, 0, 0, 0, 0, 1, '#d1d5db');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `paginainfo`
--

CREATE TABLE `paginainfo` (
  `id` int UNSIGNED NOT NULL,
  `whichRow` int UNSIGNED NOT NULL,
  `colum` tinyint NOT NULL,
  `informatie` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto` tinyint(1) NOT NULL DEFAULT '0',
  `backgroundColor` tinyint(1) NOT NULL DEFAULT '0',
  `bold` tinyint(1) NOT NULL DEFAULT '0',
  `italic` tinyint(1) NOT NULL DEFAULT '0',
  `opacity` tinyint NOT NULL DEFAULT '10',
  `kleur` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#111827',
  `backgroundKleur` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#f9fafb',
  `text_align` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'left',
  `vertical_align` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'top',
  `width_pct` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `padding_px` tinyint UNSIGNED NOT NULL DEFAULT '16',
  `border_top` tinyint(1) NOT NULL DEFAULT '0',
  `border_right` tinyint(1) NOT NULL DEFAULT '0',
  `border_bottom` tinyint(1) NOT NULL DEFAULT '0',
  `border_left` tinyint(1) NOT NULL DEFAULT '0',
  `border_width` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `border_color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#d1d5db'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `paginainfo`
--

INSERT INTO `paginainfo` (`id`, `whichRow`, `colum`, `informatie`, `foto`, `backgroundColor`, `bold`, `italic`, `opacity`, `kleur`, `backgroundKleur`, `text_align`, `vertical_align`, `width_pct`, `padding_px`, `border_top`, `border_right`, `border_bottom`, `border_left`, `border_width`, `border_color`) VALUES
(26, 13, 1, 'Wat we doen', 0, 1, 1, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(29, 15, 1, 'Van workshops, groepscoaching tot interventies op maat: \nontdek wat Shifts Happen voor jouw organisatie of netwerk kan betekenen.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 1, 0, 0, 1, 0, 1, '#000000'),
(32, 17, 1, 'img_e1f35bc1fe978280.png', 1, 1, 0, 0, 10, '#111827', '#ffde59', 'left', '0', 25, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(33, 17, 2, 'Elke shift begint met ruimte krijgen: om eerlijk te kijken, te voelen wat knelt en te verbéélden wat anders kan. \nOf je nu binnen een kleine of grote commerciële organisatie, een (semi) overheid of een maatschappelijke organisatie (projectmatig) werkzaam bent— wij bieden ondersteuning en begeleiding op maat om écht te veranderen.', 0, 1, 0, 0, 10, '#111827', '#ffde59', 'center', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(34, 18, 1, 'Gedragsverandering in actie', 0, 1, 1, 0, 10, '#111827', '#f5f2e8', 'left', '0', 0, 16, 1, 0, 0, 0, 1, '#000000'),
(35, 19, 1, 'img_b5611b6ac5d919b0.png', 1, 0, 0, 0, 10, '#111827', '#f9fafb', 'left', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(36, 20, 1, 'Kennis ophalen en toepassen', 0, 1, 1, 1, 10, '#111827', '#f5f2e8', 'right', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(37, 21, 1, 'Theorie werkt — als je het begrijpt en herkent in je eigen praktijk. In onze kennissessies verbinden we inzichten uit de sociale gedragspsychologie met jouw context. \nWe onderzoeken welke factoren in jouw situatie belangrijk zijn om collectief gedrag echt te veranderen. \nDit is belangrijk omdat we vaak zien dat er luk raak  interventies worden ingezet terwijl het probleemgedrag heel ergens anders zit \n Concreet, toepasbaar en direct bruikbaar in interventies op maat die we met en voor jullie ontwerpen en omzetten in een actieplan.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'right', '0', 0, 1, 0, 0, 1, 0, 1, '#000000'),
(38, 22, 1, 'Prijzen zijn afhankelijk van verschillende factoren. Neem gerust contact op voor een offerte of voorstel.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(39, 22, 2, 'knop hier', 0, 1, 0, 0, 10, '#ffffff', '#4caf76', 'center', '0', 25, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(40, 23, 1, 'Altijd blijven lachen', 0, 1, 1, 0, 10, '#111827', '#f5f2e8', 'left', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(41, 24, 1, 'img_49e8bbc26df257c9.png', 1, 0, 0, 0, 10, '#111827', '#f9fafb', 'right', '0', 50, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(42, 25, 1, 'Humor in transities', 0, 1, 1, 0, 10, '#111827', '#f5f2e8', 'right', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(43, 26, 1, 'Humor is geen versiering — het is een strategie. Wanneer mensen lachen, ontspannen ze. En ontspannen mensen leren beter, denken ruimer en durven meer. In onze trajecten is humor een bewust instrument, geen bijproduct.\nLosse humor workshops , bijvoorbeeld op een teamdag of tijdens een congres, vinden wij heel erg leuk om te geven!', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'right', '0', 0, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(44, 27, 1, 'img_e52888405bf84a72.png', 1, 0, 0, 0, 10, '#111827', '#f9fafb', 'left', '0', 25, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(45, 27, 2, 'Wist je dat-\nLachen de kortste weg is naar een eerlijk gesprek?\nHumor doorbreekt weerstand, creëert verbinding en maakt reflectie mogelijk zonder dat het pijn doet. \nWie samen lacht, durft samen eerlijk te reflecteren op waar het knelt — en dat is precies waar verandering begint.', 0, 1, 0, 0, 10, '#111827', '#f06b4f', 'center', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(46, 28, 1, 'img_8fbee6e736b3168f.png', 1, 0, 0, 0, 10, '#111827', '#f9fafb', 'left', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(47, 29, 1, 'Neem contact op', 0, 1, 1, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(48, 30, 1, 'Altijd leuk om kennis te maken en even te sparren. \nDit hoeft nergens op uit te lopen. Mag uiteraard wel.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(49, 31, 1, 'Wil je samen aan de slag met collectieve gedragsverandering in jouw organisatie of netwerk? \nLaat hieronder je gegevens achter, dan neem ik contact met je op. \nLiever bellen of een berichtje sturen? \nDat kan natuurlijk ook.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(50, 32, 1, 'Over Shifts Happen', 0, 1, 1, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(51, 33, 1, 'In de verschillende opdrachten werkt Marieke samen met professionals uit haar brede netwerk om kennis, ervaring en vakmanschap te bundelen voor het beste resultaat. \n\nWij staan voor het creëren van een wereld waarin gedragsverandering niet alleen mogelijk maar ook aantrekkelijk en toegankelijk is voor iedereen. \nWij geloven in de kracht van creativiteit, samenwerking en eerlijkheid.\nOnze missie is om collectieven en systemen in beweging te krijgen richting richting een sociale en ecologische sterke toekomst. Dit doen we door positieve, creatieve interventies te ontwerpen die collectieve verandering mogelijk maken.\n\nMeer over onze aanpak: \nAanbod pagina | Portfolio pagina', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(52, 34, 1, 'img_0d12d3b937b6b776.png', 1, 0, 0, 0, 10, '#111827', '#f9fafb', 'left', '0', 0, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(53, 35, 1, 'Vaak aan onze zijde: Golden Retriever Goos — de dagelijkse reminder dat onvoorwaardelijke liefde het beste gedrag uitlokt. En Shit really happens ;)', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(54, 36, 1, 'img_6208aeb8ab1ed671.png', 1, 0, 0, 0, 10, '#111827', '#f9fafb', 'center', '0', 75, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(55, 37, 1, 'Nieuwsgierig geworden?', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 1, 0, 0, 0, 0, 1, '#d1d5db'),
(56, 38, 1, 'Gedrag in beweging voor een leefbare wereld', 0, 1, 1, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(77, 48, 1, 'Shifts Happen helpt organisaties en individuen in beweging. Van bewustwording naar echte actie – met humor, creativiteit en bewezen methoden uit de sociale gedragspsychologie.', 0, 1, 0, 0, 10, '#111827', '#ffde59', 'center', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(82, 53, 1, 'Wist je dat-\r\nKennis alleen zelden genoeg is om gedrag te veranderen?\r\nWe weten al decennia dat roken ongezond is, dat vlees de planeet belast en dat bewegen goed voor ons is. Toch doen we het niet altijd. \r\nGedrag zit bijvoorbeeld in impulsen, in gewoonten, sociale normen en wordt ook bepaald door de omgeving.', 0, 1, 0, 0, 10, '#111827', '#f06b4f', 'center', '0', 50, 16, 0, 0, 0, 0, 2, '#000000'),
(83, 53, 2, 'img_a29a64425802a903.png', 1, 0, 0, 0, 10, '#111827', '#f9fafb', 'left', '0', 50, 14, 0, 0, 0, 0, 2, '#000000'),
(84, 54, 1, '(Hier knop)', 0, 0, 0, 0, 10, '#111827', '#f9fafb', 'left', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(85, 55, 1, 'Introductie', 0, 1, 1, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(86, 56, 1, 'Soms weet of voel je dat het anders moet. Maar shift het niet. \r\n\r\nShifts Happen helpt collectieven in beweging te komen.\r\n Want echte verandering begint bij gedrag — van mensen en groepen samen.\r\nBenieuwd hoe dat eruitziet in de praktijk? \r\n\r\nBekijk het aanbod of lees over eerdere projecten in het portfolio.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'left', '0', 0, 16, 0, 1, 0, 0, 2, '#000000'),
(87, 56, 2, 'img_ca2423ae420fd1a0.png', 1, 1, 0, 0, 10, '#111827', '#f5f2e8', 'left', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(88, 57, 1, 'img_bb3b644340f59713.png', 1, 0, 0, 0, 10, '#111827', '#f9fafb', 'left', '0', 25, 16, 0, 0, 0, 0, 1, '#000000'),
(89, 57, 2, 'o Workshops en trainingen op maat \r\n\r\nPraktisch, prikkelend en altijd met een knipoog.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'left', '0', 0, 16, 0, 0, 0, 0, 1, '#000000'),
(90, 58, 1, 'img_d49e9bcbc36b9753.png', 1, 1, 0, 0, 10, '#111827', '#f5f2e8', 'left', '0', 25, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(91, 58, 2, 'o Coaching voor individuen en groepen\r\n\r\nVan inzicht naar actie — op eigen tempo. Ook als je - alleen of je team- vermoeid raakt in de strijd voor een betere wereld.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'left', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(92, 59, 1, 'img_65ec5a747f4fe895.png', 1, 1, 0, 0, 10, '#111827', '#f5f2e8', 'left', '0', 25, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(93, 59, 2, 'o Pop-up events voor creatieve actie\r\n\r\nOnverwacht. Binnen of Buiten. Samen.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'left', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(94, 60, 1, '“Shit happens. Shifts ook.”', 0, 1, 1, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(95, 61, 1, 'Klaar voor een shift?\r\n(Neem contact op knop)', 0, 1, 0, 0, 10, '#111827', '#4caf76', 'center', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(96, 62, 1, 'Hieronder een greep uit projecten waarbij we individuen, teams en organisaties hielpen shiften. Elk project is anders — want elke context vraagt een eigen aanpak.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(97, 63, 1, 'Van bewustwording naar eigenaarschap \r\nOp basis van praktijkonderzoek en kennissessies een interventie ontwikkeld voor leidingevenden bij een grote overheidsorganisatie. Hierbij concreet handelingsperspectief aangedragen voor hun voorbeeldrol, de rol van aanjager van duurzame verandering.\r\n\r\nWaardegedreven gesprekken voor energiecoaches \r\nEnergiecoaches helpen huishoudens hun energieverbruik te verlagen — maar gedragsverandering vraagt meer dan goede tips. Voor deze coaches werd een praktische workshopchtend \r\nontwikkeld met bewezen gedragstechnieken: van motiverende gespreksvoering tot het slim inzetten van culturele en sociale factoren. Zodat elke deur die opengaat ook echt iets in beweging zet.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 16, 0, 1, 0, 0, 2, '#000000'),
(98, 63, 2, 'Themaweek\r\nOntwerp en organisatie van een week vol interventies, campagnes en activaties binnen een grote overheidsorganisatie. Niet één boodschap, maar vele instappunten — zodat elke medewerker ergens een raakvlak vond.\r\n\r\nPop-up Café \r\nEen leegstaand pand omgetoverd tot ontmoetingsplek voor maatschappelijke en duurzame initiatieven. Laagdrempelig, vrolijk en verbindend — waar burger en initiatief elkaar gezellig konden ontmoeten.\r\n\r\nLeven lang leren \r\nOntwikkeling van leer- en communicatiematerialen voor projecten binnen maatschappelijke organisaties — toegankelijk, activerend en afgestemd op de doelgroep en het gewenste doelgedrag. Voor jong en oud.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(99, 64, 1, 'Shift\r\nʃɪft/ zelfstandig naamwoord & werkwoord\r\n\r\nEen verschuiving — iets beweegt, kantelt, verandert van positie.\r\nEen omslag — het moment waarop iets écht anders wordt, niet alleen aan de oppervlakte.\r\nEen dienst of wacht — je neemt het over, je doet je deel, je bent aan de beurt.', 0, 1, 0, 0, 10, '#111827', '#f06b4f', 'center', '0', 0, 16, 0, 0, 1, 0, 2, '#000000'),
(100, 66, 1, 'img_b13fa1b2bf6c47f0.png', 1, 0, 0, 0, 10, '#111827', '#f9fafb', 'left', '0', 0, 16, 0, 0, 0, 0, 1, '#d1d5db'),
(101, 68, 1, 'Shifts Happen\r\nMarieke begon haar loopbaan met een studie HRM en werkervaring bij verschillende commerciele organisaties— waar ze leerde hoe organisaties bewegen, wat mensen drijft en waarom verandering zo vaak vastloopt op gedrag. Ook besloot ze om haar carriere in te zetten om maatschappelijk impact te maken.\r\nDaarna koos ze bewust voor echte actie in de verpleegkunde: dichtbij mensen, onder druk, met twee handen en een open hart. Die combinatie van organisatieverstand én menselijk vakmanschap bleken een gouden combinatie. \r\nEen Master Sociale Psychologie voegde de laatste puzzelstukken samen — gedrag, systemen en maatschappelijke vraagstukken. \r\nVandaag verbindt ze als oprichter van Shifts Happen die drie werelden dagelijks. Ze organiseert grote trajecten met veel bewegende delen, houdt het hoofd koel als het ingewikkeld wordt en verliest het einddoel nooit uit het oog. Haar communicatie is direct, warm en raak — of het nu gaat om een beleidsstuk, een workshop of een gesprek op de werkvloer. Ze brengt richting zonder te duwen, verbindt mensen die elkaar anders nooit zouden vinden en bedenkt oplossingen waar anderen nog een probleem zien. Haar enthousiasme en “glas altijd halfvol”-houding maken haar in staat om aan te jagen en optimisme te verspreiden, zelfs wanneer de uitdagingen groot lijken.', 0, 1, 0, 0, 10, '#111827', '#f5f2e8', 'center', '0', 0, 16, 1, 0, 0, 0, 2, '#000000');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `paginas`
--

CREATE TABLE `paginas` (
  `id` int UNSIGNED NOT NULL,
  `titel` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `inhoud` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `heeft_contactformulier` tinyint(1) NOT NULL DEFAULT '0',
  `body_bg` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page_bg` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page_text_color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `footer_bg` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `footer_text` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `paginas`
--

INSERT INTO `paginas` (`id`, `titel`, `slug`, `inhoud`, `heeft_contactformulier`, `body_bg`, `page_bg`, `page_text_color`, `footer_bg`, `footer_text`, `created_at`, `updated_at`) VALUES
(1, 'Home', 'home', 'Welkom bij ShiftsHappen! Dit is de standaard homepagina.', 0, '#f5f2e8', '#f5f2e8', '#111827', '#111827', '#9ca3af', '2026-06-23 07:26:21', '2026-09-08 06:29:26'),
(6, 'Portfolio', 'portfolio', 'Bekijk hier mijn portfolio!', 0, '#f5f2e8', '#f5f2e8', '#111827', '#111827', '#9ca3af', '2026-09-08 07:01:39', '2026-09-08 07:03:53'),
(7, 'Aanbod', 'aanbod', 'Aanbod', 0, '#f5f2e8', '#f5f2e8', '#111827', '#111827', '#9ca3af', '2026-09-08 08:13:21', '2026-09-08 08:16:05'),
(9, 'Contact', 'Contact', 'Contact', 1, '#f5f2e8', '#f5f2e8', '#111827', '#111827', '#9ca3af', '2026-09-08 09:02:09', '2026-09-08 09:03:18');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `site_settings`
--

CREATE TABLE `site_settings` (
  `id` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `header_bg` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#111827',
  `header_text` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#f9fafb',
  `header_link` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#dbeafe',
  `body_bg` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#f3f4f6',
  `page_bg` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#ffffff',
  `accent_color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#2563eb',
  `footer_bg` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#111827',
  `footer_text` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#9ca3af',
  `font_family` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Arial, sans-serif',
  `font_size` tinyint UNSIGNED NOT NULL DEFAULT '16',
  `font_color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#000000',
  `cookie_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `cookie_tekst` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cookie_button_text` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Accepteren',
  `cookie_bg` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#111827',
  `cookie_text_color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#f9fafb',
  `cookie_button_bg` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#2563eb',
  `cookie_button_text_color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#ffffff'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `site_settings`
--

INSERT INTO `site_settings` (`id`, `header_bg`, `header_text`, `header_link`, `body_bg`, `page_bg`, `accent_color`, `footer_bg`, `footer_text`, `font_family`, `font_size`, `font_color`, `cookie_enabled`, `cookie_tekst`, `cookie_button_text`, `cookie_bg`, `cookie_text_color`, `cookie_button_bg`, `cookie_button_text_color`) VALUES
(1, '#000000', '#f9fafb', '#dbeafe', '#f3f4f6', '#ffffff', '#2563eb', '#5a52a9', '#9ca3af', 'Arial, sans-serif', 16, '#000000', 1, 'We gebruiken cookies om je ervaring op onze website te verbeteren. Door op Accepteren te klikken ga je akkoord met ons cookiebeleid.', 'Accepteren', '#111827', '#f9fafb', '#2563eb', '#ffffff');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `socials`
--

CREATE TABLE `socials` (
  `id` int UNSIGNED NOT NULL,
  `platform` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `volgorde` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Gegevens worden geëxporteerd voor tabel `socials`
--

INSERT INTO `socials` (`id`, `platform`, `url`, `volgorde`) VALUES
(1, 'Instagram', 'https://instagram.com/', 1),
(2, 'LinkedIn', 'https://linkedin.com/', 2);

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `contactberichten`
--
ALTER TABLE `contactberichten`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `logininfo`
--
ALTER TABLE `logininfo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `gebruikersnaam` (`gebruikersnaam`);

--
-- Indexen voor tabel `paginagrid`
--
ALTER TABLE `paginagrid`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pageValue` (`pageValue`);

--
-- Indexen voor tabel `paginainfo`
--
ALTER TABLE `paginainfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `whichRow` (`whichRow`);

--
-- Indexen voor tabel `paginas`
--
ALTER TABLE `paginas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexen voor tabel `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `socials`
--
ALTER TABLE `socials`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `contactberichten`
--
ALTER TABLE `contactberichten`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT voor een tabel `logininfo`
--
ALTER TABLE `logininfo`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT voor een tabel `paginagrid`
--
ALTER TABLE `paginagrid`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT voor een tabel `paginainfo`
--
ALTER TABLE `paginainfo`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT voor een tabel `paginas`
--
ALTER TABLE `paginas`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT voor een tabel `socials`
--
ALTER TABLE `socials`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `paginagrid`
--
ALTER TABLE `paginagrid`
  ADD CONSTRAINT `paginagrid_page_fk` FOREIGN KEY (`pageValue`) REFERENCES `paginas` (`id`) ON DELETE CASCADE;

--
-- Beperkingen voor tabel `paginainfo`
--
ALTER TABLE `paginainfo`
  ADD CONSTRAINT `paginainfo_row_fk` FOREIGN KEY (`whichRow`) REFERENCES `paginagrid` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION *s;
