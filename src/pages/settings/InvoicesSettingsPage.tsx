import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Invoice {
  id: string;
  number: string;
  date: string;
  due_date: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  description: string;
  pdf_url?: string;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  paid: { 
    label: "Pago", 
    icon: <CheckCircle className="w-3 h-3" />, 
    className: "bg-green-500/10 text-green-600 border-green-500/20" 
  },
  pending: { 
    label: "Pendente", 
    icon: <Clock className="w-3 h-3" />, 
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" 
  },
  overdue: { 
    label: "Vencido", 
    icon: <XCircle className="w-3 h-3" />, 
    className: "bg-red-500/10 text-red-600 border-red-500/20" 
  },
  cancelled: { 
    label: "Cancelado", 
    icon: <XCircle className="w-3 h-3" />, 
    className: "bg-gray-500/10 text-gray-600 border-gray-500/20" 
  },
};

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: "1",
    number: "INV-2026-001",
    date: "2026-01-01",
    due_date: "2026-01-15",
    amount: 299.00,
    status: "paid",
    description: "Plano Professional - Janeiro 2026",
  },
  {
    id: "2",
    number: "INV-2025-012",
    date: "2025-12-01",
    due_date: "2025-12-15",
    amount: 299.00,
    status: "paid",
    description: "Plano Professional - Dezembro 2025",
  },
  {
    id: "3",
    number: "INV-2025-011",
    date: "2025-11-01",
    due_date: "2025-11-15",
    amount: 299.00,
    status: "paid",
    description: "Plano Professional - Novembro 2025",
  },
  {
    id: "4",
    number: "INV-2025-010",
    date: "2025-10-01",
    due_date: "2025-10-15",
    amount: 199.00,
    status: "paid",
    description: "Plano Starter - Outubro 2025",
  },
];

export function InvoicesSettingsPage() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownload = (invoice: Invoice) => {
    toast.success(`Download da fatura ${invoice.number} iniciado!`);
  };

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold text-heading">Faturas</h1>
        <p className="text-muted-foreground">
          Histórico de faturas e downloads.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-3d">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Faturas</p>
                <p className="text-2xl font-semibold text-foreground">{invoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-3d">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pago</p>
                <p className="text-2xl font-semibold text-foreground">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-3d">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-semibold text-foreground">
                  {invoices.filter((i) => i.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="card-3d">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Histórico de Faturas
              </CardTitle>
              <CardDescription>
                Visualize e baixe suas faturas anteriores.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar faturas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="overdue">Vencidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma fatura encontrada
              </h3>
              <p className="text-muted-foreground">
                Não há faturas correspondentes aos filtros selecionados.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-foreground">
                      {invoice.number}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {invoice.description}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invoice.date)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invoice.due_date)}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${statusConfig[invoice.status].className} flex items-center gap-1 w-fit`}
                      >
                        {statusConfig[invoice.status].icon}
                        {statusConfig[invoice.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(invoice)}
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Ver detalhes"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
