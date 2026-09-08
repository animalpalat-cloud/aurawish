import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  PlusCircle, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Heart,
  Layers,
  Share2,
  FileEdit
} from 'lucide-react';
import { cardService } from '../services/cardService';
import { useAuth } from '../contexts/AuthContext';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { EmptyState } from '../components/dashboard/EmptyState';
import { ShareModal } from '../components/sharing/ShareModal';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [cards, setCards] = useState([]);

  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'published' | 'drafts'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardForShare, setSelectedCardForShare] = useState(null);

  const loadCards = async () => {
    try {
      const list = await cardService.fetchCards();
      setCards(list || []);
    } catch (e) {
      console.warn('Could not load cards:', e);
      setCards(cardService.getCards());
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleDuplicate = async (id) => {
    const duplicated = await cardService.duplicateCard(id);
    if (duplicated) {
      await loadCards();
      addToast('Card duplicated successfully!', 'success');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this birthday card?')) {
      await cardService.deleteCard(id);
      await loadCards();
      addToast('Card removed from dashboard', 'info');
    }
  };

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.message?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'published') return !card.isDraft;
    if (filterTab === 'drafts') return !!card.isDraft;
    return true;
  });

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Personal Card Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              {user?.name ? `${user.name}’s Studio Cards` : 'My Birthday Cards'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your created greeting cards, track recipient views, and share direct links.
            </p>

          </div>

          <Link to="/templates">
            <Button variant="primary" size="md" icon={PlusCircle} className="shadow-lg shadow-brand-500/20">
              Create New Card
            </Button>
          </Link>
        </div>

        {/* Filter Tabs and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tab Buttons */}
          <div className="flex items-center bg-[#11141e] border border-slate-800 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setFilterTab('all')}
              className={`inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterTab === 'all'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>All Cards ({cards.length})</span>
            </button>
            <button
              onClick={() => setFilterTab('published')}
              className={`inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterTab === 'published'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ready to Share ({cards.filter(c => !c.isDraft).length})</span>
            </button>
            <button
              onClick={() => setFilterTab('drafts')}
              className={`inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterTab === 'drafts'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Drafts ({cards.filter(c => c.isDraft).length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#11141e] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Card Grid */}
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <DashboardCard
                key={card.id}
                card={card}
                onShare={(c) => setSelectedCardForShare(c)}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchQuery ? "No matching cards found" : "No cards in this category yet"}
            description={
              searchQuery
                ? `No cards found matching "${searchQuery}". Try a different search.`
                : "Pick any of our luxury birthday templates and start crafting a custom celebration card now."
            }
          />
        )}

      </div>

      {/* Share Modal */}
      {selectedCardForShare && (
        <ShareModal
          isOpen={!!selectedCardForShare}
          onClose={() => setSelectedCardForShare(null)}
          shareId={selectedCardForShare.shareId}
          recipientName={selectedCardForShare.recipientName}
        />
      )}
    </div>
  );
};

export default DashboardPage;
