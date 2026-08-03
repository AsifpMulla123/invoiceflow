const statusStyles: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SENT: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  VIEWED: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  PAID: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  OVERDUE: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  VOIDED: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[status] ?? statusStyles.DRAFT}`}
    >
      {status}
    </span>
  );
}
