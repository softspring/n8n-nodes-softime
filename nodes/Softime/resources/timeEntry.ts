import type { INodeProperties } from 'n8n-workflow';
import { handleErrors } from '../shared/errors';
import { listOutput, returnAllAndLimit } from '../shared/pagination';

const show = (...operation: string[]) => ({ resource: ['timeEntry'], operation });

const entryId: INodeProperties = {
	displayName: 'Time Entry ID',
	name: 'timeEntryId',
	type: 'string',
	required: true,
	default: '',
	displayOptions: { show: show('get', 'update', 'delete') },
};

const body = (property: string) => ({ send: { type: 'body' as const, property } });

export const timeEntryDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['timeEntry'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a time entry',
				routing: {
					request: { method: 'POST', url: '/api/v1/time-entries' },
					output: { postReceive: [handleErrors] },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a time entry',
				routing: {
					request: { method: 'DELETE', url: '=/api/v1/time-entries/{{ $parameter.timeEntryId }}' },
					output: { postReceive: [handleErrors] },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a time entry',
				routing: {
					request: { method: 'GET', url: '=/api/v1/time-entries/{{ $parameter.timeEntryId }}' },
					output: { postReceive: [handleErrors] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many time entries',
				routing: {
					request: { method: 'GET', url: '/api/v1/time-entries' },
					output: listOutput,
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a time entry',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/api/v1/time-entries/{{ $parameter.timeEntryId }}',
					},
					output: { postReceive: [handleErrors] },
				},
			},
		],
		default: 'getAll',
	},
	entryId,
	{
		displayName: 'Start At',
		name: 'startAt',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: show('create') },
		routing: body('start_at'),
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
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				routing: body('description'),
			},
			{
				displayName: 'End At',
				name: 'endAt',
				type: 'dateTime',
				default: '',
				description: 'Leave empty to create a running entry',
				routing: body('end_at'),
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				routing: body('project_id'),
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: show('update') },
		options: [
			{
				displayName: 'Billable',
				name: 'billable',
				type: 'boolean',
				default: true,
				routing: body('billable'),
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				routing: body('description'),
			},
			{
				displayName: 'End At',
				name: 'endAt',
				type: 'dateTime',
				default: '',
				routing: body('end_at'),
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				routing: body('project_id'),
			},
			{
				displayName: 'Start At',
				name: 'startAt',
				type: 'dateTime',
				default: '',
				routing: body('start_at'),
			},
		],
	},
	...returnAllAndLimit('timeEntry'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: show('getAll') },
		options: [
			{
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Only entries from this date on (in the workspace time zone)',
				routing: {
					send: {
						type: 'query',
						property: 'date_from',
						value: '={{ $value ? new Date($value).toISOString().slice(0, 10) : undefined }}',
					},
				},
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Only entries up to this date, included',
				routing: {
					send: {
						type: 'query',
						property: 'date_to',
						value: '={{ $value ? new Date($value).toISOString().slice(0, 10) : undefined }}',
					},
				},
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'project_id' } },
			},
		],
	},
];
