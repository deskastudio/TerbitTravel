import { useParams, Link } from "react-router-dom";
import { useConsumption } from "@/hooks/use-consumption";
import { Pencil, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export default function ConsumptionDetail() {
  const { id } = useParams();
  const { useConsumptionDetail } = useConsumption();
  const { consumption, isLoading, error } = useConsumptionDetail(id || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !consumption) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Gagal memuat data konsumsi</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin/consumption">Konsumsi</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail Konsumsi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Detail Konsumsi</h1>
        <div className="flex items-center space-x-2">
          <Link to={`/admin/consumption/${id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
          <Link to="/admin/consumption">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{consumption.nama}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium mb-2">Harga</h3>
              <p className="text-2xl font-bold">
                {consumption.harga.toLocaleString('id-ID', { 
                  style: 'currency', 
                  currency: 'IDR',
                  maximumFractionDigits: 0
                })}
              </p>
            </div>

            <Separator />
          
            <div>
              <h3 className="font-medium mb-4">Daftar Menu</h3>
              <ul className="grid gap-2">
                {consumption.lauk.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Dibuat pada</h3>
                <p className="text-gray-600">{new Date(consumption.createdAt || "").toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Terakhir diupdate</h3>
                <p className="text-gray-600">{new Date(consumption.updatedAt || "").toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}