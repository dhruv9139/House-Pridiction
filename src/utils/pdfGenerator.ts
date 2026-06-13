import { jsPDF } from "jspdf";
import { Prediction, Favorite } from "../types";

/**
 * Format timestamp to friendly readable string
 */
const formatReportDate = (isoString?: string) => {
  const d = isoString ? new Date(isoString) : new Date();
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Generates and downloads a Professional Property Valuation Report for a single prediction item.
 */
export const generateSingleValuationPDF = (prediction: Prediction) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // A4 dimensions: 210mm x 297mm
  const margin = 15;
  const contentWidth = 180; // 210 - 2 * 15

  // 1. Dynamic Header Banner (Deep Electric Violet & Royal Cobalt Mix)
  doc.setFillColor(30, 41, 59); // Background color (#1e293b)
  doc.rect(0, 0, 210, 38, "F");

  // Bottom Border Accent on Banner (Teal)
  doc.setFillColor(13, 148, 136); // Teal accent (#0d9488)
  doc.rect(0, 38, 210, 2, "F");

  // Logo Badge Icon (Golden Star/Square design)
  doc.setFillColor(245, 158, 11); // Gold accent (#f59e0b)
  doc.rect(margin, 10, 5, 5, "F");

  // Header Typography
  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("VALUATION AI PIPELINE", margin + 8, 14);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(15);
  doc.text("PROPERTY VALUATION REPORT", margin, 24);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // Slate light-grey
  const reportId = `VAL-${prediction.id.substring(0, 8).toUpperCase()}`;
  doc.text(`REPORT REFERENCE: ${reportId}`, margin, 31);
  doc.text(`GENERATED ON: ${formatReportDate(prediction.timestamp)}`, 210 - margin - 75, 31);

  // 2. Executive Summary Title
  let currentY = 50;
  doc.setTextColor(15, 23, 42); // slate-900 (#0f172a)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);
  doc.text("EXECUTIVE APPRAISAL BRIEF", margin, currentY);

  // Title underline
  currentY += 2;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 8;

  // 3. Section: Property Specifications Table Card
  doc.setFillColor(248, 250, 252); // slate-50 background card
  doc.rect(margin, currentY, contentWidth, 48, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(margin, currentY, contentWidth, 48, "D");

  // Table Label
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PROPERTY ASSET SPECIFICATIONS", margin + 5, currentY + 6);
  doc.line(margin + 5, currentY + 8, margin + contentWidth - 5, currentY + 8);

  // Specifications Grid values
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(9);
  
  // Left Column
  let rowY = currentY + 14;
  doc.setFont("Helvetica", "bold");
  doc.text("Property Type:", margin + 8, rowY);
  doc.setFont("Helvetica", "normal");
  doc.text(prediction.propertyType.toUpperCase(), margin + 40, rowY);

  doc.setFont("Helvetica", "bold");
  doc.text("Location Suburb:", margin + 8, rowY + 6);
  doc.setFont("Helvetica", "normal");
  doc.text(prediction.location, margin + 40, rowY + 6);

  doc.setFont("Helvetica", "bold");
  doc.text("Covered Net Area:", margin + 8, rowY + 12);
  doc.setFont("Helvetica", "normal");
  doc.text(`${prediction.area.toLocaleString()} Square Feet`, margin + 40, rowY + 12);

  doc.setFont("Helvetica", "bold");
  doc.text("Room Assets:", margin + 8, rowY + 18);
  doc.setFont("Helvetica", "normal");
  doc.text(`${prediction.bedrooms} Beds / ${prediction.bathrooms} Baths`, margin + 40, rowY + 18);

  // Right Column
  doc.setFont("Helvetica", "bold");
  doc.text("Floors Layout:", margin + 100, rowY);
  doc.setFont("Helvetica", "normal");
  doc.text(`${prediction.floors} level(s)`, margin + 135, rowY);

  doc.setFont("Helvetica", "bold");
  doc.text("Parking Spacings:", margin + 100, rowY + 6);
  doc.setFont("Helvetica", "normal");
  doc.text(`${prediction.parking} car slot(s)`, margin + 135, rowY + 6);

  doc.setFont("Helvetica", "bold");
  doc.text("Construction Age:", margin + 100, rowY + 12);
  doc.setFont("Helvetica", "normal");
  doc.text(`${prediction.age} Year(s)`, margin + 135, rowY + 12);

  doc.setFont("Helvetica", "bold");
  doc.text("Furnishing State:", margin + 100, rowY + 18);
  doc.setFont("Helvetica", "normal");
  doc.text(prediction.furnishing.replace("-", " ").toUpperCase(), margin + 135, rowY + 18);

  currentY += 56;

  // 4. Section: Predicted Value & Confidence (High-Contrast Hero Block)
  doc.setFillColor(245, 243, 255); // Warm violet light background (#f5f3ff)
  doc.rect(margin, currentY, contentWidth, 36, "F");
  doc.setDrawColor(124, 58, 237); // Electric Violet Border
  doc.setLineWidth(0.5);
  doc.rect(margin, currentY, contentWidth, 36, "D");

  doc.setTextColor(124, 58, 237);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.text("CORE PIPELINE MACHINE LEARNING APPRAISAL RESULT", margin + 8, currentY + 6);

  doc.setTextColor(15, 23, 42); // deep slate
  doc.setFontSize(22);
  doc.text(`$${prediction.predictedPrice.toLocaleString()}`, margin + 8, currentY + 18);

  // Add confidence badge
  doc.setFillColor(13, 148, 136); // Teal solid
  doc.rect(margin + 120, currentY + 11, 45, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`CONFIDENCE: ${(prediction.confidenceScore * 100).toFixed(0)}%`, margin + 124, currentY + 16);

  // Pricing Range min/max indicators
  doc.setTextColor(71, 85, 105); // slate-600
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Recommended Broker Price Spectrum: `, margin + 8, currentY + 28);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`$${prediction.priceRange.min.toLocaleString()} - $${prediction.priceRange.max.toLocaleString()}`, margin + 68, currentY + 28);

  currentY += 44;

  // 5. Section: Capital Appreciation Projections (Appreciation Curve Matrix)
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("5-YEAR CAPITAL APPRECIATION FORECASTS", margin, currentY);

  currentY += 2;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 6;

  // Years block projection
  const years = [
    { label: "Base Purchase (Yr 0)", value: prediction.predictedPrice, pct: "Baseline", color: [124, 58, 237] },
    { label: "Medium-Term Forecast (Yr 1)", value: prediction.futureValue1Year, pct: "+5.5% Growth", color: [59, 130, 246] },
    { label: "Compound Growth (Yr 3)", value: prediction.futureValue3Years, pct: "+17.0% Growth", color: [14, 165, 233] },
    { label: "Long-Term Security (Yr 5)", value: prediction.futureValue5Years, pct: "+30.0% Growth", color: [13, 148, 136] }
  ];

  years.forEach((yr, idx) => {
    const itemY = currentY + (idx * 16);
    
    // Light background bar for each prediction year
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, itemY, contentWidth, 12, "F");
    
    // Draw solid color square key indicator
    doc.setFillColor(yr.color[0], yr.color[1], yr.color[2]);
    doc.rect(margin + 4, itemY + 3.5, 5, 5, "F");

    // Year title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(yr.label, margin + 12, itemY + 7.5);

    // Dynamic appraisal value
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(yr.color[0], yr.color[1], yr.color[2]);
    doc.text(`$${yr.value.toLocaleString()}`, margin + 105, itemY + 7.5);

    // Percentage projection accent
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(yr.pct, margin + 145, itemY + 7.5);
  });

  currentY += 72;

  // 6. Section: Disclaimers / Quality Stamps
  doc.setFillColor(241, 245, 249); // slate-100 background
  doc.rect(margin, currentY, contentWidth, 25, "F");
  
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.text("ALGORITHMIC ESTIMATION PERFORMANCE & COMPLIANCE STAMPS", margin + 5, currentY + 5);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    "Disclaimer: This automated appraisal model estimates pricing vectors using specialized XGBoost Regression trees configured with regional market parameters. Stated pricing limits do not represent direct offers or legal structural boundaries. All walk factors use standardized metrics. Review all financial criteria with qualified investment brokers.",
    margin + 5,
    currentY + 10,
    { maxWidth: contentWidth - 10 }
  );

  // Page Footer signature lines
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(7);
  doc.text("HOUSE VALUATOR PIPELINE INC • CONFIDENTIAL REAL ESTATE REPORT", margin, currentY + 31);
  doc.text(`TRANSACTION LOG ID: #${prediction.id.toUpperCase()}`, margin + 110, currentY + 31);

  // Trigger browser download
  doc.save(`ValuationReport_${prediction.location.replace(/\s+/g, "_")}_${prediction.propertyType}.pdf`);
};

/**
 * Generates and downloads a Professional Portfolio Comparative Analysis Report for selected properties.
 */
export const generateComparisonPDF = (comparedProperties: Favorite[]) => {
  if (comparedProperties.length === 0) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const margin = 15;
  const contentWidth = 180;

  // 1. Premium Comparison Header Banner
  doc.setFillColor(30, 41, 59); // Background color (#1e293b)
  doc.rect(0, 0, 210, 38, "F");

  // Bottom Border Accent on Banner (Metallic Amber Gold)
  doc.setFillColor(245, 158, 11); // Gold accent (#f59e0b)
  doc.rect(0, 38, 210, 2, "F");

  // Brand Badge
  doc.setFillColor(13, 148, 136); // Teal Solid
  doc.rect(margin, 10, 5, 5, "F");

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PROPERTY METRICS ENGINE", margin + 8, 14);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(15);
  doc.text("PORTFOLIO COMPARATIVE REAL ESTATE BRIEF", margin, 24);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`ANALYZED ASSETS COUNT: ${comparedProperties.length} ACTIVE DECK SECTIONS`, margin, 31);
  doc.text(`EXECUTIVE DATE: ${formatReportDate()}`, 210 - margin - 75, 31);

  // 2. Executive Assessment Introduction
  let currentY = 50;
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);
  doc.text("COMPARATIVE REAL FINANCIAL PERFORMANCE", margin, currentY);

  currentY += 2;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 8;

  // 3. Grid Table Drawing (Self-contained comparative table block)
  // Col widths: Metric Title (50mm), Property 1 (43mm), Property 2 (43mm), Property 3 (43mm)
  const colWidths = [50, 43, 43, 43];
  const tableRows = [
    { label: "Comparative ID", getValue: (p: Favorite, i: number) => `Asset H-${i + 1}` },
    { label: "Listing Valuation", getValue: (p: Favorite) => `$${p.price.toLocaleString()}` },
    { label: "Capital Unit Rate", getValue: (p: Favorite) => `$${Math.round(p.price / p.area)} / sqft` },
    { label: "Net Dimensions", getValue: (p: Favorite) => `${p.area.toLocaleString()} SqFt` },
    { label: "Beds / Baths Profile", getValue: (p: Favorite) => `${p.bedrooms} Beds / ${p.bathrooms} Baths` },
    { label: "Yearly Investment ROI", getValue: (p: Favorite) => `${p.roi}% / year` },
    { label: "5-Year Potential Gain", getValue: (p: Favorite) => `+${Math.round((p.appreciation - 1) * 100)}% appreciations` },
    { label: "Suburb Location", getValue: (p: Favorite) => `${p.location}` },
    { label: "Structured Form", getValue: (p: Favorite) => `${p.propertyType.toUpperCase()}` }
  ];

  // Draw Table header
  doc.setFillColor(241, 245, 249); // Header fill slate-100
  doc.rect(margin, currentY, contentWidth, 10, "F");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.rect(margin, currentY, contentWidth, 10, "D");

  // Write header texts
  doc.setTextColor(71, 85, 105); // slate-600
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Valuation Metrics", margin + 3, currentY + 6.5);

  comparedProperties.forEach((prop, idx) => {
    const colX = margin + colWidths[0] + (idx * colWidths[1]);
    doc.setTextColor(124, 58, 237); // Purple for active columns
    doc.text(`Asset H-${idx + 1}`, colX + (colWidths[1] / 2) - 8, currentY + 6.5);
  });

  // Display gaps for empty slots if under 3 properties compared
  for (let idx = comparedProperties.length; idx < 3; idx++) {
    const colX = margin + colWidths[0] + (idx * colWidths[1]);
    doc.setTextColor(148, 163, 184); // grey
    doc.text("Empty Slot", colX + (colWidths[1] / 2) - 8, currentY + 6.5);
  }

  currentY += 10;

  // Draw data rows
  tableRows.forEach((row, rIdx) => {
    // Alternating rows fill styling
    if (rIdx % 2 === 0) {
      doc.setFillColor(248, 250, 252); // slate-50
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(margin, currentY, contentWidth, 11, "F");

    // Draw bottom border on row
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + 11, margin + contentWidth, currentY + 11);

    // Left column title label
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(row.label, margin + 3, currentY + 7);

    // Custom coloring rule for financial rows (ROI column, etc)
    const isRoiRow = row.label.includes("ROI");
    const isGainRow = row.label.includes("Gain");

    // Data elements for each property
    comparedProperties.forEach((prop, idx) => {
      const colX = margin + colWidths[0] + (idx * colWidths[1]);
      doc.setFont("Helvetica", "normal");
      
      if (isRoiRow) {
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(13, 148, 136); // Teal for high yield metrics
      } else if (isGainRow) {
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(30, 41, 59);
      } else {
        doc.setTextColor(51, 65, 85); // Slate default
      }
      
      const valStr = row.getValue(prop, idx);
      // Center text inside column
      const textWidth = doc.getTextWidth(valStr);
      const cellCenterX = colX + (colWidths[1] / 2) - (textWidth / 2);
      doc.text(valStr, cellCenterX, currentY + 7);
    });

    // Dash elements for unused slots
    for (let idx = comparedProperties.length; idx < 3; idx++) {
      const colX = margin + colWidths[0] + (idx * colWidths[1]);
      doc.setTextColor(203, 213, 225);
      const textWidth = doc.getTextWidth("-");
      const cellCenterX = colX + (colWidths[1] / 2) - (textWidth / 2);
      doc.text("-", cellCenterX, currentY + 7);
    }

    currentY += 11;
  });

  currentY += 10;

  // 4. Section: Investment Selection Intelligence Pick Card
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PORTFOLIO ENGINE INVESTMENT INSIGHT & SUGGESTION", margin, currentY);

  currentY += 2;
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 6;

  // Render suggestion recommendation box
  doc.setFillColor(245, 243, 255); // Violet overlay box (#f5f3ff)
  doc.rect(margin, currentY, contentWidth, 24, "F");
  doc.setDrawColor(124, 58, 237);
  doc.setLineWidth(0.4);
  doc.rect(margin, currentY, contentWidth, 24, "D");

  doc.setTextColor(124, 58, 237);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("SYSTEM INTELLIGENCE SUGGESTION:", margin + 5, currentY + 6);

  doc.setTextColor(51, 65, 85);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);

  let adviceString = "";
  if (comparedProperties.length > 1) {
    // Find item with highest ROI
    const bestAssetIndex = comparedProperties.indexOf(
      comparedProperties.reduce((best, current) => (current.roi > best.roi ? current : best))
    );
    const bestAsset = comparedProperties[bestAssetIndex];
    adviceString = `Based on an automated intelligence metric evaluation, the property designated as Asset H-${bestAssetIndex + 1} located in ${bestAsset.location} carries the absolute optimal investment performance indicator. It delivers an annual investment return coefficient of ${bestAsset.roi}% paired with a premium 5-year capital appreciation projection (+${Math.round((bestAsset.appreciation - 1)*100)}% accumulated growth), offering the highest leverage per dollar capitalized.`;
  } else {
    adviceString = "Comparative recommendation scoring engine requires multiple properties in active comparison lists to determine optimization vectors and coordinate ROI efficiency factors. Select 2 or 3 saved properties in your side deck.";
  }

  doc.text(adviceString, margin + 5, currentY + 11, { maxWidth: contentWidth - 10 });

  currentY += 34;

  // 5. Disclaimer notes
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, currentY, contentWidth, 18, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, 18, "D");

  doc.setTextColor(100, 116, 139);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "Disclaimer Notice: All compared variables represent dynamic mathematical model outputs and historical asset ratios mapped onto localized variables. Stated returns are simulations based on regional growth trajectories. Actual performance is subjected to external macroeconomic parameters, lending fluctuations, and structural shifts. Discuss options with a certified wealth advisor.",
    margin + 4,
    currentY + 5,
    { maxWidth: contentWidth - 8 }
  );

  // Footer metadata stamp
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("METRIC MATRIX DIVISION • ALL INTERESTS RESERVED • HOUSE APPRAISER CO®", margin, currentY + 25);
  const totalDeckValue = comparedProperties.reduce((acc, p) => acc + p.price, 0);
  doc.text(`CUMULATIVE PORTFOLIO EXPORT VALUE: $${totalDeckValue.toLocaleString()}`, margin + 98, currentY + 25);

  // Trigger download action
  doc.save(`PropertyComparativeReport_${comparedProperties.length}_Assets.pdf`);
};
