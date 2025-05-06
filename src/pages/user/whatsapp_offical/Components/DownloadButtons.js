import React from 'react';

const DownloadButtons = ({ dataLogs, headers }) => {
  const getFlattenedRow = (row) => {
    return headers.map(({ key }) => {
      if (key === 'submitted_failed') {
        return `Submitted: ${row.submitted || '-'} | Failed: ${row.failed || '-'}`;
      }
      return row[key] ?? '-';
    });
  };

  const convertToCSV = (rows) => {
    const csvHeaders = headers.map(h => h.label).join(',');
    const csvRows = rows.map(row => getFlattenedRow(row)
      .map(value => {
        const strValue = String(value);
        const needsTextFormat = /^\d{9,}$/.test(strValue); // 11+ digit number
        const safeValue = needsTextFormat ? `+91${strValue}` : strValue; // prefix with single quote
        return `"${safeValue.replace(/"/g, '""')}"`;
      })
      .join(',')
    );
    return [csvHeaders, ...csvRows].join('\r\n');
  };

  const downloadCSV = () => {
    const csv = convertToCSV(dataLogs);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'data.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const htmlContent = `
      <html>
      <head>
        <title>Download PDF</title>
        <style>
          table { width: 100%; border-collapse: collapse; font-family: monospace; font-size: 11px; }
          th, td { border: 1px solid #ccc; padding: 4px; text-align: left; white-space: nowrap; }
          th { background-color: #f2f2f2; }
          h2 { font-family: Arial, sans-serif; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h2>Exported Logs</h2>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h.label}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${dataLogs.map(log => `
              <tr>
                ${getFlattenedRow(log).map(val => `<td>${val}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <button onclick="window.print();">Print / Save as PDF</button>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className='flex gap-4 md:justify-start justify-around'>
      <button className='px-3 py-1 border border-black rounded-xl' onClick={downloadCSV}>
        CSV
      </button>
      <button className='px-3 py-1 border border-black rounded-xl' onClick={downloadPDF}>
        PDF
      </button>
    </div>
  );
};

export default DownloadButtons;
