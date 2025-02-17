import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { TabContainer } from '../../components/common';

import useStakingCalculations from 'sections/staking/hooks/useStakingCalculations';
import { walletAddressState } from 'store/wallet';

import TabContent from './TabContent';
import Wei, { wei } from '@synthetixio/wei';
import useSynthetixQueries from '@synthetixio/queries';
import { parseSafeWei } from 'utils/parse';

const WithdrawTab = () => {
	const { transferableCollateral } = useStakingCalculations();
	const walletAddress = useRecoilValue(walletAddressState);

	const { useGetBridgeDataQuery, useIsBridgeActiveQuery, useSynthetixTxn } = useSynthetixQueries();

	const depositsDataQuery = useGetBridgeDataQuery(
		process.env.NEXT_PUBLIC_INFURA_PROJECT_ID!,
		walletAddress
	);
	const withdrawalsInactive = !useIsBridgeActiveQuery().data;

	const [gasPrice, setGasPrice] = useState<Wei>(wei(0));
	const [txModalOpen, setTxModalOpen] = useState<boolean>(false);
	const [amountToWithdraw, setAmountToWithdraw] = useState<string>('0');

	const txn = useSynthetixTxn(
		'SynthetixBridgeToBase',
		'withdraw',
		[parseSafeWei(amountToWithdraw, 0).toBN()],
		{ gasPrice: gasPrice.toBN() }
	);

	useEffect(() => {
		if (txn.txnStatus === 'confirmed') {
			depositsDataQuery.refetch();
		}
	}, [txn.txnStatus, depositsDataQuery]);

	return (
		<StyledTabContainer>
			<TabContent
				inputValue={amountToWithdraw}
				onInputChange={(value: string) => setAmountToWithdraw(value)}
				transferableCollateral={transferableCollateral}
				onSubmit={txn.mutate}
				transactionError={txn.errorMessage}
				gasEstimateError={txn.errorMessage}
				txModalOpen={txModalOpen}
				setTxModalOpen={setTxModalOpen}
				gasLimitEstimate={txn.gasLimit}
				setGasPrice={setGasPrice}
				txHash={txn.hash}
				transactionState={txn.txnStatus}
				resetTransaction={txn.refresh}
				bridgeInactive={withdrawalsInactive}
			/>
		</StyledTabContainer>
	);
};

const StyledTabContainer = styled(TabContainer)`
	padding: 0;
`;

export default WithdrawTab;
