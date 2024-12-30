// "use client"

// import { useState } from "react"
// import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table"

// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import TableArticle from "@/components/partials/adminPartials/article/data-table"

// const data: Article[] = [
//   {
//     id: "1",
//     destination: "Lambaga",
//     duration: "7 days",
//     price: 1299,
//     rating: 4.5,
//     availability: "Available",
//   },
//   {
//     id: "2",
//     destination: "Kota",
//     duration: "10 days",
//     price: 2499,
//     rating: 4.8,
//     availability: "Limited",
//   },
//   {
//     id: "3",
//     destination: "Gajah",
//     duration: "5 days",
//     price: 999,
//     rating: 4.2,
//     availability: "Available",
//   },
//   {
//     id: "4",
//     destination: "Kuda",
//     duration: "6 days",
//     price: 1199,
//     rating: 4.6,
//     availability: "Sold Out",
//   },
//   {
//     id: "5",
//     destination: "Beruk",
//     duration: "8 days",
//     price: 1599,
//     rating: 4.7,
//     availability: "Available",
//   },
//   {
//     id: "6",
//     destination: "Sepatu",
//     duration: "6 days",
//     price: 1399,
//     rating: 4.4,
//     availability: "Limited",
//   },
//   {
//     id: "7",
//     destination: "Sydney",
//     duration: "9 days",
//     price: 2199,
//     rating: 4.6,
//     availability: "Available",
//   },
//   {
//     id: "8",
//     destination: "Barcelona",
//     duration: "5 days",
//     price: 1099,
//     rating: 4.3,
//     availability: "Available",
//   },
//   {
//     id: "9",
//     destination: "Dubai",
//     duration: "7 days",
//     price: 1799,
//     rating: 4.5,
//     availability: "Limited",
//   },
//   {
//     id: "10",
//     destination: "Cancun",
//     duration: "6 days",
//     price: 1299,
//     rating: 4.4,
//     availability: "Available",
//   },
// ]

// export type Article = {
//   id: string
//   destination: string
//   duration: string
//   price: number
//   rating: number
//   availability: "Available" | "Limited" | "Sold Out"
// }

// export const columns: ColumnDef<Article>[] = [
//   {
//     accessorKey: "destination",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Destination
//           <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => <div className="capitalize">{row.getValue("destination")}</div>,
//   },
//   {
//     accessorKey: "duration",
//     header: "Duration",
//     cell: ({ row }) => <div>{row.getValue("duration")}</div>,
//   },
//   {
//     accessorKey: "price",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Price
//           <CaretSortIcon className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("price"))
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount)
 
//       return <div className="font-medium">{formatted}</div>
//     },
//   },
//   {
//     accessorKey: "rating",
//     header: "Rating",
//     cell: ({ row }) => {
//       return <div className="font-medium">{row.getValue("rating")}/5</div>
//     },
//   },
//   {
//     accessorKey: "availability",
//     header: "Availability",
//     cell: ({ row }) => {
//       const availability = row.getValue("availability") as string
//       return (
//         <div className={`font-medium ${availability === "Available" ? "text-green-600" : availability === "Limited" ? "text-yellow-600" : "text-red-600"}`}>
//           {availability}
//         </div>
//       )
//     },
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const tourPackage = row.original
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <DotsHorizontalIcon className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(tourPackage.id)}
//             >
//               Copy package ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View package details</DropdownMenuItem>
//             <DropdownMenuItem>Book this package</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]

// const ArticlePage = () => {
//   const [sorting, setSorting] = useState<SortingState>([])
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
//   const [rowSelection, setRowSelection] = useState({})

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   })

//   return (
//     <>
//       <ArticleFilterBar table={table} />
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="py-4">
//         <TableArticle table={table} />
//       </div>
//     </>
//   )
// }

// const ArticleFilterBar = ({ table }: { table: ReturnType<typeof useReactTable<Article>> }) => (
//   <div className="flex items-center py-4">
//     <Input
//       placeholder="Filter destinations..."
//       value={(table.getColumn("destination")?.getFilterValue() as string) ?? ""}
//       onChange={(event) =>
//         table.getColumn("destination")?.setFilterValue(event.target.value)
//       }
//       className="max-w-sm"
//     />
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" className="ml-auto">
//           Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         {table
//           .getAllColumns()
//           .filter((column) => column.getCanHide())
//           .map((column) => (
//             <DropdownMenuCheckboxItem
//               key={column.id}
//               className="capitalize"
//               checked={column.getIsVisible()}
//               onCheckedChange={(value) => column.toggleVisibility(!!value)}
//             >
//               {column.id}
//             </DropdownMenuCheckboxItem>
//           ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   </div>
// )

// export default ArticlePage;
