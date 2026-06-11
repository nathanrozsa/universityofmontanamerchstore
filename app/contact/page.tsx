import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import MapWrapper from "./MapWrapper";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the University of Montana Merch Store team.",
};

const contactInfo = [
  {
    label: "Address",
    value: "32 Campus Drive, Missoula, MT 59812",
    href: null,
  },
  {
    label: "Email",
    value: "merch@umontana.edu",
    href: "mailto:merch@umontana.edu",
  },
  {
    label: "Phone",
    value: "(406) 243-0211",
    href: "tel:+14062430211",
  },
  {
    label: "Store Hours",
    value: "Mon–Fri 9am–6pm · Sat 10am–4pm",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-maroon-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Contact Us</h1>
          <p className="text-lg text-white/70">
            Have a question about an order, product, or bulk request? We're happy to help.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Left: contact info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  We typically respond within one business day. For urgent order issues,
                  please include your order number in the message.
                </p>
              </div>

              <div className="space-y-5">
                {contactInfo.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                      {item.label}
                    </dt>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-maroon-900 hover:text-maroon-700 font-medium transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <dd className="text-sm text-gray-700">{item.value}</dd>
                    )}
                  </div>
                ))}
              </div>

              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200">
                <MapWrapper />
              </div>
            </div>

            {/* Right: contact form */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
