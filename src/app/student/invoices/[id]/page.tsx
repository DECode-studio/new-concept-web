interface StudentInvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentInvoiceDetailPage({ params }: StudentInvoiceDetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoice Detail</h1>
        <p className="text-muted-foreground">Invoice #{id} coming soon.</p>
      </div>
    </div>
  );
}
