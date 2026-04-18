import jsPDF from 'jspdf';
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
  AlignmentType,
  Packer,
} from 'docx';
import { saveAs } from 'file-saver';
import { ValuationReport } from '../types';

/* ─────────────────────────────────────────────
   Helper: format date for display
───────────────────────────────────────────── */
function formattedDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/* ─────────────────────────────────────────────
   Helper: wrap long text for jsPDF
───────────────────────────────────────────── */
function writeWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

/* ─────────────────────────────────────────────
   Export to PDF
───────────────────────────────────────────── */
export async function exportToPDF(report: ValuationReport): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginL = 20;
  const marginR = 20;
  const contentW = pageW - marginL - marginR;
  const lineH = 6;

  let y = 0;

  /* ── Header Banner ── */
  doc.setFillColor(37, 99, 235); // brand blue
  doc.rect(0, 0, pageW, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Valuation Report', marginL, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Powered by Valuation System AI', marginL, 20);

  doc.setFontSize(10);
  doc.text(formattedDate(new Date()), pageW - marginR, 20, { align: 'right' });

  y = 38;

  /* ── Report Name ── */
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  y = writeWrappedText(doc, report.customerName, marginL, y, contentW, 8);
  y += 4;

  /* ── Status badge (simulated) ── */
  const statusColour: Record<string, [number, number, number]> = {
    approved: [22, 163, 74],
    review: [202, 138, 4],
    draft: [100, 116, 139],
    process: [59, 130, 246],
  };
  const [r, g, b] = statusColour[report.status] ?? [100, 116, 139];
  doc.setFillColor(r, g, b);
  const statusLabel = report.status.charAt(0).toUpperCase() + report.status.slice(1);
  const statusW = doc.getTextWidth(statusLabel) + 8;
  doc.roundedRect(marginL, y - 4, statusW, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(statusLabel, marginL + 4, y + 0.5);
  y += 10;

  /* ── Divider ── */
  doc.setDrawColor(226, 232, 240);
  doc.line(marginL, y, pageW - marginR, y);
  y += 8;

  /* ── Metadata Grid ── */
  const documentNames = report.files?.length ? report.files.map(f => f.name).join(', ') : 'No documents';
  const metaItems = [
    { label: 'Report Name', value: report.customerName },
    { label: 'Documents Name', value: documentNames },
    { label: 'Date', value: formattedDate(new Date()) },
    { label: 'Bank Name', value: report.bankName },
    { label: 'Property Type', value: report.propertyType },
    { label: 'Location', value: report.location },
    { label: 'Status', value: report.status.charAt(0).toUpperCase() + report.status.slice(1) },
  ];

  doc.setFontSize(9);
  const colW = contentW / 2;
  metaItems.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const xPos = marginL + col * colW;
    const yPos = y + row * 24;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(item.label.toUpperCase(), xPos, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const valueLines = doc.splitTextToSize(String(item.value || '—'), colW - 10);
    doc.text(valueLines, xPos, yPos + 6);
  });

  y += Math.ceil(metaItems.length / 2) * 24 + 6;

  /* ── Divider ── */
  doc.setDrawColor(226, 232, 240);
  doc.line(marginL, y, pageW - marginR, y);
  y += 8;

  /* ── Summary Heading ── */
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('AI-Generated Summary', marginL, y);
  y += 8;

  /* ── Summary Body ── */
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  const summaryText = report.content.summary || 'No summary available.';
  // Strip markdown-like headers for clean output
  const cleanSummary = summaryText
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim();

  const bodyLines = doc.splitTextToSize(cleanSummary, contentW);

  bodyLines.forEach((line: string) => {
    if (y + lineH > pageH - 20) {
      doc.addPage();
      // Add page header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageW, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('Valuation Report  •  ' + report.customerName, marginL, 7);
      y = 18;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
    }
    doc.text(line, marginL, y);
    y += lineH;
  });

  /* ── Footer on last page ── */
  const totalPages = doc.getNumberOfPages();
  for (let pg = 1; pg <= totalPages; pg++) {
    doc.setPage(pg);
    doc.setDrawColor(226, 232, 240);
    doc.line(marginL, pageH - 12, pageW - marginR, pageH - 12);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Valuation System AI  –  Confidential', marginL, pageH - 6);
    doc.text(`Page ${pg} of ${totalPages}`, pageW - marginR, pageH - 6, { align: 'right' });
  }

  const fileName = `${report.customerName.replace(/[^a-z0-9]/gi, '_')}_Valuation_Report.pdf`;
  doc.save(fileName);
}

