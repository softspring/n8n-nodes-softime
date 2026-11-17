import type { INodeProperties } from 'n8n-workflow';
import { listOutput, returnAllAndLimit } from '../shared/pagination';

export const clientDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['client'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many clients',
				routing: {
					request: { method: 'GET', url: '/api/v1/clients' },
					output: listOutput,
				},
			},
		],
		default: 'getAll',
	},
	...returnAllAndLimit('client'),
];
