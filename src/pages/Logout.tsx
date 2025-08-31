import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { toast } from 'sonner';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        toast.success("Logged out successfully");
        navigate('/login');
      } catch (err) {
        console.error("Error logging out:", err);
        toast.error("Failed to log out");
      }
    };
    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <p className="text-white">Logging out...</p>
    </div>
  );
};

export default Logout;