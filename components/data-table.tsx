"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import { updateWalletDEV } from "@/data/circle/developer-controlled/wallet";
import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";
import { updateCircleWallet } from "@/data/circle/user-controlled/wallet";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});

  const session = useSession();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleEdit = (rowId: string, rowData: any) => {
    setEditRowId(rowId);
    setEditData(rowData);
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditData({});
  };

  const handleSave = async () => {
    if (session.data?.user?.custodyType === "END_USER") {
      await updateCircleWallet(
        session.data.user.circleUserId,
        editData.id,
        editData.name,
        editData.refId
      );
    } else {
      await updateWalletDEV(editData.id, editData.name, editData.refId);
    }

    window.location.reload();
    setEditRowId(null);
    setEditData({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setEditData({
      ...editData,
      [field]: e.target.value,
    });
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {editRowId === row.id &&
                      (cell.column.id === "name" ||
                        cell.column.id === "refId") ? (
                        <input
                          value={editData[cell.column.id] || cell.getValue()}
                          onChange={(e) => handleChange(e, cell.column.id)}
                        />
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editRowId === row.id ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSave()}
                        >
                          <Check />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                        >
                          <X />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(row.id, row.original)}
                      >
                        <Pencil />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
