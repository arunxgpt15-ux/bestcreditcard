/**
 * AFFILIATE DISCLOSURE & REGULATORY COMPONENTS
 * =============================================
 * Prompt 9: Compliance UI components
 */

export const AffiliateDisclosure = () => {
  return (
    <div className="border-l-4 border-amber-400 bg-amber-50 p-4 rounded mb-6">
      <h3 className="font-semibold text-amber-900 mb-2">Affiliate Disclosure</h3>
      <p className="text-sm text-amber-800">
        JourneyCard earns a commission when you apply for a card through our links.
        <br />
        This <strong>does not change the card details</strong> we show you.
        <br />
        Our rankings are based on <strong>computed net value for your profile</strong>, not affiliate payout.
        <br />
        Affiliate payout is used only as a tie-breaker when multiple cards offer identical net value.
      </p>
    </div>
  );
};

export const RegulatoryDisclaimer = () => {
  return (
    <div className="bg-gray-100 border border-gray-300 p-4 rounded text-sm text-gray-700">
      <p className="font-semibold mb-2">Regulatory Disclaimer</p>
      <p className="mb-2">
        <strong>JourneyCard is an independent information service.</strong> We are not a bank, NBFC, 
        lending entity, DSA (Direct Selling Agent), or regulated by the RBI.
      </p>
      <p className="mb-2">
        We do not accept applications, take credit decisions, or process payments.
        All credit decisions are made solely by the card-issuing bank.
      </p>
      <p>
        <strong>Card terms change frequently.</strong> Always verify on the official issuer website 
        before applying. Our data is updated regularly but may not reflect the latest terms.
      </p>
    </div>
  );
};

export const ApprovalDisclaimer = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-900">
      <p>
        <strong>Approval Estimate:</strong> This is an estimate based on the information you provided.
        <br />
        <strong>Only the bank decides approval.</strong> This is <strong>not a pre-approval</strong> 
        and does not guarantee approval.
      </p>
    </div>
  );
};

export const ConfidenceChip = ({ confidence, lastVerified }: { confidence: "verified" | "partial" | "unverified", lastVerified?: string }) => {
  const styles = {
    verified: "bg-green-100 text-green-800",
    partial: "bg-amber-100 text-amber-800",
    unverified: "bg-gray-100 text-gray-800",
  };

  const labels = {
    verified: "Verified",
    partial: "Partial",
    unverified: "Unverified",
  };

  const descriptions = {
    verified: "Confirmed against official source",
    partial: "Derived from official source with interpretation",
    unverified: "Not yet confirmed; treat as estimate",
  };

  return (
    <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${styles[confidence]} cursor-help` }
         title={descriptions[confidence]}>
      {labels[confidence]} {lastVerified && `(${lastVerified})`}
    </div>
  );
};
