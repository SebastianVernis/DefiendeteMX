'use client';

import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

/**
 * Contactos de Emergencia - Red de apoyo y recursos
 */
export default function ContactosPage() {
  const [contacts, setContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    email: '',
    isPrimary: false,
    notes: ''
  });

  useEffect(() => {
    loadContacts();
    loadEmergencyNumbers();
  }, []);

  const loadContacts = () => {
    const saved = localStorage.getItem('emergencyContacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    }
  };

  const saveContact = () => {
    if (!formData.name || !formData.phone) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    const updated = [...contacts, newContact];
    setContacts(updated);
    localStorage.setItem('emergencyContacts', JSON.stringify(updated));

    setFormData({ name: '', phone: '', relationship: '', email: '', isPrimary: false, notes: '' });
    setShowAddForm(false);
  };

  const deleteContact = (id) => {
    if (confirm('¿Eliminar este contacto?')) {
      const updated = contacts.filter(c => c.id !== id);
      setContacts(updated);
      localStorage.setItem('emergencyContacts', JSON.stringify(updated));
    }
  };

  const officialContacts = [
    {
      category: 'Emergencias',
      color: 'red',
      items: [
        { name: 'Emergencias', phone: '911', icon: '🚨', description: 'Policía, Bomberos, Ambulancia' },
        { name: 'Cruz Roja', phone: '065', icon: '🏥', description: 'Atención médica de emergencia' },
        { name: 'Ángeles Verdes', phone: '078', icon: '🚗', description: 'Asistencia vial' }
      ]
    },
    {
      category: 'Apoyo Legal y DDHH',
      color: 'blue',
      items: [
        { name: 'CNDH', phone: '5556818125', icon: '⚖️', description: 'Comisión Nacional de Derechos Humanos' },
        { name: 'FGR', phone: '5553461900', icon: '👮', description: 'Fiscalía General de la República' },
        { name: 'Visitaduría', phone: '8000153515', icon: '📋', description: 'Quejas contra servidores públicos' }
      ]
    },
    {
      category: 'Violencia y Género',
      color: 'purple',
      items: [
        { name: 'Línea Mujeres', phone: '5556581111', icon: '👩', description: 'Atención 24/7 para violencia' },
        { name: 'INMUJERES', phone: '8008224996', icon: '💜', description: 'Instituto Nacional de las Mujeres' },
        { name: 'Locatel', phone: '5556581111', icon: '📞', description: 'Información y orientación CDMX' }
      ]
    },
    {
      category: 'Adicciones y Salud Mental',
      color: 'green',
      items: [
        { name: 'Línea de la Vida', phone: '8009112000', icon: '🧠', description: 'Prevención de adicciones' },
        { name: 'SAPTEL', phone: '5552595121', icon: '💚', description: 'Sistema de Apoyo Psicológico por Teléfono' },
        { name: 'Consejo Ciudadano', phone: '5555335533', icon: '📱', description: 'Apoyo psicológico y denuncia' }
      ]
    },
    {
      category: 'Niñez y Adolescencia',
      color: 'yellow',
      items: [
        { name: 'DIF Nacional', phone: '8003392000', icon: '👶', description: 'Protección de niños y adolescentes' },
        { name: 'Alerta Amber', phone: '8008342678', icon: '🚸', description: 'Menores extraviados' },
        { name: 'SIPINNA', phone: '8006962000', icon: '👨‍👩‍👧', description: 'Sistema de Protección Integral' }
      ]
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Red de Contactos de Emergencia
            </h1>
            <p className="text-gray-600">
              Mantén a mano los contactos que pueden ayudarte en una emergencia
            </p>
          </div>

          {/* Mis Contactos Personales */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>👥</span>
                Mis Contactos de Confianza
              </h2>
              <Button variant="primary" icon="➕" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Cancelar' : 'Agregar Contacto'}
              </Button>
            </div>

            {showAddForm && (
              <Card className="mb-6">
                <h3 className="font-bold text-lg mb-4">Nuevo Contacto</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre completo *"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono *"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Relación (Ej: Hermano, Amigo)"
                    value={formData.relationship}
                    onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    placeholder="Notas adicionales"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="md:col-span-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isPrimary}
                      onChange={(e) => setFormData({...formData, isPrimary: e.target.checked})}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                    <span className="text-sm font-medium">Contacto primario</span>
                  </label>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="primary" onClick={saveContact}>Guardar</Button>
                  <Button variant="secondary" onClick={() => setShowAddForm(false)}>Cancelar</Button>
                </div>
              </Card>
            )}

            {contacts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} hover>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👤</span>
                        {contact.isPrimary && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Primario</span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">{contact.name}</h3>
                    {contact.relationship && (
                      <p className="text-sm text-gray-600 mb-2">{contact.relationship}</p>
                    )}
                    <a
                      href={`tel:${contact.phone}`}
                      className="block text-purple-600 font-semibold hover:underline mb-1"
                    >
                      📞 {contact.phone}
                    </a>
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="block text-sm text-gray-600 hover:underline"
                      >
                        ✉️ {contact.email}
                      </a>
                    )}
                    {contact.notes && (
                      <p className="text-xs text-gray-500 mt-2 border-t pt-2">{contact.notes}</p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <div className="text-5xl mb-3">👥</div>
                <p className="text-gray-600">No hay contactos guardados</p>
                <p className="text-sm text-gray-500 mt-1">Agrega personas de confianza que puedan ayudarte en emergencias</p>
              </Card>
            )}
          </section>

          {/* Números Oficiales */}
          {officialContacts.map((section) => (
            <section key={section.category} className="mb-8">
              <h2 className="text-xl font-bold mb-4">{section.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, index) => (
                  <Card key={index} hover>
                    <div className="flex items-start gap-3">
                      <span className="text-3xl flex-shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                        <a
                          href={`tel:${item.phone}`}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all bg-${section.color}-500 hover:bg-${section.color}-600`}
                        >
                          📞 {item.phone}
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))}

        </div>
      </main>
      <Footer />
    </>
  );
}
