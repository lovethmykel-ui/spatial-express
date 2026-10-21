export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto py-8 text-left space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">Legal</span>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Terms of Service</h1>
        <p className="text-xs text-slate-500 mt-1">Last updated: July 2026</p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 leading-relaxed bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Spatial Express Logistics platform, services, rate calculators, and tracking tools, you agree to be bound by these Terms of Service.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Cargo Freight & Courier Services</h2>
          <p>
            Spatial Express acts as an aggregated logistics broker and freight forwarder connecting clients with licensed international carrier partners including DHL, FedEx, UPS, Aramex, and EMS. Rates displayed are estimated based on volumetric weight and real-time carrier tariff matrices.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Customs Clearance & Declarations</h2>
          <p>
            Senders are responsible for declaring accurate contents, values, and complying with all import/export regulations. Spatial Express assists with customs paperwork brokerage, but customs duties levied by recipient nations remain the responsibility of designated payers.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Prohibited & Hazardous Goods</h2>
          <p>
            Hazardous materials, illegal contraband, unauthorized lithium batteries, weapons, and perishable contraband prohibited by international aviation standards cannot be dispatched.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Limitation of Liability & Insurance</h2>
          <p>
            Carrier transit liability follows Warsaw/Montreal convention rules unless comprehensive transit cargo insurance was added and paid for during booking checkout.
          </p>
        </div>
      </div>
    </div>
  )
}
