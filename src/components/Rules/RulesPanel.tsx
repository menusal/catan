import React, { useState } from 'react';
import { X, BookOpen, Clock, Hammer, Coins, Skull, Shield, Crown } from 'lucide-react';

interface RulesPanelProps {
  onClose: () => void;
}

type TabType = 'general' | 'turn' | 'build' | 'trade' | 'robber' | 'dev' | 'special';

const RulesPanel: React.FC<RulesPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'turn', label: 'Turno', icon: <Clock className="w-4 h-4" /> },
    { id: 'build', label: 'Construcción', icon: <Hammer className="w-4 h-4" /> },
    { id: 'trade', label: 'Comercio', icon: <Coins className="w-4 h-4" /> },
    { id: 'robber', label: 'Ladrón', icon: <Skull className="w-4 h-4" /> },
    { id: 'dev', label: 'Desarrollo', icon: <Shield className="w-4 h-4" /> },
    { id: 'special', label: 'Especiales', icon: <Crown className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl border border-slate-700 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg transform rotate-3">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">REGLAS OFICIALES</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Guía de Referencia</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-slate-950/30 border-r border-slate-800 p-2 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-2 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg font-bold' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-900/50 custom-scrollbar">
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <section>
                  <h3 className="text-xl font-black text-blue-400 mb-3">Objetivo del Juego</h3>
                  <p className="text-slate-300 leading-relaxed">
                    El objetivo es ser el primer jugador en conseguir <strong className="text-white">10 Puntos de Victoria (PV)</strong>.
                    Los puntos se obtienen construyendo poblados y ciudades, teniendo la carretera más larga, el ejército más grande o mediante cartas de desarrollo de puntos de victoria.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-black text-blue-400 mb-3">Preparación (Setup)</h3>
                  <div className="space-y-3 text-slate-300">
                    <p>El juego comienza con una fase de preparación especial:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Ronda 1:</strong> Cada jugador coloca 1 poblado y 1 carretera en orden (J1 → J2 → J3 → J4).</li>
                      <li><strong>Ronda 2:</strong> Se coloca 1 poblado y 1 carretera en orden inverso (J4 → J3 → J2 → J1).</li>
                      <li><strong>Recursos Iniciales:</strong> Cada jugador recibe los recursos adyacentes a su <strong>segundo</strong> poblado colocado.</li>
                    </ul>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mt-3">
                      <p className="text-yellow-200 text-sm">
                        <strong>Nota:</strong> Es obligatorio colocar exactamente 1 poblado y 1 carretera en cada turno de la fase de preparación. No puedes pasar turno sin construir.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'turn' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <section>
                  <h3 className="text-xl font-black text-blue-400 mb-3">Estructura del Turno</h3>
                  <ol className="list-decimal pl-5 space-y-4 text-slate-300">
                    <li className="pl-2">
                      <strong className="text-white block mb-1">Fase de Producción (Obligatoria)</strong>
                      Lanza los dados. El resultado determina qué hexágonos producen recursos.
                      <ul className="list-disc pl-5 mt-1 text-sm text-slate-400">
                        <li>Si sale un <strong>7</strong>, se activa el Ladrón.</li>
                        <li>Nadie puede comerciar ni construir <em>antes</em> de tirar los dados.</li>
                      </ul>
                    </li>
                    <li className="pl-2">
                      <strong className="text-white block mb-1">Fase de Comercio y Construcción</strong>
                      En cualquier orden, puedes:
                      <ul className="list-disc pl-5 mt-1 text-sm text-slate-400">
                        <li>Intercambiar recursos con la banca (puertos).</li>
                        <li>Construir carreteras, poblados o ciudades.</li>
                        <li>Comprar cartas de desarrollo.</li>
                        <li>Jugar <strong>una</strong> carta de desarrollo (puede hacerse antes de tirar los dados).</li>
                      </ul>
                    </li>
                  </ol>
                </section>
              </div>
            )}

            {activeTab === 'build' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-black text-blue-400 mb-4">Costes de Construcción</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-white">Carretera</h4>
                      <span className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-300">0 PV</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/madera.png')] bg-cover relative shadow-sm" title="Madera"></div>
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/arcilla.png')] bg-cover relative shadow-sm" title="Arcilla"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Conecta poblados. Necesaria para expandirse.</p>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-white">Poblado</h4>
                      <span className="bg-blue-600 text-xs px-2 py-1 rounded text-white font-bold">1 PV</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/madera.png')] bg-cover relative shadow-sm"></div>
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/arcilla.png')] bg-cover relative shadow-sm"></div>
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/trigo.png')] bg-cover relative shadow-sm"></div>
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/lana.png')] bg-cover relative shadow-sm"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Debe estar a 2 tramos de distancia de cualquier otro edificio.</p>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-white">Ciudad</h4>
                      <span className="bg-blue-600 text-xs px-2 py-1 rounded text-white font-bold">2 PV</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/trigo.png')] bg-cover relative shadow-sm"></div>
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/trigo.png')] bg-cover relative shadow-sm"></div>
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/mineral.png')] bg-cover relative shadow-sm"></div>
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/mineral.png')] bg-cover relative shadow-sm"></div>
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/mineral.png')] bg-cover relative shadow-sm"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Sustituye a un poblado. Produce doble recurso.</p>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-white">Carta de Desarrollo</h4>
                      <span className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-300">?</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/trigo.png')] bg-cover relative shadow-sm"></div>
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/lana.png')] bg-cover relative shadow-sm"></div>
                      <div className="w-8 h-8 rounded bg-[url('/assets/cards/mineral.png')] bg-cover relative shadow-sm"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Otorga caballeros, puntos o habilidades especiales.</p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                  <h4 className="font-bold text-blue-300 mb-1">Regla de Distancia</h4>
                  <p className="text-sm text-blue-100">
                    Un poblado solo puede construirse si no hay otro poblado o ciudad (propio o ajeno) en ninguno de los 3 vértices adyacentes. Siempre debe haber al menos <strong>dos tramos de carretera</strong> entre edificios.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'trade' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <section>
                  <h3 className="text-xl font-black text-blue-400 mb-3">Comercio Marítimo (La Banca)</h3>
                  <p className="text-slate-300 mb-4">
                    En tu turno, siempre puedes intercambiar recursos con la reserva general. La tasa de cambio depende de si tienes acceso a puertos.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-slate-700">
                      <div className="bg-slate-700 px-3 py-1 rounded text-white font-black text-lg">4:1</div>
                      <div>
                        <h4 className="font-bold text-white">Tasa Estándar</h4>
                        <p className="text-xs text-slate-400">Sin puertos, entregas 4 iguales por 1 a elección.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-slate-700">
                      <div className="bg-slate-700 px-3 py-1 rounded text-white font-black text-lg">3:1</div>
                      <div>
                        <h4 className="font-bold text-white">Puerto General (?)</h4>
                        <p className="text-xs text-slate-400">Si posees este puerto, entregas 3 iguales por 1 a elección.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-slate-700">
                      <div className="bg-slate-700 px-3 py-1 rounded text-white font-black text-lg">2:1</div>
                      <div>
                        <h4 className="font-bold text-white">Puerto Especializado</h4>
                        <p className="text-xs text-slate-400">Si posees el puerto de un recurso (ej. Madera), entregas 2 de ESE recurso por 1 cualquiera.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'robber' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <section>
                  <h3 className="text-xl font-black text-red-400 mb-3">El Ladrón (Siete)</h3>
                  <p className="text-slate-300 mb-4">
                    Cuando se lanza un total de <strong>7</strong> en los dados, ocurren tres eventos en orden:
                  </p>
                  
                  <ol className="list-decimal pl-5 space-y-4 text-slate-300">
                    <li>
                      <strong className="text-red-300">Descarte por Exceso:</strong>
                      Cualquier jugador que tenga <strong>más de 7 cartas</strong> de recursos debe descartarse de la mitad (redondeado hacia abajo) a la banca.
                    </li>
                    <li>
                      <strong className="text-red-300">Mover el Ladrón:</strong>
                      El jugador que lanzó el 7 (o jugó un Caballero) <strong>debe</strong> mover el Ladrón a un hexágono de terreno diferente.
                      <p className="text-sm mt-1 text-slate-400 italic">Mientras el Ladrón esté en un hexágono, ese terreno NO produce recursos aunque salga su número.</p>
                    </li>
                    <li>
                      <strong className="text-red-300">Robar Recurso:</strong>
                      El jugador que movió el Ladrón puede robar <strong>una carta al azar</strong> de un jugador que tenga un edificio (poblado o ciudad) adyacente al nuevo hexágono del Ladrón.
                    </li>
                  </ol>
                </section>
              </div>
            )}

            {activeTab === 'dev' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <section>
                  <h3 className="text-xl font-black text-purple-400 mb-3">Cartas de Desarrollo</h3>
                  <p className="text-slate-300 mb-4 text-sm">
                    Se compran por 1 Trigo, 1 Lana y 1 Mineral. Se mantiene ocultas en la mano. 
                    <br/>
                    <em className="text-slate-500">Regla: No puedes jugar una carta en el mismo turno que la compraste (salvo que sea Puntos de Victoria para ganar inmediatamente). Solo 1 carta por turno.</em>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
                      <h4 className="font-bold text-purple-300">Caballero</h4>
                      <p className="text-xs text-purple-100">Mueve el Ladrón como si hubieras sacado un 7 (pero sin la regla de descarte). Cuenta para el Gran Ejército.</p>
                    </div>
                    
                    <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
                      <h4 className="font-bold text-purple-300">Progreso: Monopolio</h4>
                      <p className="text-xs text-purple-100">Nombra 1 recurso. Todos los demás jugadores deben entregarte TODAS las cartas de ese tipo que tengan.</p>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
                      <h4 className="font-bold text-purple-300">Progreso: Año de la Abundancia</h4>
                      <p className="text-xs text-purple-100">Toma 2 cartas de recursos cualesquiera de la banca.</p>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
                      <h4 className="font-bold text-purple-300">Progreso: Construcción de Rutas</h4>
                      <p className="text-xs text-purple-100">Coloca 2 carreteras gratis en el tablero (siguiendo las reglas normales de conexión).</p>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
                      <h4 className="font-bold text-purple-300">Punto de Victoria</h4>
                      <p className="text-xs text-purple-100">Vale 1 Punto de Victoria. Deben mantenerse ocultas hasta que te den la victoria.</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'special' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <section>
                  <h3 className="text-xl font-black text-yellow-400 mb-3">Cartas Especiales (2 PV)</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-slate-800 p-5 rounded-2xl border border-yellow-600/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <MapIcon className="w-24 h-24 text-yellow-500" />
                      </div>
                      <h4 className="text-lg font-black text-yellow-500 mb-2">LA GRAN RUTA</h4>
                      <p className="text-slate-300 text-sm mb-3">
                        Se otorga al primer jugador que construya una ruta continua de al menos <strong>5 carreteras</strong>.
                      </p>
                      <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                        <li>Si otro jugador construye una ruta <strong>más larga</strong> que la del poseedor actual, le roba la carta.</li>
                        <li>En caso de <strong>empate</strong>, el poseedor actual conserva la carta.</li>
                        <li>
                            <strong className="text-red-400">Interrupción:</strong> Si un jugador construye un poblado en medio de una ruta ajena (en un espacio edificable válido), esa ruta se "corta" en dos, reduciendo su longitud para el conteo.
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-800 p-5 rounded-2xl border border-red-600/30 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Shield className="w-24 h-24 text-red-500" />
                      </div>
                      <h4 className="text-lg font-black text-red-400 mb-2">GRAN EJÉRCITO</h4>
                      <p className="text-slate-300 text-sm mb-3">
                        Se otorga al primer jugador que juegue <strong>3 cartas de Caballero</strong>.
                      </p>
                      <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                        <li>Si otro jugador juega <strong>más caballeros</strong> que el poseedor actual, le roba la carta.</li>
                        <li>En caso de empate, el poseedor actual la conserva.</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Map Icon for internal use
const MapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" x2="9" y1="3" y2="18" />
    <line x1="15" x2="15" y1="6" y2="21" />
  </svg>
);

export default RulesPanel;
