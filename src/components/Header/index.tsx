import React, { useState, useEffect } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  Flex,
  Heading,
  Button,
  Icon,
  Text,
  Link,
  Tag,
  Box as ChakraBox,
  IconButton,
  useColorMode,
} from '@chakra-ui/core';

import { useEagerConnect, useInactiveListener } from '../../hooks';
import { injected, getNetwork } from '../../utils/connectors';
import { shortenAddress } from '../../utils';
import { bgColor1, bgColor3, bgColor4, bgColor5 } from '../../utils/theme';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { account, active, activate, connector, error } = useWeb3React<
    Web3Provider
  >();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activatingConnector, setActivatingConnector] = useState<
    AbstractConnector
  >();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector)
      setActivatingConnector(undefined);
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager || !!activatingConnector);

  useEffect(() => {
    if (triedEager && !active && !error) activate(getNetwork(42));
  }, [triedEager, active, error, activate]);

  if (error) {
    return null;
  } else if (!triedEager) {
    return null;
  } else {
    return (
      <>
        <Flex
          as="header"
          align="center"
          justify="space-between"
          p="0.75rem 1.25rem"
          color="light.100"
          bg={bgColor3[colorMode]}
          m="0 auto"
        >
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mr={5}
          >
            <span
              style={{ fontSize: '3rem', width: '100%', marginRight: '0.5rem' }}
              role="img"
              aria-label="tophat"
            >
              🎩
            </span>
            <Heading as="h1" size="xl">
              MagicBet
            </Heading>
          </Flex>
          <Flex alignItems="center" justifyContent="flex-end">
            <IconButton
              aria-label={`Switch to ${
                colorMode === 'light' ? 'dark' : 'light'
              } mode`}
              variant="ghost"
              variantColor="white"
              mr="2"
              fontSize="1.5rem"
              onClick={toggleColorMode}
              icon={colorMode === 'light' ? 'moon' : 'sun'}
              _hover={{ bg: 'Transparent' }}
            />
            <Link
              bg="none"
              mr="1rem"
              cursor="pointer"
              href="https://github.com/BetTogether"
              isExternal
              aria-label="Github Link"
            >
              <Icon name="githubIcon" size="2rem" color="light.100" />
            </Link>

            {active && !!(connector === injected) ? (
              <Tag
                border="1px"
                borderRadius="4px"
                variant="solid"
                color="light.100"
                m="0"
                position="relative"
                w="auto"
                borderColor={bgColor4[colorMode]}
                bg={bgColor4[colorMode]}
              >
                {!!account && shortenAddress(account)}
              </Tag>
            ) : (
              <Button
                border="1px"
                borderRadius="4px"
                variant="solid"
                color="light.100"
                cursor="pointer"
                m="0"
                position="relative"
                width="auto"
                borderColor={bgColor4[colorMode]}
                bg={bgColor4[colorMode]}
                _hover={{ bg: bgColor4[colorMode] }}
                _active={{ bg: bgColor4[colorMode] }}
                onClick={() => {
                  setActivatingConnector(injected);
                  activate(injected);
                }}
              >
                Connect
              </Button>
            )}

            <ChakraBox
              display={{ sm: 'block', md: 'none' }}
              onClick={() => setIsExpanded(!isExpanded)}
              p="0.625rem"
            >
              {isExpanded ? (
                <Icon name="menuOpenIcon" size="2rem" />
              ) : (
                <Icon name="menuClosedIcon" size="2rem" />
              )}
            </ChakraBox>
          </Flex>
        </Flex>
        {isExpanded && (
          <ChakraBox
            h="auto"
            w="100%"
            position="absolute"
            zIndex={100}
            bg={bgColor1[colorMode]}
            display={{ sm: 'block', md: 'none' }}
          >
            <ChakraBox m="0" p="0" borderBottom="1px solid rgba(0, 0, 0, 0.8)">
              <Text
                font-weight="500"
                h="3rem"
                p="0 1rem"
                mt={{ base: 4, md: 0 }}
                mr={6}
                display="block"
              >
                <Link
                  textTransform="uppercase"
                  fontWeight="bold"
                  cursor="pointer"
                  href="/dashboard"
                  onClick={() => setIsExpanded(false)}
                >
                  Dashboard
                </Link>
              </Text>
              <Text
                font-weight="500"
                h="3rem"
                p="0 1rem"
                mt={{ base: 4, md: 0 }}
                mr={6}
                display="block"
              >
                <Link
                  textTransform="uppercase"
                  fontWeight="bold"
                  cursor="pointer"
                  href="/markets"
                  onClick={() => setIsExpanded(false)}
                >
                  Markets
                </Link>
              </Text>
            </ChakraBox>
          </ChakraBox>
        )}
      </>
    );
  }
};

export default Header;
