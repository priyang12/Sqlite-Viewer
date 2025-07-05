import React from "react";
import { clsx } from "clsx";
import { Handle, HandleProps } from "@xyflow/react";

function TableWrapper({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="table-container"
      className={clsx("relative w-full overflow-x-auto")}
    >
      <table
        data-slot="table"
        className={clsx("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      data-testid="table"
      className={clsx("w-full text-left text-sm", className)}
      {...props}
    />
  );
}

function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      data-slot="table-header"
      className={clsx("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={clsx("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={clsx(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      data-slot="table-row"
      className={clsx(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      data-slot="table-head"
      className={clsx(
        "text-foreground h-10 whitespace-nowrap px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      data-slot="table-cell"
      className={clsx(
        "whitespace-nowrap p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <caption
      data-slot="table-caption"
      className={clsx("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

function TableHandle({ className, ...props }: HandleProps) {
  return (
    <>
      <Handle
        className={clsx(
          "h-[11px] w-[11px] rounded-full border border-slate-300 bg-slate-100 transition",
          className,
        )}
        {...props}
      />
    </>
  );
}

export {
  TableWrapper,
  Table,
  TableHeader,
  TableFooter,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableHandle,
};
