"use client"; // Se estiver usando Next.js com pasta /app

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

// Corrige ícone do marker no Next.js
const customIcon = new L.Icon({
    iconUrl: "globe.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
        click() {
            setPosition([-29.446825, -51.976910])
            map.flyTo([-29.446825, -51.976910], map.getZoom());
        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

export default function MapView() {
    const [modal, setModal] = useState(false);


    const areaCoords = [
        [-29.423952, -52.042638],
        [-29.423063, -51.903006],
        [-29.457019, -51.908313],
        [-29.460751, -52.035697],

    ];


    const handleAreaClick = () => {
        setModal(true);
    };

    const handleClose = () => {
        setModal(false);
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>

            <MapContainer
                center={[-29.446825, -51.976910]}
                zoom={12}
                style={{ height: "90vh", width: "100vw", zIndex: "2" }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {/* Marcador principal */}
                <Marker position={[-29.446825, -51.976910]} icon={customIcon}>
                    <Popup>📍 Você está em Lajeado!</Popup>
                </Marker>

                {/* Área (polígono) */}
                <Polygon
                    pathOptions={{ color: "blue", fillColor: "cyan", fillOpacity: 0.3 }}
                    positions={areaCoords}
                    eventHandlers={{
                        click: handleAreaClick,
                    }}
                />
            </MapContainer>
            {modal && (
                <Modal
                    open={modal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                       <div>
                        <p>TESTE</p>
                       </div>
                    </Box>
                </Modal>
            )}

        </>
    );
}
