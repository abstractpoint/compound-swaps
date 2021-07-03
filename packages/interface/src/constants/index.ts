export const GA_TRACKING_ID: string = process.env.GA_TRACKING_ID ?? "";
export const siteURL: string = "https://compound.gcubed.io/";
export const ALCHEMY_API: string = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
export const INFURA_ID: string = process.env.NEXT_PUBLIC_INFURA_ID ?? "";
export const saiSymbol: string =
  "0x4441490000000000000000000000000000000000000000000000000000000000";
export const mkrSymbol: string =
  "0x4d4b520000000000000000000000000000000000000000000000000000000000";

export const addresses: {
  [chainId: number]: {
    comptroller: string;
    multicall: string;
    cTokenSwap: string;
  };
} = {
  1: {
    comptroller: "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
    multicall: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
    cTokenSwap: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
  },
  1337: {
    comptroller: "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
    multicall: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
    cTokenSwap: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
  },
};
