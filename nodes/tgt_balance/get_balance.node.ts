import { createHash } from 'crypto';
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

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

export class GetBalance implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TGT Balance',
		name: 'get_balance',
		icon: { light: 'file:tgt.svg', dark: 'file:tgt.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Get transport card balance from api.tgt72.ru (TGT). Use Account credential with card number.',
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
			},
		],
		properties: [],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const credentials = await this.getCredentials('transportCardApi');
		const cardNumber = (credentials?.card_number as string) ?? '';
		const hash = computeHash(cardNumber);

		const response = await this.helpers.httpRequest({
			method: 'GET',
			url: 'https://api.tgt72.ru/api/v5/balance/',
			qs: { card: cardNumber, hash },
			json: true,
		});

		const result = Array.isArray(items) && items.length > 0 ? items : [{ json: {} }];
		for (const item of result) {
			item.json = { ...item.json, ...(response as object) };
		}
		return [result];
	}
}
