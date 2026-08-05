// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
//       <h1 className="text-4xl font-semibold mb-4 max-w-xl">
//         GST-compliant invoices. Get paid via UPI. Built for one freelancer, not
//         a finance team.
//       </h1>
//       <p className="text-muted-foreground max-w-md mb-8">
//         No invoice caps. No accounting-suite bloat. A payment-tracking dashboard
//         that's the first thing you see, not the last.
//       </p>
//       <div className="flex gap-3">
//         <Button asChild size="lg">
//           <Link href="/signup">Get started free</Link>
//         </Button>
//         <Button asChild size="lg" variant="outline">
//           <Link href="/demo">See a live demo</Link>
//         </Button>
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-linear-to-b from-background to-muted/30">
      <div className="mb-4 text-sm font-medium text-primary">InvoiceFlow</div>
      <h1 className="text-4xl md:text-5xl font-semibold mb-4 max-w-2xl tracking-tight">
        GST-compliant invoices. Get paid via UPI.
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl mb-2">
        Built for one freelancer, not a finance team.
      </p>
      <p className="text-muted-foreground max-w-md mb-10">
        No invoice caps. No accounting-suite bloat. A payment-tracking dashboard
        that's the first thing you see, not the last.
      </p>
      <div className="flex gap-3 mb-16">
        <Button asChild size="lg">
          <Link href="/signup">Get started free</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/demo">See a live demo</Link>
        </Button>
      </div>

      <div className="border rounded-2xl p-6 max-w-lg w-full bg-card shadow-sm text-left">
        <p className="text-xs text-muted-foreground mb-3">Dashboard preview</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="border rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Total earned</p>
            <p className="text-lg font-semibold tabular-nums">₹42,000</p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
            <p className="text-lg font-semibold tabular-nums">₹18,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
