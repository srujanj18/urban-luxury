import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const AdminUsers = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin-login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 mb-6">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-amber-500" />
            <h1 className="text-2xl font-bold text-white">Manage Users</h1>
          </div>
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="outline"
            className="text-white border-slate-600 hover:bg-slate-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </header>
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-6 w-6 mr-2 text-amber-500" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white text-center">User management coming soon.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;