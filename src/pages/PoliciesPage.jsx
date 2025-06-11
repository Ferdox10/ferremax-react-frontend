import { useState, useEffect } from 'react';
import { getPolicies } from '../services/api';
import { Shield, Truck, Undo, Lock, Users } from 'lucide-react';

const iconMap = {
    Shield: <Shield className="text-orange-500 w-6 h-6 mr-4"/>,
    Truck: <Truck className="text-orange-500 w-6 h-6 mr-4"/>,
    Undo: <Undo className="text-orange-500 w-6 h-6 mr-4"/>,
    Lock: <Lock className="text-orange-500 w-6 h-6 mr-4"/>,
    Users: <Users className="text-orange-500 w-6 h-6 mr-4"/>
};

export default function PoliciesPage() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const response = await getPolicies();
                setPolicies(response.data.policies);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchPolicies();
    }, []);

    if (loading) return <p>Cargando políticas...</p>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Políticas de la Empresa</h1>
            </div>
            <div className="space-y-6">
                {policies.map(policy => (
                    <div key={policy.id} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            {iconMap[policy.icono] || iconMap.Shield}
                            <h2 className="text-2xl font-semibold">{policy.titulo}</h2>
                        </div>
                        <p className="mt-4 text-gray-600 pl-10">{policy.contenido}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
