import type {
	ICredentialTestFunction,
	IExecuteFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { createHash } from 'crypto';

function formatDateDDMMYYYY(d: Date): string {
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	return `${day}.${month}.${year}`;
}

function computeHash(cardNumber: string): string {
	const dateStr = formatDateDDMMYYYY(new Date());
	const toHash = `${dateStr}.${cardNumber}`;
	return createHash('md5').update(toHash, 'utf8').digest('hex');
}

const testConnection: ICredentialTestFunction = async function (credential): Promise<INodeCredentialTestResult> {
	try {
		const cardNumber = (credential.data as { card_number?: string } | undefined)?.card_number ?? '';
		const hash = computeHash(cardNumber);

		// ICredentialTestFunctions only exposes request, not httpRequest
		// eslint-disable-next-line @n8n/community-nodes/no-deprecated-workflow-functions
		await this.helpers.request({
			method: 'GET',
			url: 'https://api.tgt72.ru/api/v5/balance/',
			qs: { card: cardNumber, hash },
			json: true,
		});

		return { status: 'OK', message: 'Credential works' };
	} catch (error) {
		return { status: 'Error', message: (error as Error).message };
	}
};

export class TgtBalance implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TGT Balance',
		name: 'tgtBalance',
		icon: { light: 'file:tgt.svg', dark: 'file:tgt.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Get transport card balance from api.tgt72.ru (TGT).',
		defaults: {
			name: 'TGT Balance',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'transportCardApi',
				required: true,
				displayName: 'Account',
				testedBy: 'testConnection',
			},
		],
		properties: [],
	};

	methods = {
		credentialTest: {
			testConnection,
		},
		testConnection,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'transportCardApi',
			{
				method: 'GET',
				url: 'https://api.tgt72.ru/api/v5/balance/',
				json: true,
			},
		);

		const result = items.length > 0 ? items : [{ json: {} }];
		for (const item of result) {
			item.json = { ...item.json, ...(response as object) };
		}
		return [result];
	}
}

