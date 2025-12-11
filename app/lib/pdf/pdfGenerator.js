import { jsPDF } from 'jspdf';

/**
 * PDF Generator Service
 * Generates downloadable PDF documents for legal resources
 */

// PDF Templates with actual content
const pdfTemplates = {
  1: {
    title: 'Guía de Derechos Fundamentales',
    content: [
      { type: 'heading', text: 'GUÍA DE DERECHOS FUNDAMENTALES' },
      { type: 'subtitle', text: 'Conoce tus derechos constitucionales en situaciones de detención' },
      { type: 'section', text: '1. DERECHO A LA LIBERTAD' },
      { type: 'paragraph', text: 'Toda persona tiene derecho a la libertad y seguridad personal. Nadie puede ser privado de su libertad sino en los casos y con las formas determinadas por la ley.' },
      { type: 'section', text: '2. DERECHO A NO SER TORTURADO' },
      { type: 'paragraph', text: 'Queda prohibida y será sancionada por la ley penal toda forma de tortura y los tratos crueles, inhumanos o degradantes. No se puede renunciar a este derecho.' },
      { type: 'section', text: '3. DERECHO A LA PRESUNCIÓN DE INOCENCIA' },
      { type: 'paragraph', text: 'Toda persona se presume inocente mientras no se declare su responsabilidad mediante sentencia emitida por el juez de la causa.' },
      { type: 'section', text: '4. DERECHO A LA DEFENSA' },
      { type: 'paragraph', text: 'Toda persona tiene derecho a defenderse o ser defendida por un abogado de su elección durante todo el proceso. Si no puede pagar un abogado, el Estado le proporcionará uno sin costo.' },
      { type: 'section', text: '5. DERECHO A GUARDAR SILENCIO' },
      { type: 'paragraph', text: 'Tienes derecho a no declarar en tu contra. No estás obligado a confesarte culpable ni a testificar contra ti mismo.' },
      { type: 'section', text: '6. CONTACTOS DE EMERGENCIA' },
      { type: 'paragraph', text: 'Comisión Nacional de Derechos Humanos (CNDH): 800 715 2000' },
      { type: 'paragraph', text: 'Emergencias: 911' },
      { type: 'paragraph', text: 'Denuncia Anónima: 089' },
      { type: 'footer', text: 'Documento generado por Defiéndete MX - www.defiendete-mx.com' }
    ]
  },
  2: {
    title: 'Contactos de Emergencia',
    content: [
      { type: 'heading', text: 'CONTACTOS DE EMERGENCIA' },
      { type: 'subtitle', text: 'Lista completa de números de emergencia y organizaciones de ayuda' },
      { type: 'section', text: 'EMERGENCIAS GENERALES' },
      { type: 'paragraph', text: '911 - Emergencias (policía, bomberos, ambulancia)' },
      { type: 'paragraph', text: '089 - Denuncia Anónima' },
      { type: 'paragraph', text: '088 - Información y orientación ciudadana' },
      { type: 'section', text: 'VIOLENCIA Y DERECHOS HUMANOS' },
      { type: 'paragraph', text: '800 715 2000 - CNDH (Comisión Nacional de Derechos Humanos)' },
      { type: 'paragraph', text: '800 008 0028 - Línea Nacional contra la Trata de Personas' },
      { type: 'paragraph', text: '800 TU AYUDA (800 888 9832) - Violencia familiar y sexual' },
      { type: 'section', text: 'APOYO LEGAL' },
      { type: 'paragraph', text: '55 5533 5533 - Fiscalía General de la República' },
      { type: 'paragraph', text: '800 737 3764 - Instituto Federal de Defensoría Pública' },
      { type: 'section', text: 'SALUD Y CRISIS' },
      { type: 'paragraph', text: '800 911 2000 - Línea de la Vida (salud mental y adicciones)' },
      { type: 'paragraph', text: '55 5259 8121 - Cruz Roja' },
      { type: 'section', text: 'ORGANISMOS INTERNACIONALES' },
      { type: 'paragraph', text: '+52 55 5061 6000 - ONU México' },
      { type: 'paragraph', text: '+52 55 9172 5100 - Amnistía Internacional México' },
      { type: 'footer', text: 'Documento generado por Defiéndete MX - www.defiendete-mx.com' }
    ]
  },
  3: {
    title: 'Procedimientos Legales',
    content: [
      { type: 'heading', text: 'PROCEDIMIENTOS LEGALES' },
      { type: 'subtitle', text: 'Paso a paso de los procedimientos legales en México' },
      { type: 'section', text: 'FASE 1: INVESTIGACIÓN INICIAL' },
      { type: 'paragraph', text: '1. Presentación de denuncia: Acude al Ministerio Público con identificación oficial y narra los hechos.' },
      { type: 'paragraph', text: '2. Carpeta de investigación: Se abre un expediente y se te asigna un número de carpeta.' },
      { type: 'paragraph', text: '3. Recolección de pruebas: Presenta todas las pruebas que tengas (documentos, fotos, videos, testigos).' },
      { type: 'section', text: 'FASE 2: IMPUTACIÓN' },
      { type: 'paragraph', text: '1. Citatorio al imputado: Se notifica al presunto responsable para que comparezca.' },
      { type: 'paragraph', text: '2. Audiencia inicial: Se realiza ante el juez de control en un plazo de 48 horas si hay detenido.' },
      { type: 'paragraph', text: '3. Formulación de imputación: El MP presenta los cargos formalmente.' },
      { type: 'section', text: 'FASE 3: PROCESO JUDICIAL' },
      { type: 'paragraph', text: '1. Auto de vinculación a proceso: El juez decide si hay elementos para iniciar el juicio.' },
      { type: 'paragraph', text: '2. Etapa de investigación complementaria: Plazo para reunir más pruebas (2 meses ampliable a 6).' },
      { type: 'paragraph', text: '3. Audiencia intermedia: Se decide qué pruebas son admisibles para el juicio.' },
      { type: 'section', text: 'FASE 4: JUICIO ORAL' },
      { type: 'paragraph', text: '1. Audiencia de juicio: Presentación de pruebas, testimonios y alegatos.' },
      { type: 'paragraph', text: '2. Deliberación: El juez o tribunal valora las pruebas presentadas.' },
      { type: 'paragraph', text: '3. Sentencia: Se emite la resolución absolutoria o condenatoria.' },
      { type: 'section', text: 'DERECHOS DURANTE TODO EL PROCESO' },
      { type: 'paragraph', text: '- Estar presente en todas las audiencias' },
      { type: 'paragraph', text: '- Contar con un asesor jurídico' },
      { type: 'paragraph', text: '- Recibir información sobre el estado del caso' },
      { type: 'paragraph', text: '- Interponer recursos de impugnación' },
      { type: 'footer', text: 'Documento generado por Defiéndete MX - www.defiendete-mx.com' }
    ]
  },
  4: {
    title: 'Formulario de Denuncia',
    content: [
      { type: 'heading', text: 'FORMULARIO DE DENUNCIA' },
      { type: 'subtitle', text: 'Plantilla para presentar denuncias ante autoridades' },
      { type: 'section', text: 'DATOS DEL DENUNCIANTE' },
      { type: 'paragraph', text: 'Nombre completo: _____________________________________________' },
      { type: 'paragraph', text: 'Edad: _______ Sexo: _______ Estado civil: _______' },
      { type: 'paragraph', text: 'Domicilio: ____________________________________________________' },
      { type: 'paragraph', text: 'Teléfono: _____________ Correo electrónico: ___________________' },
      { type: 'paragraph', text: 'Identificación oficial (tipo y número): ___________________________' },
      { type: 'section', text: 'DATOS DEL IMPUTADO (SI SE CONOCE)' },
      { type: 'paragraph', text: 'Nombre completo: _____________________________________________' },
      { type: 'paragraph', text: 'Alias o apodo: ________________________________________________' },
      { type: 'paragraph', text: 'Domicilio (si se conoce): ______________________________________' },
      { type: 'paragraph', text: 'Características físicas: _______________________________________' },
      { type: 'section', text: 'NARRACIÓN DE LOS HECHOS' },
      { type: 'paragraph', text: 'Fecha y hora de los hechos: ___________________________________' },
      { type: 'paragraph', text: 'Lugar donde ocurrieron: _______________________________________' },
      { type: 'paragraph', text: 'Descripción detallada de lo sucedido:' },
      { type: 'paragraph', text: '________________________________________________________________' },
      { type: 'paragraph', text: '________________________________________________________________' },
      { type: 'paragraph', text: '________________________________________________________________' },
      { type: 'paragraph', text: '________________________________________________________________' },
      { type: 'section', text: 'TESTIGOS' },
      { type: 'paragraph', text: 'Nombre del testigo 1: _________________________________________' },
      { type: 'paragraph', text: 'Teléfono: ___________________' },
      { type: 'paragraph', text: 'Nombre del testigo 2: _________________________________________' },
      { type: 'paragraph', text: 'Teléfono: ___________________' },
      { type: 'section', text: 'PRUEBAS ADJUNTAS' },
      { type: 'paragraph', text: '☐ Fotografías   ☐ Videos   ☐ Documentos   ☐ Mensajes' },
      { type: 'paragraph', text: '☐ Certificado médico   ☐ Otros: ______________________________' },
      { type: 'section', text: 'DECLARACIÓN' },
      { type: 'paragraph', text: 'Bajo protesta de decir verdad, manifiesto que los hechos narrados son ciertos y estoy consciente de las responsabilidades legales de declarar falsamente.' },
      { type: 'paragraph', text: 'Firma: __________________   Fecha: __________________' },
      { type: 'footer', text: 'Documento generado por Defiéndete MX - www.defiendete-mx.com' }
    ]
  },
  5: {
    title: 'Derechos del Detenido',
    content: [
      { type: 'heading', text: 'DERECHOS DEL DETENIDO' },
      { type: 'subtitle', text: 'Información detallada sobre los derechos durante una detención' },
      { type: 'section', text: 'QUÉ HACER SI TE DETIENEN' },
      { type: 'paragraph', text: '1. Mantén la calma y no te resistas' },
      { type: 'paragraph', text: '2. Pide que se identifiquen los oficiales' },
      { type: 'paragraph', text: '3. Pregunta el motivo de tu detención' },
      { type: 'paragraph', text: '4. No firmes nada sin leer y sin tu abogado presente' },
      { type: 'paragraph', text: '5. Ejercita tu derecho a guardar silencio' },
      { type: 'section', text: 'TUS DERECHOS CONSTITUCIONALES' },
      { type: 'paragraph', text: '1. DERECHO A SABER POR QUÉ TE DETIENEN: Las autoridades deben informarte inmediatamente la causa de tu detención y quién te acusa.' },
      { type: 'paragraph', text: '2. DERECHO A COMUNICARTE: Puedes hacer una llamada telefónica a un familiar, abogado o consulado.' },
      { type: 'paragraph', text: '3. DERECHO A UN ABOGADO: Puedes contar con un defensor particular o público desde el momento de tu detención.' },
      { type: 'paragraph', text: '4. DERECHO A GUARDAR SILENCIO: No estás obligado a declarar. Tu silencio no puede ser usado en tu contra.' },
      { type: 'paragraph', text: '5. DERECHO A NO SER TORTURADO: Ninguna autoridad puede torturarte o maltratarte física o psicológicamente.' },
      { type: 'paragraph', text: '6. DERECHO A ATENCIÓN MÉDICA: Si estás lesionado o enfermo, tienes derecho a recibir atención médica.' },
      { type: 'paragraph', text: '7. DERECHO A INTÉRPRETE: Si no hablas español, tienen que proporcionarte un intérprete sin costo.' },
      { type: 'section', text: 'TIEMPO DE DETENCIÓN' },
      { type: 'paragraph', text: '- Detención sin orden: Máximo 48 horas antes de ser presentado ante el juez' },
      { type: 'paragraph', text: '- Delincuencia organizada: Puede extenderse hasta 96 horas' },
      { type: 'paragraph', text: '- Después de este tiempo, deben liberarte o presentarte ante un juez' },
      { type: 'section', text: 'SI VIOLAN TUS DERECHOS' },
      { type: 'paragraph', text: '- Informa inmediatamente a tu abogado' },
      { type: 'paragraph', text: '- Solicita atención médica y que se documenten lesiones' },
      { type: 'paragraph', text: '- Presenta queja ante la CNDH: 800 715 2000' },
      { type: 'paragraph', text: '- Todas las pruebas obtenidas con violación de derechos son inválidas' },
      { type: 'footer', text: 'Documento generado por Defiéndete MX - www.defiendete-mx.com' }
    ]
  },
  6: {
    title: 'Recursos de la CNDH',
    content: [
      { type: 'heading', text: 'RECURSOS DE LA CNDH' },
      { type: 'subtitle', text: 'Compilación de recursos oficiales de la Comisión Nacional de Derechos Humanos' },
      { type: 'section', text: '¿QUÉ ES LA CNDH?' },
      { type: 'paragraph', text: 'La Comisión Nacional de los Derechos Humanos (CNDH) es un organismo constitucional autónomo que protege y defiende los derechos humanos en México.' },
      { type: 'section', text: 'SERVICIOS QUE OFRECE' },
      { type: 'paragraph', text: '1. Recepción de quejas por violaciones a derechos humanos' },
      { type: 'paragraph', text: '2. Asesoría jurídica gratuita' },
      { type: 'paragraph', text: '3. Orientación y atención psicológica' },
      { type: 'paragraph', text: '4. Emisión de recomendaciones a autoridades' },
      { type: 'paragraph', text: '5. Observación de casos relevantes' },
      { type: 'paragraph', text: '6. Capacitación en derechos humanos' },
      { type: 'section', text: 'CÓMO PRESENTAR UNA QUEJA' },
      { type: 'paragraph', text: '1. PRESENCIAL: Acude a cualquier oficina de la CNDH en el país' },
      { type: 'paragraph', text: '2. TELEFÓNICA: Llama al 800 715 2000 (lada sin costo)' },
      { type: 'paragraph', text: '3. EN LÍNEA: Ingresa a www.cndh.org.mx' },
      { type: 'paragraph', text: '4. POR CORREO: Envía a quejasdenuncias@cndh.org.mx' },
      { type: 'section', text: 'REQUISITOS PARA PRESENTAR QUEJA' },
      { type: 'paragraph', text: '- Nombre y domicilio del quejoso' },
      { type: 'paragraph', text: '- Narración de los hechos' },
      { type: 'paragraph', text: '- Autoridad presuntamente responsable' },
      { type: 'paragraph', text: '- Pruebas (si se tienen)' },
      { type: 'paragraph', text: '- No es necesario contar con abogado' },
      { type: 'section', text: 'DERECHOS HUMANOS QUE PROTEGE' },
      { type: 'paragraph', text: '✓ Derecho a la vida e integridad personal' },
      { type: 'paragraph', text: '✓ Derecho a la libertad' },
      { type: 'paragraph', text: '✓ Derecho a la igualdad y no discriminación' },
      { type: 'paragraph', text: '✓ Derecho a la seguridad jurídica' },
      { type: 'paragraph', text: '✓ Derechos sociales (salud, educación, vivienda)' },
      { type: 'paragraph', text: '✓ Derechos de grupos vulnerables' },
      { type: 'section', text: 'CONTACTO CNDH' },
      { type: 'paragraph', text: 'Teléfono: 800 715 2000 / 55 5681 8125' },
      { type: 'paragraph', text: 'WhatsApp: 55 4433 5508' },
      { type: 'paragraph', text: 'Web: www.cndh.org.mx' },
      { type: 'paragraph', text: 'Correo: quejasdenuncias@cndh.org.mx' },
      { type: 'paragraph', text: 'Dirección: Periférico Sur 3469, Col. San Jerónimo Lídice, CDMX' },
      { type: 'footer', text: 'Documento generado por Defiéndete MX - www.defiendete-mx.com' }
    ]
  }
};

