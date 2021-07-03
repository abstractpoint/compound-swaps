import { useCallback, useEffect, useState, useReducer } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { INFURA_ID } from "../constants";
import WalletConnectProvider from "@walletconnect/web3-provider";

const NETWORK_NAME: string = "mainnet";

export interface Web3ReactData {
  provider?: ethers.providers.Web3Provider;
  address: string;
  chainId: number;
  loadWeb3Modal?: () => Promise<void>;
  logoutOfWeb3Modal?: () => Promise<void>;
}

interface State {
  provider?: ethers.providers.Web3Provider;
  address: string;
  chainId: number;
}

enum ActionType {
  CONNECTED,
}

type Action = {
  type: ActionType.CONNECTED;
  payload: Omit<State, "provider"> & {
    provider: ethers.providers.Web3Provider;
  };
};

export const initialData: Web3ReactData = {
  provider: undefined,
  address: ethers.constants.AddressZero,
  chainId: 1,
  loadWeb3Modal: undefined,
  logoutOfWeb3Modal: undefined,
};

const initialState: State = {
  provider: undefined,
  address: ethers.constants.AddressZero,
  chainId: 1,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.CONNECTED:
      const { provider, address, chainId } = action.payload;
      return { ...state, provider, address, chainId };
    default:
      throw new Error();
  }
}

function useWeb3ReactState(): Web3ReactData {
  const [state, dispatch] = useReducer<(state: State, action: Action) => State>(
    reducer,
    initialState
  );
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [web3Provider, setWeb3Provider] = useState<any>();
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const [autoLoaded, setAutoLoaded] = useState<boolean>(false);
  const { provider, address, chainId } = state;
  const {
    autoLoad,
    infuraId,
    NETWORK,
  }: {
    autoLoad: boolean;
    infuraId: string;
    NETWORK: string;
  } = {
    autoLoad: true,
    infuraId: INFURA_ID,
    NETWORK: NETWORK_NAME,
  };

  useEffect(() => {
    const web3Modal: Web3Modal = new Web3Modal({
      network: NETWORK,
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId,
          },
        },
      },
    });
    setWeb3Modal(web3Modal);
  }, []);

  // Open wallet selection modal.
  const loadWeb3Modal: () => Promise<void> = useCallback(async () => {
    try {
      if (web3Modal) {
        const newProvider = await web3Modal.connect();
        setWeb3Provider(newProvider);
        const newWeb3Provider: ethers.providers.Web3Provider =
          new ethers.providers.Web3Provider(newProvider, "any");
        const newNetwork: ethers.providers.Network =
          await newWeb3Provider.getNetwork();
        const newAddress: string = await newWeb3Provider
          .getSigner()
          .getAddress();
        dispatch({
          type: ActionType.CONNECTED,
          payload: {
            provider: newWeb3Provider,
            address: newAddress,
            chainId: newNetwork.chainId,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [web3Modal]);

  const logoutOfWeb3Modal: () => Promise<void> = useCallback(
    async function () {
      if (web3Modal) {
        await web3Modal.clearCachedProvider();
        window.location.reload();
      }
    },
    [web3Modal]
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && !autoLoaded && web3Modal && web3Modal.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, web3Modal]);

  useEffect(() => {
    const listener = (
      newNetwork: ethers.providers.Networkish,
      oldNetwork: ethers.providers.Networkish
    ) => {
      if (oldNetwork) window.location.reload();
    };
    if (provider !== undefined) provider.on("network", listener);
    return () => {
      if (provider !== undefined) provider.off("network", listener);
    };
  }, [provider]);

  useEffect(() => {
    const accountsListener = () => window.location.reload();
    const disconnectListener = () => {
      (async () => {
        if (web3Modal) {
          await web3Modal.clearCachedProvider();
          window.location.reload();
        }
      })();
    };
    if (web3Provider !== undefined) {
      web3Provider.on("accountsChanged", accountsListener);
      web3Provider.on("disconnect", disconnectListener);
    }
  }, [web3Provider]);

  return { provider, address, chainId, loadWeb3Modal, logoutOfWeb3Modal };
}

export default useWeb3ReactState;
