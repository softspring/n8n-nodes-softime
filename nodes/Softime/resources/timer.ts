import type { INodeProperties } from 'n8n-workflow';
import { handleErrors } from '../shared/errors';

const show = (operation: string) => ({ resource: ['timer'], operation: [operation] });

export const timerDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['timer'] } },
		options: [
			{
				name: 'Get Active',
				value: 'getActive',
				action: 'Get active timers',
				description: 'Get the timers currently running for the token user',
				routing: {
					request: { method: 'GET', url: '/api/v1/timer/current' },
					output: {
						postReceive: [handleErrors, { type: 'rootProperty', properties: { property: 'timers' } }],
					},
				},
			},
			{
				name: 'Start',
				value: 'start',
				action: 'Start a timer',
				description: 'Start a timer on a project',
				routing: {
					request: { method: 'POST', url: '/api/v1/timer/start' },
					output: { postReceive: [handleErrors] },
				},
			},
			{
				name: 'Stop',
				value: 'stop',
				action: 'Stop a timer',
				description: 'Stop the running timer',
				routing: {
					request: { method: 'POST', url: '/api/v1/timer/stop' },
					output: { postReceive: [handleErrors] },
				},
			},
		],
		default: 'getActive',
	},
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: show('start') },
		description: 'ID of the project to track time on',
		routing: { send: { type: 'body', property: 'project_id' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: show('start') },
		options: [
			{
				displayName: 'Billable',
				name: 'billable',
				type: 'boolean',
				default: true,
				routing: { send: { type: 'body', property: 'billable' } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				routing: { send: { type: 'body', property: 'description' } },
			},
			{
				displayName: 'Start At',
				name: 'startAt',
				type: 'dateTime',
				default: '',
				description: 'Start instant. Defaults to now.',
				routing: { send: { type: 'body', property: 'start_at' } },
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: show('stop') },
		options: [
			{
				displayName: 'End At',
				name: 'endAt',
				type: 'dateTime',
				default: '',
				description: 'End instant. Defaults to now.',
				routing: { send: { type: 'body', property: 'end_at' } },
			},
			{
				displayName: 'Timer ID',
				name: 'timerId',
				type: 'string',
				default: '',
				description:
					'ID of the timer to stop. Needed only if the workspace allows several simultaneous timers; otherwise the running one is stopped.',
				routing: { send: { type: 'body', property: 'timer_id' } },
			},
		],
	},
];
