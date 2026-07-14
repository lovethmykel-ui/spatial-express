export default function Privacy() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-sm text-muted leading-relaxed">
        <p>Last updated: June 30, 2026</p>
        <p>
          This site uses cookies and similar technologies, including those placed by
          third-party advertising partners such as Google AdSense. Google and its partners
          may use cookies or web beacons to serve ads based on your prior visits to this
          or other websites.
        </p>
        <p>
          You can opt out of personalized advertising by visiting{' '}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            www.aboutads.info/choices
          </a>{' '}
          or your Google Ad Settings.
        </p>
        <p>
          The Airdrop Tracker stores a randomly generated identifier in your browser's local
          storage to remember which tasks you've checked off. This identifier is not linked to
          any personal information and no account or login is required to use it.
        </p>
        <p>
          The Token Check tool sends the contract address you enter to DexScreener's public
          API to retrieve trading data. We do not store the addresses you look up.
        </p>
        <p>
          For questions about this policy, see the Contact page.
        </p>
      </div>
    </div>
  )
}
