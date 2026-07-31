'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { APP_NAME } from '@/lib/constants';

export function exportProgressReport(
  elementId: string,
  filename = `${APP_NAME.toLowerCase()}-progress-report.pdf`,
) {
  const element = document.getElementById(elementId);
  if (!element) return;

  html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.setFontSize(18);
    pdf.text(`${APP_NAME} Progress Report`, 10, 15);
    pdf.setFontSize(9);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 10, 22);

    let heightLeft = imgHeight;
    let position = 30;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - position;

    while (heightLeft > 0) {
      position = -(pageHeight - position) - 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  });
}
