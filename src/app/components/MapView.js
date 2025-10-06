"use client";

import { MapContainer, TileLayer, Marker, Polygon, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// --- FUNÇÕES AUXILIARES ---
function getPolygonCenter(coords) {
    const latSum = coords.reduce((sum, [lat]) => sum + lat, 0);
    const lngSum = coords.reduce((sum, [, lng]) => sum + lng, 0);
    return [latSum / coords.length, lngSum / coords.length];
}

function getCropIcon(cropData) {
    if (!cropData?.tipo) return null;

    const svgUrls = {
        milho: "/milho.svg",
        soja: "/soja.svg",
        trigo: "/trigo.svg",
        arroz: "/arroz.svg",
    };

    return new L.Icon({
        iconUrl: svgUrls[cropData.tipo],
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
    });
}

// --- COMPONENTE DE ÁREAS ---
function Areas({ areas, plantacao, onAreaClick }) {
    const map = useMap();

    const getPolygonColor = (id) => {
        const cropData = plantacao[id];
        if (!cropData) return "cyan";
        if (cropData.status === "crescendo") return "gray";
        switch (cropData.tipo) {
            case "milho": return "yellow";
            case "soja": return "green";
            case "trigo": return "orange";
            case "arroz": return "lightblue";
            default: return "cyan";
        }
    };

    const handleClick = (id, coords) => {
        onAreaClick(id);
        const center = getPolygonCenter(coords);
        map.flyTo(center);
    };

    return (
        <>
            {Object.entries(areas).map(([id, coords]) => (
                <Polygon
                    key={id}
                    pathOptions={{ color: "blue", fillColor: getPolygonColor(id), fillOpacity: 0.5 }}
                    positions={coords}
                    eventHandlers={{ click: () => handleClick(Number(id), coords) }}
                />
            ))}

            {Object.entries(areas).map(([id, coords]) => {
                const cropData = plantacao[id];
                if (!cropData) return null;
                const center = getPolygonCenter(coords);
                return <Marker key={"icon" + id} position={center} icon={getCropIcon(cropData)} />;
            })}
        </>
    );
}

// --- MAP VIEW PRINCIPAL ---
export default function MapView({ onSell }) {
    const [modal, setModal] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);
    const [plantacao, setPlantacao] = useState({});

    // --- PERSISTÊNCIA LOCAL ---
    useEffect(() => {
        const saved = localStorage.getItem("plantacao");
        if (saved) {
            try {
                setPlantacao(JSON.parse(saved));
            } catch {
                setPlantacao({});
            }
        }
    }, []);

    useEffect(() => {
        // Salva apenas áreas com plantação válida
        const filtered = Object.fromEntries(
            Object.entries(plantacao).filter(([_, val]) => val != null)
        );
        localStorage.setItem("plantacao", JSON.stringify(filtered));
    }, [plantacao]);

    // --- CONFIGURAÇÃO DAS ÁREAS ---
    const squareLat = 600 / 111320;
    const squareLng = 600 / 95400;
    const startLat = -30.978954;
    const startLng = -53.907414;

    function createSquare(lat, lng) {
        return [
            [lat, lng],
            [lat, lng + squareLng],
            [lat + squareLat, lng + squareLng],
            [lat + squareLat, lng],
        ];
    }

    const areas = {
        1: createSquare(startLat, startLng),
        2: createSquare(startLat, startLng + squareLng),
        3: createSquare(startLat, startLng + 2 * squareLng),
        4: createSquare(startLat, startLng + 3 * squareLng),
    };

    const handleClose = () => setModal(false);

    // --- FUNÇÕES DE PLANTIO E VENDA ---
    const handlePlant = (tipo) => {
        if (!selectedArea) return;

        const existing = plantacao[selectedArea];
        if (existing?.status === "crescendo") {
            alert("Esta área já possui uma plantação em crescimento!");
            return;
        }

        // Planta e marca como crescendo
        setPlantacao(prev => ({
            ...prev,
            [selectedArea]: { tipo, status: "crescendo" }
        }));

        // Simula crescimento
        setTimeout(() => {
            setPlantacao(prev => ({
                ...prev,
                [selectedArea]: { tipo, status: "pronto" }
            }));
        }, 10000);

        setModal(false);
    };

    const handleSell = () => {
           
        if (!selectedArea) return;
    
        const cropData = plantacao[selectedArea]; 

        if (!cropData) {
            alert("Não há plantação nesta área!");
            return;
        }
    
        if (cropData.status == "crescendo") {
            alert("A plantação ainda está crescendo!");
            return;
        }
    
        if (onSell && cropData.tipo) {
            onSell(cropData.tipo);
        }
    
        setPlantacao(prev => {
            const copy = { ...prev };
            delete copy[selectedArea];
            return copy;
        });
    
        alert(`Produtos da área ${selectedArea} vendidos!`);
        setModal(false);
    };
    
    
    

    // --- LOCALIZAÇÃO ---
    function LocationMarker() {
        const [position, setPosition] = useState(null);
        useMapEvents({
            click() {
                setPosition([-30.978954, -53.907414]);
            },
            locationfound(e) {
                setPosition(e.latlng);
            },
        });
    }

    return (
        <>
            <MapContainer
                center={[-30.978954, -53.907414]}
                zoom={14}
                style={{ height: "90vh", width: "100vw", zIndex: 2 }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                    attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                />
                <Areas areas={areas} plantacao={plantacao} onAreaClick={(id) => { setSelectedArea(id); setModal(true); }} />
                <LocationMarker />
            </MapContainer>

            <Modal
                open={modal}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 24, p: 4 }}>
                    <Typography id="modal-title" variant="h6" gutterBottom sx={{ color: "black" }}>
                        Área {selectedArea} selecionada
                    </Typography>
                    <Typography id="modal-description" sx={{ mb: 2, color: "black" }}>
                        O que deseja fazer nesta área?
                    </Typography>

                    {(!plantacao[selectedArea]) && (
                        <>
                            <Typography variant="subtitle1" sx={{ mb: 1, color: "black" }}>Plantar:</Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                {["milho", "soja", "trigo", "arroz"].map((crop) => (
                                    <Grid item xs={6} key={crop}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            color="success"
                                            onClick={() => handlePlant(crop)}
                                        >
                                            {crop}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="outlined" color="error" onClick={handleSell}>
                            Vender Colheita
                        </Button>
                        <Button variant="contained" onClick={handleClose}>
                            Fechar
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
}
