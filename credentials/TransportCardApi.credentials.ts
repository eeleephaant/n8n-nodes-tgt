import { createHash } from 'crypto';
import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	IDataObject,
	INodeProperties,
} from 'n8n-workflow';

export class TransportCardApi implements ICredentialType {
	name = 'transportCardApi';

	displayName = 'Transport Card API';

	icon: Icon = { light: 'file:../icons/tgt.svg', dark: 'file:../icons/tgt.dark.svg' };

	documentationUrl = 'https://github.com/YOUR_USERNAME/n8n-nodes-tgt#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Card Number',
			name: 'card_number',
			type: 'string',
			default: '',
			placeholder: '999007421334214521',
			description: 'Transport card number (e.g. TGT / Транспортная карта)',
		},
	];

	async preAuthentication(
		credentials: ICredentialDataDecryptedObject,
	): Promise<IDataObject> {
		const cardNumber = (credentials?.card_number as string | undefined) ?? '';
		const now = new Date();
		const day = String(now.getDate()).padStart(2, '0');
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const year = now.getFullYear();
		const dateStr = `${day}.${month}.${year}`;
		const toHash = `${dateStr}.${cardNumber}`;
		const hash = createHash('md5').update(toHash, 'utf8').digest('hex');
		return { hash };
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				card: '={{$credentials.card_number}}',
				hash: '={{$credentials.hash}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: 'https://api.tgt72.ru/api/v5/balance/',
		},
	};
}
