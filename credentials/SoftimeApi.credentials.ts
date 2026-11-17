import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SoftimeApi implements ICredentialType {
	name = 'softimeApi';

	displayName = 'Softime API';

	icon: Icon = { light: 'file:../icons/softime.svg', dark: 'file:../icons/softime.dark.svg' };

	documentationUrl = 'https://github.com/softspring/n8n-nodes-softime#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Personal API token created in the Softime workspace page (Workspace → API tokens)',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.softime.app',
			required: true,
			description:
				'Base URL of the Softime API. Change it to test against staging (https://api.staging.softime.softspring.cloud).',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/timer/current',
			method: 'GET',
		},
	};
}
