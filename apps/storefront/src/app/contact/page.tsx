'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#C9A34A]">
            We&apos;re Here To Assist You
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#191714]">
            Contact Rangoli Fashions
          </h1>
          <p className="text-xs sm:text-sm text-[#746D62] max-w-lg mx-auto">
            Have questions regarding sizing, customizations, bulk orders or delivery? Reach out to our dedicated concierge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Store Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#FFF8ED] border border-[#C9A34A]/50 flex items-center justify-center shrink-0 text-[#003D2D]">
                <MapPin size={20} />
              </div>
              <div className="text-xs space-y-1">
                <h3 className="font-serif text-sm font-semibold text-[#191714]">Boutique &amp; Store Address</h3>
                <p className="text-[#746D62] leading-relaxed">
                  42, Silk Heritage Lane, Fashion District, Jaipur, Rajasthan, 302001, India
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#FFF8ED] border border-[#C9A34A]/50 flex items-center justify-center shrink-0 text-[#003D2D]">
                <Phone size={20} />
              </div>
              <div className="text-xs space-y-1">
                <h3 className="font-serif text-sm font-semibold text-[#191714]">Phone &amp; WhatsApp Support</h3>
                <p className="text-[#746D62]">+91 98765 43210</p>
                <p className="text-[#746D62] text-[11px]">Instant WhatsApp support for orders and styling assistance</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#FFF8ED] border border-[#C9A34A]/50 flex items-center justify-center shrink-0 text-[#003D2D]">
                <Mail size={20} />
              </div>
              <div className="text-xs space-y-1">
                <h3 className="font-serif text-sm font-semibold text-[#191714]">Email Concierge</h3>
                <p className="text-[#746D62]">support@rangolifashions.com</p>
                <p className="text-[#746D62] text-[11px]">We respond to all inquiries within 24 hours</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E8DFD0] shadow-xs flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#FFF8ED] border border-[#C9A34A]/50 flex items-center justify-center shrink-0 text-[#003D2D]">
                <Clock size={20} />
              </div>
              <div className="text-xs space-y-1">
                <h3 className="font-serif text-sm font-semibold text-[#191714]">Business Hours</h3>
                <p className="text-[#746D62]">Monday – Saturday: 10:00 AM – 8:00 PM IST</p>
                <p className="text-[#746D62]">Sunday: 11:00 AM – 6:00 PM IST</p>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-xl border border-[#E8DFD0] shadow-md">
              <h2 className="font-serif text-xl font-semibold text-[#191714] mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-[#746D62] mb-6">
                Fill out the form below and our customer experience team will get back to you promptly.
              </p>

              {sent ? (
                <div className="p-6 bg-[#FFF8ED] border border-[#C9A34A] rounded-xl text-center space-y-2">
                  <h3 className="font-serif text-lg font-bold text-[#003D2D]">Message Received</h3>
                  <p className="text-xs text-[#746D62]">
                    Thank you, {name}! Our team has received your inquiry and will reach out to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#746D62] mb-1 font-medium">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#746D62] mb-1 font-medium">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#746D62] mb-1 font-medium">Subject *</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Order inquiry, Sizing question"
                      className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#746D62] mb-1 font-medium">Message *</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full border border-[#E8DFD0] rounded-md p-2.5 text-[#191714] focus:outline-none focus:border-[#003D2D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#003D2D] text-[#FFF8ED] hover:bg-[#0B5940] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
                  >
                    <span>Send Message</span>
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
