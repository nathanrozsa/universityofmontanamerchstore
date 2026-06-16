'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const CSS = `
#griz-chatbot-widget {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#griz-toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5a0000, #7a1010);
  border: 2px solid #c9a84c;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 18px rgba(90,0,0,0.45);
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  padding: 0;
}

#griz-toggle-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(90,0,0,0.55);
}

.griz-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: #c9a84c;
  color: #5a0000;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  line-height: 1;
}

#griz-chat-window {
  position: absolute;
  bottom: 76px;
  right: 0;
  width: 340px;
  max-height: 520px;
  background: #fdf8f0;
  border: 2px solid #c9a84c;
  border-radius: 16px;
  box-shadow: 0 8px 36px rgba(90,0,0,0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: grizSlideIn 0.22s ease;
}

@keyframes grizSlideIn {
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)  scale(1);    }
}

.griz-header {
  background: linear-gradient(135deg, #5a0000, #7a1010);
  padding: 13px 15px;
  display: flex;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;
}

.griz-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c9a84c, #e8c96a);
  border: 2px solid rgba(255,255,255,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21px;
  flex-shrink: 0;
}

.griz-header-info { flex: 1; min-width: 0; }

.griz-header-name {
  color: #fff;
  font-weight: 700;
  font-size: 14.5px;
  line-height: 1.25;
}

.griz-header-sub {
  color: rgba(255,255,255,0.62);
  font-size: 11px;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.griz-close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(201,168,76,0.2);
  border: 1.5px solid #c9a84c;
  color: #c9a84c;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
  transition: background 0.15s;
  flex-shrink: 0;
  padding: 0;
}

.griz-close-btn:hover { background: rgba(201,168,76,0.38); }

.griz-messages {
  flex: 1;
  overflow-y: auto;
  padding: 13px 11px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  max-height: 286px;
}

.griz-messages::-webkit-scrollbar { width: 4px; }
.griz-messages::-webkit-scrollbar-track { background: transparent; }
.griz-messages::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.35); border-radius: 4px; }

.griz-msg { display: flex; max-width: 86%; }
.griz-msg.bot  { align-self: flex-start; }
.griz-msg.user { align-self: flex-end; }

.griz-bubble {
  padding: 9px 13px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.55;
  word-break: break-word;
}

.griz-msg.bot .griz-bubble {
  background: #fff;
  border: 1.5px solid #c9a84c;
  color: #2d1a00;
  border-bottom-left-radius: 4px;
}

.griz-msg.user .griz-bubble {
  background: linear-gradient(135deg, #5a0000, #7a1010);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.griz-msg.bot .griz-bubble a {
  color: #5a0000;
  font-weight: 600;
  text-decoration: underline;
}

.griz-typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 14px;
  background: #fff;
  border: 1.5px solid #c9a84c;
  border-radius: 14px;
  border-bottom-left-radius: 4px;
  align-self: flex-start;
}

.griz-dot {
  width: 7px;
  height: 7px;
  background: #c9a84c;
  border-radius: 50%;
  animation: grizBounce 1.2s infinite ease-in-out;
}
.griz-dot:nth-child(2) { animation-delay: 0.2s; }
.griz-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes grizBounce {
  0%, 60%, 100% { transform: translateY(0);   opacity: 0.35; }
  30%            { transform: translateY(-6px); opacity: 1;    }
}

.griz-chips {
  padding: 8px 11px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  border-top: 1px solid rgba(201,168,76,0.25);
  flex-shrink: 0;
  background: #fdf8f0;
}

.griz-chip {
  padding: 5px 11px;
  border-radius: 20px;
  border: 1.5px solid #c9a84c;
  background: #fff;
  color: #5a0000;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  font-family: inherit;
}

