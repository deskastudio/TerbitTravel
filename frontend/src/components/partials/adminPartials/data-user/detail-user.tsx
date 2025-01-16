import { useParams, Link } from "react-router-dom";
import { useUserDetail } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Loader2 } from "lucide-react";

const UserDetail = () => {
  const { id } = useParams();
  const { user, isLoading, error } = useUserDetail(id || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error.message}</p>
        <Link to="/admin/user" className="mt-4 inline-block">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar User
          </Button>
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">User tidak ditemukan</p>
        <Link to="/admin/user" className="mt-4 inline-block">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar User
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/admin/user">User</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail User</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Detail User</h1>
        <Link to="/admin/user">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{user.nama}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Email</h3>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Nomor Telepon</h3>
              <p className="mt-1">{user.noTelp}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Instansi</h3>
              <p className="mt-1">{user.instansi || "-"}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Status</h3>
              <p className="mt-1">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  user.status === "verified"
                    ? "bg-green-100 text-green-800"
                    : user.status === "unverified"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {user.status || "unverified"}
                </span>
              </p>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <h3 className="font-medium text-sm text-gray-500">Alamat</h3>
            <p className="mt-1">{user.alamat}</p>
          </div>

          {/* Foto */}
          {user.foto && (
            <div>
              <h3 className="font-medium text-sm text-gray-500 mb-2">Foto</h3>
              <img
                src={`http://localhost:5000${user.foto}`}
                alt={user.nama}
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Dibuat pada</h3>
              <p className="mt-1">
                {user.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : "-"
                }
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Terakhir diupdate</h3>
              <p className="mt-1">
                {user.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : "-"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetail;
