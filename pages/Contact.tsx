
import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle, MessageCircle } from 'lucide-react';

const CONTACT_CHANNELS = [
  {
    title: 'Call Center',
    detail: '+84 909 123 456',
    helper: 'Mon-Sat, 8:00 - 21:00',
    href: 'tel:+84909123456',
    icon: Phone
  },
  {
    title: 'Email Support',
    detail: 'support@luminashop.com',
    helper: 'Response within 24 hours',
    href: 'mailto:support@luminashop.com',
    icon: Mail
  },
  {
    title: 'Zalo Chat',
    detail: 'zalo.me/0909123456',
    helper: 'Fast consultation for product and order questions',
    href: 'https://zalo.me/0909123456',
    icon: MessageCircle
  }
];

const QUICK_ACTIONS = [
  { label: 'Open Messenger', href: 'https://m.me/luminashop.vn' },
  { label: 'Go to Zalo', href: 'https://zalo.me/0909123456' },
  { label: 'Send Email', href: 'mailto:sales@luminashop.com' }
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!formData.name || !formData.email || !formData.message) return;

      setStatus('SENDING');
      
      // Simulate Server Email Delay (Action -> Server Mail)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`[Mail Server] Contact Form Submitted by ${formData.email}`);
      console.log(`[Mail Server] Forwarding to admin@luminashop.com: ${formData.message}`);
      
      setStatus('SUCCESS');
      setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-surface min-h-screen">
      <div className="relative bg-slate-900 h-[300px] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
         <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-slate-300 max-w-xl mx-auto text-lg">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
         </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 -mt-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Info Cards */}
              <div className="lg:col-span-1 space-y-4">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
                      <div className="p-3 bg-blue-50 text-primary rounded-lg">
                          <MapPin className="size-6" />
                      </div>
                      <div>
                          <h3 className="font-bold text-slate-900 mb-1">Office & Showroom</h3>
                          <p className="text-slate-500 text-sm">25 Nguyen Hue, District 1<br/>Ho Chi Minh City, Vietnam</p>
                      </div>
                  </div>
                  {CONTACT_CHANNELS.map(channel => {
                      const Icon = channel.icon;

                      return (
                        <a
                          key={channel.title}
                          href={channel.href}
                          target={channel.href.startsWith('http') ? '_blank' : undefined}
                          rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4 hover:border-primary hover:shadow-md transition-all"
                        >
                            <div className="p-3 bg-blue-50 text-primary rounded-lg">
                                <Icon className="size-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">{channel.title}</h3>
                                <p className="text-slate-600 text-sm font-semibold">{channel.detail}</p>
                                <p className="text-slate-500 text-sm mt-1">{channel.helper}</p>
                            </div>
                        </a>
                      );
                  })}

                  <div className="bg-slate-900 text-white p-6 rounded-xl shadow-sm border border-slate-900">
                      <h3 className="font-bold mb-3">Quick Support</h3>
                      <p className="text-sm text-slate-200 mb-4">
                        Need a faster answer? Use one of our direct channels below.
                      </p>
                      <div className="flex flex-col gap-2">
                        {QUICK_ACTIONS.map(action => (
                          <a
                            key={action.label}
                            href={action.href}
                            target={action.href.startsWith('http') ? '_blank' : undefined}
                            rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
                            className="inline-flex items-center justify-center rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20 transition-colors"
                          >
                            {action.label}
                          </a>
                        ))}
                      </div>
                  </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                  <div className="mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
                      <p className="text-slate-500">Fill out the form below and our team will get back to you.</p>
                  </div>

                  {status === 'SUCCESS' ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500">
                          <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                              <CheckCircle className="size-8" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                          <p className="text-slate-500 mb-6">Thank you for contacting us. We will reply to your email shortly.</p>
                          <button onClick={() => setStatus('IDLE')} className="text-primary font-bold hover:underline">Send another message</button>
                      </div>
                  ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <label className="text-sm font-bold text-slate-700">Your Name</label>
                                  <input 
                                      type="text" 
                                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                                      placeholder="John Doe"
                                      value={formData.name}
                                      onChange={e => setFormData({...formData, name: e.target.value})}
                                      required
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                                  <input 
                                      type="email" 
                                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                                      placeholder="john@example.com"
                                      value={formData.email}
                                      onChange={e => setFormData({...formData, email: e.target.value})}
                                      required
                                  />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700">Subject</label>
                              <input 
                                  type="text" 
                                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                                  placeholder="How can we help?"
                                  value={formData.subject}
                                  onChange={e => setFormData({...formData, subject: e.target.value})}
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700">Message</label>
                              <textarea 
                                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all h-32 resize-none" 
                                  placeholder="Write your message here..."
                                  value={formData.message}
                                  onChange={e => setFormData({...formData, message: e.target.value})}
                                  required
                              ></textarea>
                          </div>
                          
                          <button 
                              type="submit" 
                              disabled={status === 'SENDING'}
                              className="bg-primary hover:bg-blue-600 text-white font-bold py-3.5 px-8 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                          >
                              {status === 'SENDING' ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                              {status === 'SENDING' ? 'Sending...' : 'Send Message'}
                          </button>
                      </form>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default Contact;
