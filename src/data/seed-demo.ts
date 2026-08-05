export const demoClients = [
  { id: "demo-1", name: "Aarav Studio", state: "Karnataka", country: "India" },
  {
    id: "demo-2",
    name: "Northwind Co.",
    state: "Maharashtra",
    country: "India",
  },
  { id: "demo-3", name: "Kavya Designs", state: "Karnataka", country: "India" },
];

export const demoInvoices = [
  {
    id: "demo-inv-1",
    invoiceNumber: "INV-0042",
    client: demoClients[0],
    status: "OVERDUE",
    total: 18000,
    dueDate: "22 Jul",
  },
  {
    id: "demo-inv-2",
    invoiceNumber: "INV-0041",
    client: demoClients[1],
    status: "SENT",
    total: 32000,
    dueDate: "15 Jul",
  },
  {
    id: "demo-inv-3",
    invoiceNumber: "INV-0040",
    client: demoClients[2],
    status: "PAID",
    total: 10000,
    dueDate: "10 Jul",
  },
  {
    id: "demo-inv-4",
    invoiceNumber: "INV-0039",
    client: demoClients[0],
    status: "DRAFT",
    total: 6500,
    dueDate: "—",
  },
];
