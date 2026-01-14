import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Search, Plus, Download, FileText, FileSpreadsheet, Printer, Copy, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  title?: string;
  searchPlaceholder?: string;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onAdd?: () => void;
  addButtonText?: string;
  exportOptions?: {
    enabled?: boolean;
    filename?: string;
  };
}

export function DataTableToolbar<TData>({
  table,
  title,
  searchPlaceholder = "Buscar...",
  globalFilter,
  setGlobalFilter,
  onAdd,
  addButtonText = "Adicionar",
  exportOptions,
}: DataTableToolbarProps<TData>) {
  const handleExport = (type: "print" | "csv" | "excel" | "pdf" | "copy") => {
    // Export functionality placeholder
    console.log(`Exporting as ${type}...`);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between border-b border-border">
      {/* Title and Export */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {title && (
          <h5 className="text-lg font-semibold text-heading m-0">{title}</h5>
        )}
        
        {exportOptions?.enabled !== false && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => handleExport("print")} className="gap-2 cursor-pointer">
                <Printer className="h-4 w-4" />
                Imprimir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2 cursor-pointer">
                <FileText className="h-4 w-4" />
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")} className="gap-2 cursor-pointer">
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2 cursor-pointer">
                <FileText className="h-4 w-4" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("copy")} className="gap-2 cursor-pointer">
                <Copy className="h-4 w-4" />
                Copiar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Search and Add */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9 w-full sm:w-64"
          />
        </div>
        
        {onAdd && (
          <Button onClick={onAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            {addButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}
