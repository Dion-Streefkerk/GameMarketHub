[[_TOC_]]

## Opdrachtomschrijving

Dit is het project voor Software Engineering in blok 4 (2023 - 2024).

LucaStars is ontzettend blij met de games die in het vorige blok zijn opgeleverd. De marketingafdeling van LucaStars heeft daarom, samen met CEO Bert Rongil, bedacht om de games te koop aan te bieden in een speciaal hiervoor te bouwen webshop. Zo krijgt iedereen die graag text based adventures speelt een prachtig aanbod voorgeschoteld! De opdracht die je nu van LucaStars krijgt, is om samen met je team een webshop te bouwen voor de games die in blok 3 zijn opgeleverd!

In de vorige blokken heb je kennis gemaakt en gewerkt met de basisprincipes van (object georiënteerd) programmeren, databases, allerhande webtechnologieën, UX/UI design en infrastructure. Ook heb je geleerd hoe je moet samenwerken in een team, hoe je scrum inzet om structuur aan je project te geven en ga zo maar door. Op deze wijze heb je mooie producten gemaakt: Dokkie, Code Exchange en The Game. In het laatste blok van dit studiejaar wordt er van je verwacht dat je veel meer zelf gaat doen. Dus waar je bijvoorbeeld in het vorige blok een volledig uitgewerkt class diagram had met een bijpassende game engine om tegenaan te programmeren, ga je in dit project een groot gedeelte van het class diagram zelf maken en omzetten naar code.

Een aantal onderdelen binnen dit project zijn nieuw. Zo ga je een onderzoek uitvoeren binnen de context van het project en ga je code testen.

## Wat je gaat maken

### Randvoorwaarden webshop

De opdracht die je team krijgt is dus om een webshop te bouwen voor de in blok 3 opgeleverde games. Hierbij worden dezelfde technologieën als in het vorige blok gebruikt:

- Lit: Het framework waarmee je Web Components kan realiseren op de frontend.
- Express: Het framework waarmee je APIs kan bouwen, vergelijkbaar met de HBO-ICT.Cloud API van blok 1 en 2!
- Fetch API: Een functionaliteit in moderne browsers waarmee je APIs kan aanspreken.
- Node.js: De techniek die je code uiteindelijk uitvoert.
- HTML/CSS: Met name in relatie tot Web Components.
- TypeScript: Want alleen met veel programmeren word je behendiger als programmeur!
- MySQL: Vanuit de code praat je weer met een MySQL database.

In de webshop wordt iedere opgeleverde game aangeboden. De benodigde informatie per game vind je in een CSV-bestand in de docs-map in deze repository. Om extra inkomsten te genereren dient de webshop per game ook merchandise aan te bieden. Denk aan hoodies, T-shirts, mokken, etc.

Voor de requirements van de webshop verwijzen we ook naar de docs-map. Hier vind je technische documentatie: technische eisen API, design (wireframe, css en omschrijving) en netwerkvereisten. 

### Rol Product Owner

Ieder team plant aan het begin van het project een gesprek met de Product Owner om de requirements en aanvullende eisen goed helder te krijgen. Gedurende het project is de Product Owner jullie eerste aanspreekpunt voor het op te leveren product. Stem bijvoorbeeld de `Product Backlog` en de `Sprint Backlogs` goed af met de Product Owner en praat hen regelmatig bij. Bottom line komt het er op neer dat de Product Owner niet verrast mag worden m.b.t. het product dat jullie opleveren.

### Onderzoek

Naast een webshop wil LucaStars dat ieder teamlid een onderzoeksverslag schrijft in de context van de opdracht. De resultaten van de onderzoeksverslagen wil LucaStars gebruiken om de webshop op de middellange termijn door te ontwikkelen. User stories die op basis van de verschillende onderzoeksverslagen worden geformuleerd komen dus minimaal op de backlog terecht. Het onderzoeksverslag is in het Standaardnederlands.

Onderwerpen voor je onderzoek waar je uit kunt kiezen zijn:

