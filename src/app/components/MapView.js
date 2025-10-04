"use client";

import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Ícone personalizado do usuário
const customIcon = new L.Icon({
    iconUrl: "globe.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Component para marcar localização
function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click() {
            setPosition([-29.446825, -51.976910])
            map.flyTo([-29.446825, -51.976910], map.getZoom());
        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

// Função para calcular o centro de um polígono
function getPolygonCenter(coords) {
    const latSum = coords.reduce((sum, [lat]) => sum + lat, 0);
    const lngSum = coords.reduce((sum, [, lng]) => sum + lng, 0);
    return [latSum / coords.length, lngSum / coords.length];
}

// Função para criar ícone SVG
function getCropIcon(crop) {
    if (!crop) return null;

    const svgUrls = {
        milho: "/milho.svg",
        soja: "/soja.svg",
        trigo: "/trigo.svg",
        arroz: "/arroz.svg",
    };

    return new L.Icon({
        iconUrl: svgUrls[crop],
        iconSize: [30, 30],      // tamanho do ícone
        iconAnchor: [15, 15],    // centraliza sobre o ponto
        popupAnchor: [0, -15],   // onde o popup vai aparecer
    });
}

export default function MapView() {
    const [modal, setModal] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);
    const [plantacao, setPlantacao] = useState({
        1: null,
        2: null,
        3: null,
        4: null,
    });

    // Tamanho e posição dos quadrados
    const squareLat = 0.02;
    const squareLng = 0.02;
    const startLat = -29.460751;
    const startLng = -52.042638;

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

    const handleAreaClick = (id) => {
        setSelectedArea(id);
        setModal(true);
    };

    const handleClose = () => setModal(false);

    const handlePlant = (crop) => {
        if (!selectedArea) return;
        setPlantacao(prev => {
            const updated = { ...prev, [selectedArea]: crop };
            console.log("Plantação atualizada:", updated);
            return updated;
        });
        setModal(false);
    };

    const handleSell = () => {
        if (!selectedArea) return;
        console.log(`Vender produtos da área ${selectedArea}`);
        setModal(false);
    };

    const getPolygonColor = (id) => {
        const crop = plantacao[id];
        switch (crop) {
            case "milho": return "yellow";
            case "soja": return "green";
            case "trigo": return "orange";
            case "arroz": return "lightblue";
            default: return "cyan";
        }
    };

    return (
        <>
            <MapContainer
                center={[-29.446825, -51.976910]}
                zoom={13}
                style={{ height: "90vh", width: "100vw", zIndex: 2 }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                <Marker position={[-29.446825, -51.976910]} icon={customIcon}>
                    <Popup>📍 Você está em Lajeado!</Popup>
                </Marker>

                {Object.entries(areas).map(([id, coords]) => (
                    <Polygon
                        key={id}
                        pathOptions={{ color: "blue", fillColor: getPolygonColor(id), fillOpacity: 0.5 }}
                        positions={coords}
                        eventHandlers={{ click: () => handleAreaClick(Number(id)) }}
                    />
                ))}

                {/* Marcadores SVG das plantações */}
                {Object.entries(areas).map(([id, coords]) => {
                    const crop = plantacao[id];
                    if (!crop) return null;
                    const center = getPolygonCenter(coords);
                    return <Marker key={"icon"+id} position={center} icon={getCropIcon(crop)} />;
                })}

                <LocationMarker />
            </MapContainer>

            <Modal
                open={modal}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 24, p: 4 }}>
                    <Typography id="modal-title" variant="h6" gutterBottom sx={{color: "black"}}>
                        Área {selectedArea} selecionada
                    </Typography>
                    <Typography id="modal-description" sx={{ mb: 2 , color: "black"}}>
                        O que deseja fazer nesta área?
                    </Typography>

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
