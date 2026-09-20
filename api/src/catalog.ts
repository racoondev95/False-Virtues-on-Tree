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

export const INTRO = {
  title: "Falsele Virtuți ale Arborelui Vieții",
  subtitle: "Omul ca vehicul de manifestare a Divinității în planul fizic",
  body: `Atunci când ne raportăm la Arborele Vieții, avem pentru fiecare dintre sefirot câte o virtute și un viciu. În munca practicantului, scopul este îndumnezeirea: încorporarea virtuților Arborelui, astfel încât ele să se manifeste prin noi în lumea fizică.

Bifează afirmațiile care ți se potrivesc acum, fără presiune și fără judecată. Nu există răspunsuri „greșite” — e doar o oglindă blândă. La final, fiecare sefiră arată unde merită mai multă atenție și grijă.`
};

export const SEFIROT: SefiraCatalog[] = [
  {
    slug: "kether",
    name: "Kether",
    planet: "Pluto",
    virtue: "Unitate",
    vice: null,
    color: "#F8F1D8",
    summary:
      "Kether este coroana Arborelui: unitatea din care izvorăsc toate celelalte sefirot. Nu are viciu clasic; uneori atenția se împrăștie pe roluri separate și unitatea rămâne pe fundal, așteptând să fie rechemată.",
    questions: [
      "Mi se întâmplă să mă simt mai degrabă o sumă de roluri decât o prezență unitară.",
      "Unitatea mă atrage ca idee, dar încă nu orientează ușor alegerile din ziua mea.",
      "Când apar conflicte interioare, tind să mă identific cu o singură parte și să le țin pe celelalte la distanță.",
      "Uneori am nevoie să mă simt deosebit sau separat ca să mă simt întreg."
    ]
  },
  {
    slug: "chokmah",
    name: "Chokmah (Hochma)",
    planet: "Neptun",
    virtue: "Scop / Devoțiune",
    vice: null,
    color: "#C9D4E8",
    summary:
      "Scopul spune pentru ce îți folosești existența. Devoțiunea autentică poate continua când e greu și poate, cu blândețe, să se reorienteze când viața cere o altă formă.",
    questions: [
      "Calea spirituală mă ajută uneori să amân și lucrurile concrete pe care totuși le simt importante.",
      "Îmi place să fiu văzut ca cineva cu o cale specială sau „aleasă”.",
      "Dacă nimeni nu ar ști ce fac, scopul meu ar părea mai puțin important.",
      "Mă țin de o direcție și din grija de a nu admite că am investit mult într-o cale care nu mai potrivește.",
      "Imaginea mea de om dedicat e uneori mai prezentă decât scopul în sine.",
      "Mi-e greu să schimb metoda fără să simt că întreaga direcție se năruie."
    ]
  },
  {
    slug: "binah",
    name: "Binah",
    planet: "Saturn",
    virtue: "Liniște",
    vice: "Avariție / Retenție",
    color: "#2B1B4A",
    summary:
      "Liniștea este spațiul dintre eveniment și reacție. Retenția autentică protejează și maturizează; uneori, din grijă, putem păstra prea mult și rămânem fără flux.",
    questions: [
      "Păstrez tăcerea sau informațiile mai ales din teamă, nu pentru că au nevoie de timp.",
      "Tăcerea mă ajută uneori să ocolesc discuții pe care, în fond, le simt necesare.",
      "Cunoașterea pe care o țin aproape îmi dă uneori un sentiment de siguranță sau de loc unic.",
      "Îmi e greu să las o întrebare deschisă; simt nevoia unui răspuns imediat.",
      "Ce păstrez în interior se închide uneori în izolare, în loc să se așeze în înțelepciune.",
      "Trec repede de la observație la concluzii pe care le simt definitive."
    ]
  },
  {
    slug: "hessed",
    name: "Hessed",
    planet: "Jupiter",
    virtue: "Obediență / Aliniere",
    vice: "Ipocrizia / Mândria",
    color: "#3D6BDB",
    summary:
      "Alinierea autentică pune voința în serviciul unei ordini pe care o recunoști ca legitimă — fără servilism și fără rebeliune automată.",
    questions: [
      "O idee mi se pare adevărată mai ales pentru că vine de la cineva pe care îl respect ca autoritate.",
      "Uneori renunț la opinii sau limite ca să păstrez armonia cu un grup sau cu un ghid.",
      "Îndoiala o simt uneori ca pe un semn că „nu sunt destul de bun discipol”.",
      "Resping ușor reguli sau profesori, doar pentru că reprezintă o formă de autoritate.",
      "Cer altora disciplină și modestie, iar pentru mine las mai ușor excepții.",
      "Ascult uneori mai mult din teama de a dezamăgi decât din judecată proprie.",
      "Urmez mai degrabă persoana care a formulat principiul decât principiul în sine."
    ]
  },
  {
    slug: "ghebura",
    name: "Ghebura",
    planet: "Marte",
    virtue: "Curaj / Energie",
    vice: "Cruzime / Restricție",
    color: "#C62828",
    summary:
      "Curajul acționează în direcția potrivită chiar și când apare frica. Forța blândă și măsurată e tot forță; uneori intensitatea poate depăși nevoia momentului.",
    questions: [
      "Duritatea sau confruntarea mi se par uneori sinonime cu curajul.",
      "Reacționez mai intens decât situația cere, ca să reduc o nesiguranță interioară.",
      "O diferență de opinie o simt ușor ca pe un atac la care trebuie să răspund.",
      "Uneori justific o reacție aspră prin „adevăr”, „ordine” sau „disciplină”.",
      "Acționez și din nevoia de a arăta că sunt puternic.",
      "Aștept să se adune frustrarea în loc să pun limite calm, din timp.",
      "Mi-e greu să spun „am greșit”, de teamă că imaginea de forță s-ar clătina."
    ]
  },
  {
    slug: "tiferet",
    name: "Tiferet",
    planet: "Soare",
    virtue: "Devotamentul",
    vice: "Egoism",
    color: "#E8C547",
    summary:
      "Devotamentul orientează voința către ceva mai larg decât interesul imediat, păstrând totodată ochiul deschis și inima sinceră.",
    questions: [
      "Am nevoie să rămân „cel care nu abandonează”, chiar când direcția nu mai rezonează cu valorile mele.",
      "Continui o relație, o practică sau o cauză și pentru că am investit deja foarte mult.",
      "Suferința sau sacrificiul mi se par uneori dovezi că sunt cu adevărat dedicat.",
      "Mă atașez intens de o persoană, un grup sau o idee și îmi e greu să țin contradicțiile.",
      "Loialitatea mea e orientată uneori mai mult spre imaginea mea de om loial.",
      "Ca să rămân „devotat”, simt că trebuie să las deoparte lucruri pe care totuși le văd clar."
    ]
  },
  {
    slug: "netah",
    name: "Netah (Netzach)",
    planet: "Venus",
    virtue: "Dărnicia",
    vice: "Impuritate",
    color: "#2E8B57",
    summary:
      "Dărnicia lasă resursele să circule fără așteptări ascunse. Include și măsura: libertatea de a oferi și libertatea de a păstra.",
    questions: [
      "Ofer și cu speranța de a primi iubire, loialitate, recunoștință sau un loc mai bun.",
      "Uneori apare un resentiment de tipul „după tot ce am făcut…”.",
      "Mi-e greu să spun „nu”; dăruiesc și din frică sau din nevoia de a fi acceptat.",
      "Identitatea mea se leagă ușor de a fi „cel care se sacrifică”.",
      "Ofer într-un ritm care mă epuizează și nu mai e bun nici pentru mine, nici pentru ceilalți.",
      "Darul îmi dă uneori senzația că am un cuvânt de spus asupra celui care îl primește.",
      "Ofer ca să mă simt generos, nu neapărat pentru că darul e cu adevărat potrivit."
    ]
  },
  {
    slug: "hod",
    name: "Hod",
    planet: "Mercur",
    virtue: "Sinceritate / Adevăr",
    vice: "Necinste / Falsitate",
    color: "#E07A2F",
    summary:
      "Sinceritatea leagă ceea ce percepem, ceea ce gândim și ceea ce exprimăm. A spune ce crezi e un început frumos; a verifica dacă e adevărat e următorul pas blând.",
    questions: [
      "Spun ce cred, dar nu verific întotdeauna dacă se potrivește cu realitatea.",
      "Selectez sau omit detalii ca ceilalți să ajungă la concluzia pe care o simt potrivită.",
      "Când sunt furios, apar ușor cuvinte ca „mereu”, „niciodată”, „toți”, „nimeni”.",
      "Tratez interpretările mele ca pe fapte sigure.",
      "Caut mai ales dovezi care îmi confirmă ceea ce deja cred.",
      "Confund sinceritatea cu dreptul de a spune orice gând, în orice moment.",
      "Folosesc adevăruri parțiale care pot lăsa o impresie diferită de întreg."
    ]
  },
  {
    slug: "yesod",
    name: "Yesod",
    planet: "Luna",
    virtue: "Independența",
    vice: "Lenea",
    color: "#7B5EA7",
    summary:
      "Independența păstrează direcția interioară fără a confunda autonomia cu refuzul oricărei influențe sau cu izolarea.",
    questions: [
      "Pentru a mă simți independent, cred că trebuie să nu ascult pe nimeni și să nu cer ajutor.",
      "Identitatea mea se leagă uneori de refuzul de a fi influențat.",
      "Simt nevoia să arăt permanent că mă descurc singur.",
      "Relațiile, cooperarea sau nevoia de afecțiune îmi par uneori semne de slăbiciune.",
      "Mi-e greu să îmi schimb opinia, pentru că a avea dreptate ține de cine sunt.",
      "Las ușor mediul să decidă în locul meu, în loc să mă bazez pe propria evaluare.",
      "Transform singurătatea într-o virtute, deși uneori e mai degrabă o formă de izolare."
    ]
  },
  {
    slug: "malkut",
    name: "Malkut",
    planet: "Sfera elementelor",
    virtue: "Discernământ",
    vice: "Avariție / Inerție",
    color: "#8B6914",
    summary:
      "Discernământul percepe diferențele și priorizează cu blândețe. Uneori justificăm atașamente sau confort ca pe alegeri „clare”, fără să le mai verificăm.",
    questions: [
      "Sunt foarte sigur că știu ce e important și ce merită lăsat deoparte, cu puțin loc pentru îndoială.",
      "Uneori numesc „spiritual” ceva ce vine mai degrabă din atașament, frică sau confort.",
      "Nu verific mai târziu dacă timpul sau energia „câștigate” sunt folosite cum am sperat.",
      "Îmi e greu să disting motivul pe care îl declar de cel care mă mișcă cu adevărat.",
      "Evit uneori responsabilitatea sau competiția și numesc asta priorizare conștientă.",
      "Știu ce e mai important, dar încă îmi e greu să renunț la alternativa mai mică."
    ]
  }
];