.griz-chip:hover:not(:disabled) { background: #5a0000; color: #c9a84c; }
.griz-chip:disabled { opacity: 0.5; cursor: not-allowed; }

.griz-input-row {
  padding: 9px 11px;
  display: flex;
  gap: 8px;
  align-items: center;
  border-top: 1px solid rgba(201,168,76,0.25);
  flex-shrink: 0;
  background: #fdf8f0;
}

.griz-input {
  flex: 1;
  padding: 9px 14px;
  border-radius: 20px;
  border: 1.5px solid #c9a84c;
  background: #fff;
  font-size: 13.5px;
  color: #2d1a00;
  outline: none;
  font-family: inherit;
  min-width: 0;
}

.griz-input:focus   { border-color: #5a0000; }
.griz-input::placeholder { color: #b5a897; }

.griz-send-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5a0000, #7a1010);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.15s, opacity 0.15s;
  padding: 0;
}

.griz-send-btn:hover:not(:disabled) { transform: scale(1.1); }
.griz-send-btn:disabled { opacity: 0.45; cursor: not-allowed; }
`;

interface Message {
  role: 'bot' | 'user';
  text: string;
  isHtml?: boolean;
}

function escapeHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function getBotReply(input: string): string {
  const t = input.toLowerCase();

  if (/\b(hi|hello|hey|howdy|sup|good\s+morning|good\s+afternoon|good\s+evening)\b/.test(t))
    return `Hey there! 👋 Welcome to the <b>University of Montana Merch Store</b>! I'm Griz Assistant. How can I help you find the perfect Grizzly gear today?`;

  if (/\b(thanks?|thank\s+you|thx|ty|appreciate)\b/.test(t))
    return `You're so welcome! 🐻 Is there anything else I can help you with? <b>Go Griz!</b>`;

  if (/hoodie|sweatshirt|pullover/.test(t))
    return `Our most popular hoodie is the <b>Montana Script Hoodie</b> — currently <b>15% off at $54.99</b>! It's officially licensed and available in XS–3XL. We recommend <b>sizing up</b> for a relaxed fit. <a href="/shop/montana-script-hoodie">Shop it here →</a>`;

  if (/t[\s-]?shirt|tee\b|graphic\s+shirt/.test(t))
    return `Check out the <b>Grizzlies Classic Tee</b> for just <b>$29.99</b>! A fan favorite — officially licensed, available in XS–3XL, and it runs true to size. <a href="/shop">Browse tees →</a>`;

  if (/water[\s-]?bottle|bottle|drinkware|tumbler/.test(t))
    return `We carry the <b>Grizzlies Water Bottle</b> — a great way to rep the Griz on the go! Check it out in our store. <a href="/shop">Shop now →</a>`;

  if (/accessori|hat|cap|bag|keychain|pin|magnet/.test(t))
    return `We have a wide selection of officially licensed <b>Griz accessories</b> — hats, bags, keychains, and more. <a href="/shop">Browse accessories →</a>`;

  if (/ship|deliver|delivery|how\s+long|arrival|when\s+will/.test(t))
    return `We offer <b>free shipping on orders over $75!</b> Standard delivery takes <b>3–5 business days</b>. Expedited shipping is available at checkout.`;

  if (/return|refund|exchange|send\s+back/.test(t))
    return `We have a hassle-free <b>30-day return policy</b>. Not satisfied? Just contact us and we'll make it right — no questions asked!`;

  if (/track|order\s+status|where\s+is\s+my|tracking\s+number/.test(t))
    return `To track your order, check your confirmation email for a tracking link. You can also <a href="/sign-in">sign in to your account</a> to view your full order history.`;

  if (/sale|discount|promo|deal|\d+%\s*off|coupon/.test(t))
    return `🎉 Right now the <b>Montana Script Hoodie</b> is <b>15% off</b> — only <b>$54.99!</b> <a href="/shop/montana-script-hoodie">Grab it before it's gone →</a>`;

  if (/size|sizing|fit|measurement|\bxs\b|\bsm\b|\bmed\b|\blarge\b|\bxl\b|\b2xl\b|\b3xl\b/.test(t))
    return `Our apparel runs in sizes <b>XS through 3XL</b>. For hoodies and sweatshirts, we recommend <b>sizing up one</b> for a relaxed fit. T-shirts and polos run true to size.`;

  if (/licens|official|authentic|genuine|real/.test(t))
    return `Every item in our store is <b>100% officially licensed</b> University of Montana merchandise. Shop with confidence — all gear is authentic Grizzly Nation! 🐻`;

  if (/price|cost|how\s+much|cheap|afford|expensive/.test(t))
    return `Our prices range from <b>~$12 for accessories</b> to <b>$65+ for premium apparel</b>. The <b>Grizzlies Classic Tee</b> starts at $29.99 and the <b>Montana Script Hoodie</b> is on sale for $54.99. <a href="/shop">Browse all →</a>`;

  if (/contact|email|phone|support|help|reach/.test(t))
    return `Need help from our team? Visit our <a href="/contact">Contact page</a> and we'll get back to you as soon as possible. <b>Go Griz!</b> 🐻`;

  return `Go Griz! 🐻 I'm not sure about that one, but I'm always happy to help. Try browsing the <a href="/shop">full store</a> or visit our <a href="/contact">contact page</a> to reach our team directly.`;
}

const QUICK_REPLIES = ['Browse hoodies', 'Track my order', 'Shipping info', 'Return policy'];

const WELCOME: Message = {
  role: 'bot',
  isHtml: true,
  text: `Hi there! 🐻 I'm <b>Griz Assistant</b>, your University of Montana Merch Store helper. Ask me about products, shipping, returns, or anything Griz!`,
};

export default function GrizChatbot() {
  const [isOpen, setIsOpen]       = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [messages, setMessages]   = useState<Message[]>([WELCOME]);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.getElementById('griz-chatbot-styles')) return;
    const style = document.createElement('style');
    style.id = 'griz-chatbot-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const open = () => {
    setIsOpen(true);
    if (showBadge) setShowBadge(false);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const toggle = () => (isOpen ? setIsOpen(false) : open());

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: getBotReply(trimmed), isHtml: true }]);
    }, 900);
  }, [isTyping]);

  return (
    <div id="griz-chatbot-widget">
      {isOpen && (
        <div id="griz-chat-window">
          {/* Header */}
          <div className="griz-header">
            <div className="griz-avatar">🐻</div>
            <div className="griz-header-info">
              <div className="griz-header-name">Griz Assistant</div>
              <div className="griz-header-sub">University of Montana Merch Store</div>
            </div>
            <button className="griz-close-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="griz-messages">
            {messages.map((msg, i) =>
              msg.isHtml ? (
                <div key={i} className={`griz-msg ${msg.role}`}>
                  <div className="griz-bubble" dangerouslySetInnerHTML={{ __html: msg.text }} />
                </div>
              ) : (
                <div key={i} className={`griz-msg ${msg.role}`}>
                  <div className="griz-bubble">{msg.text}</div>
                </div>
              )
            )}
            {isTyping && (
              <div className="griz-typing">
                <span className="griz-dot" />
                <span className="griz-dot" />
                <span className="griz-dot" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick-reply chips */}
          <div className="griz-chips">
            {QUICK_REPLIES.map(chip => (
              <button
                key={chip}
                className="griz-chip"
                onClick={() => send(chip)}
                disabled={isTyping}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div className="griz-input-row">
            <input
              ref={inputRef}
              className="griz-input"
              placeholder="Ask me anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              disabled={isTyping}
            />
            <button
              className="griz-send-btn"
              onClick={() => send(input)}
              disabled={isTyping || !input.trim()}
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button id="griz-toggle-btn" onClick={toggle} aria-label="Toggle Griz Assistant">
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {showBadge && !isOpen && <span className="griz-badge">1</span>}
      </button>
    </div>
  );
}
