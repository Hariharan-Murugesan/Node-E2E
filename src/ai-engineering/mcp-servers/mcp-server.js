import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

// Reuse the same business logic in your API and MCP tools.
async function getOrderStatus(orderId) {
    const orders = {
        'ORD-1001': {
            orderId: 'ORD-1001',
            status: 'Shipped',
            estimatedDelivery: '2026-10-15'
        },
        'ORD-1002': {
            orderId: 'ORD-1002',
            status: 'Processing',
            estimatedDelivery: 'Not available yet'
        }
    };

    return orders[orderId] ?? { error: 'Order not found' };
}

serveStdio(() => {
    const server = new McpServer({
        name: 'unipick-support',
        version: '1.0.0'
    });

    server.registerTool(
        'get_order_status',
        {
            description: 'Look up an order status using its order ID.',
            inputSchema: z.object({
                orderId: z.string().min(1)
            })
        },
        async ({ orderId }) => {
            const result = await getOrderStatus(orderId);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result)
                    }
                ]
            };
        }
    );

    return server;
});