import React, { useState, useEffect } from 'react';
import { formatUnits } from '@ethersproject/units';
import { v4 as uuidv4 } from 'uuid';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Heading,
  useColorMode,
} from '@chakra-ui/core';

import { shortenAddress } from 'utils';
import { useFactoryContract } from 'hooks/useHelperContract';
import { bgColor7 } from 'utils/theme';

interface IOutcome {
  name: string;
  bets: string;
}

const InfoModal = ({ infoModalToggle, marketContract }: any): JSX.Element => {
  const factoryContract = useFactoryContract();
  const { colorMode } = useColorMode();

  const MarketStates = ['WAITING', 'OPEN', 'LOCKED', 'WITHDRAW'];
  const [marketState, setMarketState] = useState<string>('');
  const [pot, setPot] = useState<string>('0');
  const [owner, setOwner] = useState<string>('');
  const [numberOfParticipants, setNumberOfParticipants] = useState<number>(0);
  const [outcomeNamesAndAmounts, setOutcomeNamesAndAmounts] = useState<any>([]);

  useEffect(() => {
    (async () => {
      let isStale = false;

      if (!isStale && factoryContract) {
        try {
          const state = await marketContract.getCurrentState();
          setMarketState(MarketStates[state]);
          setOwner(await marketContract.owner());
          const numberOfParticipants = await marketContract.getMarketSize();
          setNumberOfParticipants(numberOfParticipants.toNumber());
          const _pot = await marketContract.totalBets();
          const pot = formatUnits(_pot.toString(), 18);
          setPot(pot);

          const numberOfOutcomes = await marketContract.numberOfOutcomes();

          if (numberOfOutcomes !== 0) {
            let newOutcomesArray = [];
            for (let i = 0; i < numberOfOutcomes; i++) {
              let newOutcome: IOutcome = { name: '', bets: '' };

              newOutcome.name = await marketContract.outcomeNames(i);
              const numOfBets = await marketContract.totalBetsPerOutcome(i);

              const hexString = numOfBets.toString();
              const removedZeros = hexString.replace(
                /^0+(\d)|(\d)0+$/gm,
                '$1$2'
              );
              newOutcome.bets = removedZeros;

              newOutcomesArray.push(newOutcome);
            }
            setOutcomeNamesAndAmounts(newOutcomesArray);
          }
        } catch (error) {
          console.error(error);
        }
      }

      return () => {
        isStale = true;
      };
    })();
  }, []);

  return (
    <Modal
      isOpen={infoModalToggle.isOpen}
      onClose={infoModalToggle.onClose}
      isCentered
    >
      <ModalOverlay />

      <ModalContent bg={bgColor7[colorMode]} borderRadius="0.25rem">
        <ModalHeader>Market Stats</ModalHeader>
        <ModalCloseButton onClick={infoModalToggle.onClose} />
        <ModalBody>
          <Flex flexDirection="column" alignItems="center">
            <Heading
              as="h3"
              fontSize="1.8rem"
              fontWeight="400"
              lineHeight=" 2rem"
              margin="0"
              padding="0"
            >
              {owner ? shortenAddress(owner) : '-'}
            </Heading>
            <Text
              fontSize="0.75rem"
              lineHeight="1.5"
              margin="0 0 10px"
              padding="0"
            >
              Contract Owner
            </Text>
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Heading
              as="h3"
              fontSize="1.8rem"
              fontWeight="400"
              lineHeight=" 2rem"
              margin="0"
              padding="0"
            >
              {marketState ? marketState : '-'}
            </Heading>
            <Text
              fontSize="0.75rem"
              lineHeight="1.5"
              margin="0 0 10px"
              padding="0"
            >
              Market State
            </Text>
          </Flex>
          {outcomeNamesAndAmounts &&
            outcomeNamesAndAmounts.map((outcome: IOutcome) => (
              <Flex key={uuidv4()} flexDirection="column" alignItems="center">
                <Heading
                  as="h3"
                  fontSize="1.8rem"
                  fontWeight="400"
                  lineHeight=" 2rem"
                  margin="0"
                  padding="0"
                >
                  {outcome.bets}
                </Heading>
                <Text
                  fontSize="0.75rem"
                  lineHeight="1.5"
                  margin="0 0 10px"
                  padding="0"
                >
                  Bets for {outcome.name}
                </Text>
              </Flex>
            ))}

          <Flex flexDirection="column" alignItems="center">
            <Heading
              as="h3"
              fontSize="1.8rem"
              fontWeight="400"
              lineHeight=" 2rem"
              margin="0"
              padding="0"
            >
              {numberOfParticipants}
            </Heading>
            <Text
              fontSize="0.75rem"
              lineHeight="1.5"
              margin="0 0 10px"
              padding="0"
            >
              Number of Participants
            </Text>
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Heading
              as="h3"
              fontSize="1.8rem"
              fontWeight="400"
              lineHeight=" 2rem"
              margin="0"
              padding="0"
            >
              {pot}
            </Heading>
            <Text
              fontSize="0.75rem"
              lineHeight="1.5"
              margin="0 0 10px"
              padding="0"
            >
              Total Pot Size (in Dai)
            </Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InfoModal;
