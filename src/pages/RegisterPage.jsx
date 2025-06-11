import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await register({ username, email, password });
      if (response.data.success) {
        setSuccess('¡Registro exitoso! Serás redirigido al inicio de sesión.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message || 'Error en el registro.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">Crear una Cuenta</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            {success && <p className="text-sm text-green-600 text-center">{success}</p>}
            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50">
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </div>
          </form>
           <p className="text-sm text-center text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}