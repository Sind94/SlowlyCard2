import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { mockExpansions, generateRandomCards, saveFoundCards, getLocalUserData } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';

const Spacchetta = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedExpansion, setSelectedExpansion] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const [openedCards, setOpenedCards] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSelectExpansion = (expansion) => {
    setSelectedExpansion(expansion);
    setOpenedCards([]);
    setShowResults(false);
  };

  const handleOpenPack = async () => {
    setIsOpening(true);
    
    // Simulazione apertura pacchetto con animazione
    setTimeout(() => {
      const newCards = generateRandomCards(selectedExpansion.id);
      setOpenedCards(newCards);
      
      // Salva le carte trovate
      const cardIds = newCards.map(card => card.id);
      saveFoundCards(cardIds);
      
      // Conta le nuove carte uniche
      const userData = getLocalUserData();
      const newUniqueCards = cardIds.filter(id => !userData.foundCards.includes(id));
      
      setIsOpening(false);
      setShowResults(true);
      
      toast({
        title: "Pacchetto aperto!",
        description: newUniqueCards.length > 0 
          ? `Hai trovato ${newUniqueCards.length} nuove carte uniche!` 
          : "Tutte carte già in collezione, ma sempre belle da vedere!",
      });
    }, 2000);
  };

  const CardRevealAnimation = ({ card, index }) => (
    <Card 
      className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-400/30 backdrop-blur-sm transform transition-all duration-500 hover:scale-105"
      style={{ 
        animationDelay: `${index * 0.2}s`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      <CardContent className="p-4">
        <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden">
          <img 
            src={card.image} 
            alt={card.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold text-center text-white">
          {card.name}
        </h3>
        <Badge 
          variant="secondary" 
          className="w-full mt-2 bg-yellow-500/20 text-yellow-300 justify-center"
        >
          ✨ Nuova Carta!
        </Badge>
      </CardContent>
    </Card>
  );

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900">
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">
                Pacchetto Aperto! 🎉
              </h1>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Home
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Le tue nuove carte!
            </h2>
            <p className="text-xl text-white/80">
              Da: {selectedExpansion.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {openedCards.map((card, index) => (
              <CardRevealAnimation key={card.id} card={card} index={index} />
            ))}
          </div>

          <div className="text-center space-y-4">
            <Button 
              onClick={() => {
                setShowResults(false);
                setOpenedCards([]);
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white mr-4"
            >
              Apri un altro pacchetto
            </Button>
            <Button 
              onClick={() => navigate('/album')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Vai all'Album
            </Button>
          </div>
        </main>

        <style jsx>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  if (selectedExpansion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setSelectedExpansion(null)}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                ← Torna alle Espansioni
              </Button>
              <h1 className="text-2xl font-bold text-white">
                {selectedExpansion.name}
              </h1>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Home
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div 
                className="w-48 h-64 mx-auto mb-6 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: selectedExpansion.color }}
              >
                <img 
                  src={selectedExpansion.image} 
                  alt={selectedExpansion.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Pacchetto {selectedExpansion.name}
              </h2>
              <p className="text-xl text-white/80 mb-8">
                {selectedExpansion.description}
              </p>
            </div>

            {isOpening ? (
              <div className="space-y-6">
                <div className="animate-spin w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto"></div>
                <p className="text-2xl text-white animate-pulse">
                  Apertura del pacchetto in corso...
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="text-6xl mb-4">🎁</div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Pronto per l'apertura!
                    </h3>
                    <p className="text-white/80 mb-6">
                      Ogni pacchetto contiene 5 carte casuali dall'espansione {selectedExpansion.name}
                    </p>
                    <Button 
                      onClick={handleOpenPack}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xl px-8 py-4 transform transition-all duration-200 hover:scale-105"
                      size="lg"
                    >
                      🎉 Apri Pacchetto!
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4 text-sm text-white/60">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold mb-1">Carte totali:</p>
                    <p>{selectedExpansion.totalCards}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="font-semibold mb-1">Probabilità:</p>
                    <p>Tutte uguali</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Spacchetta
            </h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
              {user?.nickname}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Home
            </Button>
            <Button 
              onClick={logout}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Scegli un'Espansione
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Seleziona l'espansione da cui vuoi aprire un pacchetto. Ogni pacchetto contiene 5 carte casuali!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockExpansions.map((expansion) => (
            <Card 
              key={expansion.id}
              className="bg-gradient-to-br from-black/40 to-black/20 border-white/10 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => handleSelectExpansion(expansion)}
            >
              <CardHeader className="text-center">
                <div 
                  className="w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden transform transition-all duration-300 group-hover:rotate-3 shadow-xl"
                  style={{ backgroundColor: expansion.color }}
                >
                  <img 
                    src={expansion.image} 
                    alt={expansion.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-2xl text-white mb-2">
                  {expansion.name}
                </CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  {expansion.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <Badge 
                    className="text-lg px-4 py-2 text-white"
                    style={{ backgroundColor: expansion.color }}
                  >
                    5 carte per pacchetto
                  </Badge>
                  <p className="text-white/60">
                    {expansion.totalCards} carte totali disponibili
                  </p>
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4">
                    <p className="text-yellow-300 font-semibold text-sm">
                      ✨ Clicca per aprire un pacchetto!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Come Funziona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-4xl">🎯</div>
                  <h3 className="text-lg font-semibold text-white">Scegli</h3>
                  <p className="text-white/70 text-sm">Seleziona l'espansione che preferisci</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl">🎁</div>
                  <h3 className="text-lg font-semibold text-white">Apri</h3>
                  <p className="text-white/70 text-sm">Apri il pacchetto e scopri le carte</p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl">📚</div>
                  <h3 className="text-lg font-semibold text-white">Colleziona</h3>
                  <p className="text-white/70 text-sm">Ogni carta unica viene salvata nel tuo album</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Spacchetta;