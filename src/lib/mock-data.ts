// MOCK DATA — all scenarios are fictional. No real brands, no real URLs, no
// real email addresses. Nothing in this file ever hits the network; every
// "phishing attack" shown in the app is rendered from these static values.

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Category = "email" | "sms" | "url" | "social";

export interface RedFlag { id: string; label: string; explanation: string; }

export interface Scenario {
  id: string;
  category: Category;
  difficulty: Difficulty;
  isPhishing: boolean;
  title: string;
  points: number;
  sender?: { name: string; email: string };
  subject?: string;
  bodyHtml?: string;
  attachments?: { name: string; suspicious: boolean }[];
  smsFrom?: string;
  smsBody?: string;
  fakeUrl?: string;
  siteHtml?: string;
  redFlags: RedFlag[];
  legitReason?: string;
}

export const scenarios: Scenario[] = [
  { id: "email-1", category: "email", difficulty: "Beginner", isPhishing: true, points: 10,
    title: "NovaBank account locked",
    sender: { name: "NovaBank Security", email: "secure-alerts@novabank-verify.co" },
    subject: "URGENT: Your account will be locked in 24 hours",
    bodyHtml: `<p>Dear Customer,</p><p>We detected <b>unusual activity</b> on your account. To avoid permanent suspension you MUST verify within 24 hours.</p><p><a data-flag="link" href="#">Click here to verify now</a></p><p>Failure to act will result in account closure.</p><p>NovaBank Security Team</p>`,
    redFlags: [
      { id: "sender", label: "Suspicious sender domain", explanation: "The real bank would use @novabank.com, not novabank-verify.co." },
      { id: "urgency", label: "Urgency / fear tactics", explanation: "'24 hours' and 'permanent suspension' pressure you to act fast." },
      { id: "link", label: "Deceptive link", explanation: "The link points to an unrelated domain." },
      { id: "greeting", label: "Generic greeting", explanation: "'Dear Customer' — a real bank uses your name." },
    ] },
  { id: "email-2", category: "email", difficulty: "Beginner", isPhishing: false, points: 8,
    title: "Cloudify invoice #4482",
    sender: { name: "Cloudify Billing", email: "billing@cloudify.com" },
    subject: "Your monthly invoice is ready",
    bodyHtml: `<p>Hi Jordan,</p><p>Your invoice for October is available in your Cloudify dashboard. Payment processes automatically on the 3rd.</p><p>Sign in from your bookmark to view details.</p><p>— The Cloudify team</p>`,
    redFlags: [],
    legitReason: "Matching sender domain, no urgency, no credential prompt, and it tells you to sign in from your bookmark." },
  { id: "email-3", category: "email", difficulty: "Intermediate", isPhishing: true, points: 15,
    title: "ShopEase refund pending",
    sender: { name: "ShopEase Support", email: "support@shopease-refunds.net" },
    subject: "Refund of $248.99 is pending your confirmation",
    bodyHtml: `<p>Hello,</p><p>You have a pending refund of <b>$248.99</b>. To recieve your refund please confirm your card details:</p><p><a data-flag="link" href="#">Claim your refund →</a></p>`,
    attachments: [{ name: "refund_form.html", suspicious: true }],
    redFlags: [
      { id: "sender", label: "Lookalike domain", explanation: "shopease-refunds.net is not shopease.com." },
      { id: "spelling", label: "Spelling mistake", explanation: "'recieve' is misspelled — real teams proofread." },
      { id: "link", label: "Credential harvesting link", explanation: "Refunds never require re-entering full card details." },
      { id: "attachment", label: "Dangerous HTML attachment", explanation: "HTML attachments host fake login pages locally." },
    ] },
  { id: "email-4", category: "email", difficulty: "Intermediate", isPhishing: true, points: 15,
    title: "IT Helpdesk — password expires today",
    sender: { name: "IT Helpdesk", email: "helpdesk@it-support-portal.info" },
    subject: "Action required: password expires in 2 hours",
    bodyHtml: `<p>Team,</p><p>Your password expires today. Keep the same password at the portal below.</p><p><a data-flag="link" href="#">Keep my password</a></p>`,
    redFlags: [
      { id: "sender", label: "External sender posing as IT", explanation: "Internal IT sends from an internal domain." },
      { id: "urgency", label: "Short deadline", explanation: "'2 hours' bypasses critical thinking." },
      { id: "link", label: "Fake credential portal", explanation: "IT never emails you a link to keep your password." },
    ] },
  { id: "email-5", category: "email", difficulty: "Beginner", isPhishing: false, points: 8,
    title: "Team offsite recap",
    sender: { name: "Priya Menon", email: "priya.menon@yourcompany.example" },
    subject: "Photos from the offsite",
    bodyHtml: `<p>Hey all,</p><p>Thanks for a great two days. Photos are in the shared drive under 'Team/Offsite-2025'.</p><p>Cheers,<br/>Priya</p>`,
    redFlags: [],
    legitReason: "Known colleague, internal domain, no external links or credential prompts." },
  { id: "email-6", category: "email", difficulty: "Advanced", isPhishing: true, points: 25,
    title: "CEO wire request",
    sender: { name: "Alex Rowe (CEO)", email: "alex.rowe@yourcompаny.example" },
    subject: "Quick favor — need this handled discreetly",
    bodyHtml: `<p>Are you at your desk? I need you to process a wire to a new vendor before end of day. Don't loop in finance yet — I'll explain later. Reply and I'll send details.</p><p>Sent from my iPhone</p>`,
    redFlags: [
      { id: "sender", label: "Homograph in domain", explanation: "The 'а' in yourcompаny is Cyrillic, not Latin 'a'." },
      { id: "urgency", label: "Executive urgency + secrecy", explanation: "'Don't loop in finance' is a classic BEC tactic." },
      { id: "process", label: "Bypasses controls", explanation: "Legitimate wires always follow the approval process." },
    ] },
  { id: "email-7", category: "email", difficulty: "Intermediate", isPhishing: true, points: 15,
    title: "Shared document from unknown user",
    sender: { name: "docs-noreply", email: "no-reply@docs-share.cloud" },
    subject: "'Q4-Budget-FINAL.pdf' has been shared with you",
    bodyHtml: `<p>A document has been shared with you.</p><p><a data-flag="link" href="#">Open document</a></p><p>Sign in with your email to view.</p>`,
    redFlags: [
      { id: "sender", label: "Unfamiliar sharing service", explanation: "'docs-share.cloud' isn't your real document platform." },
      { id: "link", label: "Sign-in harvesting", explanation: "Leads to a fake sign-in page that captures credentials." },
      { id: "context", label: "No context", explanation: "Real shares come from a colleague with a message." },
    ] },
  { id: "email-8", category: "email", difficulty: "Beginner", isPhishing: false, points: 8,
    title: "Weekly newsletter — Cloudify",
    sender: { name: "Cloudify Digest", email: "digest@newsletter.cloudify.com" },
    subject: "This week in Cloudify: 3 new features",
    bodyHtml: `<p>Hi Jordan,</p><p>New: incremental backups, region pinning, improved audit logs. Changelog on the status page.</p><p>Unsubscribe from the footer.</p>`,
    redFlags: [],
    legitReason: "Legit newsletter on a subdomain, no credential prompts, standard unsubscribe." },
  { id: "email-9", category: "email", difficulty: "Advanced", isPhishing: true, points: 25,
    title: "MFA reset requested",
    sender: { name: "Account Security", email: "security@account-verify.support" },
    subject: "We reset your MFA — confirm to keep access",
    bodyHtml: `<p>Your MFA device was reset at 03:14 UTC. If this wasn't you, confirm within 10 minutes.</p><p><a data-flag="link" href="#">Confirm identity</a></p>`,
    redFlags: [
      { id: "sender", label: "Look-alike security domain", explanation: "'account-verify.support' isn't your provider." },
      { id: "urgency", label: "10-minute pressure", explanation: "Extremely short windows override caution." },
      { id: "link", label: "MFA-bypass phishing", explanation: "Links to a proxy that captures MFA codes." },
    ] },
  { id: "email-10", category: "email", difficulty: "Intermediate", isPhishing: false, points: 10,
    title: "Calendar invite — Design review",
    sender: { name: "Ravi Patel", email: "ravi.patel@yourcompany.example" },
    subject: "Invite: Design review — Thu 3pm",
    bodyHtml: `<p>Hey — added a 30 min slot on Thursday. Feel free to move it. Agenda in the calendar description.</p>`,
    redFlags: [],
    legitReason: "Colleague at internal domain, standard invite, no credential prompts." },

  { id: "sms-1", category: "sms", difficulty: "Beginner", isPhishing: true, points: 10,
    title: "Package delivery failed",
    smsFrom: "+1 (555) 010-4429",
    smsBody: "SwiftPost: your parcel could not be delivered. Reschedule: hxxp://swiftpost-track.co/r/8fj (fee $2.99)",
    redFlags: [
      { id: "sender", label: "Unknown long number", explanation: "Real carriers use registered short codes." },
      { id: "link", label: "Unusual domain", explanation: "'swiftpost-track.co' isn't the real carrier." },
      { id: "fee", label: "Small-fee bait", explanation: "Tiny fees exist to capture card details." },
    ] },
  { id: "sms-2", category: "sms", difficulty: "Beginner", isPhishing: false, points: 6,
    title: "2FA code",
    smsFrom: "NovaBank",
    smsBody: "NovaBank: Your one-time code is 481203. Do not share this code. If you didn't request it, ignore.",
    redFlags: [],
    legitReason: "One-way code, no link, explicit 'do not share' warning." },
  { id: "sms-3", category: "sms", difficulty: "Intermediate", isPhishing: true, points: 15,
    title: "Tax refund",
    smsFrom: "+44 7700 900123",
    smsBody: "GOV-NOTICE: You are due a refund of £284.10. Claim within 24h: hxxp://gov-refund-portal.click",
    redFlags: [
      { id: "sender", label: "Non-official sender", explanation: "Governments don't text refunds from personal numbers." },
      { id: "urgency", label: "24-hour deadline", explanation: "Tax authorities never demand action by SMS." },
      { id: "link", label: "'.click' TLD", explanation: "Cheap TLDs are heavily used in phishing campaigns." },
    ] },
  { id: "sms-4", category: "sms", difficulty: "Intermediate", isPhishing: true, points: 15,
    title: "Bank fraud alert",
    smsFrom: "+1 (555) 020-9987",
    smsBody: "NovaBank Alert: Did you spend $1,289.00 at ShopEase? Reply Y or N. Dispute: hxxp://novabank-alerts.help",
    redFlags: [
      { id: "sender", label: "Random long number", explanation: "Your real bank uses a consistent short code." },
      { id: "link", label: "Non-bank domain", explanation: "'novabank-alerts.help' is a decoy." },
      { id: "reply", label: "Reply-based trap", explanation: "A reply confirms your number is active." },
    ] },
  { id: "sms-5", category: "sms", difficulty: "Advanced", isPhishing: true, points: 22,
    title: "Boss on WhatsApp",
    smsFrom: "+1 (555) 700-0022",
    smsBody: "Hi it's Alex — I lost my phone, this is my new number. Are you free? Need a small favor before my next meeting.",
    redFlags: [
      { id: "sender", label: "'New number' pretext", explanation: "Classic impersonation opener — verify via a known channel." },
      { id: "favor", label: "Urgency + secrecy", explanation: "'Favor before my meeting' leads to gift-card / wire scams." },
    ] },

  { id: "url-1", category: "url", difficulty: "Beginner", isPhishing: true, points: 12,
    title: "NovaBank sign-in page",
    fakeUrl: "http://novabank-login.security-check.co/login",
    siteHtml: `<div class="p-6"><div class="text-2xl font-bold">NovaBank</div><p class="text-sm mt-2">Sign in to your account</p><input placeholder="Email" class="mt-4 w-full rounded bg-white/10 px-3 py-2 outline-none"/><input placeholder="Password" type="password" class="mt-2 w-full rounded bg-white/10 px-3 py-2 outline-none"/><button data-flag="form" class="mt-3 w-full rounded bg-primary text-primary-foreground px-3 py-2">Sign in</button><p class="text-xs mt-2 opacity-70">Also enter your card number for verification.</p></div>`,
    redFlags: [
      { id: "domain", label: "Not the real domain", explanation: "'security-check.co' is the registrable domain — decoration to its left." },
      { id: "http", label: "Not HTTPS", explanation: "Login pages must be HTTPS." },
      { id: "form", label: "Asks for card at login", explanation: "Real sign-in pages never ask for your card number." },
    ] },
  { id: "url-2", category: "url", difficulty: "Beginner", isPhishing: false, points: 8,
    title: "Cloudify dashboard",
    fakeUrl: "https://app.cloudify.com/dashboard",
    siteHtml: `<div class="p-6"><div class="text-2xl font-bold">Cloudify</div><p class="text-sm mt-2">Welcome back, Jordan</p><div class="mt-4 grid grid-cols-3 gap-2 text-xs"><div class="rounded bg-white/10 p-3">Backups: OK</div><div class="rounded bg-white/10 p-3">Regions: 3</div><div class="rounded bg-white/10 p-3">Usage: 42%</div></div></div>`,
    redFlags: [],
    legitReason: "HTTPS on the real domain, no login form on the dashboard, no sensitive prompts." },
  { id: "url-3", category: "url", difficulty: "Intermediate", isPhishing: true, points: 18,
    title: "ShopEase 'checkout' page",
    fakeUrl: "https://shopease.com.secure-orders.click/checkout",
    siteHtml: `<div class="p-6"><div class="text-2xl font-bold">ShopEase</div><p class="text-sm mt-2">Confirm your order</p><input placeholder="Card number" class="mt-3 w-full rounded bg-white/10 px-3 py-2 outline-none"/><input placeholder="CVV" class="mt-2 w-full rounded bg-white/10 px-3 py-2 outline-none"/><input placeholder="OTP from bank" class="mt-2 w-full rounded bg-white/10 px-3 py-2 outline-none"/><button data-flag="form" class="mt-3 w-full rounded bg-primary text-primary-foreground px-3 py-2">Pay $248.99</button></div>`,
    redFlags: [
      { id: "domain", label: "Subdomain trick", explanation: "The real domain is 'secure-orders.click' — 'shopease.com' is just a label." },
      { id: "otp", label: "Asks for OTP", explanation: "Legit checkouts never ask you to type your bank OTP." },
    ] },
  { id: "url-4", category: "url", difficulty: "Advanced", isPhishing: true, points: 22,
    title: "MFA prompt lookalike",
    fakeUrl: "https://accounts.cloudify-support.help/mfa",
    siteHtml: `<div class="p-6"><div class="text-2xl font-bold">Cloudify</div><p class="text-sm mt-2">Enter the code from your authenticator</p><input placeholder="6-digit code" class="mt-3 w-full rounded bg-white/10 px-3 py-2 outline-none"/><button data-flag="form" class="mt-3 w-full rounded bg-primary text-primary-foreground px-3 py-2">Verify</button><p class="text-xs mt-2 opacity-70">Enter within 30s or account will be locked.</p></div>`,
    redFlags: [
      { id: "domain", label: "Look-alike domain", explanation: "'cloudify-support.help' is not cloudify.com." },
      { id: "urgency", label: "30-second lockout warning", explanation: "MFA proxy kits use countdowns to rush you." },
    ] },
  { id: "url-5", category: "url", difficulty: "Intermediate", isPhishing: false, points: 10,
    title: "NovaBank public homepage",
    fakeUrl: "https://www.novabank.com/",
    siteHtml: `<div class="p-6"><div class="text-2xl font-bold">NovaBank</div><p class="text-sm mt-2">Everyday banking made simple.</p><div class="mt-4 flex gap-2 text-xs"><span class="rounded bg-white/10 px-2 py-1">Personal</span><span class="rounded bg-white/10 px-2 py-1">Business</span><span class="rounded bg-white/10 px-2 py-1">Support</span></div></div>`,
    redFlags: [],
    legitReason: "HTTPS, real root domain, no login form on the public homepage." },
];

