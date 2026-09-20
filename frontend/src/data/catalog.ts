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

Bifează afirmațiile care ți se aplică cu sinceritate. La final, fiecare sefiră va arăta numărul de probleme recunoscute.`
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
      "Kether este coroana Arborelui: unitatea din care izvorăsc toate celelalte sefirot. Nu are viciu clasic, dar fragmentarea atenției și identificarea cu părți izolate pot acoperi virtutea.",
    questions: [
      "Simt că sunt mai degrabă o colecție de roluri contradictorii decât o prezență unitară.",
      "Caut unitatea doar ca idee, fără să o las să orienteze alegerile zilnice.",
      "Când apar conflicte interioare, identific imediat o parte ca „eu” și restul ca inamic.",
      "Am nevoie să fiu special sau separat de ceilalți pentru a mă simți întreg."
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
      "Scopul spune pentru ce îți folosești existența. Devoțiunea autentică poate continua când e greu, dar și să se oprească când realitatea cere o schimbare de direcție.",
    questions: [
      "Spun că vreau să evoluez spiritual, dar folosește asta ca evadare din problemele vieții.",
      "Am nevoie să fiu perceput ca persoană specială sau „aleasă” prin acest scop.",
      "Dacă nimeni nu ar afla ce fac, scopul ar pierde din importanță.",
      "Mă agăț de direcție mai ales ca să nu admit că am investit greșit.",
      "Confund imaginea mea de om devotat cu scopul însuși.",
      "Nu pot admite că metoda e greșită fără să simt că toată direcția e invalidă."
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
      "Liniștea este spațiul dintre eveniment și reacție. Retenția autentică protejează și maturizează; falsa retenție transformă informația în monedă de putere.",
    questions: [
      "Rețin informații sau reacții mai degrabă din frică decât pentru că au nevoie de timp.",
      "Folosesc tăcerea ca să evit confruntări necesare.",
      "Păstrez cunoașterea ca să rămân indispensabil sau să păstrez un statut.",
      "Nu pot sta cu o întrebare deschisă; forțez imediat un răspuns.",
      "Ceea ce păstrez în interior se rigidizează în izolare, nu se maturizează în înțelepciune.",
      "Transform observațiile imediat în concluzii definitive."
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
      "Alinierea autentică pune voința în serviciul unei ordini recunoscute ca legitimă, fără servilism și fără rebeliune reflexă.",
    questions: [
      "Consider că o idee este adevărată doar pentru că vine de la o autoritate.",
      "Renunț la opinii, limite sau valori ca să păstrez aprobarea unui grup sau a unui profesor.",
      "Tratez îndoiala ca pe un defect spiritual: „un adevărat discipol nu pune întrebări”.",
      "Resping orice regulă sau profesor doar pentru că reprezintă autoritate.",
      "Cerem altora disciplină și modestie, dar îmi acord excepții.",
      "Ascult mai degrabă din frica de dezaprobare decât din judecată.",
      "Nu înțeleg principiul pe care îl urmez; urmez doar persoana care l-a formulat."
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
      "Curajul acționează în direcția corectă în ciuda fricii. Forța controlată face parte din forță; agresivitatea și cruzimea justificată sunt false virtuți.",
    questions: [
      "Confund duritatea, dominanța sau confruntarea permanentă cu curajul.",
      "Reacționez violent sau excesiv ca să elimin nesiguranța, nu pentru că e necesar.",
      "Orice diferență de opinie o citesc ca atac ce trebuie neutralizat.",
      "Justific umilirea sau pedeapsa disproporționată prin „adevăr”, „ordine” sau „disciplină”.",
      "Acționez mai ales ca să demonstrez că sunt puternic.",
      "Aștept ca frustrarea să explodeze în loc să pun limite clare din timp.",
      "Îmi este greu să spun „am greșit” pentru că imaginea de forță ar părea fragilă."
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
      "Devotamentul orientează voința către ceva superior interesului imediat, fără a anula discernământul și fără a idolatriza obiectul dedicării.",
    questions: [
      "Am nevoie să fiu „cel care nu abandonează niciodată”, chiar când direcția nu mai corespunde valorilor.",
      "Continui o relație, o practică sau o cauză pentru că am sacrificat deja prea mult.",
      "Confund suferința sau sacrificiul cu dovada devotamentului.",
      "Idolatrizez o persoană, un maestru, un grup sau o idee și nu suport contradicțiile.",
      "Devotamentul meu e orientat mai ales către imaginea mea de om loial.",
      "Pentru a rămâne „devotat” trebuie să neg ceea ce văd."
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
      "Dărnicia lasă resursele să circule fără facturi invizibile. Include măsura: libertatea de a oferi și libertatea de a păstra.",
    questions: [
      "Ofer ca să cumpăr iubire, loialitate, recunoștință sau statut.",
      "Simt resentiment de tipul „după tot ce am făcut pentru tine…”.",
      "Nu pot spune „nu”; darurile mele sunt conduse de frică sau nevoie de acceptare.",
      "Îmi construiesc identitatea pe sacrificiul de sine: „eu sunt cel care se sacrifică”.",
      "Ofer într-un ritm care mă epuizează și nu mai e constructiv pentru nimeni.",
      "Consider că darul îmi dă autoritate asupra celui care îl primește.",
      "Ofer ca să mă simt generos, nu pentru că darul este cu adevărat folositor."
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
      "Sinceritatea leagă realitatea percepută, gândirea și exprimarea. A spune ce crezi nu e suficient dacă nu verifici dacă e adevărat.",
    questions: [
      "Spun exact ce cred, dar nu verific dacă respectiva convingere corespunde realității.",
      "Selectez sau omit informații ca ceilalți să ajungă la concluzia pe care o doresc.",
      "Când sunt furios, folosesc „mereu”, „niciodată”, „toți”, „nimeni”.",
      "Tratez interpretările mele ca pe fapte sigure.",
      "Caut mai ales dovezi care îmi confirmă convingerile.",
      "Confund sinceritatea cu dreptul de a spune orice gând, oricând.",
      "Folosesc adevăruri parțiale ca să produc o impresie falsă."
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
      "Cred că, pentru a fi independent, trebuie să nu ascult de nimeni și să nu cer ajutor.",
      "Îmi construiesc identitatea pe refuzul de a fi influențat.",
      "Simt nevoia să demonstrez permanent că mă descurc singur.",
      "Consider relațiile, cooperarea sau nevoia de afecțiune drept slăbiciuni.",
      "Îmi este greu să îmi schimb opinia, pentru că identitatea depinde de a avea dreptate.",
      "Evit să mă bazez pe propria evaluare și las mediul să decidă în locul meu.",
      "Transform singurătatea într-o virtute, deși e mai degrabă izolare."
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
      "Discernământul percepe diferențele și priorizează. Falsul discernământ confundă justificarea atașamentelor cu capacitatea de a vedea clar.",
    questions: [
      "Sunt convins că știu ce e important și ce trebuie sacrificat, fără loc pentru îndoială.",
      "Justific atașamente, frici sau confort ca pe alegeri „spirituale”.",
      "Nu verific după luni dacă timpul sau energia „câștigate” sunt folosite cum am pretins.",
      "Nu distinge între motivul declarat și motivul real al alegerii.",
      "Evit responsabilitatea sau competiția și numesc asta priorizare conștientă.",
      "Știu ce e mai important, dar nu reușesc să renunț efectiv la alternativa mai mică."
    ]
  }
];
