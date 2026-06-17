'use client';
import { MessageCircle, MessageSquare, Mail, Globe, Share2 } from 'lucide-react';

export default function SupportedSources() {
  const sources = [
    { icon: MessageCircle, label: 'WhatsApp Chats' },
    { icon: MessageSquare, label: 'SMS Messages' },
    { icon: Mail, label: 'Emails' },
    { icon: Globe, label: 'Websites' },
    { icon: Share2, label: 'Social Media Messages' },
  ];

  return (
    <div className="supported-sources">
      <h3>We analyze screenshots from</h3>
      <div className="sources-grid">
        {sources.map((source, index) => (
          <div key={index} className="source-item">
            <source.icon size={20} />
            <span>{source.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
