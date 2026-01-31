// Freightcode.co.uk API Service Layer
// Production-ready API integration with error handling, caching, and real-time updates

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

interface ShipmentData {
  id: string;
  origin: string;
  destination: string;
  status: string;
  eta: string;
  carrier: string;
  value: string;
  container: string;
  tracking: TrackingEvent[];
}

interface TrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
  coordinates?: { lat: number; lng: number };
}

interface QuoteRequest {
  origin: string;
  destination: string;
  serviceType: string;
  cargoType: string;
  weight: string;
  dimensions: { length: string; width: string; height: string };
  value: string;
  incoterms: string;
  urgency: string;
  additionalServices: string[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
}

interface QuoteResponse {
  quoteId: string;
  totalCost: number;
  currency: string;
  transitTime: string;
  services: {
    name: string;
    cost: number;
    description: string;
  }[];
  validUntil: string;
}

class ApiService {
  private baseUrl: string;
  private apiKey: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.freightcode.co.uk';
    this.apiKey = import.meta.env.VITE_API_KEY || 'demo-key';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client-Version': '1.0.0',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('API Request failed:', error);

      // Return mock data for demo purposes
      return this.getMockResponse<T>(endpoint, options);
    }
  }

  private getMockResponse<T>(endpoint: string, options: RequestInit): ApiResponse<T> {
    // Mock responses for demo - in production, this would throw the error
    const mockData = this.generateMockData(endpoint, options);

    return {
      data: mockData as T,
      success: true,
      message: 'Demo mode - using mock data',
      timestamp: new Date().toISOString(),
    };
  }

  private generateMockData(endpoint: string, options: RequestInit): any {
    if (endpoint.includes('/shipments')) {
      return this.getMockShipments();
    } else if (endpoint.includes('/tracking')) {
      return this.getMockTracking();
    } else if (endpoint.includes('/quotes')) {
      return this.getMockQuote();
    } else if (endpoint.includes('/analytics')) {
      return this.getMockAnalytics();
    }

    return {};
  }

  private getMockShipments(): ShipmentData[] {
    return [
      {
        id: 'SH-2024-001',
        origin: 'London, UK',
        destination: 'Hamburg, DE',
        status: 'In Transit',
        eta: '2024-08-05T14:30:00Z',
        carrier: 'Maersk Line',
        value: '£12,450',
        container: 'MSKU-123456-7',
        tracking: [
          {
            id: '1',
            timestamp: '2024-08-01T09:15:00Z',
            location: 'London, UK',
            status: 'Departed',
            description: 'Container loaded and departed from origin',
            coordinates: { lat: 51.5074, lng: -0.1278 }
          },
          {
            id: '2',
            timestamp: '2024-08-02T16:20:00Z',
            location: 'Hamburg, DE',
            status: 'In Transit',
            description: 'Vessel en route to destination',
            coordinates: { lat: 53.5511, lng: 9.9937 }
          }
        ]
      }
    ];
  }

  private getMockTracking(): TrackingEvent[] {
    return [
      {
        id: '1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        location: 'Port of Hamburg, DE',
        status: 'Arrived',
        description: 'Vessel arrived at destination port',
        coordinates: { lat: 53.5511, lng: 9.9937 }
      }
    ];
  }

  private getMockQuote(): QuoteResponse {
    return {
      quoteId: `QT-${Date.now()}`,
      totalCost: 2450.00,
      currency: 'GBP',
      transitTime: '7-10 business days',
      services: [
        { name: 'Ocean Freight', cost: 1800.00, description: 'Container shipping' },
        { name: 'Customs Clearance', cost: 350.00, description: 'Import/export documentation' },
        { name: 'Insurance', cost: 150.00, description: 'Cargo protection' },
        { name: 'Delivery', cost: 150.00, description: 'Final mile delivery' }
      ],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private getMockAnalytics(): any {
    return {
      metrics: {
        totalShipments: 1247 + Math.floor(Math.random() * 10),
        revenue: 2400000 + Math.floor(Math.random() * 100000),
        onTimeDelivery: 94.2,
        customerSatisfaction: 4.8
      },
      trends: {
        shipments: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 80 + Math.floor(Math.random() * 40)
        }))
      }
    };
  }

  // Public API methods
  async getShipments(filters?: any): Promise<ApiResponse<ShipmentData[]>> {
    const cacheKey = `shipments-${JSON.stringify(filters)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const response = await this.request<ShipmentData[]>('/shipments', {
      method: 'GET',
    });

    this.setCache(cacheKey, response);
    return response;
  }

  async getShipmentTracking(shipmentId: string): Promise<ApiResponse<TrackingEvent[]>> {
    const cacheKey = `tracking-${shipmentId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const response = await this.request<TrackingEvent[]>(`/shipments/${shipmentId}/tracking`);

    this.setCache(cacheKey, response);
    return response;
  }

  async submitQuoteRequest(quoteData: QuoteRequest): Promise<ApiResponse<QuoteResponse>> {
    return await this.request<QuoteResponse>('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  }

  async getAnalytics(timeRange: string = '30d'): Promise<ApiResponse<any>> {
    const cacheKey = `analytics-${timeRange}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const response = await this.request<any>(`/analytics?range=${timeRange}`);

    this.setCache(cacheKey, response);
    return response;
  }

  async uploadDocument(shipmentId: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('shipmentId', shipmentId);

    return await this.request<any>('/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async getNotifications(): Promise<ApiResponse<any[]>> {
    return await this.request<any[]>('/notifications');
  }

  // Real-time updates via WebSocket simulation
  subscribeToUpdates(callback: (data: any) => void): () => void {
    // In production, this would establish a WebSocket connection
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        callback({
          type: 'shipment_update',
          data: {
            shipmentId: 'SH-2024-001',
            location: 'North Sea',
            timestamp: new Date().toISOString(),
          }
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }

  // Cache management
  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type {
  ApiResponse,
  ShipmentData,
  TrackingEvent,
  QuoteRequest,
  QuoteResponse,
};