/**
 * Generate PDF document
 * @param {number} resourceId - ID of the resource template
 * @returns {Blob} PDF blob
 */
export const generatePDF = (resourceId) => {
  const template = pdfTemplates[resourceId];

  if (!template) {
    throw new Error(`Template not found for resource ID: ${resourceId}`);
  }

  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to check if new page is needed
  const checkNewPage = (additionalHeight = 0) => {
    if (yPosition + additionalHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Render content
  template.content.forEach((item, index) => {
    switch (item.type) {
      case 'heading':
        checkNewPage(20);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229); // Indigo-600
        doc.text(item.text, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;
        break;

      case 'subtitle':
        checkNewPage(15);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(107, 114, 128); // Gray-500
        const subtitleLines = doc.splitTextToSize(item.text, maxWidth);
        doc.text(subtitleLines, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += subtitleLines.length * 6 + 10;
        break;

      case 'section':
        checkNewPage(12);
        // Add some spacing before section
        if (index > 0) yPosition += 5;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(item.text, margin, yPosition);
        yPosition += 10;
        break;

      case 'paragraph':
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55, 65, 81); // Gray-700
        const lines = doc.splitTextToSize(item.text, maxWidth);

        // Check if we need a new page for this paragraph
        const paragraphHeight = lines.length * 6;
        checkNewPage(paragraphHeight);

        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 6 + 3;
        break;

      case 'footer':
        // Always put footer at bottom of last page
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(156, 163, 175); // Gray-400
        const footerY = pageHeight - 15;
        doc.text(item.text, pageWidth / 2, footerY, { align: 'center' });

        // Add generation date
        const date = new Date().toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        doc.text(`Generado el: ${date}`, pageWidth / 2, footerY + 5, { align: 'center' });
        break;
    }
  });

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Return PDF as blob
  return doc.output('blob');
};

/**
 * Download PDF file
 * @param {number} resourceId - ID of the resource template
 * @param {string} filename - Name for the downloaded file
 */
export const downloadPDF = (resourceId, filename) => {
  try {
    const pdfBlob = generatePDF(resourceId);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `recurso-${resourceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Get PDF preview URL
 * @param {number} resourceId - ID of the resource template
 * @returns {string} Object URL for preview
 */
export const getPDFPreviewURL = (resourceId) => {
  const pdfBlob = generatePDF(resourceId);
  return URL.createObjectURL(pdfBlob);
};

export default {
  generatePDF,
  downloadPDF,
  getPDFPreviewURL
};
