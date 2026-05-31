import React, { useState } from 'react';
import Navigation from './components/Navigation';
import QRGenerator from './components/QRGenerator';
import WiFiQRGenerator from './components/WiFiQRGenerator';
import QRScanner from './components/QRScanner';
import QRStorage from './components/QRStorage';
import { QRCodeData } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [qrCodes, setQrCodes] = useLocalStorage<QRCodeData[]>('qr-codes', []);

  const handleSaveQRCode = (qrData: QRCodeData) => {
    setQrCodes(prev => [qrData, ...prev]);
  };

  const handleDeleteQRCode = (id: string) => {
    setQrCodes(prev => prev.filter(qr => qr.id !== id));
  };

  const handleUpdateQRCode = (id: string, updatedData: Partial<QRCodeData>) => {
    setQrCodes(prev => prev.map(qr => qr.id === id ? { ...qr, ...updatedData } : qr));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'generator':
        return <QRGenerator onSave={handleSaveQRCode} />;
      case 'wifi':
        return <WiFiQRGenerator onSave={handleSaveQRCode} />;
      case 'scanner':
        return <QRScanner onSave={handleSaveQRCode} />;
      case 'storage':
        return <QRStorage qrCodes={qrCodes} onDelete={handleDeleteQRCode} onUpdate={handleUpdateQRCode} />;
      default:
        return <QRGenerator onSave={handleSaveQRCode} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;