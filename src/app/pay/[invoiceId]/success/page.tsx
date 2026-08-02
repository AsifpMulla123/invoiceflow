export default function PaySuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-2xl mb-2">✓</p>
        <h1 className="text-xl font-semibold mb-2">Payment received</h1>
        <p className="text-sm text-muted-foreground">
          Thank you — this invoice has been marked as paid. You can close this
          page.
        </p>
      </div>
    </div>
  );
}
