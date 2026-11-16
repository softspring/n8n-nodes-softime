import type { INodeProperties } from 'n8n-workflow';
import { handleErrors } from '../shared/errors';
import { listOutput, returnAllAndLimit } from '../shared/pagination';

const show = (operation: string) => ({ resource: ['project'], operation: [operation] });
const body = (property: string) => ({ send: { type: 'body' as const, property } });

export const projectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['project'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a project',
				routing: {
					request: { method: 'POST', url: '/api/v1/projects' },
					output: { postReceive: [handleErrors] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many projects',
				routing: {
					request: { method: 'GET', url: '/api/v1/projects' },
					output: listOutput,
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: show('create') },
		routing: body('name'),
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: show('create') },
		options: [
			{
				displayName: 'Billable',
				name: 'billable',
				type: 'boolean',
				default: true,
				routing: body('billable'),
			},
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'string',
				default: '',
				description: 'Client of the project. If empty, the API decides the client.',
				routing: body('client_id'),
			},
			{
				displayName: 'Hourly Rate',
				name: 'hourlyRate',
				type: 'number',
				default: 0,
				routing: body('hourly_rate'),
			},
		],
	},
	...returnAllAndLimit('project'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: show('getAll') },
		options: [
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'client_id' } },
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'name' } },
			},
		],
	},
];
