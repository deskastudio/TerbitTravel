import { useParams, useNavigate } from "react-router-dom";
import { useUserDetail } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { 
  ArrowLeft, 
  Loader2, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar, 
  Clock,
  User,
  Shield,
  Eye,
  Edit,
  Users,
  Copy,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading, error } = useUserDetail(id || "");

  // Debug logs
  console.log("User Detail - ID:", id);
  console.log("User Detail - User Data:", user);
  console.log("User Detail - Loading:", isLoading);
  console.log("User Detail - Error:", error);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "unverified":
        return "bg-yellow-100 text-yellow-800";
      case "incomplete_profile":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "verified":
        return "Terverifikasi";
      case "unverified":
        return "Belum Verifikasi";
      case "incomplete_profile":
        return "Profil Tidak Lengkap";
      default:
        return "Tidak Diketahui";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4" />;
      case "unverified":
        return <AlertCircle className="w-4 h-4" />;
      case "incomplete_profile":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil!",
      description: `${label} berhasil disalin ke clipboard`,
    });
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Tidak diketahui";
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysJoined = (createdAt: string | undefined) => {
    if (!createdAt) return 0;
    return Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 3600 * 24));
  };

  const calculateProfileCompleteness = (user: any) => {
    const fields = [user?.nama, user?.email, user?.noTelp, user?.alamat, user?.instansi];
    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat detail user...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Terjadi Kesalahan</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => navigate("/admin/user")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar User
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-lg font-semibold mb-2">User Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-4">User yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Button onClick={() => navigate("/admin/user")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar User
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Button 
              variant="link" 
              onClick={() => navigate("/admin/user")}
              className="p-0 text-blue-600 hover:text-blue-800"
            >
              User
            </Button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">Detail User</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.nama}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {user.email}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-blue-500" />
              {user.noTelp}
            </Badge>
            <Badge className={`flex items-center gap-1 ${getStatusVariant(user.status || 'unverified')}`}>
              {getStatusIcon(user.status || 'unverified')}
              {getStatusLabel(user.status || 'unverified')}
            </Badge>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/user/${user._id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/user")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Photo */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-[16/6] bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 mx-auto mb-4 relative">
                        {user.foto ? (
                          <img
                            src={`http://localhost:5000${user.foto}`}
                            alt={user.nama}
                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full bg-white/20 backdrop-blur-sm rounded-full border-4 border-white flex items-center justify-center ${user.foto ? 'hidden' : ''}`}>
                          <User className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold">{user.nama}</h2>
                      <p className="text-white/80">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className={getStatusVariant(user.status || 'unverified')}>
                    {getStatusLabel(user.status || 'unverified')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded"></div>
                Informasi Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Nama Lengkap</p>
                      <p className="text-blue-700 font-semibold">{user.nama}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(user.nama, "Nama")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-green-700 font-semibold">{user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(user.email, "Email")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Nomor Telepon</p>
                      <p className="text-purple-700 font-semibold">{user.noTelp}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(user.noTelp, "Nomor telepon")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Building className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Instansi</p>
                      <p className="text-orange-700 font-semibold">{user.instansi || "Tidak ada"}</p>
                    </div>
                    {user.instansi && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(user.instansi!, "Instansi")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  Alamat
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <p className="text-gray-700">{user.alamat || "Alamat belum diisi"}</p>
                  {user.alamat && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(user.alamat, "Alamat")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded"></div>
                Aktivitas Akun
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Bergabung Pada</p>
                      <p className="text-green-700 font-medium">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Terakhir Update</p>
                      <p className="text-blue-700 font-medium">
                        {formatDate(user.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-600 rounded"></div>
                Status Akun
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  {user.status === 'verified' ? (
                    <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-yellow-100 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-yellow-600" />
                    </div>
                  )}
                </div>
                <Badge className={`text-sm ${getStatusVariant(user.status || 'unverified')}`}>
                  {getStatusLabel(user.status || 'unverified')}
                </Badge>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verifikasi Email</span>
                  <Badge variant={user.status === 'verified' ? 'default' : 'secondary'}>
                    {user.status === 'verified' ? 'Terverifikasi' : 'Belum'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profil Lengkap</span>
                  <Badge variant={user.status !== 'incomplete_profile' ? 'default' : 'destructive'}>
                    {user.status !== 'incomplete_profile' ? 'Lengkap' : 'Tidak Lengkap'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded"></div>
                Statistik User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {calculateDaysJoined(user.createdAt)}
                  </div>
                  <div className="text-sm text-gray-600">Hari Bergabung</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {user.foto ? 1 : 0}
                  </div>
                  <div className="text-sm text-gray-600">Foto Profil</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {[user.nama, user.email, user.noTelp, user.alamat, user.instansi].filter(Boolean).length}
                  </div>
                  <div className="text-sm text-gray-600">Data Terisi</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {calculateProfileCompleteness(user)}%
                  </div>
                  <div className="text-sm text-gray-600">Kelengkapan</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Info Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-green-600 rounded"></div>
                Ringkasan Informasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID User</label>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 font-mono text-sm bg-gray-100 p-2 rounded flex-1 mr-2">
                      {user._id}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(user._id, "ID User")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Akun</label>
                  <Badge variant="outline" className={getStatusVariant(user.status || 'unverified')}>
                    {getStatusIcon(user.status || 'unverified')}
                    <span className="ml-1">{getStatusLabel(user.status || 'unverified')}</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-600 rounded"></div>
                Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/user/${user._id}/edit`)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(user.email, "Email")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Copy Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(user.noTelp, "Nomor telepon")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Copy Phone
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(window.location.href, "Link halaman")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;