import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  header: { marginBottom: 20 },
  businessName: { fontSize: 16, fontWeight: 700 },
  logo: { width: 100, height: 40, marginBottom: 8, objectFit: "contain" },
  section: { marginBottom: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: 1,
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: 700,
  },
  tableRow: { flexDirection: "row", paddingVertical: 3 },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colRate: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1, textAlign: "right" },
  totalsSection: { marginTop: 16, borderTop: 1, paddingTop: 8 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 2,
  },
  totalLabel: { width: 100, textAlign: "right", marginRight: 10 },
  totalValue: { width: 80, textAlign: "right" },
  exportNote: { marginTop: 12, fontSize: 9, fontStyle: "italic" },
});

interface InvoicePdfProps {
  invoiceNumber: string;
  logoUrl: string | null;
  businessName: string;
  businessGstin: string | null;
  clientName: string;
  clientGstin: string | null;
  clientState: string;
  dueDate: string;
  lineItems: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  cgst: number;
  sgst: number;
  igst: number;
  discount: number;
  total: number;
  exportNote: string | null;
}

export function InvoicePdf({
  invoiceNumber,
  logoUrl,
  businessName,
  businessGstin,
  clientName,
  clientGstin,
  clientState,
  dueDate,
  lineItems,
  cgst,
  sgst,
  igst,
  discount,
  total,
  exportNote,
}: InvoicePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoUrl && <Image src={logoUrl} style={styles.logo} />}
          <Text style={styles.businessName}>{businessName}</Text>
          {businessGstin && <Text>GSTIN: {businessGstin}</Text>}
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text>Invoice: {invoiceNumber}</Text>
            <Text>Due: {dueDate}</Text>
          </View>
          <Text>
            Bill to: {clientName} ({clientState})
          </Text>
          {clientGstin && <Text>Client GSTIN: {clientGstin}</Text>}
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colRate}>Rate</Text>
          <Text style={styles.colAmount}>Amount</Text>
        </View>
        {lineItems.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colRate}>₹{item.rate.toFixed(2)}</Text>
            <Text style={styles.colAmount}>₹{item.amount.toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.totalsSection}>
          {discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalValue}>-₹{discount.toFixed(2)}</Text>
            </View>
          )}
          {cgst > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>CGST (9%)</Text>
              <Text style={styles.totalValue}>₹{cgst.toFixed(2)}</Text>
            </View>
          )}
          {sgst > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SGST (9%)</Text>
              <Text style={styles.totalValue}>₹{sgst.toFixed(2)}</Text>
            </View>
          )}
          {igst > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IGST (18%)</Text>
              <Text style={styles.totalValue}>₹{igst.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontWeight: 700 }]}>Total</Text>
            <Text style={[styles.totalValue, { fontWeight: 700 }]}>
              ₹{total.toFixed(2)}
            </Text>
          </View>
        </View>

        {exportNote && <Text style={styles.exportNote}>{exportNote}</Text>}
      </Page>
    </Document>
  );
}
