import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FlexDivRow, FlexDivRowCentered } from 'styles/common';
import { SYNTH_BY_CURRENCY_KEY } from 'sections/loans/constants';
import { Loan } from 'queries/loans/types';
import { wei } from '@synthetixio/wei';

type AccruedInterestProps = {
	loan: Loan;
};

const AccruedInterest: React.FC<AccruedInterestProps> = ({ loan }) => {
	const { t } = useTranslation();
	const debtAsset = SYNTH_BY_CURRENCY_KEY[loan.currency];

	return (
		<Container>
			<Header>{t('loans.interest-accrued')}</Header>
			<FlexDivRowCentered>
				<Item>
					<Text>
						{wei(loan.accruedInterest).toString(4)} {debtAsset}
					</Text>
				</Item>
			</FlexDivRowCentered>
		</Container>
	);
};

const Container = styled(FlexDivRow)`
	width: 100%;
	justify-content: space-between;
`;

const Header = styled.p`
	font-family: ${(props) => props.theme.fonts.interBold};
	font-size: 12px;
	color: ${(props) => props.theme.colors.gray};
	text-transform: uppercase;
`;

const Text = styled.span`
	font-family: ${(props) => props.theme.fonts.interBold};
	font-size: 12px;
	color: ${(props) => props.theme.colors.white};
`;

const Item = styled.span`
	display: inline-flex;
	align-items: center;
	cursor: pointer;
	svg {
		margin-left: 5px;
	}
`;

export default AccruedInterest;
