/**
 * Sursă unică pentru întrebări + soluții (stil key → value).
 * Prefix: K | C | B | He | G | T | N | Ho | Y | M
 * Editezi aici; catalogul API/frontend și soluțiile se construiesc din aceste chei.
 */

export type SefiraSlug =
  | "kether"
  | "chokmah"
  | "binah"
  | "hessed"
  | "ghebura"
  | "tiferet"
  | "netah"
  | "hod"
  | "yesod"
  | "malkut";

export type TextEntry = {
  question: string;
  solution: string;
};

export const INTRO = {
  title: "Falsele Virtuți ale Arborelui Vieții",
  subtitle: "Omul ca vehicul de manifestare a Divinității în planul fizic",
  body: `Atunci când ne raportăm la Arborele Vieții, avem pentru fiecare dintre sefirot câte o virtute și un viciu. În munca practicantului, scopul este îndumnezeirea: încorporarea virtuților Arborelui, astfel încât ele să se manifeste prin noi în lumea fizică.

Bifează afirmațiile care ți se potrivesc acum, fără presiune și fără judecată. Nu există răspunsuri „greșite” — e doar o oglindă blândă. La final, fiecare sefiră arată unde merită mai multă atenție și grijă.`
};

/** Meta sefirot (fără texte Q/A — acestea vin din TEXTS). */
export const SEFIRA_META: Record<
  SefiraSlug,
  {
    name: string;
    planet: string;
    virtue: string;
    vice: string | null;
    color: string;
    summary: string;
    keys: readonly string[];
  }
> = {
  kether: {
    name: "Kether",
    planet: "Pluto",
    virtue: "Unitate",
    vice: null,
    color: "#F8F1D8",
    summary:
      "Kether este coroana Arborelui: unitatea din care izvorăsc toate celelalte sefirot. Nu are viciu clasic; uneori atenția se împrăștie pe roluri separate și unitatea rămâne pe fundal, așteptând să fie rechemată.",
    keys: ["K-1", "K-2", "K-3", "K-4"]
  },
  chokmah: {
    name: "Chokmah (Hochma)",
    planet: "Neptun",
    virtue: "Scop / Devoțiune",
    vice: null,
    color: "#C9D4E8",
    summary:
      "Scopul spune pentru ce îți folosești existența. Devoțiunea autentică poate continua când e greu și poate, cu blândețe, să se reorienteze când viața cere o altă formă.",
    keys: ["C-1", "C-2", "C-3", "C-4", "C-5", "C-6"]
  },
  binah: {
    name: "Binah",
    planet: "Saturn",
    virtue: "Liniște",
    vice: "Avariție / Retenție",
    color: "#2B1B4A",
    summary:
      "Liniștea este spațiul dintre eveniment și reacție. Retenția autentică protejează și maturizează; uneori, din grijă, putem păstra prea mult și rămânem fără flux.",
    keys: ["B-1", "B-2", "B-3", "B-4", "B-5", "B-6"]
  },
  hessed: {
    name: "Hessed",
    planet: "Jupiter",
    virtue: "Obediență / Aliniere",
    vice: "Ipocrizie / Mândrie",
    color: "#3D6BDB",
    summary:
      "Alinierea autentică pune voința în serviciul unei ordini pe care o recunoști ca legitimă — fără servilism și fără rebeliune automată.",
    keys: ["He-1", "He-2", "He-3", "He-4", "He-5", "He-6", "He-7"]
  },
  ghebura: {
    name: "Ghebura",
    planet: "Marte",
    virtue: "Curaj / Energie",
    vice: "Cruzime / Restricție",
    color: "#C62828",
    summary:
      "Curajul acționează în direcția potrivită chiar și când apare frica. Forța blândă și măsurată e tot forță; uneori intensitatea poate depăși nevoia momentului.",
    keys: ["G-1", "G-2", "G-3", "G-4", "G-5", "G-6", "G-7"]
  },
  tiferet: {
    name: "Tiferet",
    planet: "Soare",
    virtue: "Devotament",
    vice: "Egoism",
    color: "#E8C547",
    summary:
      "Devotamentul orientează voința către ceva mai larg decât interesul imediat, păstrând totodată ochiul deschis și inima sinceră.",
    keys: ["T-1", "T-2", "T-3", "T-4", "T-5", "T-6"]
  },
  netah: {
    name: "Netah (Netzach)",
    planet: "Venus",
    virtue: "Dărnicie",
    vice: "Impuritate",
    color: "#2E8B57",
    summary:
      "Dărnicia lasă resursele să circule fără așteptări ascunse. Include și măsura: libertatea de a oferi și libertatea de a păstra.",
    keys: ["N-1", "N-2", "N-3", "N-4", "N-5", "N-6", "N-7"]
  },
  hod: {
    name: "Hod",
    planet: "Mercur",
    virtue: "Sinceritate / Adevăr",
    vice: "Necinste / Falsitate",
    color: "#E07A2F",
    summary:
      "Sinceritatea leagă ceea ce percepem, ceea ce gândim și ceea ce exprimăm. A spune ce crezi e un început frumos; a verifica dacă e adevărat e următorul pas blând.",
    keys: ["Ho-1", "Ho-2", "Ho-3", "Ho-4", "Ho-5", "Ho-6", "Ho-7"]
  },
  yesod: {
    name: "Yesod",
    planet: "Luna",
    virtue: "Independență",
    vice: "Lene",
    color: "#7B5EA7",
    summary:
      "Independența păstrează direcția interioară fără a confunda autonomia cu refuzul oricărei influențe sau cu izolarea.",
    keys: ["Y-1", "Y-2", "Y-3", "Y-4", "Y-5", "Y-6", "Y-7"]
  },
  malkut: {
    name: "Malkut",
    planet: "Sfera elementelor",
    virtue: "Discernământ",
    vice: "Avariție / Inerție",
    color: "#8B6914",
    summary:
      "Discernământul percepe diferențele și priorizează cu blândețe. Uneori justificăm atașamente sau confort ca pe alegeri „clare”, fără să le mai verificăm.",
    keys: ["M-1", "M-2", "M-3", "M-4", "M-5", "M-6"]
  }
};

