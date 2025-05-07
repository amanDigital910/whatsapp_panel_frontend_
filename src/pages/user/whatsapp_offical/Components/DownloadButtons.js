import React from 'react';
import { toast } from 'react-toastify';

const DownloadButtons = ({ dataLogs, headers }) => {
  const getFlattenedRow = (row) => {
    return headers.map(({ key }) => {
      if (key === 'submitted_failed') {
        return `Submitted: ${row.submitted || '-'} | Failed: ${row.failed || '-'}`;
      }
      return row[key] ?? '-';
    });
  };

  const copyToClipboard = () => {
    try {
      const jsonString = JSON.stringify(dataLogs, null, 2);
      console.log(jsonString);

      navigator.clipboard.writeText(jsonString)
        .then(() => {
          toast.success('Log details copied to clipboard as JSON!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    } catch (error) {
      console.error('Error converting to JSON: ', error);
      toast.error('Failed to convert data to JSON.');
    }
  };


  const convertToCSV = (rows) => {
    const csvHeaders = headers.map(h => h.label).join(',');
    const csvRows = rows.map(row => getFlattenedRow(row)
      .map(value => {
        const strValue = String(value);
        const needsTextFormat = /^\d{9,}$/.test(strValue); // 11+ digit number
        const safeValue = needsTextFormat ? `+91 ${strValue}` : strValue; // prefix with single quote
        return `"${safeValue.replace(/"/g, '""')}"`;
      })
      .join(',')
    );
    toast.success('Logs details Download in Excel');
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
          th, td { border: 1px solid #ccc; padding: 2px; text-align: left; white-space: wrap; }
          th { background-color: #f2f2f2; }
          h2 { font-family: Arial, sans-serif; }
          @media print {
            @page { size: landscape; }
            button { display: none; }
          }
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
        <script>
        window.onload = function() {
          window.print();
          setTimeout(() => window.close(), 1000);
        };
      </script>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};


  return (
    <div className='flex gap-4 md:justify-start justify-around'>
      <button className='px-3 py-1 text-base font-medium border-2 border-[#0d6efd] text-[#0d6efd] rounded-md hover:text-white hover:bg-[#0d6efd]' onClick={copyToClipboard}>
        Copy
      </button>
      <button className='px-3 py-1 text-base font-medium border-2 border-[#dc3545] text-[#dc3545] rounded-md hover:text-white hover:bg-[#dc3545]' onClick={downloadCSV}>
        CSV
      </button>
      <button className='px-3 py-1 text-base font-medium border-2 border-[#198754] text-[#198754] rounded-md hover:text-white hover:bg-[#198754]' onClick={downloadPDF}>
        PDF
      </button>
    </div>
  );
};

export default DownloadButtons;
