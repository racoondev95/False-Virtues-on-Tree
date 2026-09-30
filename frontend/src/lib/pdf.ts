import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { solutionFor } from "../data/solutions";
import type { AdminListItem, ResultPayload } from "./api";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 16;
const MARGIN_TOP = 16;
const MARGIN_BOTTOM = 18;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

const INK: [number, number, number] = [27, 20, 6];
const MUTED: [number, number, number] = [92, 83, 70];
const GOLD: [number, number, number] = [122, 92, 16];

type FontPack = { regular: string; bold: string };

let fontsPromise: Promise<FontPack> | null = null;

function bufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const size = 0x8000;
  for (let i = 0; i < bytes.length; i += size) {
    binary += String.fromCharCode(...bytes.subarray(i, i + size));
  }
  return btoa(binary);
}

function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      fetch("/fonts/Roboto-Regular.ttf").then((res) => {
        if (!res.ok) throw new Error("font");
        return res.arrayBuffer();
      }),
      fetch("/fonts/Roboto-Bold.ttf").then((res) => {
        if (!res.ok) throw new Error("font");
        return res.arrayBuffer();
      })
    ])
      .then(([regular, bold]) => ({
        regular: bufferToBase64(regular),
        bold: bufferToBase64(bold)
      }))
      .catch((error) => {
        fontsPromise = null;
        throw error;
      });
  }
  return fontsPromise;
}

async function createDoc() {
  const fonts = await loadFonts();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.addFileToVFS("Roboto-Regular.ttf", fonts.regular);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.addFileToVFS("Roboto-Bold.ttf", fonts.bold);
  doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
  doc.setFont("Roboto", "normal");
  return doc;
}

