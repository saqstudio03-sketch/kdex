import { LifeBuoy, Mail, MessageSquare, ShieldCheck, KeyRound, Receipt } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const FAQ = [
  {
    q: "How fast are keys delivered?",
    a: "Immediately after payment verification your key appears in Account → Game Library and is emailed to you.",
  },
  {
    q: "Are the activation keys legitimate?",
    a: "Yes — in production, keys come from authorised distributors and are reserved through a transactional fulfilment process so no key is ever sold twice.",
  },
  {
    q: "How do refunds work?",
    a: "Unused keys are refundable within 48 hours. Open a ticket with your order ID and support will process it.",
  },
  {
    q: "Which regions do keys work in?",
    a: "Every product page lists its region. Unless stated otherwise, keys activate in India (IN).",
  },
];

const TOPICS = [
  { Icon: Receipt, title: "Payment issues", desc: "Failed transactions, refunds, receipts" },
  { Icon: KeyRound, title: "Activation help", desc: "Key not working, wrong region" },
  { Icon: ShieldCheck, title: "Account security", desc: "Password, verification, devices" },
  { Icon: MessageSquare, title: "General enquiry", desc: "Anything else we can help with" },
];

export default function SupportPage() {
  usePageSeo({
    title: "Support Centre — KDex Games",
    description: "FAQs, activation help and contact options for KDex Games customers.",
    canonicalPath: "/support",
  });

  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="rounded-2xl border border-line bg-card p-8 text-center">
        <LifeBuoy className="mx-auto h-8 w-8 text-accent" />
        <h1 className="mt-3 font-display text-3xl font-bold">Support Centre</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
          Answers to common questions, plus a ticket system for anything order-specific.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/account/support">
            <Button>Open a support ticket</Button>
          </Link>
          <Link to="/account/orders">
            <Button variant="outline">Check my orders</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOPICS.map(({ Icon, title, desc }) => (
          <div key={title} className="rounded-xl border border-line bg-card p-5">
            <Icon className="h-5 w-5 text-accent" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-display text-xl font-bold">Frequently asked questions</h2>
          <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
                  {f.q}
                  <span className="float-right text-accent transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-line bg-card p-6">
          <h2 className="font-display text-xl font-bold">Contact</h2>
          <p className="mt-2 text-sm text-muted">
            Ticket responses typically arrive within a few hours during store hours
            (10:00–22:00 IST).
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-accent" /> support@nexora.demo
          </p>
          <p className="mt-4 rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs leading-relaxed text-warning">
            DEMO NOTICE — email delivery is not wired up in this environment; ticket replies
            are stored locally in your browser.
          </p>
        </section>
      </div>
    </div>
  );
}