- Verwerken van persoonsgegevens volgens AVG, GDPR.
- Procedures in geval van een datalek.
- Invoeren van digitale duurzaamheid voor deze webshop.
- Belangrijke normen en waarden voor LucaStars.
- Een inclusieve webshop.
- Online marketing via SEO.
- Een optimale netwerkinfrastructuur van de webshop in termen van performance en security.
- Voordelen en nadelen van de in het project gebruikte codebase.
- Best practises rond UI en UX die toepasbaar zijn in de webshop.
- Websites geschikt maken voor gebruikers met een visuele beperking.
- Backend frameworks.
- Frontend web frameworks.
- Cookie toestemming. 
- Veilig regelen van betalingen in een webshop.
- Een eigen onderwerp na goedkeuring van de docent.

## Learning stories, user stories en Product Backlog

### Learning stories

Tijdens dit project werk je weer aan **learning stories**. Daarin staan de te leren vaardigheden en competenties binnen dit project. Ze geven je houvast bij wat je moet leren. In de learning stories staan verwijzingen naar **lesmateriaal**. Bijvoorbeeld de Knowledge Base, de Digitale Leeromgeving (DLO), videocourses, websites, etc.

Veel van de **learning stories** heb je al gezien tijdens het vorige blok, maar die kun je nu gebruiken om de boel weer even op te frissen. Je vindt ze onder `Issues > Boards > Selecteer <Product Backlog> in de dropdown`. Een learning story hoeft niet aan een `Milestone` te worden gekoppeld.

### User stories

Voor deze opdracht zijn _epic_ user stories opgesteld. Dat geeft je team houvast bij het bouwen van de webshop. Iedere _epic_ user story krijgt onderliggende _child_ user stories die ieder voorzien moeten worden van acceptatiecriteria en taken. Bij het opstellen van een user story houd je onderstaand format aan. Als basis voor de user stories gebruik je het requirements-document dat jullie eerder hebben opgesteld.

