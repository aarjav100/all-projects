export interface QRCodeData {
  id: string;
  type: 'text' | 'url' | 'wifi' | 'email' | 'phone';
  title: string;
  content: string;
  createdAt: string;
  qrCodeUrl: string;
  isScanned?: boolean;
  scannedFrom?: string;
}

export interface WiFiConfig {
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}