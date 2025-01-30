import { useParams, Link } from "react-router-dom";
import { useArmada } from "@/hooks/use-armada";
import { Pencil, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function ArmadaDetail() {
  const { id } = useParams();
  const { useArmadaDetail } = useArmada();
  const { armada, isLoading } = useArmadaDetail(id || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!armada) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Gagal memuat data armada</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin/armada">Armada</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail Armada</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mt-2">
        <h1 className="text-3xl font-bold tracking-tight">Detail Armada</h1>
        <div className="flex items-center space-x-2">
          <Link to={`/admin/armada/${id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" /> Edit Armada
            </Button>
          </Link>
          <Link to="/admin-all-armada">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>{armada.nama}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Kapasitas</h3>
                <p>{armada.kapasitas} orang</p>
              </div>
              <div>
                <h3 className="font-medium">Merek</h3>
                <p>{armada.merek}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Harga</h3>
              <p>{armada.harga.toLocaleString('id-ID', { 
                style: 'currency', 
                currency: 'IDR' 
              })}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Gambar Armada</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {armada.gambar.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/${image}`}
                    alt={`${armada.nama} ${index + 1}`}
                    className="aspect-square rounded-md object-cover"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}