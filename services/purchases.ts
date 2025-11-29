import api from './api';

export interface PurchaseOrder {
    id: number;
    order_number: string;
    supplier_name: string;
    order_date: string;
    expected_date: string;
    status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
    total_amount: number;
    items: any[];
}

export const purchasesService = {
    getPurchaseOrders: async () => {
        const response = await api.get('/purchases/purchase-orders/');
        return response.data;
    },

    createPurchaseOrder: async (data: any) => {
        const response = await api.post('/purchases/purchase-orders/', data);
        return response.data;
    },

    updatePurchaseOrder: async (id: number, data: any) => {
        const response = await api.patch(`/purchases/purchase-orders/${id}/`, data);
        return response.data;
    },

    deletePurchaseOrder: async (id: number) => {
        await api.delete(`/purchases/purchase-orders/${id}/`);
    },

    // For the "Genius" feature - Trigger Auto-PO check manually if needed
    checkAutoProcurement: async () => {
        // This might be a custom endpoint we add later
    },

    negotiateWithSupplier: async (poId: number) => {
        const response = await api.post(`/ai/negotiate/${poId}`);
        return response.data;
    }
};
