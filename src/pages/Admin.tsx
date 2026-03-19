import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Plus, Trash2, Edit2, LogOut, X, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'nakath' | 'recipes'>('nakath');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Queries
  const { data: nakathList, isLoading: loadingNakath } = useQuery({
    queryKey: ['nakath-admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('nakath').select('*').order('time', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  const { data: recipesList, isLoading: loadingRecipes } = useQuery({
    queryKey: ['recipes-admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('recipes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  // Mutations
  const upsertMutation = useMutation({
    mutationFn: async (item: any) => {
      const table = activeTab;
      const { data, error } = await supabase.from(table).upsert(item).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [activeTab === 'nakath' ? 'nakath-admin' : 'recipes-admin'] });
      queryClient.invalidateQueries({ queryKey: [activeTab] });
      setIsModalOpen(false);
      setEditingItem(null);
    },
    onError: (error: any) => alert(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(activeTab).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [activeTab === 'nakath' ? 'nakath-admin' : 'recipes-admin'] });
      queryClient.invalidateQueries({ queryKey: [activeTab] });
    },
    onError: (error: any) => alert(error.message),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const item: any = Object.fromEntries(formData.entries());
    
    if (activeTab === 'nakath') {
      item.time = new Date(item.time).toISOString();
    } else {
      item.ingredients = item.ingredients.split(',').map((i: string) => i.trim());
    }

    if (editingItem) {
      item.id = editingItem.id;
    }

    upsertMutation.mutate(item);
  };

  if (!session) {
    return (
      <div className="max-w-md mx-auto py-20">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-[#D41922]">
          <div className="flex justify-center mb-6">
            <div className="bg-[#D41922] p-4 rounded-full text-white">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-8">Admin Portal</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#D41922] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#D41922] outline-none"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#D41922] text-white py-4 rounded-xl font-bold hover:bg-[#B3151C] transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome, {session.user.email}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-[#D41922] font-bold text-sm transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="flex gap-4">
        <TabButton active={activeTab === 'nakath'} onClick={() => setActiveTab('nakath')} label="Nakath Times" />
        <TabButton active={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')} label="Recipes" />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold capitalize">{activeTab} Management</h2>
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="bg-[#D41922] text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#B3151C] transition-colors"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 font-bold text-sm uppercase tracking-widest text-gray-400">Title</th>
                <th className="pb-4 font-bold text-sm uppercase tracking-widest text-gray-400">Details</th>
                <th className="pb-4 font-bold text-sm uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeTab === 'nakath' ? (
                nakathList?.map(item => (
                  <tr key={item.id} className="group">
                    <td className="py-4 font-bold text-[#D41922]">{item.title}</td>
                    <td className="py-4 text-sm text-gray-500">{new Date(item.time).toLocaleString()}</td>
                    <td className="py-4 text-right space-x-2">
                      <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(item.id); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              ) : (
                recipesList?.map(item => (
                  <tr key={item.id} className="group">
                    <td className="py-4 font-bold text-[#D41922]">{item.title}</td>
                    <td className="py-4 text-sm text-gray-500">{item.ingredients.length} Ingredients</td>
                    <td className="py-4 text-right space-x-2">
                      <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(item.id); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#D41922] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingItem ? 'Edit' : 'Add New'} {activeTab}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {activeTab === 'nakath' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Title</label>
                    <input name="title" defaultValue={editingItem?.title} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#D41922] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Time</label>
                    <input name="time" type="datetime-local" defaultValue={editingItem ? new Date(editingItem.time).toISOString().slice(0, 16) : ''} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#D41922] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
                    <textarea name="description" defaultValue={editingItem?.description} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#D41922] outline-none h-24" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Title</label>
                    <input name="title" defaultValue={editingItem?.title} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#D41922] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Image URL</label>
                    <input name="image_url" defaultValue={editingItem?.image_url} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#D41922] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Ingredients (comma separated)</label>
                    <input name="ingredients" defaultValue={editingItem?.ingredients?.join(', ')} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#D41922] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Instructions</label>
                    <textarea name="instructions" defaultValue={editingItem?.instructions} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#D41922] outline-none h-24" />
                  </div>
                </>
              )}
              <button 
                type="submit" 
                disabled={upsertMutation.isPending}
                className="w-full bg-[#D41922] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#B3151C] transition-colors disabled:opacity-50"
              >
                <Save size={20} />
                {upsertMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
        active ? 'bg-[#D41922] text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
