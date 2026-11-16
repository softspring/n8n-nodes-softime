import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { clientDescription } from './resources/client';
import { projectDescription } from './resources/project';
import { timeEntryDescription } from './resources/timeEntry';
import { timerDescription } from './resources/timer';

export class Softime implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Softime',
		name: 'softime',
		icon: { light: 'file:../../icons/softime.svg', dark: 'file:../../icons/softime.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Track time and manage projects in Softime',
		defaults: {
			name: 'Softime',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'softimeApi', required: true }],
		requestDefaults: {
			baseURL: '={{ $credentials.baseUrl }}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			// Errors are translated by handleErrors (see shared/errors.ts)
			ignoreHttpStatusErrors: true,
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Client', value: 'client' },
					{ name: 'Project', value: 'project' },
					{ name: 'Time Entry', value: 'timeEntry' },
					{ name: 'Timer', value: 'timer' },
				],
				default: 'timer',
			},
			...timerDescription,
			...timeEntryDescription,
			...projectDescription,
			...clientDescription,
		],
	};
}