export interface QuizQuestion { id: string; q: string; options: string[]; correct: number; explain: string; }
export const quizBank: QuizQuestion[] = [
  { id: "q1", q: "You get an email from 'IT Helpdesk' with a link asking you to keep your password. What should you do?", options: ["Click the link and re-enter my password", "Report the message to IT via your known internal channel", "Reply asking if it's real", "Forward it to your team"], correct: 1, explain: "Real IT never sends external password portals — verify via a known channel." },
  { id: "q2", q: "Which is the most reliable red flag in a URL?", options: ["It uses HTTPS", "It has a padlock icon", "The registrable domain doesn't match the brand you expect", "It's long"], correct: 2, explain: "The registrable domain (right before the TLD) is what matters." },
  { id: "q3", q: "An 'invoice' email has an .html attachment. Best action?", options: ["Open it in a private tab", "Don't open — HTML attachments host fake login pages", "Open on your phone", "Print it"], correct: 1, explain: "HTML attachments render locally and can host credential-stealing forms." },
  { id: "q4", q: "A text says your package failed delivery — click a link to pay $2.99. What is this?", options: ["Legit carrier fee", "Smishing", "Automated retry", "Standard rescheduling"], correct: 1, explain: "Small fees are classic smishing bait to capture card details." },
  { id: "q5", q: "The safest way to visit your bank is to…", options: ["Search Google and click the top result", "Click the link in the last email", "Use a bookmark or type the URL directly", "Ask a chatbot for the link"], correct: 2, explain: "Bookmarks and typed URLs bypass paid ads and look-alike domains." },
  { id: "q6", q: "What is Business Email Compromise (BEC)?", options: ["An email virus", "Impersonating an executive to trick employees into wires", "A spam filter", "A firewall"], correct: 1, explain: "BEC uses social engineering — often impersonating a CEO." },
  { id: "q7", q: "You clicked a suspicious link but closed the tab immediately. What now?", options: ["Nothing", "Report, change any typed credentials, monitor accounts", "Restart your computer", "Delete the email only"], correct: 1, explain: "Report and rotate anything you typed." },
  { id: "q8", q: "Strongest sign a message is phishing?", options: ["From someone new", "Urgency that pushes you around your normal process", "Has a signature", "Is short"], correct: 1, explain: "Urgency + bypassing process is a top phishing signal." },
  { id: "q9", q: "Homograph attacks work by…", options: ["Using bold text", "Substituting look-alike Unicode characters in a domain", "Sending large attachments", "Using capital letters"], correct: 1, explain: "Cyrillic 'а' vs Latin 'a' is a classic example." },
  { id: "q10", q: "A colleague WhatsApps you from a new number and asks a favor. What do you do?", options: ["Help immediately", "Verify via a known channel first", "Ignore forever", "Send a gift card just in case"], correct: 1, explain: "Verify out-of-band before doing anything." },
  { id: "q11", q: "Which link is safest?", options: ["hxxp://novabank-login.security-check.co", "https://novabank.com.secure.click", "https://www.novabank.com", "http://novabank.com"], correct: 2, explain: "HTTPS on the real root domain." },
  { id: "q12", q: "MFA phishing kits capture codes by…", options: ["Guessing", "Proxying login so you type your code into their fake page", "Reading SMS remotely", "Bribing carriers"], correct: 1, explain: "AiTM proxies relay MFA codes in real time." },
  { id: "q13", q: "A refund email asks for your full card number and CVV. Correct read?", options: ["Standard refund", "Phishing — refunds never require re-entering card details", "Only suspicious if the amount is wrong", "Depends on the sender"], correct: 1, explain: "Real refunds go back to the card that paid." },
  { id: "q14", q: "What best reduces phishing risk day-to-day?", options: ["Bigger font emails", "Slow down: verify sender, hover links, question urgency", "Use only your phone", "Reply and ask"], correct: 1, explain: "Slowing down is the single best defense." },
  { id: "q15", q: "Reporting a suspected phishing email…", options: ["Is optional", "Helps protect coworkers and improves defenses", "Guarantees the sender is banned", "Deletes it from everyone's inbox"], correct: 1, explain: "Reporting feeds defenses and warns others." },
];

