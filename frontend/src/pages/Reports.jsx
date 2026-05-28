import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, FileSpreadsheet, CheckCircle2, PieChart, Activity, ShieldCheck, Table2, Clock3, ArrowUpRight } from 'lucide-react';
import { reportService } from '../services';
import { GlassCard, Button } from '../components/UI';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export default function Reports() {
  const [loading, setLoading] = useState(false);

  const reportHighlights = [
    {
      icon: PieChart,
      title: 'Portfolio Summary PDF',
      points: ['Total investment vs current value', 'Profit / loss snapshot', 'Asset allocation and current holdings', 'User details and generation time'],
      accent: '#6366F1',
    },
    {
      icon: Table2,
      title: 'Transaction History Excel',
      points: ['Buy, sell, and update transactions', 'Export-friendly table format', 'Useful for taxes and accounting', 'Easy to filter, sort, and archive'],
      accent: '#22C55E',
    },
    {
      icon: ShieldCheck,
      title: 'Why these reports help',
      points: ['Quick performance review', 'Clear record of all activity', 'Better decision-making before rebalancing', 'Simple sharing with advisors or accountants'],
      accent: '#8B5CF6',
    },
  ];

  const pdfIncludes = [
    'Generated date and user identity',
    'Total investment, current value, and profit/loss',
    'Portfolio assets with quantity and current value',
    'Readable summary for quick review',
  ];

  const excelIncludes = [
    'All transaction rows in spreadsheet format',
    'Buy / sell / update activity details',
    'Use it for filtering, auditing, and tax work',
    'Easy to import into other tools',
  ];

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
    <div className="content-area" style={{ maxWidth: 1280, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} style={{ marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.14)', color: '#6366F1', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
          <ArrowUpRight size={14} /> Export center
        </div>
        <h1 className="section-title">Reports</h1>
        <p className="section-subtitle">Export your portfolio data and transaction history. Each report shows exactly what is inside before you download it.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        {reportHighlights.map((item) => (
          <GlassCard key={item.title} hover={false} style={{ padding: 22 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${item.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.accent, marginBottom: 16 }}>
              <item.icon size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{item.title}</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {item.points.map((point) => (
                <div key={point} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                  <CheckCircle2 size={16} color={item.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        <GlassCard hover={false} style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#6366F1' }}>
            <FileText size={32} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Portfolio Summary PDF</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>A clean report that gives you a quick picture of your portfolio health, current holdings, and total performance.</p>
          <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
            {pdfIncludes.map((item) => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                <CheckCircle2 size={16} color="#6366F1" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, color: 'var(--text-muted)', fontSize: 13 }}>
            <Clock3 size={14} /> Best for monthly review and sharing with advisors
          </div>
          <Button onClick={downloadPDF} loading={loading} style={{ width: '100%' }}>
            <Download size={16} style={{ display: 'inline', marginRight: 8 }} />
            Download PDF
          </Button>
        </GlassCard>

        <GlassCard hover={false} style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#22C55E' }}>
            <FileSpreadsheet size={32} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Transaction History Excel</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>A spreadsheet export of your activity log for accounting, tax filing, filtering, and record keeping.</p>
          <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
            {excelIncludes.map((item) => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                <CheckCircle2 size={16} color="#22C55E" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, color: 'var(--text-muted)', fontSize: 13 }}>
            <Activity size={14} /> Best for audits, tax work, and quick sorting
          </div>
          <Button variant="secondary" onClick={downloadExcel} loading={loading} style={{ width: '100%' }}>
            <Download size={16} style={{ display: 'inline', marginRight: 8 }} />
            Download Excel
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