function filePart(value: string | null | undefined) {
  const clean = (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return clean || "fara-nume";
}

function fileStamp(date = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}`;
}

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("ro-RO", { dateStyle: "long", timeStyle: "short" });
}

function show(value: string | null | undefined) {
  const text = value?.trim();
  return text ? text : "—";
}

function paint(doc: jsPDF, color: [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function ensure(doc: jsPDF, y: number, needed = 8) {
  if (y + needed <= PAGE_H - MARGIN_BOTTOM) return y;
  doc.addPage();
  return MARGIN_TOP + 2;
}

function writeLines(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  size: number,
  style: "normal" | "bold",
  color: [number, number, number]
) {
  doc.setFont("Roboto", style);
  doc.setFontSize(size);
  paint(doc, color);
  const lines = doc.splitTextToSize(text, width) as string[];
  const lineH = size * 0.352 * 1.38;
  for (const line of lines) {
    y = ensure(doc, y, lineH);
    doc.text(line, x, y);
    y += lineH;
  }
  return y;
}

function addFooters(doc: jsPDF) {
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFont("Roboto", "normal");
    doc.setFontSize(8.5);
    paint(doc, MUTED);
    doc.text("Rezultat orientativ · Falsele Virtuți ale Arborelui Vieții", MARGIN_X, PAGE_H - 8);
    doc.text(`${page} / ${pages}`, PAGE_W - MARGIN_X, PAGE_H - 8, { align: "right" });
  }
}

function drawBanner(doc: jsPDF, kicker: string, title: string) {
  doc.setFillColor(27, 20, 6);
  doc.rect(0, 0, PAGE_W, 30, "F");
  doc.setFillColor(232, 197, 71);
  doc.rect(0, 30, PAGE_W, 1.4, "F");
  doc.setFont("Roboto", "normal");
  doc.setFontSize(9);
  paint(doc, [232, 197, 71]);
  doc.text(kicker.toUpperCase(), MARGIN_X, 12);
  doc.setFont("Roboto", "bold");
  doc.setFontSize(16);
  paint(doc, [248, 241, 216]);
  doc.text(title, MARGIN_X, 22);
  return 40;
}

function drawResult(doc: jsPDF, result: ResultPayload) {
  let y = drawBanner(doc, "Chestionar", "Falsele Virtuți ale Arborelui Vieții");
  const total = result.sefirot.reduce((sum, sefira) => sum + sefira.problemCount, 0);

  y = writeLines(doc, `Nume: ${show(result.lastName || result.participantName)}`, MARGIN_X, y, CONTENT_W, 11, "normal", INK);
  y = writeLines(doc, `Prenume: ${show(result.firstName)}`, MARGIN_X, y, CONTENT_W, 11, "normal", INK);
  y = writeLines(doc, `Email: ${show(result.email)}`, MARGIN_X, y, CONTENT_W, 11, "normal", INK);
  y = writeLines(doc, `Telefon: ${show(result.phone)}`, MARGIN_X, y, CONTENT_W, 11, "normal", INK);
  y = writeLines(doc, `Completat: ${formatWhen(result.createdAt)}`, MARGIN_X, y, CONTENT_W, 11, "normal", INK);
  y += 1.5;
  y = writeLines(doc, `Afirmații bifate: ${total}`, MARGIN_X, y, CONTENT_W, 11, "bold", GOLD);
  y += 4;

  for (const sefira of result.sefirot) {
    y = ensure(doc, y, 32);
    doc.setDrawColor(228, 215, 176);
    doc.setLineWidth(0.3);
    doc.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
    y += 7;
    y = writeLines(doc, sefira.name, MARGIN_X, y, CONTENT_W, 14, "bold", INK);
    const vice = sefira.vice ? ` · Viciu: ${sefira.vice}` : "";
    y = writeLines(
      doc,
      `${sefira.planet} · Virtute: ${sefira.virtue}${vice}`,
      MARGIN_X,
      y,
      CONTENT_W,
      10,
      "normal",
      GOLD
    );
    y += 1.5;
    y = writeLines(doc, "Situație", MARGIN_X, y, CONTENT_W, 11, "bold", INK);
    y = writeLines(doc, sefira.summary, MARGIN_X, y, CONTENT_W, 10.5, "normal", MUTED);
    y += 2;
    y = writeLines(doc, "Întrebări", MARGIN_X, y, CONTENT_W, 11, "bold", INK);

    const questions = sefira.questions.length
      ? sefira.questions
      : sefira.checked.map((item) => ({ ...item, checked: true }));

    if (!questions.length) {
      y = writeLines(doc, "Nu există întrebări înregistrate pentru această sefiră.", MARGIN_X, y, CONTENT_W, 10.5, "normal", MUTED);
      y += 4;
      continue;
    }

    questions.forEach((question, index) => {
      y += 1.2;
      const mark = question.checked ? "Bifată" : "Nebifată";
      y = writeLines(
        doc,
        `${index + 1}. ${mark} — ${question.prompt}`,
        MARGIN_X,
        y,
        CONTENT_W,
        10.5,
        "normal",
        question.checked ? INK : MUTED
      );
      y = writeLines(doc, `Soluție: ${solutionFor(question.prompt)}`, MARGIN_X + 4, y + 0.4, CONTENT_W - 4, 10.5, "normal", INK);
    });
    y += 5;
  }

  y += 1;
  y = writeLines(
    doc,
    "Sfaturile de aici sunt orientative și nu reprezintă o consiliere calificată, adaptabilă oricărei situații.",
    MARGIN_X,
    y,
    CONTENT_W,
    9,
    "normal",
    MUTED
  );
  return y;
}

export async function downloadResultPdf(result: ResultPayload) {
  const doc = await createDoc();
  drawResult(doc, result);
  addFooters(doc);
  const name = `${filePart(result.lastName || result.participantName)}-${filePart(result.firstName)}`;
  doc.save(`rezultat-${name}-${fileStamp(new Date(result.createdAt))}.pdf`);
}

export async function downloadContactsPdf(people: AdminListItem[]) {
  const doc = await createDoc();
  drawBanner(doc, "Arhivă", "Nume, prenume, email, telefon");
  doc.setFont("Roboto", "normal");
  doc.setFontSize(11);
  paint(doc, INK);
  doc.text(`${people.length} ${people.length === 1 ? "persoană" : "persoane"} · generat ${formatWhen(new Date().toISOString())}`, MARGIN_X, 38);

  if (!people.length) {
    doc.text("Nu există răspunsuri salvate.", MARGIN_X, 52);
  } else {
    autoTable(doc, {
      startY: 46,
      margin: { left: 10, right: 10, top: 16, bottom: 16 },
      head: [["Nume", "Prenume", "Email", "Telefon"]],
      body: people.map((person) => [
        show(person.lastName || person.participantName),
        show(person.firstName),
        show(person.email),
        show(person.phone)
      ]),
      styles: {
        font: "Roboto",
        fontStyle: "normal",
        fontSize: 10,
        textColor: INK,
        cellPadding: 2.6,
        overflow: "linebreak"
      },
      headStyles: {
        font: "Roboto",
        fontStyle: "bold",
        fillColor: [27, 20, 6],
        textColor: [244, 239, 227]
      },
      alternateRowStyles: { fillColor: [248, 244, 232] },
      columnStyles: {
        0: { cellWidth: 42 },
        1: { cellWidth: 42 },
        2: { cellWidth: 68 },
        3: { cellWidth: 38 }
      }
    });
  }

  addFooters(doc);
  doc.save(`contacte-chestionar-${fileStamp()}.pdf`);
}

export async function downloadAllResultsPdf(results: ResultPayload[]) {
  const doc = await createDoc();
  if (!results.length) {
    drawBanner(doc, "Arhivă", "Rezultatele chestionarului");
    doc.setFont("Roboto", "normal");
    doc.setFontSize(12);
    paint(doc, INK);
    doc.text("Nu există răspunsuri salvate.", MARGIN_X, 48);
  } else {
    results.forEach((result, index) => {
      if (index > 0) doc.addPage();
      drawResult(doc, result);
    });
  }
  addFooters(doc);
  doc.save(`rezultate-complete-${fileStamp()}.pdf`);
}
