'use client'
import './page.css'
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from 'react';

const MapView = dynamic(() => import("./components/MapView.js"), { ssr: false });

export default function Home() {
    // Estados do jogo
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(null);
    const menuRef = useRef(null);

    const [coins, setCoins] = useState(250);
    const [seeds, setSeeds] = useState({
        milho: 100,
        trigo: 100,
        arroz: 100,
        cafe: 100
    });
    const [hectares, setHectares] = useState(10);

    const [informacao, setInformacao] = useState({
        precipitacao: false,
        incidenciaSolar: false,
        temperatura: false,
        umidade: false
    });

    // Preços
    const prices = {
        produtos: {
            milho: 50,
            soja: 70,
            trigo: 40,
            cafe: 80
        },
        terreno: 100, // por hectare
        informacao: 30 // cada dado
    };

    // ----------- Ações -------------
    const handleShop = () => setOpen(true);

    // Comprar produtos (sementes)
    const buyProduct = (type) => {
        if (coins >= prices.produtos[type]) {
            setSeeds(prev => ({
                ...prev,
                [type]: (prev[type] || 0) + 1000
            }));
            setCoins(prev => prev - prices.produtos[type]);
        } else {
            alert("Moedas insuficientes!");
        }
    };

    // Comprar terreno
    const buyLand = () => {
        if (coins >= prices.terreno) {
            setHectares(prev => prev + 1);
            setCoins(prev => prev - prices.terreno);
        } else {
            alert("Moedas insuficientes!");
        }
    };

    // Comprar informações
    const buyInfo = (infoType) => {
        if (informacao[infoType]) {
            alert("Você já possui essa informação!");
            return;
        }
        if (coins >= prices.informacao) {
            setInformacao(prev => ({
                ...prev,
                [infoType]: true
            }));
            setCoins(prev => prev - prices.informacao);
        } else {
            alert("Moedas insuficientes!");
        }
    };

    // Função para receber venda do MapView e aumentar coins
const handleSellCrop = (tipo) => {
    const sellPrices = {
        milho: 50,
        soja: 70,
        trigo: 40,
        arroz: 60,
    };

    const valor = sellPrices[tipo] || 0;
    setCoins(prev => prev + valor);
    alert(`Você vendeu ${tipo} por ${valor} moedas!`);
};


    // Fechar menu clicando fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <>
            <header>
                <div className='header-logo'>
                    <img src='LogoIcon.png' />
                    <h1>Farm Navigator</h1>
                </div>

                {/* Estoque de sementes */}
                <div className='header-seeds'>
                    {[
                        { name: "Milho", key: "milho" },
                        { name: "Trigo", key: "trigo" },
                        { name: "Arroz", key: "arroz" },
                        { name: "Café", key: "cafe" },
                    ].map((seed, i) => (
                        <div className='seeds' key={i}>
                            <img src='SeedsIcon.png' />
                            <h2>{seed.name}</h2>
                            <p>{seeds[seed.key]}</p>
                        </div>
                    ))}
                </div>

                <div className='header-aside'>
                    <div className='header-info'>
                        <img src='DayIcon.png' />
                        <h1>04/10/2025</h1>
                    </div>
                    <div className='header-info'>
                        <img src='CoinsIcon.png' />
                        <h1>{coins}</h1>
                    </div>
                    <button onClick={handleShop} className='header-shop'>
                        <img src='ShopIcon.png' />
                        <h1>Loja</h1>
                    </button>
                </div>
            </header>

            <main>
                <MapView onSell={handleSellCrop}/>
            </main>

            {/* MENU LATERAL */}
            {open && (
                <aside ref={menuRef} className='menu'>
                    <div className='menu-option'>
                        <div
                            id='option'
                            onClick={() => setActiveTab("informacao")}
                            style={activeTab === "informacao" ? { backgroundColor: "#2E7D32" } : null}
                        >
                            <h1>Dados</h1>
                        </div>
                        <div
                            id='option'
                            onClick={() => setActiveTab("terreno")}
                            style={activeTab === "terreno" ? { backgroundColor: "#2E7D32" } : null}
                        >
                            <h1>Terreno</h1>
                        </div>
                        <div
                            id='option'
                            onClick={() => setActiveTab("produtos")}
                            style={activeTab === "produtos" ? { backgroundColor: "#2E7D32" } : null}
                        >
                            <h1>Sementes</h1>
                        </div>
                    </div>

                    <div>
                        {/* ABA PRODUTOS */}
                        {activeTab === 'produtos' ? (
                            <div className='menu-content'>
                                <div className='menu-content-option'>
                                    <h1>Milho x1000 - {prices.produtos.milho} moedas</h1>
                                    <button onClick={() => buyProduct('milho')}>+</button>
                                </div>
                                <div className='menu-content-option'>
                                    <h1>Soja x1000 - {prices.produtos.soja} moedas</h1>
                                    <button onClick={() => buyProduct('soja')}>+</button>
                                </div>
                                <div className='menu-content-option'>
                                    <h1>Trigo x1000 - {prices.produtos.trigo} moedas</h1>
                                    <button onClick={() => buyProduct('trigo')}>+</button>
                                </div>
                                <div className='menu-content-option'>
                                    <h1>Café x1000 - {prices.produtos.cafe} moedas</h1>
                                    <button onClick={() => buyProduct('cafe')}>+</button>
                                </div>
                            </div>
                        ) : activeTab === 'terreno' ? (
                            /* ABA TERRENO */
                            <div className='menu-content'>
                                <div className='menu-content-option'>
                                    <h1>Hectares: {hectares}</h1>
                                    <button onClick={buyLand}>Comprar (+1 ha) - {prices.terreno} moedas</button>
                                </div>
                            </div>
                        ) : (
                            /* ABA INFORMAÇÕES */
                            <div className='menu-content'>
                                <div className='menu-content-option'>
                                    <h1>Precipitação</h1>
                                    <button onClick={() => buyInfo('precipitacao')}>
                                        {informacao.precipitacao ? "Comprado" : `+ (${prices.informacao} moedas)`}
                                    </button>
                                </div>
                                <div className='menu-content-option'>
                                    <h1>Incidência Solar</h1>
                                    <button onClick={() => buyInfo('incidenciaSolar')}>
                                        {informacao.incidenciaSolar ? "Comprado" : `+ (${prices.informacao} moedas)`}
                                    </button>
                                </div>
                                <div className='menu-content-option'>
                                    <h1>Temperatura</h1>
                                    <button onClick={() => buyInfo('temperatura')}>
                                        {informacao.temperatura ? "Comprado" : `+ (${prices.informacao} moedas)`}
                                    </button>
                                </div>
                                <div className='menu-content-option'>
                                    <h1>Umidade</h1>
                                    <button onClick={() => buyInfo('umidade')}>
                                        {informacao.umidade ? "Comprado" : `+ (${prices.informacao} moedas)`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            )}
        </>
    );
}