/* ─────────────────────────────────────────────
   Export to DOCX
───────────────────────────────────────────── */
export async function exportToDOCX(report: ValuationReport): Promise<void> {
  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0 },
    bottom: { style: BorderStyle.NONE, size: 0 },
    left: { style: BorderStyle.NONE, size: 0 },
    right: { style: BorderStyle.NONE, size: 0 },
    insideH: { style: BorderStyle.NONE, size: 0 },
    insideV: { style: BorderStyle.NONE, size: 0 },
  };

  const documentNames = report.files?.length ? report.files.map(f => f.name).join(', ') : 'No documents';
  const metaItems = [
    { label: 'Report Name', value: report.customerName },
    { label: 'Documents Name', value: documentNames },
    { label: 'Date', value: formattedDate(new Date()) },
    { label: 'Bank Name', value: report.bankName },
    { label: 'Property Type', value: report.propertyType },
    { label: 'Location', value: report.location },
    { label: 'Status', value: report.status.charAt(0).toUpperCase() + report.status.slice(1) },
  ];

  const metaRows = metaItems.map(
    (item) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: item.label, bold: true, size: 20, color: '64748B' }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: String(item.value || '—'), size: 20, color: '0F172A' }),
                ],
              }),
            ],
          }),
        ],
      })
  );

  const summaryText = report.content.summary || 'No summary available.';
  // Split paragraphs, strip markdown, filter empty ones, then build Paragraph objects
  const summaryParagraphs = summaryText
    .replace(/^#{1,6}\s+/gm, '')
    .split(/\n{2,}/)
    .map((para) =>
      para
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .trim()
    )
    .filter((text) => text.length > 0)
    .map(
      (text) =>
        new Paragraph({
          children: [new TextRun({ text, size: 22, color: '1E293B' })],
          spacing: { after: 160 },
        })
    );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
          },
        },
        children: [
          /* Title */
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 200 },
            children: [
              new TextRun({
                text: report.customerName,
                bold: true,
                size: 52,
                color: '0F172A',
                font: 'Calibri',
              }),
            ],
          }),

          /* Sub-heading: bank • property • location */
          new Paragraph({
            children: [
              new TextRun({
                text: `${report.bankName}  •  ${report.propertyType}  •  ${report.location}`,
                size: 22,
                color: '64748B',
                italics: true,
              }),
            ],
            spacing: { after: 400 },
          }),

          /* ── Metadata Table ── */
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: 'Report Information', bold: true, size: 28, color: '1D4ED8' }),
            ],
            spacing: { before: 200, after: 120 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: noBorder,
            rows: metaRows,
          }),

          /* Spacer */
          new Paragraph({ children: [], spacing: { after: 300 } }),

          /* ── Summary Section ── */
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({ text: 'AI-Generated Summary', bold: true, size: 28, color: '1D4ED8' }),
            ],
            spacing: { before: 200, after: 200 },
          }),

          ...summaryParagraphs,

          /* Footer note */
          new Paragraph({
            children: [
              new TextRun({
                text: `\nGenerated by Valuation System AI  •  ${formattedDate(new Date())}`,
                size: 16,
                color: '94A3B8',
                italics: true,
              }),
            ],
            spacing: { before: 500 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${report.customerName.replace(/[^a-z0-9]/gi, '_')}_Valuation_Report.docx`;
  saveAs(blob, fileName);
}