Wat is een user story ook al weer? Op [scrumguide.nl](https://scrumguide.nl/user-story/) vind je de volgende definitie:

> “Een User Story is een korte beschrijving (Story) van wat een gebruiker (User) wil. User Stories worden gebruikt bij het ontwikkelen van producten of software binnen Agile raamwerken, waaronder Scrum. Een User Story bestaat uit enkele zinnen waarin staat wat de gebruiker van het product moet / wil doen. Een User Story is eigenlijk weinig gedetailleerd en zou moeten kunnen passen op een post-it. Via de User Story heeft de gebruiker invloed op het ontwikkelen van een systeem of product en uiteindelijk de functionaliteit ervan.”

Een user story noteer je volgens een vast format:

_Als … (soort gebruiker) wil ik … (feature/actie), zodat … (doel/voordeel)._

Een voorbeeld van een user story:

_“Als gamer wil ik met mijn ruimteschip kunnen schieten als ik op de spatiebalk druk, zodat ik vijandige aliens kan uitschakelen.”_

### De Product Backlog van deze opdracht

Omdat we werken volgens Scrum staan de user stories en de learning stories voor deze opdracht op de `Product Backlog`. De `Product Backlog` vind je in deze Gitlab-repository onder `Issues > Boards > Selecteer <Product Backlog> in de dropdown`. **Je bouwt user stories om de learning stories te kunnen voltooien.**

## Definition of Done (DoD)

Binnen scrum dient iedere user story te voldoen aan een zogenaamde Definition of Done (DoD). Door het opstellen en aanhouden van een Definition Of Done, zorg je ervoor dat het werk wat je aflevert ook daadwerkelijk gebruikt kan worden. Als je een user story hebt afgebouwd zet je 'm in _verify_ en controleer je of deze voldoet aan de _Definition of Done_ (zie hieronder). Pas als dat in orde is kun je de user story _closen_.

In dit project wordt er onderscheid gemaakt tussen generieke, frontend-specifieke en backend-specifieke DoD’s. Zorg ervoor dat iedere user story op de backlog wordt voorzien van een ‘afvinkbare’ DoD. Dit is dus altijd een combinatie van generiek met frontend óf generiek met backend óf alledrie. Dit is sterk afhankelijk van de aard van de betreffende user story.

Je kunt met je team afspreken om naast deze DoD’s, nog andere te hanteren. Indien jij en je team hiertoe besluiten, dan moet je deze DoD’s inzichtelijk maken in je documentatie!

### Generieke DoD

- [ ] Alle acceptatiecriteria van de user story zijn afgevinkt.
- [ ] Je hebt volgens de HBO-ICT standaarden gewerkt (Agile scrum, GitLab, sprint boards, sprint planning, burndown chart die zoveel mogelijk de ideale lijn volgt, HBO-ICT conventions etc.)
- [ ] Het leerproces is beschreven in Standaardnederlands.
- [ ] Geschreven code is voorzien van relevant Engelstalig commentaar m.b.v. `TSDoc`.
- [ ] De user wordt in de webshop in het Engels of in het Nederlands bediend waarbij de gekozen taal consequent is doorgevoerd.
- [ ] Het werk is gereviewd door een peer.
- [ ] De code is (functioneel) getest op fouten.
- [ ] Testresultaten zijn vastgelegd.
- [ ] De applicatie werkt zonder fouten bij normaal gebruik.
- [ ] User story is geclosed.

### Frontend-specifieke DoD

- [ ] Het UX/UI gedeelte van de applicatie voldoet aan het Think-Make-Check (TMC) principe.
- [ ] Design Document is aanwezig en bijgewerkt.
- [ ] De applicatie dient zowel op desktop- als mobile devices gebruikt te kunnen worden.

### Backend-specifieke DoD

- [ ] Database is genormaliseerd t/m de 3e normaalvorm.
- [ ] ERD is aanwezig en geactualiseerd.
- [ ] EERD is aanwezig en geactualiseerd.
- [ ] Class-diagram is opgesteld in UML en geactualiseerd.
- [ ] Alle technische documentatie is in het Engels en relevant voor collega-ontwikkelaars. 

## Sprints

Je werkt weer in sprints. Tijdens een sprint selecteer je de user stories van de `Product Backlog` die je denkt te kunnen gaan bouwen tijdens een sprint. In totaal zijn er 3 sprints:

- Sprint 1, duurt 2 weken en loopt van 15 april - 28 april
- Sprint 2, duurt 3 weken en loopt van 6 mei - 26 mei
- Sprint 3, duurt 3 weken en loopt van 27 mei - 16 juni

Om een user story toe te wijzen aan een sprint wijs je deze toe aan een `Milestone`. Dit kun je doen bij de eigenschappen van een user story. Zie hiervoor wederom de pagina `Issues`. **Aan het eind van een sprint moet er altijd een bruikbaar product zijn voor de eindgebruiker.** User stories die niet af zijn gaan door naar de volgende sprint. Test een user story dus goed voordat je deze op _Done_ zet!

## Deliverables

Lopende het project moeten er diverse deelproducten opgeleverd worden die dienen als bewijs voor de verschillende criteria. Hieronder vind je per criterium een overzicht:

- K1: Code, class diagram, ERD, EERD, geimplementeerde database.
- K2: Per iteratie een prototype dat voldoet aan de TMC-cyclus.
- K3: Sequence diagram en logisch netwerkdiagram, webshop draait op HBO-ICT.Cloud, redirects van endpoints.
- K4: User stories met acceptatiecriteria, taken en DoD.
- K5: Design Document, bijgewerkt per sprint.
- G1: Competentie Ontwikkel Plan (COP), STARRT reflecties, SMART leerdoelen, peer feedback.
- G2: Onderzoeksverslag, samenwerkingscontract, retrospectives.
- G3: Onderzoeksverslag waarin je een ethisch vraagstuk behandelt in de context van de webshop, óf een uitvoerige STARRT reflectie op hoe je via de techniek duurzame (ethische) keuzes hebt gemaakt, óf een product dat volgt uit de workshop over ethiek, óf een eigen idee in overleg met je docent.
- G4: Onderzoeksverslag.

## Kwaliteitscriteria

Voor het bouwen van deze opdracht heb je 3 sprints de tijd. Aan het einde van die periode moet je applicatie aan een aantal verwachtingen voldoen. We noemen dit de kwaliteitscriteria. Voor dit blok zien de kwaliteitscriteria er als volgt uit:

| Cat | Nr | Kwaliteitscriteria | HBO-i model |
|-----|----|--------------------|-------------|
| 1 | K1 | Je hebt object georiënteerde software gemaakt die samenwerkt met een database. | S |
| 1 | K2 | Je hebt de wensen en behoeften van gebruikers verwerkt in een goed doordacht prototype. | G |
| 1 | K3 | Je hebt een infrastructuur ontworpen en gebouwd volgens zelf-gedefinieerde vereisten. | I |
| 2 | K4 | Je hebt requirements verzameld voor je applicatie en deze omgezet naar acceptatiecriteria. | S |
| 2 | K5 | Je legt per sprint de belangrijkste beslissingen, resultaten en inzichten van je UX/UI-ontwerp vast. | G |

## Gedragscriteria

Om een IT-project succesvol op te leveren, is het noodzakelijk dat je leert om je als een professional te gedragen. Je hebt hiervoor vaardigheden nodig, die we binnen het hbo professional skills noemen. Voor dit project dient je gedrag aan de volgende criteria te voldoen:

| Cat. | Nr | Gedragscriteria | HBO-i model |
|------|----|-----------------|-------------|
| 3 | G1 | Je blijft leren en werkt doelgericht. | PL |
| 4 | G2 | Je werkt constructief samen en stemt je mondelinge- en schriftelijke communicatie af op het doel (een onderzoeksverslag) en de doelgroep. | DI |
| 4 | G3 | Je herkent ethische aspecten en maatschappelijke gevolgen van de opdracht en maakt hierin bewuste keuzes.| TO |
| 4 | G4 | Je doet methodisch onderzoek en analyseert de uitkomsten. Vanuit deze analyse concludeer je wat de beste oplossing van een probleem is. | OP |

## HBO-i

_Binnen deze opdracht ligt de focus op de volgende architectuurlagen:_

- Software (S) : niveau 1
- Gebruikersinteractie (G) : niveau 1
- Infrastructuur (I): niveau 1

_Binnen deze opdracht ligt de focus op de volgende professional skills:_

- Persoonlijk leiderschap (PL) : niveau 1
- Toekomstgericht organiseren (TO) : niveau 1
- Doelgericht interacteren (DI) : niveau 1
- Onderzoekend probleemoplossen (OP) : niveau 1

## Hoe installeer ik het?
- Open de *root* van je project als map in VS Code.
- Installer de NPM packages (bijvoorbeeld met `npm install`) en voer daarna het `dev`-script uit (bijvoorbeeld met `npm run dev`).
  - Let op! Je hoeft alleen de packages in de *root* van je project te installeren, de packages van `/src/api`, `/src/tests` en `/src/web` worden dan automatisch mee geïnstalleerd.
- Ga in de browser naar http://localhost:3000 en bevestig dat je een pagina met de titel "Welkom op de Luca Stars webshop!" krijgt.

## Wat zit er in deze repository?
Deze repository bevat onder andere de volgende onderdelen:
- `/src/api` is het project voor de backend.
- `/src/web` is het project voor de frontend.
- `/src/tests` is het project om zowel de frontend als backend (automatisch) te testen.

### Resources
Daarnaast is er ook nog een `/res`-map waarin je twee bestanden vind:
- `LucaStarsProducts.csv`
- `LucaStarsProducts.json`

Beide bestanden bevatten dezelfde informatie, maar in een ander formaat. Deze bestanden moet je gebruiken om je database van informatie te voorzien, dit wordt ook wel *database seeding* genoemd. 

> **Tip!** Wil je een leuke uitdaging, voeg dan bijvoorbeeld een Express.js API endpoint aan het backend project toe om de `.csv` in je database te verwerken. Wil je zonder al te veel gedoe gewoon direct aan de gang, gebruik dan de `.json`. Of doe het allebei! Als je je logica slim opzet, kun je meerdere formaten ondersteunen zonder dubbele code.

> **Let op!** Wat betreft de afbeeldingen van de geimporteerde producten: gebruik de gegeven URLs om de afbeeldingen op je webshop te tonen! Alle afbeeldingen bij elkaar zijn namelijk ongeveer 100MB aan data. Ten eerste zal dit je repository onnodig groot en trager maken, ten tweede worden de afbeeldingen dan ook meermaals naar de HBO-ICT.Cloud gekopieërd bij het releasen. Voor je eigen producten ben je natuurlijk wel vrij om je eigen afbeeldingen te uploaden.

### Shared
De `/src/shared` is een speciale map waarvan de `.ts`-bestanden in alle bovenstaande projecten te gebruiken zijn. Je kunt deze importeren met een speciale `@shared` notatie, bijvoorbeeld: `import { UserData } from "@shared/types"`.

### Backend
Het backend project maakt gebruik van [Express.js](https://expressjs.com/) voor het verzorgen van de API endpoints. 

Alle logica van de API endpoints moeten door losse controllers verzorgd worden, standaard is de `UserController` en de `OrderItemController` toegevoegd. De controllers moeten op hun beurt weer gebruik gaan maken van *services* (zoals een `UserService`, deze is niet standaard aangeleverd) om tegen de database aan te praten. Dit is ook nodig om later (automatisch) testen makkelijker te maken.

Er is standaard al een `authenticationMiddleware.ts` die gebruik maakt van [JSON Web Tokens](https://jwt.io/). Hiermee kun je herkennen welke gebruikers er met de API endpoints praten. Een voorbeeld hiervan is geïmplementeerd in de `hello`-functie van de `UserController`. Zie ook `routes.ts` voor het gebruik.

### Frontend
Het frontend project bestaat uit [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) op basis van [Lit](https://lit.dev/).

Standaard is er een `webshop-root`-component (zie `Root.ts`) beschikbaar waarmee het raamwerk van de website opgezet wordt (header/body/footer), met een voorbeeld hoe je verschillende pagina's zou kunnen ondersteunen (`enum RouterPage`).

Alle logica met (onder andere) betrekking tot de API endpoints zitten in *services* weggestopt, waar het `webshop-root`-component (en later andere componenten) gebruik van maakt. 

Momenteel doet het `webshop-root`-component meer dan het zou moeten doen, het is dus zeker verstandig om per pagina een een component te maken (bijvoorbeeld een `webshop-page-login` voor het inlogformulier) en deze dan te *renderen* in het `webshop-root`-component wanneer de inlogpagina getoond moet worden. Je krijgt daarmee dan componenten met relatief weinig logica, wat de onderhoudbaarheid ten goede komt!

> **Tip!** Communicatie tussen verschillende componenten kan op meerdere manieren gedaan worden. Ook hier kan de (werking van) `gameService.ts` van het vorige blok eventueel van dienst zijn.

### Tests
Nieuw bij dit project is het concept van (automatisch) testen, hiervoor maakt het project gebruik van [Vitest](https://vitest.dev/), wat weer geïnspireerd is op syntax van [Jest](https://jestjs.io/).

Er zijn een aantal voorbeelden meegeleverd:
- `routest.test.ts` test een aantal API endpoints van het backend project of deze correct reageren op bepaalde invoer.
- `UserService.test.ts` test de `login`-functie `UserService` van het frontend project. Dit is een vrij geavanceerd voorbeeld die onder andere gebruik maakt van *mocking*. Met *mocking* kun je tijdens een test de werking van een functie overschrijven, in dit geval de standaard `fetch`-functie. Het resultaat is dat de test nu de baas is over hoe de `fetch`-functie reageert zonder daarvoor een draaiend backend project nodig te hebben!

### Scripts
In de `package.json` in de *root* van het project vind je een aantal scripts die helpen bij de ontwikkeling.

Deze scripts blijven draaien en herstarten de projecten als je code wijzigt:
- `dev` start zowel het backend- als frontend-project tegelijk op
- `dev:api` start enkel het backend-project op
- `dev:web` start enkel het frontend-project op

Deze scripts gebruik je voor het uitrollen naar een omgeving buiten je eigen computer:
- `build` compileert zowel het backend- als frontend-project tegelijk
- `build:api` compileert enkel het backend-project
- `build:web` compileert enkel het frontend-project

Deze scripts gebruik je om de gecompileerde varianten te testen:
- `preview` start de gecompileerde varianten van het backend- en frontend-project tegelijk op
- `preview:api` start enkel de gecompileerde variant van het backend-project op
- `preview:web` start enkel de gecompileerde variant van het frontend-project op

Met het `test`-script voer je eenmalig alle tests geautomatiseerd uit en krijg je aan het eind een lijst met resultaten.

Met het `typedoc`-script kun je een documentatie-website van je code genereren. Deze zal dan te vinden zijn in `/docs/tsdoc`. Dit is handig om te controleren of al je code correct gedocumenteerd is met TSDoc!

De `package.json` van het tests-project bevat ook nog een aantal handig scripts:
- `test:watch` doet hetzelfde als `test`, maar blijft draaien en zal iedere keer als je wijzigingen in je code maakt opnieuw uitvoeren.
- `test:watch-with-coverage` doet hetzelfde als `test:watch`, maar geeft ook informatie over de *code coverage* van je tests.
- `test:ui` doet hetzelfde als `test:watch-with-coverage`, maar opent een UI in de browser voor een fijner overzicht dan enkel in de console.

## Releasen naar de HBO-ICT.Cloud
Je kunt dit project op twee manieren releasen naar de HBO-ICT.Cloud:
- Handmatig
- Geautomatiseerd

> **Let op!** Je backend project heeft een `.env`-bestand nodig om correct te werken, ook op de HBO-ICT.Cloud. Zorg er na de eerste keer releasen voor dat je een kopie van een werkende `.env` neerzet en daarin de `PORT` op `8080` zet!

### Handmatig
Volg de volgende stappen:

1. Zorg ervoor dat je met je lokale repository op de juiste branch zit die je wilt uitrollen, bijvoorbeeld `main`.
2. Voer `npm install` uit om er zeker van te zijn dat alles up-to-date is.
3. Voer `npm run test` uit om te controleren of alle tests slagen.
4. Voer `npm run build` uit. Het kan zijn dat je nu "compile errors" krijgt. Deze zul je eerst moeten oplossen voor je nog een keer dit commando probeert. Als bovenstaande stap succesvol is, heb je nu een `dist`-map in de *root* van je repository, met daarin een `web`- en `api`-map.
5. Gebruik een programma om verbinding te maken met de SFTP omgeving van je HBO-ICT.Cloud project.
6. Nadat je verbonden bent, zul je twee mappen zien: `dev` en `live`. Deze mappen staan respectievelijk voor de Development en Live omgeving waar je je applicatie kunt uitrollen, kies er één. 
    - De vuistregel is dat `live` altijd moet werken, `dev` mag ten alle tijden kapot gaan. 
    - Aan het eind van een sprint staat er altijd een werkende versie op `live`.
7. In de map van de gekozen omgeving vind je weer twee mappen: `wwwroot` en `app`.
    - In de `wwwroot`-map zet je alle bestanden die je in de `dist/web`-map hebt staan. Dus niet de `web`-map zelf, maar de inhoud!
    - In de `app`-map zet je alle bestanden die je in de `dist/api`-map hebt staan. Dus niet de `api`-map zelf, maar de inhoud!
8. Ga naar je HBO-ICT.Cloud omgeving en herstart de omgeving die je net hebt geüpload via het Control Panel.
    - Start de applicatie niet op, dan heb vast iets verkeerds gedaan. Kun je geen log bekijken, gebruik dan de Debug-modus en download de log.txt via SFTP uit de `/dev/api`- of `/live/api`-map.
    - Start de applicatie wel op, maar doet deze niet wat je verwacht, dan kun je als het goed is wel de volledige log in de browser bekijken.

### Geautomatiseerd
Je kunt ook bij elke commit geautomatiseerd een release doen. Zet hiervoor `DEPLOY_HIC` in `.gitlab-ci.yml` op `true`. 

Je moet ook de volgende CI/CD variables op je GitLab-project instellen:
- `HIC_API_KEY` (Flags: Mask variable) - De API key van je HBO-ICT.Cloud project.
- `HIC_API_URL` (Flags: Geen) - De URL naar de Docker API (`https://hbo-ict.cloud/api/Docker/[ProjectId]`) waar `[ProjectId]` is vervangen met de ID die je in de URL van je HBO-ICT.Cloud project ziet (`https://hbo-ict.cloud/Project/[ProjectId]`).
- `HIC_SFTP_HOST` (Flags: Geen) - De URL van de SFTP server, deze is altijd `sftp://sftp.hbo-ict.cloud:3322`.
- `HIC_SFTP_USERNAME` (Flags: Geen) - De SFTP Username van je HBO-ICT.Cloud project.
- `HIC_SFTP_PASSWORD` (Flags: Mask variable) - De SFTP Password van je HBO-ICT.Cloud project.

Je zult wel zelf nog de `lftp`-instructie in de `.gitlab-ci.hic.yml` af moeten maken, maak daarbij gebruik van bovenstaande variabelen waar nodig. 

> **Tip!** Er is nog één speciale variabele waar je ook gebruik van kunt maken en dat is `HIC_ENVIRONMENT`. Deze zal afhankelijk van de branch-naam die gepushed is op de waarde `live` of `dev` staan. Handig om te bepalen naar welke map je moet uploaden dus!