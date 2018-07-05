import "./stylesheets/main.css";

// Small helpers you might want to keep
import "./helpers/context_menu.js";
import "./helpers/external_links.js";
import $ from "jquery";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'jspdf-customfonts';


import BlicdrukTombola from './helpers/tombola-generator';

document.querySelector("#app").style.display = "block";



$('.main button').on('click', (event) => {
  const numberOfBlocks = $('.main input').val();
  if (numberOfBlocks < 1 || numberOfBlocks > 1666) {
    return alert("Unesite broj od 1 do 1666");
  }
  $('.main button').html('U toku!');
  disableInput(true);
  setTimeout(() => {
    const generator = new BlicdrukTombola();
    generator.generateCustomNumberOfUniqueBlocks(numberOfBlocks).then((blocks) => {
      generatePdf(blocks);
      disableInput(false);
      $('.main button').html('Generiši');
      //  $('.save-to-pdf').css('display', 'block')
    });
  }, 0)
})



const disableInput = (value) => {
  $('.main button').prop("disabled", value);
  $('.main input').prop("disabled", value);
}

const generatePdf = (blocks) => {
  var doc = new jsPDF('p', 'mm', [85, 180]);

  //  doc.addFont('NotoSansCJKjp-Regular.ttf', 'NotoSansCJKjp', 'normal');

  blocks.forEach((block, blockKey) => {
    let position = 26.78;
    block.forEach((serie, serieKey) => {
      var columns = ["", "", "", "", "", "", "", "", ""];
      var serieNumber = blockKey * 6 + serieKey + 1;
      doc.setFontSize(6);
      doc.text(68.5, position - 1, "Broj " + ("0000" + serieNumber).slice(-4));
      var rows = [Array(9), Array(9), Array(9)];
      serie.forEach((row, rowKey) => {
        row.forEach(element => {
          var rangeDigit = Math.floor(element / 10);
          if (rangeDigit === 9) { // 80-90 belongs to same range
            rangeDigit = 8;
          }
          rows[rowKey][rangeDigit] = element;
        })
      })
      doc.autoTable(columns, rows, {
        theme: 'plain', // 'striped', 'grid' or 'plain'
        styles: {
          fontSize: 10,
          lineWidth: 0,
          cellPadding: { top: 1.50, bottom: 0.68 }, // a number, array or object (see margin below)
          //  font: "NotoSansCJKjp", // helvetica, times, courier
          // fontStyle: 'normal', // normal, bold, italic, bolditalic
          lineColor: 0,
          overflow: 'hidden', // visible, hidden, ellipsize or linebreak
          fillColor: false, // false for transparent or a color as described below
          textColor: 0,
          halign: 'center', // left, center, right
          //  valign: 'middle', // top, middle, bottom
          columnWidth: 7.7, // 'auto', 'wrap' or a number
        },
        headerStyles: {},
        bodyStyles: {},
        alternateRowStyles: {},
        columnStyles: {},

        // Properties
        startY: position, // false (indicates margin top value) or a number
        margin: 7.93, // a number, array or object
        pageBreak: 'auto', // 'auto', 'avoid' or 'always'
        tableWidth: 'auto', // 'auto', 'wrap' or a number, 
        showHeader: 'never', // 'everyPage', 'firstPage', 'never',
        //   tableLineColor: 1, // number, array (see color section below)
        //  tableLineWidth: 0.1,
      });

      position += 24;
    })
    // add new page if there are more blocks
    if (blockKey < blocks.length - 1) {
      doc.addPage();
    }
  })

  doc.save('table.pdf');


  //window.open(doc.output('bloburl'))
}