import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract, ContractInterface } from '@ethersproject/contracts';

export default function useContract(
  address?: string,
  ABI?: ContractInterface,
  withSigner = false
): Contract | undefined {
  const { library, account } = useWeb3React();
  return useMemo(
    () =>
      !!address && !!ABI && !!library
        ? new Contract(
            address,
            ABI,
            withSigner ? library.getSigner(account) : library
          )
        : undefined,
    [address, ABI, withSigner, library, account]
  );
}
