import { useState } from 'react';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { reportService } from '../services';
import { GlassCard, Button } from '../components/UI';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export default function Reports() {
  const [loading, setLoading] = useState(false);

  const downloadPDF = async () => {
    try {
      setLoading(true);
      const res = await reportService.portfolio();
      const data = res.data.data;
      
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Portfolio Report', 14, 22);
      
      doc.setFontSize(12);
      doc.text(`Generated: ${data.generated_at}`, 14, 32);
      doc.text(`User: ${data.user.name} (${data.user.email})`, 14, 40);
      
      doc.setFontSize(14);
      doc.text('Summary', 14, 55);
      doc.setFontSize(10);
      doc.text(`Total Investment: INR ${data.summary.total_investment}`, 14, 65);
      doc.text(`Total Value: INR ${data.summary.total_value}`, 14, 72);
      doc.text(`Profit/Loss: INR ${data.summary.total_profit_loss}`, 14, 79);
      
      doc.setFontSize(14);
      doc.text('Assets', 14, 95);
      let y = 105;
      data.portfolios.forEach((p, i) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(10);
        doc.text(`${i + 1}. ${p.asset_name} (${p.asset_type}) - Qty: ${p.quantity} | Value: INR ${p.current_value}`, 14, y);
        y += 8;
      });
      
      doc.save('Smart_Portfolio_Report.pdf');
      toast.success('PDF downloaded');
    } catch (err) {
      toast.error('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    try {
      setLoading(true);
      const res = await reportService.transactions();
      const data = res.data.data.transactions;
      
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      
      XLSX.writeFile(wb, "Smart_Portfolio_Transactions.xlsx");
      toast.success('Excel downloaded');
    } catch (err) {
      toast.error('Failed to generate Excel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area">
      <h1 className="section-title">Reports</h1>
      <p className="section-subtitle">Export your portfolio data and transaction history</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 32 }}>
        <GlassCard hover={false} style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#6366F1' }}>
            <FileText size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Portfolio Summary</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Detailed PDF report containing your asset allocation, current values, and overall performance.</p>
          <Button onClick={downloadPDF} loading={loading} style={{ width: '100%' }}>
            <Download size={16} style={{ display: 'inline', marginRight: 8 }} />
            Download PDF
          </Button>
        </GlassCard>

        <GlassCard hover={false} style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#22C55E' }}>
            <FileSpreadsheet size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Transaction History</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Raw Excel export of all your buy, sell, and update transactions for tax and accounting purposes.</p>
          <Button variant="secondary" onClick={downloadExcel} loading={loading} style={{ width: '100%' }}>
            <Download size={16} style={{ display: 'inline', marginRight: 8 }} />
            Download Excel
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
