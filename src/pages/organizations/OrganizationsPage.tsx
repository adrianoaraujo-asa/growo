import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DataTable, 
  DataTableColumnHeader, 
  AvatarCell, 
  StatusBadge, 
  RowActions 
} from "@/components/ui/data-table";
import { AddOrganizationSheet } from "./AddOrganizationSheet";
import { useOrganizations, Organization } from "@/hooks/useOrganizations";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StaggerContainer, StaggerItem } from "@/components/animations/MotionWrapper";

const statusMap: Record<string, { label: string; variant: "primary" | "success" | "danger" | "warning" | "info" | "secondary" }> = {
  active: { label: "Ativo", variant: "success" },
  inactive: { label: "Inativo", variant: "secondary" },
  suspended: { label: "Suspenso", variant: "danger" },
  pending: { label: "Pendente", variant: "warning" },
};

export function OrganizationsPage() {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editingOrg, setEditingOrg] = React.useState<Organization | null>(null);
  
  const { organizations, isLoading, deleteOrganization } = useOrganizations();

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setSheetOpen(true);
  };

  const handleDelete = async (org: Organization) => {
    if (confirm(`Deseja realmente excluir a organização "${org.name}"?`)) {
      await deleteOrganization(org.id);
    }
  };

  const handleAdd = () => {
    setEditingOrg(null);
    setSheetOpen(true);
  };

  const columns: ColumnDef<Organization>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ? true :
            table.getIsSomePageRowsSelected() ? "indeterminate" : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Organização" />
      ),
      cell: ({ row }) => {
        const org = row.original;
        return (
          <AvatarCell
            name={org.name}
            subtitle={org.industry || org.slug}
            imageUrl={org.logo_url}
          />
        );
      },
    },
    {
      accessorKey: "legal_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Razão Social" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-foreground">
          {row.getValue("legal_name") || "-"}
        </span>
      ),
    },
    {
      accessorKey: "document_number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CNPJ/CPF" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-foreground font-mono">
          {row.getValue("document_number") || "-"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data Cadastro" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return (
          <span className="text-sm text-foreground">
            {date ? format(new Date(date), "dd/MM/yyyy", { locale: ptBR }) : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusInfo = statusMap[status] || { label: status, variant: "secondary" as const };
        return (
          <StatusBadge variant={statusInfo.variant}>
            {statusInfo.label}
          </StatusBadge>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const org = row.original;
        return (
          <RowActions
            onView={() => console.log("View", org.id)}
            onEdit={() => handleEdit(org)}
            onDelete={() => handleDelete(org)}
          />
        );
      },
    },
  ];

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <div>
          <h1 className="text-2xl font-semibold text-heading">Organizações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as organizações cadastradas no sistema
          </p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <DataTable
          columns={columns}
          data={organizations}
          title="Lista de Organizações"
          searchPlaceholder="Buscar organização..."
          onAdd={handleAdd}
          addButtonText="Nova Organização"
          isLoading={isLoading}
        />
      </StaggerItem>

      <AddOrganizationSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        organization={editingOrg}
      />
    </StaggerContainer>
  );
}