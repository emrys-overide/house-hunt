import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  Calculator,
  ExternalLink,
  Heart,
  Sparkles,
} from 'lucide-react';
import { ChatMessage, Listing } from '../types';

interface TenantConciergeViewProps {
  onSelectListing: (listingId: string) => void;
  listings: Listing[];
  onOpenLiveVoice?: () => void;
  isSaved?: (listingId: string) => boolean;
  onToggleSave?: (listingId: string) => void;
}

export const TenantConciergeView: React.FC<TenantConciergeViewProps> = ({
  onSelectListing,
  listings,
  isSaved,
  onToggleSave,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Karibu. I am your private Nairobi Residential Advisor.

I provide unbiased ground intelligence across Utawala, Benedicta, Eastern Bypass, and greater Nairobi:
• True Cost of Occupancy (TCO): Exact move-in cash requirements without surprise fees.
• Borehole & Water Schedules: Direct verification of 24/7 borehole versus municipal rationing.
• Individual KPLC Prepaid Token Verification: Ensuring zero shared electricity disputes.
• Stage Proximity & Commuter Access: Walking distances to matatu stages and peak fares.

Share your preferred budget, bedroom typology, or commute destination to begin.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isSending) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "Samahani, jaribu tena kiasi.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedListingIds: data.recommendedListingIds || [],
        tcoComparison: data.tcoComparison || [],
        groundingSources: data.groundingSources || [],
        webSearchQueries: data.webSearchQueries || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Mtandao umesumbua kidogo. Try asking about a specific estate like Complex Utawala, Benedicta, or Roysambu.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    '1-Bed under 20k near Utawala Stage with borehole water',
    'Calculate move-in TCO for a 2-bedroom in Complex Utawala',
    'Which buildings have individual KPLC token meters in Benedicta?',
    'Find 3-bedroom family houses under 40k along Eastern Bypass',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Editorial Header */}
      <div className="bg-white rounded-xl border border-[#e8e7e1] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-0.5">
            Search-Grounded Intelligence
          </span>
          <h2 className="font-editorial text-2xl font-medium text-stone-900 tracking-tight">
            Residential Advisory &amp; TCO Analysis
          </h2>
          <p className="text-xs text-stone-500">
            Real-time advisory on borehole reliability, token tariffs, and move-in cash ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Ground Intelligence Active</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-xl border border-[#e8e7e1] shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-[580px] flex flex-col overflow-hidden">
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#fafaf8]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-mono ${
                    isUser ? 'bg-stone-900 text-stone-100' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : 'S'}
                </div>

                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-stone-900 text-stone-100'
                        : 'bg-white border border-[#eceae5] text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.02)] whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Grounding Sources */}
                  {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="p-3 bg-stone-50 border border-[#eceae5] rounded-lg space-y-1 text-xs">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                        Verified Sources
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {msg.groundingSources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#e8e7e1] rounded text-[10px] text-stone-600 hover:text-stone-900 transition-colors"
                          >
                            <span className="truncate max-w-[180px]">{source.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TCO Comparison */}
                  {msg.tcoComparison && msg.tcoComparison.length > 0 && (
                    <div className="p-3 bg-stone-50 rounded-lg border border-[#eceae5] space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1">
                        <Calculator className="w-3 h-3 text-stone-400" />
                        TCO Cost Comparison
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {msg.tcoComparison.map((comp, idx) => (
                          <div key={idx} className="p-2.5 bg-white rounded-md border border-[#e8e7e1]">
                            <p className="font-medium text-stone-900">{comp.title}</p>
                            <p className="text-stone-500 font-mono text-[11px]">
                              Rent: KES {comp.rentKes.toLocaleString()} • Move-in: KES {comp.moveInCostKes.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Listing Buttons */}
                  {msg.recommendedListingIds && msg.recommendedListingIds.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {msg.recommendedListingIds.map((id) => {
                        const matched = listings.find((l) => l.id === id);
                        if (!matched) return null;
                        const saved = isSaved ? isSaved(id) : false;
                        return (
                          <div
                            key={id}
                            className="inline-flex items-center gap-1 bg-white border border-[#e8e7e1] rounded-md p-1 hover:border-stone-400 transition-colors"
                          >
                            <button
                              onClick={() => onSelectListing(id)}
                              className="px-2 py-0.5 text-stone-800 hover:text-stone-900 text-xs font-medium cursor-pointer"
                            >
                              <span>{matched.title} (KES {matched.monthlyRent.toLocaleString()})</span>
                            </button>
                            {onToggleSave && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleSave(id);
                                }}
                                className="p-1 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                              >
                                <Heart className={`w-3 h-3 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <span className="text-[10px] text-stone-400 block px-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-2.5 mr-auto items-center text-xs text-stone-500">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-pulse" />
              <span>Analyzing market ground records...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="px-4 py-2 bg-white border-t border-[#f0eee9] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-3.5 bg-white border-t border-[#eceae5]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask about houses, borehole water, KPLC meters, or TCO in Utawala, Benedicta..."
              className="flex-1 px-3 py-2 bg-stone-50 border border-[#e8e7e1] rounded-lg text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-500 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isSending}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