export interface Article { id: string; title: string; summary: string; body: string; tag: string; }
export const articles: Article[] = [
  { id: "spoofed-domain", tag: "Domains", title: "How to spot a spoofed domain", summary: "The registrable domain is the only part that matters.", body: "Look at the label immediately before the TLD. In 'novabank.com.secure-orders.click', the real domain is 'secure-orders.click'. Everything to the left is decoration. Bookmarks, typed URLs, and password managers that only autofill on the real domain protect you almost for free." },
  { id: "urgency-tactics", tag: "Social Engineering", title: "Common urgency tactics", summary: "Countdowns, threats, and secrecy are red flags.", body: "'24 hours or your account is closed', '10-minute lockout', 'don't tell finance' — these are engineered to bypass careful thinking. Any message that asks you to skip a normal step is worth a second look." },
  { id: "clicked-a-link", tag: "Response", title: "What to do if you clicked a phishing link", summary: "Report first, rotate anything you typed.", body: "Close the tab, report to security, change any credentials or codes you entered, and monitor accounts for unusual activity. Clicking alone isn't always fatal — but reporting quickly protects everyone else." },
  { id: "mfa-phishing", tag: "MFA", title: "Why MFA isn't magic — AiTM phishing", summary: "Adversary-in-the-middle kits capture codes in real time.", body: "Attackers proxy your login through their site, capturing both password and MFA. Defenses: phishing-resistant MFA (passkeys/WebAuthn), never enter MFA codes on unfamiliar domains, always start login from a bookmark." },
  { id: "sender-check", tag: "Email", title: "Reading email sender addresses properly", summary: "The From name is trivially spoofed.", body: "The display name is set by the sender. Look at the actual address — specifically the registrable domain. Look-alikes ('novabank-verify.co' vs 'novabank.com') and homoglyphs (Cyrillic 'а' vs Latin 'a') are common tricks." },
  { id: "attachments", tag: "Attachments", title: "Dangerous attachments at a glance", summary: "HTML, ISO, LNK, and macro docs deserve scrutiny.", body: "HTML attachments can host fake login pages locally. ISO/IMG files can bundle scripts. LNK files can execute commands. When in doubt, don't open — verify via a known channel." },
];

export const seedLeaderboard = [
  { name: "Kai Nakamura", score: 480, badges: 6 },
  { name: "Elena Ruiz", score: 425, badges: 5 },
  { name: "Wole Adebayo", score: 390, badges: 5 },
  { name: "Mira Sato", score: 340, badges: 4 },
  { name: "Chen Wu", score: 305, badges: 4 },
  { name: "Aditi Rao", score: 260, badges: 3 },
  { name: "Liam O'Neill", score: 220, badges: 3 },
];
