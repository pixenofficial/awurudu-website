import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/LanguageContext';
import { 
  Settings, Users, Clock, BookOpen, HelpCircle, 
  Plus, Trash2, Edit2, Save, X, ShieldCheck, 
  AlertTriangle, CheckCircle2, RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';

const ADMIN_EMAIL = 'webpixen@gmail.com';

export default function AdminPortal() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'nakath' | 'recipes' | 'quiz' | 'contestants'>('nakath');
  const [data, setData] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      fetchData();
    }
  }, [user, activeTab]);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }

  async function fetchData() {
    setLoading(true);
    let table = '';
    switch (activeTab) {
      case 'nakath': table = 'auspicious_times'; break;
      case 'recipes': table = 'recipes'; break;
      case 'quiz': table = 'quiz_questions'; break;
      case 'contestants': table = 'contestants'; break;
    }

    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (!error) setData(data || []);
    setLoading(false);
  }

  async function handleSave(id?: string) {
    let table = '';
    switch (activeTab) {
      case 'nakath': table = 'auspicious_times'; break;
      case 'recipes': table = 'recipes'; break;
      case 'quiz': table = 'quiz_questions'; break;
      case 'contestants': table = 'contestants'; break;
    }

    if (id) {
      const { error } = await supabase.from(table).update(editForm).eq('id', id);
      if (error) {
        setStatus({ type: 'error', message: error.message });
      } else {
        setStatus({ type: 'success', message: t('updatedSuccessfully') });
        setIsEditing(null);
        fetchData();
      }
    } else {
      const { error } = await supabase.from(table).insert([editForm]);
      if (error) {
        setStatus({ type: 'error', message: error.message });
      } else {
        setStatus({ type: 'success', message: t('addedSuccessfully') });
        setIsAdding(false);
        fetchData();
      }
    }
    setTimeout(() => setStatus(null), 3000);
  }

  async function handleDelete(id: string) {
    if (!confirm(t('areYouSureDelete'))) return;

    let table = '';
    switch (activeTab) {
      case 'nakath': table = 'auspicious_times'; break;
      case 'recipes': table = 'recipes'; break;
      case 'quiz': table = 'quiz_questions'; break;
      case 'contestants': table = 'contestants'; break;
    }

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      setStatus({ type: 'success', message: t('deletedSuccessfully') });
      fetchData();
    }
    setTimeout(() => setStatus(null), 3000);
  }

  const getInitialForm = () => {
    switch (activeTab) {
      case 'nakath': return { 
        title: '', 
        description: '', 
        time: '', 
        category: 'Tradition', 
        direction: '', 
        color: '', 
        icon: 'Clock' 
      };
      case 'recipes': return { 
        title: '', 
        description: '', 
        image_url: '', 
        category: 'Traditional', 
        prep_time: '', 
        servings: '', 
        ingredients: [], 
        instructions: [] 
      };
      case 'quiz': return { 
        question: '', 
        options: ['', '', '', ''], 
        correct_answer: 0 
      };
      case 'contestants': return { 
        name: '', 
        category: 'Prince', 
        image_url: '', 
        votes: 0 
      };
      default: return {};
    }
  };

  const renderField = (key: string, value: any) => {
    if (['id', 'created_at', 'updated_at'].includes(key)) return null;

    if (Array.isArray(value)) {
      return (
        <div key={key} className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">{key.replace('_', ' ')}</label>
          <div className="space-y-2">
            {value.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-[#D41922] outline-none transition-all"
                  value={item}
                  onChange={(e) => {
                    const newArr = [...value];
                    newArr[index] = e.target.value;
                    setEditForm({ ...editForm, [key]: newArr });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newArr = value.filter((_, i) => i !== index);
                    setEditForm({ ...editForm, [key]: newArr });
                  }}
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setEditForm({ ...editForm, [key]: [...value, ''] })}
              className="w-full p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:border-[#D41922] hover:text-[#D41922] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> {t('addNew')}
            </button>
          </div>
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">{key.replace('_', ' ')}</label>
          <textarea 
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-2 focus:ring-[#D41922] outline-none transition-all"
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const val = JSON.parse(e.target.value);
                setEditForm({ ...editForm, [key]: val });
              } catch (err) {}
            }}
            rows={4}
          />
        </div>
      );
    }

    return (
      <div key={key} className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-gray-400">{key.replace('_', ' ')}</label>
        <input 
          type={typeof value === 'number' ? 'number' : 'text'}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold focus:ring-2 focus:ring-[#D41922] outline-none transition-all"
          value={value}
          onChange={(e) => setEditForm({ ...editForm, [key]: typeof value === 'number' ? Number(e.target.value) : e.target.value })}
        />
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <RefreshCw className="w-12 h-12 text-[#D41922] animate-spin" />
    </div>
  );

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
          <ShieldCheck size={48} />
        </div>
        <h1 className="text-3xl font-black text-[#1A1A1A]">{t('accessDenied')}</h1>
        <p className="text-gray-600 max-w-md">
          {t('adminReserved')}
        </p>
        <button 
          onClick={() => window.location.href = '/profile'}
          className="px-8 py-3 bg-[#D41922] text-white rounded-2xl font-bold shadow-xl hover:bg-[#B0141B] transition-all"
        >
          {t('goToProfile')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#D41922] rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
            <Settings size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tight">{t('adminPortal')}</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{t('manageAvuruduHub')}</p>
          </div>
        </div>

        {status && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg",
              status.type === 'success' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}
          >
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            {status.message}
          </motion.div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-3xl shadow-sm border border-gray-100">
        {[
          { id: 'nakath', label: t('nakath'), icon: Clock },
          { id: 'recipes', label: t('recipes'), icon: BookOpen },
          { id: 'quiz', label: t('quiz'), icon: HelpCircle },
          { id: 'contestants', label: t('contestants'), icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all",
              activeTab === tab.id 
                ? "bg-[#D41922] text-white shadow-lg" 
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-black text-[#1A1A1A] capitalize">{t(activeTab)} {t('management')}</h2>
          <button 
            onClick={() => {
              setEditForm(getInitialForm());
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#D41922] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#B0141B] transition-all"
          >
            <Plus size={16} />
            {t('addNew')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest">
                <th className="px-6 py-4">{t('idName')}</th>
                <th className="px-6 py-4">{t('details')}</th>
                <th className="px-6 py-4">{t('status')}</th>
                <th className="px-6 py-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#1A1A1A]">
                      {item.title || item.name || item.question || item.id.substring(0, 8)}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">{item.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 line-clamp-1 max-w-xs">
                      {item.description || item.instructions || item.answer || 'No details available'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700">
                      {t('active')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setIsEditing(item.id);
                          setEditForm(item);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-bold italic">
                    {t('noItemsFound')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {(isEditing || isAdding) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-black text-[#1A1A1A]">{isAdding ? t('addNewItem') : t('editItem')}</h3>
              <button onClick={() => { setIsEditing(null); setIsAdding(false); }} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {Object.keys(editForm).map((key) => renderField(key, editForm[key]))}
            </div>
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => handleSave(isEditing || undefined)}
                className="flex-1 py-4 bg-[#D41922] text-white rounded-2xl font-black text-lg shadow-xl hover:bg-[#B0141B] transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {isAdding ? t('createItem') : t('saveChanges')}
              </button>
              <button 
                onClick={() => { setIsEditing(null); setIsAdding(false); }}
                className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all"
              >
                {t('cancel')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>

  );
}
