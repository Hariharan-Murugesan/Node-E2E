import { openai, MODEL } from '../openai-api/openai.js';

// Demo data; replace with a real database query.
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

    return orders[orderId] ?? {
        error: 'Order not found'
    };
}

const tools = [
    {
        type: 'function',
        name: 'get_order_status',
        description: 'Get the status of an order by its order ID.',
        strict: true,
        parameters: {
            type: 'object',
            properties: {
                orderId: {
                    type: 'string',
                    description: 'The order ID, such as ORD-1001'
                }
            },
            required: ['orderId'],
            additionalProperties: false
        }
    }
];

const availableFunctions = {
    get_order_status: getOrderStatus
};

export async function runAgent(question) {
    let response = await openai.responses.create({
        model: MODEL,
        instructions: `
            You are a customer support agent.
            Use the order lookup tool when a question needs order data.
            Never invent an order status.
            Explain when an order cannot be found.
        `,
        input: question,
        tools
    });

    // Allow multiple tool-call rounds, with a safety limit.
    for (let round = 0; round < 5; round++) {
        const calls = response.output.filter(
            item => item.type === 'function_call'
        );

        if (calls.length === 0) {
            return response.output_text;
        }

        const outputs = await Promise.all(
            calls.map(async call => {
                let result;

                try {
                    const args = JSON.parse(call.arguments);
                    const fn = availableFunctions[call.name];

                    if (!fn) {
                        throw new Error('Unknown tool');
                    }

                    result = await fn(args.orderId);
                } catch {
                    result = { error: 'Tool execution failed' };
                }

                return {
                    type: 'function_call_output',
                    call_id: call.call_id,
                    output: JSON.stringify(result)
                };
            })
        );

        response = await openai.responses.create({
            model: MODEL,
            previous_response_id: response.id,
            input: outputs,
            tools
        });
    }

    throw new Error('Agent reached its maximum tool-call rounds');
}