export const SEFIRA_ORDER: SefiraSlug[] = [
  "kether",
  "chokmah",
  "binah",
  "hessed",
  "ghebura",
  "tiferet",
  "netah",
  "hod",
  "yesod",
  "malkut"
];

/**
 * Întrebări și soluții pe chei stabile (ex. K-1).
 * Ton: observațional, calm, fără atac la persoană.
 */
export const TEXTS: Record<string, TextEntry> = {
  // —— Kether ——
  "K-1": {
    question: "Mi se întâmplă să mă simt mai degrabă o sumă de roluri decât o prezență unitară.",
    solution:
      "Poți observa fiecare rol cu blândețe, fără să te reduci la unul singur. Întrebare blândă: „Ce rămâne constant în mine, în toate aceste roluri?” Unitatea crește prin recunoaștere, nu prin forțarea părților să dispară."
  },
  "K-2": {
    question: "Unitatea mă atrage ca idee, dar încă nu orientează ușor alegerile din ziua mea.",
    solution:
      "Alege azi o acțiune mică și concretă care exprimă aceeași direcție în mai multe zone ale vieții tale. Virtutea apare când ideea ghidează o prioritate reală, nu când rămâne doar o formulă frumoasă."
  },
  "K-3": {
    question:
      "Când apar conflicte interioare, tind să mă identific cu o singură parte și să le țin pe celelalte la distanță.",
    solution:
      "Numește ambele părți și caută ce încearcă fiecare să protejeze, înainte să alegi o tabără. Conflictul interior e un semn că unitatea încă se așază — nu o dovadă că trebuie să respingi o parte din tine."
  },
  "K-4": {
    question: "Uneori am nevoie să mă simt deosebit sau separat ca să mă simt întreg.",
    solution:
      "E uman să cauți un loc unic. Poți verifica, cu grijă, dacă nevoia de a fi special acoperă teama de a fi „obișnuit”. Unitatea nu cere separare: poți recunoaște aceeași sursă în tine și în celălalt, păstrându-ți particularitatea."
  },

  // —— Chokmah ——
  "C-1": {
    question:
      "Calea spirituală mă ajută uneori să amân și lucrurile concrete pe care totuși le simt importante.",
    solution:
      "Întrebare blândă: dacă nimeni nu ar afla niciodată că fac acest lucru, l-aș mai face? Dacă scopul slujește și o formă de evadare, adu-l înapoi în viața concretă — ce ai amâna și ce ar însemna să îl întâmpini fără să lași deoparte direcția?"
  },
  "C-2": {
    question: "Îmi place să fiu văzut ca cineva cu o cale specială sau „aleasă”.",
    solution:
      "Dacă nu ai primi recunoaștere sau admirație, scopul ar rămâne important? Devoțiunea autentică nu depinde de imaginea de persoană aleasă — și totuși merită să o onorezi pe cea care îți e cu adevărat a ta."
  },
  "C-3": {
    question: "Dacă nimeni nu ar ști ce fac, scopul meu ar părea mai puțin important.",
    solution:
      "Exersează o practică sau un gest pe care nimeni nu îl vede. Dacă se golește fără martori, poate există un atașament față de imagine mai mare decât față de scop — și poți redistribui blând energia către ceea ce contează în tăcere."
  },
  "C-4": {
    question:
      "Mă țin de o direcție și din grija de a nu admite că am investit mult într-o cale care nu mai se potrivește.",
    solution:
      "Când spui „nu pot renunța”, distinge blând voința de grija de a admite o investiție greșită. Devoțiunea autentică poate continua la greu și poate, cu demnitate, să se oprească când realitatea cere altă formă."
  },
  "C-5": {
    question: "Imaginea mea de om dedicat e uneori mai prezentă decât scopul în sine.",
    solution:
      "Întrebare blândă: sunt dedicat scopului sau imaginii mele despre mine ca persoană dedicată? Redefinește obiectul: o valoare pe care o trăiești, nu un rol pe care trebuie să îl joci."
  },
  "C-6": {
    question: "Mi-e greu să schimb metoda fără să simt că întreaga direcție se năruie.",
    solution:
      "Poți admite că metoda nu mai e potrivită fără să anulezi întreaga direcție. Caută dovezi care arată că merită schimbată calea, nu identitatea ta."
  },

  // —— Binah ——
  "B-1": {
    question: "Păstrez tăcerea sau informațiile mai ales din teamă, nu pentru că au nevoie de timp.",
    solution:
      "Întrebare blândă: „Ce aleg să păstrez în liniște și de ce? Are nevoie de timp să se așeze sau mă tem să îl privesc cu adevărat?” Liniștea autentică e grijă, nu evitare."
  },
  "B-2": {
    question: "Tăcerea mă ajută uneori să ocolesc discuții pe care, în fond, le simt necesare.",
    solution:
      "Distinge tăcerea care clarifică de tăcerea care amână. Când alegi să nu vorbești, creezi spațiu pentru înțelegere — sau lași pe mai târziu o conversație care merită atenție?"
  },
  "B-3": {
    question:
      "Cunoașterea pe care o țin aproape îmi dă uneori un sentiment de siguranță sau de loc unic.",
    solution:
      "Retenția e frumoasă când protejează; se îngustează când informația e doar monedă de siguranță. Dacă o păstrezi ca să te simți indispensabil, poți stabili un criteriu clar de transmitere și un drum blând prin care celălalt poate ajunge la ea."
  },
  "B-4": {
    question: "Îmi e greu să las o întrebare deschisă; simt nevoia unui răspuns imediat.",
    solution:
      "Exersează să rămâi cu o întrebare fără să forțezi imediat un răspuns. Liniștea este spațiul dintre eveniment și reacție — și merită antrenată cu blândețe."
  },
  "B-5": {
    question: "Ce păstrez în interior se închide uneori în izolare, în loc să se așeze în înțelepciune.",
    solution:
      "Verifică cu grijă: ceea ce păstrez se maturizează în înțelepciune sau se transformă în frică și rigiditate? Dacă te închizi față de tot ce te provoacă, energia nu se păstrează — rămâne pe loc."
  },
  "B-6": {
    question: "Trec repede de la observație la concluzii pe care le simt definitive.",
    solution:
      "Observă o informație fără să o transformi imediat într-o concluzie. Permite-ți să revizuiești ceea ce crezi că știi — e un gest de respect față de realitate."
  },

  // —— Hessed ——
  "He-1": {
    question:
      "O idee mi se pare adevărată mai ales pentru că vine de la cineva pe care îl respect ca autoritate.",
    solution:
      "Poți porni nu de la „trebuie să ascult?”, ci de la „de ce consider că această persoană sau regulă are dreptul să îmi solicite acest lucru?” Separă blând autoritatea de adevăr."
  },
  "He-2": {
    question: "Uneori renunț la opinii sau limite ca să păstrez armonia cu un grup sau cu un ghid.",
    solution:
      "Observă frica de dezaprobare cu blândețe: dacă persoana s-ar supăra că nu ești de acord, ai considera în continuare că are dreptate? Dacă răspunsul se schimbă doar din cauza reacției, frica a luat locul judecății."
  },
  "He-3": {
    question: "Îndoiala o simt uneori ca pe un semn că „nu sunt destul de bun discipol”.",
    solution:
      "Alinierea sănătoasă coexistă cu discernământul și sinceritatea. Poți urma un sfat păstrând capacitatea de a observa rezultatele și de a reconsidera. Îndoiala nu e defect — e instrument."
  },
  "He-4": {
    question: "Resping ușor reguli sau profesori, doar pentru că reprezintă o formă de autoritate.",
    solution:
      "Poți învăța să refuzi fără să transformi refuzul în rebeliune. Întreabă dacă refuzi pentru că cererea e greșită sau pentru că îți e greu să primești direcție. Mândria poate apărea și prin refuzul oricărei autorități."
  },
  "He-5": {
    question: "Cer altora disciplină și modestie, iar pentru mine las mai ușor excepții.",
    solution:
      "Verifică dacă standardele sunt reciproce. O autoritate care cere reguli pentru ceilalți și excepții pentru sine merită privită cu precauție — inclusiv când această autoritate ești tu."
  },
  "He-6": {
    question: "Ascult uneori mai mult din teama de a dezamăgi decât din judecată proprie.",
    solution:
      "Exersează ascultarea fără abandonarea judecății. Persoana care urmează un principiu pentru că îl consideră adevărat e diferită de cea care îl urmează doar de teamă — și ambele merită onestitate."
  },
  "He-7": {
    question: "Urmez mai degrabă persoana care a formulat principiul decât principiul în sine.",
    solution:
      "Înțelege principiul înainte să îl urmezi: „Ce încearcă această regulă să protejeze sau să realizeze?” Când înțelegi principiul, alinierea devine conștientă și liberă."
  },

  // —— Ghebura ——
  "G-1": {
    question: "Duritatea sau confruntarea mi se par uneori sinonime cu curajul.",
    solution:
      "Separă blând curajul de agresivitate. Întrebare: „Acționez pentru că este necesar sau pentru că vreau să demonstrez că sunt puternic?” Controlul forței face parte din forță."
  },
  "G-2": {
    question: "Reacționez mai intens decât situația cere, ca să reduc o nesiguranță interioară.",
    solution:
      "Întrebare blândă: „Câtă forță necesită, de fapt, această situație?” Dacă o problemă mică produce o reacție mare, energia vine mai mult din acumulări personale decât din prezent — și merită îngrijită acolo."
  },
  "G-3": {
    question: "O diferență de opinie o simt ușor ca pe un atac la care trebuie să răspund.",
    solution:
      "Curajul nu presupune absența fricii. Poți spune: „Îmi este frică, dar voi decide în funcție de ceea ce consider corect.” Diferența de opinie nu e automat un atac."
  },
  "G-4": {
    question: "Uneori justific o reacție aspră prin „adevăr”, „ordine” sau „disciplină”.",
    solution:
      "Un scop legitim nu justifică automat o metodă disproporționată. Forța poate restabili ordinea; merită să verifici dacă nu caută doar o justificare pentru a fi folosită."
  },
  "G-5": {
    question: "Acționez și din nevoia de a arăta că sunt puternic.",
    solution:
      "Persoana curajoasă nu trebuie să demonstreze permanent că e puternică. Poate tolera o provocare fără să răspundă imediat și poate alege retragerea când e mai constructivă."
  },
  "G-6": {
    question: "Aștept să se adune frustrarea în loc să pun limite calm, din timp.",
    solution:
      "Pune limite înainte să apară resentimentul. O limită exprimată calm necesită adesea mai multă forță decât o izbucnire — și e mai blândă cu toată lumea."
  },
  "G-7": {
    question: "Mi-e greu să spun „am greșit”, de teamă că imaginea de forță s-ar clătina.",
    solution:
      "A spune „am greșit” nu micșorează forța. Dimpotrivă, arată că imaginea proprie nu e atât de fragilă încât trebuie apărată cu orice preț."
  },

  // —— Tiferet ——
  "T-1": {
    question:
      "Am nevoie să rămân „cel care nu abandonează”, chiar când direcția nu mai rezonează cu valorile mele.",
    solution:
      "Definește clar obiectul: către ce ești, de fapt, dedicat — o valoare, o persoană, o imagine despre tine sau o recompensă? Atașamentul față de identitatea de om dedicat nu e același lucru cu dedicarea."
  },
  "T-2": {
    question: "Continui o relație, o practică sau o cauză și pentru că am investit deja foarte mult.",
    solution:
      "Întrebare blândă: „Dacă aș descoperi astăzi această situație pentru prima dată, fără istoricul investițiilor, aș alege-o din nou?” Sacrificiul trecut nu trebuie să justifice sacrificiul viitor."
  },
  "T-3": {
    question: "Suferința sau sacrificiul mi se par uneori dovezi că sunt cu adevărat dedicat.",
    solution:
      "Separă dedicarea de sacrificiu. Faptul că suferi nu demonstrează automat că ești dedicat. Întreabă dacă sacrificiul servește direcția aleasă sau doar îți dovedește ție că ești dedicat."
  },
  "T-4": {
    question: "Mă atașez intens de o persoană, un grup sau o idee și îmi e greu să țin contradicțiile.",
    solution:
      "Loialitatea merită deosebită de supunere. Poți fi loial unei persoane fără să îi accepți fiecare decizie, unei tradiții fără fiecare interpretare, unei cauze fără orice metodă folosită în numele ei."
  },
  "T-5": {
    question: "Loialitatea mea e orientată uneori mai mult spre imaginea mea de om loial.",
    solution:
      "Verifică dacă obiectul mai merită acest lucru. Dacă lași deoparte identitatea de persoană loială, ce rămâne din direcție? Dacă nu rămâne nimic, obiectul era imaginea — și poți alege din nou, cu blândețe."
  },
  "T-6": {
    question: "Ca să rămân „devotat”, simt că trebuie să las deoparte lucruri pe care totuși le văd clar.",
    solution:
      "Păstrează capacitatea de a spune „m-am înșelat”. Devotamentul autentic nu trebuie să anuleze sinceritatea lui Hod și discernământul lui Malkut."
  },

  // —— Netah ——
  "N-1": {
    question: "Ofer și cu speranța de a primi iubire, loialitate, recunoștință sau un loc mai bun.",
    solution:
      "Înainte de a oferi, întreabă blând: „Dacă această persoană nu îmi va mulțumi niciodată și nu îmi va întoarce gestul, mai vreau să ofer?” Dacă nu, e o tranzacție încă nedeclarată — și merită clarificată cu grijă."
  },
  "N-2": {
    question: "Uneori apare un resentiment de tipul „după tot ce am făcut…”.",
    solution:
      "Resentimentul semnalează o așteptare neexprimată. Întrebare blândă: „Ce consider că îmi datorează această persoană și când am stabilit, de fapt, această datorie?”"
  },
  "N-3": {
    question: "Mi-e greu să spun „nu”; dăruiesc și din frică sau din nevoia de a fi acceptat.",
    solution:
      "Poți învăța să spui „nu” fără vinovăție. Darul e liber când ai fi putut să nu îl oferi și totuși ai ales să îl oferi. Capacitatea de a refuza face dărnicia autentică."
  },
  "N-4": {
    question: "Identitatea mea se leagă ușor de a fi „cel care se sacrifică”.",
    solution:
      "Dărnicia care există ca identitate continuă chiar când darul nu mai e constructiv. Separă valoarea ta de cât de mult poți renunța la propriile nevoi — merită să fii și tu pe listă."
  },
  "N-5": {
    question: "Ofer într-un ritm care mă epuizează și nu mai e bun nici pentru mine, nici pentru ceilalți.",
    solution:
      "Întrebare blândă: „Dacă continui să ofer în acest ritm timp de un an, ce se va întâmpla cu mine?” Dărnicia care distruge resursele celui care oferă nu e sustenabilă."
  },
  "N-6": {
    question: "Darul îmi dă uneori senzația că am un cuvânt de spus asupra celui care îl primește.",
    solution:
      "Respectă libertatea celui care primește. Un dar nu îți acordă autoritate asupra lui. Acceptă că poate folosi lucrul diferit de cum ai fi făcut tu."
  },
  "N-7": {
    question: "Ofer ca să mă simt generos, nu neapărat pentru că darul e cu adevărat potrivit.",
    solution:
      "Întrebare blândă: „Ofer acest lucru pentru că îi este util celuilalt sau pentru că eu vreau să mă simt o persoană generoasă?” Intenția bună nu garantează că darul e potrivit — și poți verifica cu grijă."
  },

  // —— Hod ——
  "Ho-1": {
    question: "Spun ce cred, dar nu verific întotdeauna dacă se potrivește cu realitatea.",
    solution:
      "Sinceritatea nu se reduce la „eu asta cred”. Folosește niveluri de certitudine: „știu”, „am observat”, „cred”, „presupun”, „interpretez”, „nu știu”. Verifică blând dacă ceea ce crezi corespunde realității."
  },
  "Ho-2": {
    question: "Selectez sau omit detalii ca ceilalți să ajungă la concluzia pe care o simt potrivită.",
    solution:
      "Merită să verifici dacă alegi informațiile pentru că sunt cele mai relevante sau pentru că dorești o anumită concluzie. Adevăruri parțiale pot lăsa o impresie diferită de întreg."
  },
  "Ho-3": {
    question: "Când sunt furios, apar ușor cuvinte ca „mereu”, „niciodată”, „toți”, „nimeni”.",
    solution:
      "Observă cu blândețe exagerările produse de emoții. Păstrează diferența dintre intensitatea unei emoții și exactitatea unei afirmații. Verifică termenii absoluți înainte să îi spui."
  },
  "Ho-4": {
    question: "Tratez interpretările mele ca pe fapte sigure.",
    solution:
      "Separă faptele de interpretări: „Ce s-a întâmplat efectiv și ce parte reprezintă interpretarea mea?” Mintea transformă ușor interpretările în certitudini — și poți încetini acest salt."
  },
  "Ho-5": {
    question: "Caut mai ales dovezi care îmi confirmă ceea ce deja cred.",
    solution:
      "Exersează căutarea activă a informațiilor care ar putea arăta că te-ai înșelat. Dacă o convingere nu supraviețuiește verificării, e mai degrabă un atașament — și merită îngrijit ca atașament."
  },
  "Ho-6": {
    question: "Confund sinceritatea cu dreptul de a spune orice gând, în orice moment.",
    solution:
      "Înainte să spui ceva: „Este adevărat? Este relevant? Este necesar acum? Îl exprim corect?” Sinceritatea nu elimină responsabilitatea asupra modului de comunicare."
  },
  "Ho-7": {
    question: "Folosesc adevăruri parțiale care pot lăsa o impresie diferită de întreg.",
    solution:
      "A spune numai lucruri adevărate nu e suficient dacă intenția e să produci o impresie falsă. Alege informațiile după relevanță, nu după efectul dorit asupra celuilalt."
  },

  // —— Yesod ——
  "Y-1": {
    question: "Pentru a mă simți independent, cred că trebuie să nu ascult pe nimeni și să nu cer ajutor.",
    solution:
      "Separă influența de control. A cere ajutor nu anulează independența. Uneori alegerea cea mai autonomă e să recunoști că nu ai o competență și să apelezi la cineva care o are."
  },
  "Y-2": {
    question: "Identitatea mea se leagă uneori de refuzul de a fi influențat.",
    solution:
      "Înainte de a accepta sau respinge: „Dacă această idee nu ar fi venit de la această persoană, ci aș fi descoperit-o singur, aș considera-o la fel de bună?” Scoate la suprafață atât supunerea, cât și opoziția automată."
  },
  "Y-3": {
    question: "Simt nevoia să arăt permanent că mă descurc singur.",
    solution:
      "Întrebare blândă: „Dacă nimeni nu ar afla că am făcut acest lucru singur, aș mai simți aceeași nevoie?” Dacă nu, motivația e validarea imaginii, nu independența — și poți alege din nou."
  },
  "Y-4": {
    question: "Relațiile, cooperarea sau nevoia de afecțiune îmi par uneori semne de slăbiciune.",
    solution:
      "Poți învăța să fii singur fără să transformi singurătatea într-o virtute. E sănătos să funcționezi fără prezență constantă, dar relațiile nu sunt slăbiciuni."
  },
  "Y-5": {
    question: "Mi-e greu să îmi schimb opinia, pentru că a avea dreptate ține de cine sunt.",
    solution:
      "Permite-ți să spui „m-am înșelat”. Capacitatea de a-ți schimba opinia e una dintre cele mai clare forme de autonomie intelectuală — și de blândețe față de tine."
  },
  "Y-6": {
    question: "Las ușor mediul să decidă în locul meu, în loc să mă bazez pe propria evaluare.",
    solution:
      "Independența psihologică e capacitatea de a te baza pe propria evaluare, nu doar pe cea din exterior. Poți primi un sfat fără să devii dependent de cine ți-l oferă."
  },
  "Y-7": {
    question: "Transform singurătatea într-o virtute, deși uneori e mai degrabă o formă de izolare.",
    solution:
      "Dacă începi să consideri cooperarea sau nevoia de afecțiune drept slăbiciuni, independența se transformă în izolare. Păstrează direcția interioară fără să refuzi legătura."
  },

  // —— Malkut ——
  "M-1": {
    question:
      "Sunt foarte sigur că știu ce e important și ce merită lăsat deoparte, cu puțin loc pentru îndoială.",
    solution:
      "Lasă loc posibilității de a te înșela. Exercițiu blând: „Ce ar trebui să fie adevărat pentru ca alegerea mea actuală să fie greșită?” Caută informația care contrazice propria perspectivă."
  },
  "M-2": {
    question: "Uneori numesc „spiritual” ceva ce vine mai degrabă din atașament, frică sau confort.",
    solution:
      "Distinge între motivul declarat și motivul real. Poți spune „fac asta pentru evoluție”, dar motivul real poate fi frica, orgoliul sau comoditatea. Discernământul vede și aceste diferențe — fără judecată aspră."
  },
  "M-3": {
    question: "Nu verific mai târziu dacă timpul sau energia „câștigate” sunt folosite cum am sperat.",
    solution:
      "Observă consecințele alegerilor. Discernământul nu e doar judecată mentală. Dacă spui că sacrifici ceva pentru practică, verifică după luni dacă timpul e chiar folosit astfel."
  },
  "M-4": {
    question: "Îmi e greu să disting motivul pe care îl declar de cel care mă mișcă cu adevărat.",
    solution:
      "Când ai de făcut o alegere, întreabă blând: „Este acest lucru cu adevărat necesar pentru direcția mea sau doar îmi satisface o dorință, o frică sau o nevoie de confort?”"
  },
  "M-5": {
    question: "Evit uneori responsabilitatea sau competiția și numesc asta priorizare conștientă.",
    solution:
      "Separă ce e important de ce doar pare important. Uneori nu e vorba de alegerea greșită, ci de convingerea că știi cu certitudine de ce o faci — și poți lăsa loc pentru nuanțe."
  },
  "M-6": {
    question: "Știu ce e mai important, dar încă îmi e greu să renunț la alternativa mai mică.",
    solution:
      "Virtutea apare prin prioritizare concretă. Nu e suficient să știi că ceva e pe primul loc; merită să poți renunța efectiv la alternativa mai puțin importantă. Exersează întâi în lucrurile mici, cu blândețe."
  }
};

export type SefiraCatalog = {
  slug: SefiraSlug;
  name: string;
  planet: string;
  virtue: string;
  vice: string | null;
  color: string;
  summary: string;
  questions: string[];
};

export function buildSefirot(): SefiraCatalog[] {
  return SEFIRA_ORDER.map((slug) => {
    const meta = SEFIRA_META[slug];
    return {
      slug,
      name: meta.name,
      planet: meta.planet,
      virtue: meta.virtue,
      vice: meta.vice,
      color: meta.color,
      summary: meta.summary,
      questions: meta.keys.map((key) => {
        const entry = TEXTS[key];
        if (!entry) throw new Error(`Lipsește textul pentru cheia ${key}`);
        return entry.question;
      })
    };
  });
}

export function solutionFor(prompt: string): string {
  for (const entry of Object.values(TEXTS)) {
    if (entry.question === prompt) return entry.solution;
  }
  return "Revino la virtutea sefirei: observă cu blândețe diferența dintre intenția declarată și forța care te mișcă în realitate, apoi alege o acțiune mică, verificabilă.";
}

export function solutionByKey(key: string): string | undefined {
  return TEXTS[key]?.solution;
}
