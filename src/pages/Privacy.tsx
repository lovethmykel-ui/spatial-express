export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto py-8 text-left space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">Legal</span>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-1">Last updated: July 2026</p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 leading-relaxed bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            Spatial Express collects information necessary to execute freight handling, customs clearance, and pickup dispatching. This includes sender and recipient names, addresses, contact telephone numbers, email addresses, package contents, and declared valuations.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. How We Use Your Information</h2>
          <p>
            Your information is transmitted securely to partner carriers (such as DHL, FedEx, UPS, Aramex, EMS) and customs authorities for official bill of lading generation, tracking updates, and delivery fulfillment.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Payment Information Security</h2>
          <p>
            All financial transactions are processed securely through certified payment gateways such as Paystack. Spatial Express does not store raw credit card numbers or banking credentials on our servers.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Data Retention & Your Rights</h2>
          <p>
            Shipment records and manifests are stored in accordance with international cargo transportation laws. You may request data access, correction, or deletion by emailing privacy@spatialexpress.com.
          </p>
        </div>
      </div>
    </div>
  )
}
