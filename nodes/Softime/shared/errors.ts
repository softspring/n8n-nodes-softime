import {
	NodeApiError,
	type IExecuteSingleFunctions,
	type IN8nHttpFullResponse,
	type INodeExecutionData,
	type JsonObject,
	type PostReceiveAction,
} from 'n8n-workflow';

function messageFor(status: number): { message: string; description: string } | undefined {
	if (status === 401) {
		return {
			message: 'Invalid or expired Softime API token',
			description:
				'The API rejected the token (401). Create a new token in the Softime workspace page (Workspace → API tokens) and update the "Softime API" credential.',
		};
	}
	if (status === 403) {
		return {
			message: 'Softime API token not allowed to do this',
			description:
				'The API refused the request (403). Check that the token has the required permissions (scopes), that API tokens are enabled in the workspace and that the subscription is active.',
		};
	}
	if (status === 429) {
		return {
			message: 'Softime API rate limit reached',
			description:
				'Too many requests (429). Wait a moment and retry, or reduce the number of requests in the workflow.',
		};
	}
	return undefined;
}

/**
 * Turns non-2xx responses (requests run with ignoreHttpStatusErrors) into clear
 * errors and normalizes empty successful responses (e.g. 204 on delete).
 */
export const handleErrors: PostReceiveAction = async function (
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const status = response.statusCode;
	if (status >= 200 && status < 300) {
		if (status === 204) return [{ json: { success: true } }];
		return items;
	}

	const body = (typeof response.body === 'object' && response.body !== null
		? response.body
		: { message: String(response.body ?? '') }) as JsonObject;
	const known = messageFor(status);
	const apiDetail = [body.detail, body.message, body.title].find((v) => typeof v === 'string') as
		| string
		| undefined;

	throw new NodeApiError(this.getNode(), body, {
		message: known?.message ?? apiDetail ?? `Softime API error (${status})`,
		description: known?.description ?? apiDetail,
		httpCode: String(status),
	});
};
