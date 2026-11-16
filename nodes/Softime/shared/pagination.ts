import type { INodeProperties } from 'n8n-workflow';
import { handleErrors } from './errors';

/** Softime paginated lists answer `{ items, page, per_page, total, total_pages }`. */
export const listOutput = {
	postReceive: [handleErrors, { type: 'rootProperty' as const, properties: { property: 'items' } }],
};

export function returnAllAndLimit(resource: string): INodeProperties[] {
	const show = { resource: [resource], operation: ['getAll'] };
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			displayOptions: { show },
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			routing: {
				send: { paginate: '={{ $value }}' },
				operations: {
					pagination: {
						type: 'generic',
						properties: {
							continue: '={{ $response.body.page < $response.body.total_pages }}',
							request: {
								qs: {
									page: '={{ $pageCount + 1 }}',
									per_page: 100,
								},
							},
						},
					},
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			displayOptions: { show: { ...show, returnAll: [false] } },
			typeOptions: { minValue: 1, maxValue: 100 },
			default: 50,
			description: 'Max number of results to return',
			routing: {
				send: { type: 'query', property: 'per_page' },
			},
		},
	];
}
