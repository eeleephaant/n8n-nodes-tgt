import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TransportCardApi implements ICredentialType {
	name = 'transportCardApi';

	displayName = 'Transport Card';

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
}
