import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import {
  Box,
  Flex,
  Heading,
  Button,
  Tag,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/core';

import { bgColor1, color1, bgColor6 } from '../../utils/theme';
import CreateMarket from '../../components/Modals/CreateMarket';
import { useFactoryContract } from 'hooks/useHelperContract';
import MBMarketContract from '../../abis/MBMarket.json';

const Admin = (): JSX.Element => {
  const { account, active, library } = useWeb3React<Web3Provider>();
  const { colorMode } = useColorMode();
  const createMarketModalToggle = useDisclosure();

  const factoryContract: Contract | undefined = useFactoryContract();
  const [marketContract, setMarketContract] = useState<Contract | null>();
  const [contractAddress, setContractAddress] = useState<string>('');

  useEffect(() => {
    (async () => {
      let isStale = false;
      try {
        if (!isStale && factoryContract !== undefined) {
          const mostRecentAddress = await factoryContract.getMostRecentMarket();

          if (mostRecentAddress !== AddressZero && !!library && !!account) {
            setContractAddress(mostRecentAddress + '');
            const marketContract = new Contract(
              mostRecentAddress,
              MBMarketContract.abi,
              library.getSigner(account)
            );
            setMarketContract(marketContract);

            const isPaused = await marketContract.paused();
            if (isPaused) setMarketContract(null);
          }
          // factoryContract.on('MarketCreated', (address: any) => {
          //   const marketInstance = new Contract(
          //     address,
          //     MBMarketContract.abi,
          //     wallet
          //   );
          //   setMarketContract(marketInstance);
          // });
        }
      } catch (error) {
        console.error(error);
      }
      return () => {
        isStale = true;
      };
    })();
  }, [factoryContract]);

  return (
    <Box bg={bgColor1[colorMode]} pb="1rem" rounded="md">
      <Box
        borderTopRightRadius="0.25rem"
        borderTopLeftRadius="0.25rem"
        bg="primary.100"
        h="0.5rem"
      />
      <Flex
        mb="-1px"
        justifyContent="space-between"
        alignItems="center"
        p="1rem 1.5rem"
      >
        <Heading
          as="h3"
          size="lg"
          fontSize="1.5rem"
          font-weight="500"
          color={color1[colorMode]}
        >
          Admin
        </Heading>
      </Flex>

      <Flex
        flexWrap="wrap"
        flexDirection="column"
        justifyContent="center"
        m="0 auto 1rem"
        p="0rem 1rem"
        maxWidth="100%"
      >
        {!marketContract ? (
          <Button
            bg={bgColor6[colorMode]}
            border="none"
            borderRadius="0.33rem"
            color="light.100"
            text-Align="center"
            fontSize="1rem"
            p="0.8rem"
            w="auto"
            cursor="pointer"
            _hover={{ bg: 'primary.100' }}
            isDisabled={!active}
            onClick={createMarketModalToggle.onOpen}
          >
            Create Market
          </Button>
        ) : (
          <Flex justifyContent="center" flexDirection="column" mt="1rem">
            <Tag>{contractAddress}</Tag>
            <Button
              my="0.25rem"
              color="light.100"
              bg={bgColor6[colorMode]}
              _hover={{ bg: 'primary.100' }}
              onClick={async () => await marketContract.incrementState()}
            >
              Increment Market State
            </Button>
            <Button
              my="0.25rem"
              color="light.100"
              bg={bgColor6[colorMode]}
              _hover={{ bg: 'primary.100' }}
              onClick={async () => await marketContract.determineWinner()}
            >
              Get Winner from Oracle
            </Button>
            <Button
              my="0.25rem"
              color="light.100"
              bg={bgColor6[colorMode]}
              _hover={{ bg: 'primary.100' }}
              onClick={async () => await marketContract.disableContract()}
            >
              Disable Contract
            </Button>
          </Flex>
        )}
      </Flex>
      <CreateMarket createMarketModalToggle={createMarketModalToggle} />
    </Box>
  );
};

export default Admin;