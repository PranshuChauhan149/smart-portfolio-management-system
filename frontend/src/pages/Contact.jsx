import { useState } from 'react';
import { motion } from 'framer-motion';
import { InputField, Button, GlassCard } from '../components/UI';
import { contactService } from '../services';
import toast from 'react-hot-toast';

export default function Contact() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactService.submit(contactForm);
      toast.success('Message sent successfully! We will get back to you soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '80px 20px', position: 'relative', zIndex: 1, minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', width: '100%' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 40px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Contact Us</h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>Have questions? We'd love to hear from you. Send us a message below.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard hover={false} style={{ padding: 40 }}>
            <form onSubmit={handleContactSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <InputField 
                  label="Name" 
                  value={contactForm.name} 
                  onChange={e => setContactForm({...contactForm, name: e.target.value})} 
                  required 
                  placeholder="John Doe"
                />
                <InputField 
                  label="Email" 
                  type="email" 
                  value={contactForm.email} 
                  onChange={e => setContactForm({...contactForm, email: e.target.value})} 
                  required 
                  placeholder="john@example.com"
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <InputField 
                  label="Subject" 
                  value={contactForm.subject} 
                  onChange={e => setContactForm({...contactForm, subject: e.target.value})} 
                  placeholder="How can we help you?"
                />
              </div>
              <div style={{ marginTop: 16, marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Message</label>
                <textarea 
                  required
                  value={contactForm.message} 
                  onChange={e => setContactForm({...contactForm, message: e.target.value})} 
                  className="input-field" 
                  style={{ minHeight: 150, resize: 'vertical' }} 
                  placeholder="Enter your message here..."
                />
              </div>
              <Button type="submit" loading={loading} style={{ width: '100%', padding: '14px', fontSize: 16 }}>Send Message</Button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
