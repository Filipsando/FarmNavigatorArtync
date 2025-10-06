'use client'

import './page.css';
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const MapView = dynamic(() => import("../components/MapView.js"), { ssr: false });

export default function Home() {
    // ====== Estados do jogo ======
    const [coins, setCoins] = useState(250);
    const [seeds, setSeeds] = useState({ milho: 100, trigo: 100, arroz: 100, cafe: 100 });
    const [hectares, setHectares] = useState(10);
    
    // NOVO: Array para armazenar informações compradas
    const [informacoesCompradas, setInformacoesCompradas] = useState([]);

    // Menu lateral
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(null);
    const menuRef = useRef(null);

    // Modal
    const [modalData, setModalData] = useState(null);

    // Preços
    const prices = {
        produtos: { milho: 50, soja: 70, trigo: 40, cafe: 80 },
        terreno: 100,
        informacao: 30
    };

    // Dados das informações disponíveis
    const dadosInformacao = {
        precipitacao: {
            titulo: 'Precipitação',
            descricao: 'Precipitação atual da região: 80mm',
            icone: '🌧️'
        },
        incidenciaSolar: {
            titulo: 'Incidência Solar',
            descricao: 'Incidência Solar: Alta (8 horas diárias)',
            icone: '☀️'
        },
        temperatura: {
            titulo: 'Temperatura',
            descricao: 'Temperatura atual: 26°C',
            icone: '🌡️'
        },
        umidade: {
            titulo: 'Umidade',
            descricao: 'Umidade relativa: 70%',
            icone: '💧'
        }
    };

    // ====== Funções de compra ======
    const buyProduct = (type) => {
        if (coins >= prices.produtos[type]) {
            setSeeds(prev => ({ ...prev, [type]: (prev[type] || 0) + 1000 }));
            setCoins(prev => prev - prices.produtos[type]);
        } else alert("Moedas insuficientes!");
    };

    const buyLand = () => {
        if (coins >= prices.terreno) {
            setHectares(prev => prev + 1);
            setCoins(prev => prev - prices.terreno);
        } else alert("Moedas insuficientes!");
    };

    const buyInfo = (infoType) => {
        // Verificar se já foi comprada
        const jaComprada = informacoesCompradas.some(info => info.tipo === infoType);
        
        if (jaComprada) {
            // Se já foi comprada, apenas abre o modal
            openModal(infoType);
        } else {
            // Se não foi comprada, verifica se tem moedas
            if (coins >= prices.informacao) {
                // Adiciona ao array de informações compradas
                const novaInfo = {
                    tipo: infoType,
                    ...dadosInformacao[infoType],
                    dataCompra: new Date().toLocaleString('pt-BR')
                };
                setInformacoesCompradas(prev => [...prev, novaInfo]);
                setCoins(prev => prev - prices.informacao);
                openModal(infoType);
            } else {
                alert("Moedas insuficientes!");
            }
        }
    };

    const openModal = (infoType) => setModalData(infoType);
    const closeModal = () => setModalData(null);

    // Venda de produtos
    const handleSellCrop = (tipo) => {
        const sellPrices = { milho: 50, soja: 70, trigo: 40, arroz: 60 };
        setCoins(prev => prev + (sellPrices[tipo] || 0));
    };

    // Verificar se uma informação já foi comprada
    const isInfoPurchased = (infoType) => {
        return informacoesCompradas.some(info => info.tipo === infoType);
    };

    // Fechar menu clicando fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    // ====== Render ======
    return (
        <>
            {/* HEADER */}
            <header>
                <div className='header-logo'>
                    <img src='LogoIcon.png' alt="Logo" />
                    <h1>Farm Navigator</h1>
                </div>

                <div className='header-seeds'>
                    {Object.entries(seeds).map(([key, value]) => (
                        <div className='seeds' key={key}>
                            <img src='SeedsIcon.png' alt={key} />
                            <h2>{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
                            <p>{value}</p>
                        </div>
                    ))}
                </div>

                <div className='header-aside'>
                    <div className='header-info'>
                        <img src='DayIcon.png' alt="Data" />
                        <h1>04/10/2025</h1>
                    </div>
                    <div className='header-info'>
                        <img src='CoinsIcon.png' alt="Coins" />
                        <h1>{coins}</h1>
                    </div>
                    <button onClick={() => setMenuOpen(true)} className='header-shop'>
                        <img src='ShopIcon.png' alt="Loja" />
                        <h1>Loja</h1>
                    </button>
                </div>
            </header>

            {/* MAPA */}
            <main>
                <MapView onSell={handleSellCrop} />
            </main>

            {/* MENU LATERAL */}
            {menuOpen && (
                <aside ref={menuRef} className='menu'>
                    <div className='menu-option'>
                        {['informacao', 'terreno', 'produtos'].map(tab => (
                            <div
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={activeTab === tab ? { backgroundColor: "#2E7D32" } : null}
                            >
                                <h1>{tab === 'informacao' ? 'Dados' : tab === 'terreno' ? 'Terreno' : 'Sementes'}</h1>
                            </div>
                        ))}
                    </div>

                    <div className='menu-content'>
                        {/* PRODUTOS */}
                        {activeTab === 'produtos' && (
                            Object.entries(prices.produtos).map(([key, price]) => (
                                <div className='menu-content-option' key={key}>
                                    <h1>{`${key.charAt(0).toUpperCase() + key.slice(1)} x1000 - ${price} moedas`}</h1>
                                    <button onClick={() => buyProduct(key)}>+</button>
                                </div>
                            ))
                        )}

                        {/* TERRENO */}
                        {activeTab === 'terreno' && (
                            <div className='menu-content-option'>
                                <h1>Hectares: {hectares}</h1>
                                <button onClick={buyLand}>Comprar (+1 ha) - {prices.terreno} moedas</button>
                            </div>
                        )}

                        {/* INFORMAÇÕES */}
                        {activeTab === 'informacao' && (
                            <>
                                <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#2E7D32' }}>
                                        Informações Compradas ({informacoesCompradas.length})
                                    </h3>
                                    {informacoesCompradas.length === 0 ? (
                                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                            Nenhuma informação comprada ainda
                                        </p>
                                    ) : (
                                        informacoesCompradas.map((info, index) => (
                                            <div 
                                                key={index} 
                                                style={{ 
                                                    padding: '8px', 
                                                    marginBottom: '8px', 
                                                    backgroundColor: 'white',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ddd'
                                                }}
                                            >
                                                <span style={{ fontSize: '20px', marginRight: '8px' }}>{info.icone}</span>
                                                <strong>{info.titulo}</strong>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888' }}>
                                                    Comprada em: {info.dataCompra}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <h3 style={{ marginBottom: '10px', color: '#333' }}>Comprar Novas Informações:</h3>
                                {Object.entries(dadosInformacao).map(([key, dados]) => {
                                    const comprada = isInfoPurchased(key);
                                    return (
                                        <div className='menu-content-option' key={key}>
                                            <h1>
                                                {dados.icone} {dados.titulo}
                                                {comprada && <span style={{ color: '#4CAF50', marginLeft: '8px' }}>✓</span>}
                                            </h1>
                                            <button onClick={() => buyInfo(key)}>
                                                {comprada ? "Ver" : `Comprar (${prices.informacao} moedas)`}
                                            </button>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </aside>
            )}

            {/* MODAL */}
            <Modal
                open={!!modalData}
                onClose={closeModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 4
                }}>
                    {modalData && dadosInformacao[modalData] && (
                        <>
                            <Typography id="modal-title" variant="h6" gutterBottom sx={{color: "black"}}>
                                {dadosInformacao[modalData].icone} {dadosInformacao[modalData].titulo}
                            </Typography>
                            <Typography id="modal-description" sx={{ mb: 2,lor: "black" }}>
                                {dadosInformacao[modalData].descricao}
                            </Typography>
                            <Button 
                                variant="contained" 
                                onClick={closeModal}
                                sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1B5E20' } }}
                            >
                                Fechar
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
}