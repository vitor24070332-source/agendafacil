import { useState, useEffect } from 'react';
import api from '../services/api';

const STATUS_LABEL = { CONFIRMED: 'Confirmado', CANCELLED: 'Cancelado', COMPLETED: 'Concluído' };
const STATUS_COLOR = { CONFIRMED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700', COMPLETED: 'bg-blue-100 text-blue-700' };

export default function Agendamentos() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ professionalId: '', serviceId: '', scheduledAt: '' });
  const [services, setServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchAppointments(); fetchServices(); }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/api/appointments');
      setAppointments(data);
    } catch { setError('Erro ao carregar agendamentos'); }
    finally { setLoading(false); }
  };

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/api/services');
      setServices(data);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/appointments', form);
      setAppointments(prev => [...prev, data]);
      setShowForm(false);
      setForm({ professionalId: '', serviceId: '', scheduledAt: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar agendamento');
    } finally { setSubmitting(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Confirmar cancelamento?')) return;
    try {
      await api.patch(`/api/appointments/${id}/cancel`);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao cancelar');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Meus Agendamentos</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
          + Novo Agendamento
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-700">Novo Agendamento</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
            <select required value={form.serviceId}
              onChange={e => {
                const svc = services.find(s => s.id === e.target.value);
                setForm({ ...form, serviceId: e.target.value, professionalId: svc?.professionalId || '' });
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Selecione um serviço</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name} — R$ {s.price}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
            <input type="datetime-local" required value={form.scheduledAt}
              onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50">
              {submitting ? 'Agendando...' : 'Confirmar'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-8">Carregando...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="space-y-3">
          {appointments.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{a.service?.name || 'Serviço'}</p>
                <p className="text-sm text-gray-500">{new Date(a.scheduledAt).toLocaleString('pt-BR')}</p>
                {a.professional?.user?.name && <p className="text-sm text-gray-500">Com: {a.professional.user.name}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[a.status]}`}>
                  {STATUS_LABEL[a.status]}
                </span>
                {a.status === 'CONFIRMED' && (
                  <button onClick={() => handleCancel(a.id)} className="text-red-500 text-sm hover:underline">
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
