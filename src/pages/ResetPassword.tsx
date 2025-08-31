import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { confirmPasswordReset, verifyPasswordResetCode, AuthError } from 'firebase/auth';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [oobCode, setOobCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  useEffect(() => {
    // The 'oobCode' is the verification code from the email link
    const code = searchParams.get('oobCode');
    if (!code) {
      setError('Invalid or missing password reset link. Please request a new one.');
      setLoading(false);
      return;
    }

    setOobCode(code);

    // Verify the code is valid before showing the password form
    verifyPasswordResetCode(auth, code)
      .then((email) => {
        setMessage(`You can now reset the password for ${email}.`);
        setIsCodeVerified(true);
      })
      .catch((err: AuthError) => {
        switch (err.code) {
          case 'auth/expired-action-code':
            setError('This password reset link has expired. Please request a new one.');
            break;
          case 'auth/invalid-action-code':
            setError('This password reset link is invalid. It may have already been used.');
            break;
          default:
            setError('An error occurred. Please try the link again or request a new one.');
            break;
        }
        console.error("Verification Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!oobCode) {
        setError('An unexpected error occurred. Missing reset code.');
        return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Your password has been reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/admin-login');
      }, 3000);
    } catch (err) {
      const error = err as AuthError;
      switch (error.code) {
        case 'auth/weak-password':
          setError('The password is too weak. It must be at least 6 characters long.');
          break;
        default:
          setError('Failed to reset password. The link may have expired. Please try again.');
          break;
      }
      console.error("Reset Error:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div>Verifying link...</div></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}
        
        {isCodeVerified && !message.includes('Redirecting') && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block mb-1">New Password</label>
              <input type="password" className="w-full border px-3 py-2 rounded" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoFocus />
            </div>
            <div className="mb-6">
              <label className="block mb-1">Confirm New Password</label>
              <input type="password" className="w-full border px-3 py-2 rounded" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;